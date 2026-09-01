import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';
import { GlassCard } from '../components/GlassCard';
import './Arena.css';
import './Admin.css';

// Local storage backup key for offline/fallback resilience
const LOCAL_TIMER_KEY = 'veltraxx_event_timer_state';

const getInitialLocalTimer = () => {
  try {
    const saved = localStorage.getItem(LOCAL_TIMER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.status === 'idle') {
        parsed.durationSeconds = 86400;
        parsed.remainingSecondsAtPause = 86400;
      }
      return parsed;
    }
  } catch (e) {}
  return {
    status: 'idle',
    is_public: false,
    startTime: null,
    endTime: null,
    durationSeconds: 86400,
    remainingSecondsAtPause: 86400,
    serverNow: null
  };
};

export default function Admin() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab: 'stage' (Chief Guest Smart Board) | 'controls' (Timer Controls) | 'registrations' (Registrations Desk)
  const [adminTab, setAdminTab] = useState('stage');

  // Backstage Operator Feedback & Inputs
  const [customMinutes, setCustomMinutes] = useState('');
  const [operatorFeedback, setOperatorFeedback] = useState(null);
  const [isTimerLoading, setIsTimerLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // --- LIVE TIMER & CELESTIAL STAGE STATE ---
  const [timerState, setTimerState] = useState(getInitialLocalTimer);
  const [remainingMs, setRemainingMs] = useState(() => {
    const initial = getInitialLocalTimer();
    if (initial.status === 'running' && initial.endTime) {
      return Math.max(0, new Date(initial.endTime).getTime() - Date.now());
    }
    if (initial.status === 'paused') {
      return (initial.remainingSecondsAtPause || 86400) * 1000;
    }
    return 86400 * 1000; // Always 24:00:00 default
  });
  
  const [clockOffset, setClockOffset] = useState(0);
  const [ignitionStep, setIgnitionStep] = useState(null); // null, 3, 2, 1, 'LIVE'
  const prevStatusRef = useRef(timerState.status || 'idle');
  const hasLocalIgnitionFiredRef = useRef(false);
  const lastIgnitedStartTimeRef = useRef(null);

  // --- REGISTRATIONS DESK STATE ---
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [teamsError, setTeamsError] = useState(null);

  // Receipt Modal State
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);

  // Deletion Modal State
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [deleteCountdown, setDeleteCountdown] = useState(3);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Helper to persist timer state locally as resilience fallback
  const persistLocalTimer = (newState) => {
    try {
      localStorage.setItem(LOCAL_TIMER_KEY, JSON.stringify(newState));
    } catch (e) {}
  };

  // 1. Auth & Admin Status Check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdminStatus(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setIsAdmin(false);
        setTeams([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        setAuthError("Admin authorization check failed. Please check database permissions.");
        setIsAdmin(false);
        return false;
      }
      
      if (!data) {
        setAuthError("You are authenticated, but this account is not authorized as an admin.");
        setIsAdmin(false);
        return false;
      }

      setIsAdmin(true);
      fetchTeamsData();
      return true;
    } catch (err) {
      setAuthError("Admin authorization check failed.");
      setIsAdmin(false);
      return false;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    
    const { error: authErrorObj } = await supabase.auth.signInWithPassword({ email, password });
    
    if (authErrorObj) {
      setAuthError("Login failed. Please check your credentials.");
      setIsLoggingIn(false);
      return;
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      setAuthError("Login succeeded, but failed to retrieve user profile.");
      setIsLoggingIn(false);
      return;
    }
    
    await checkAdminStatus(user.id);
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const targetEndTimeMsRef = useRef(null);

  // Helper to parse dates safely across all browsers & UTC formats
  const parseTimestamp = (ts) => {
    if (!ts) return null;
    if (typeof ts === 'string' && !ts.endsWith('Z') && !ts.includes('+')) {
      return new Date(ts + 'Z').getTime();
    }
    return new Date(ts).getTime();
  };

  // 2. Fetch Live Timer State from Supabase
  const syncTimerState = async () => {
    try {
      const { data, error } = await supabase.rpc('get_timer_state');
      if (!error && data && data.status) {
        if (data.status === 'running' && prevStatusRef.current === 'idle' && data.start_time) {
          const sNow = data.server_now ? parseTimestamp(data.server_now) : Date.now();
          const sStart = parseTimestamp(data.start_time);
          const elapsedSinceStart = (sNow - sStart) / 1000;
          if (elapsedSinceStart < 8 && !ignitionStep && !hasLocalIgnitionFiredRef.current && lastIgnitedStartTimeRef.current !== data.start_time) {
            lastIgnitedStartTimeRef.current = data.start_time;
            triggerIgnitionSequence();
          }
        }
        prevStatusRef.current = data.status || 'idle';

        const updated = {
          status: data.status || 'idle',
          is_public: !!data.is_public,
          startTime: data.start_time,
          endTime: data.end_time,
          durationSeconds: data.duration_seconds || 86400,
          remainingSecondsAtPause: data.remaining_seconds_at_pause ?? 86400,
          serverNow: data.server_now
        };

        setTimerState(updated);
        persistLocalTimer(updated);

        if (data.status === 'running') {
          const remSec = data.remaining_seconds !== undefined 
            ? data.remaining_seconds 
            : (data.end_time ? Math.max(0, Math.floor((parseTimestamp(data.end_time) - Date.now()) / 1000)) : 86400);
          
          targetEndTimeMsRef.current = Date.now() + (remSec * 1000);
          setRemainingMs(remSec * 1000);
        } else if (data.status === 'paused') {
          targetEndTimeMsRef.current = null;
          setRemainingMs((data.remaining_seconds_at_pause || 0) * 1000);
        } else if (data.status === 'idle') {
          targetEndTimeMsRef.current = null;
          setRemainingMs(86400 * 1000);
        } else if (data.status === 'ended') {
          targetEndTimeMsRef.current = null;
          setRemainingMs(0);
        }
      }
    } catch (err) {
      console.warn("Timer sync notice (using local state fallback):", err);
    }
  };

  useEffect(() => {
    syncTimerState();
    const channel = supabase
      .channel('admin_timer_unified_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_timer' }, () => {
        syncTimerState();
      })
      .subscribe();

    const pollInterval = setInterval(syncTimerState, 30000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, []);

  // 3. High-Precision Local Ticker
  useEffect(() => {
    if (timerState.status !== 'running' || ignitionStep) return;

    const interval = setInterval(() => {
      if (!targetEndTimeMsRef.current && timerState.endTime) {
        targetEndTimeMsRef.current = parseTimestamp(timerState.endTime);
      }
      if (!targetEndTimeMsRef.current) return;

      const rem = Math.max(0, targetEndTimeMsRef.current - Date.now());

      if (rem <= 0) {
        setRemainingMs(0);
        setTimerState(prev => {
          const ended = { ...prev, status: 'ended' };
          persistLocalTimer(ended);
          return ended;
        });
        clearInterval(interval);
      } else {
        setRemainingMs(rem);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timerState.status, timerState.endTime, ignitionStep]);

  // Calculations
  const isRunning = timerState.status === 'running' && !ignitionStep;
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');

  // Trigger 3-2-1 Stage Ignition with optional callback
  const triggerIgnitionSequence = (onComplete) => {
    if (ignitionStep !== null) return; // Prevent double execution
    setIgnitionStep(3);
    setTimeout(() => setIgnitionStep(2), 950);
    setTimeout(() => setIgnitionStep(1), 1900);
    setTimeout(() => setIgnitionStep('LIVE'), 2850);
    setTimeout(() => {
      setIgnitionStep(null);
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 3900);
  };

  // --- TOGGLE PUBLIC VISIBILITY / STAGE GATE CONTROL ---
  const handleTogglePublicVisibility = async (nextIsPublic) => {
    setIsTimerLoading(true);
    const updated = {
      ...timerState,
      is_public: nextIsPublic
    };
    setTimerState(updated);
    persistLocalTimer(updated);

    try {
      const { data, error } = await supabase.rpc('set_stage_public_visibility', {
        p_is_public: nextIsPublic
      });
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showOperatorFeedback(
        nextIsPublic 
          ? "Stage Arena is now PUBLIC & Broadcasting to all participants!" 
          : "Stage Arena is now PRIVATE (Participants see Standby lock screen)."
      );
    } catch (err) {
      showOperatorFeedback(
        nextIsPublic 
          ? "Stage Arena set to PUBLIC locally." 
          : "Stage Arena set to PRIVATE locally."
      );
    } finally {
      setIsTimerLoading(false);
    }
  };

  // --- CHIEF GUEST TOUCH LAUNCH HANDLER ---
  const handleChiefGuestLaunch = async () => {
    if (isTimerLoading || ignitionStep !== null) return;
    setIsTimerLoading(true);
    hasLocalIgnitionFiredRef.current = true;
    prevStatusRef.current = 'running';

    // 1. Play the 3-2-1 -> LIVE Ignition sequence
    triggerIgnitionSequence(async () => {
      // 2. Exactly when LIVE finishes and the clock reveals on stage:
      const liveStartMs = Date.now();
      const nowIso = new Date(liveStartMs).toISOString();
      const endIso = new Date(liveStartMs + 86400 * 1000).toISOString();
      lastIgnitedStartTimeRef.current = nowIso;

      const localStartedState = {
        ...timerState,
        status: 'running',
        startTime: nowIso,
        endTime: endIso,
        durationSeconds: 86400,
        remainingSecondsAtPause: 86400,
        serverNow: nowIso
      };

      setTimerState(localStartedState);
      persistLocalTimer(localStartedState);
      setRemainingMs(86400 * 1000);
      setIsTimerLoading(false);

      // 3. Broadcast to Supabase backend
      try {
        const { data, error } = await supabase.rpc('start_event_timer', {
          p_duration_seconds: 86400
        });

        if (!error && data && data.status) {
          lastIgnitedStartTimeRef.current = data.start_time;
          setTimerState(data);
          persistLocalTimer(data);
        }
        showOperatorFeedback("24-Hour Stage Arena Officially Launched!");
      } catch (err) {
        console.warn("Supabase launch broadcast note:", err.message);
        showOperatorFeedback("Stage Clock Launched live!");
      }
    });
  };

  // --- OPERATOR BACKSTAGE CONTROLS ---
  const showOperatorFeedback = (msg, isError = false) => {
    setOperatorFeedback({ text: msg, isError });
    setTimeout(() => setOperatorFeedback(null), 3500);
  };

  const handleStartTimerPreset = async (durationSec) => {
    setIsTimerLoading(true);
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const endIso = new Date(now + durationSec * 1000).toISOString();

    const nextState = {
      ...timerState,
      status: 'running',
      startTime: nowIso,
      endTime: endIso,
      durationSeconds: durationSec,
      remainingSecondsAtPause: durationSec,
      serverNow: nowIso
    };
    setTimerState(nextState);
    persistLocalTimer(nextState);
    setRemainingMs(durationSec * 1000);

    try {
      const { data, error } = await supabase.rpc('start_event_timer', {
        p_duration_seconds: durationSec
      });
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showOperatorFeedback(`Timer set to ${Math.round(durationSec / 60)} minutes & running!`);
    } catch (err) {
      showOperatorFeedback(`Timer set to ${Math.round(durationSec / 60)}m locally.`);
    } finally {
      setIsTimerLoading(false);
    }
  };

  const handlePauseTimer = async () => {
    setIsTimerLoading(true);
    const currentRemSec = Math.max(0, Math.floor(remainingMs / 1000));
    
    const pausedState = {
      ...timerState,
      status: 'paused',
      remainingSecondsAtPause: currentRemSec
    };
    setTimerState(pausedState);
    persistLocalTimer(pausedState);

    try {
      const { data, error } = await supabase.rpc('pause_event_timer');
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showOperatorFeedback("Stage Clock PAUSED.");
    } catch (err) {
      showOperatorFeedback("Stage Clock PAUSED locally.");
    } finally {
      setIsTimerLoading(false);
    }
  };

  const handleResumeTimer = async () => {
    setIsTimerLoading(true);
    const remSec = timerState.remainingSecondsAtPause || Math.floor(remainingMs / 1000) || 86400;
    const now = Date.now();
    const endIso = new Date(now + remSec * 1000).toISOString();

    const resumedState = {
      ...timerState,
      status: 'running',
      endTime: endIso
    };
    setTimerState(resumedState);
    persistLocalTimer(resumedState);

    try {
      const { data, error } = await supabase.rpc('resume_event_timer');
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showOperatorFeedback("Stage Clock RESUMED.");
    } catch (err) {
      showOperatorFeedback("Stage Clock RESUMED locally.");
    } finally {
      setIsTimerLoading(false);
    }
  };

  const handleAdjustTimer = async (secondsToAdd) => {
    setIsTimerLoading(true);
    
    if (timerState.status === 'running' && timerState.endTime) {
      const currentEnd = new Date(timerState.endTime).getTime();
      const newEnd = new Date(currentEnd + secondsToAdd * 1000).toISOString();
      const adjustedState = {
        ...timerState,
        endTime: newEnd,
        durationSeconds: (timerState.durationSeconds || 86400) + secondsToAdd
      };
      setTimerState(adjustedState);
      persistLocalTimer(adjustedState);
      setRemainingMs(prev => Math.max(0, prev + secondsToAdd * 1000));
    } else if (timerState.status === 'paused') {
      const newRem = Math.max(0, (timerState.remainingSecondsAtPause || 0) + secondsToAdd);
      const adjustedState = {
        ...timerState,
        remainingSecondsAtPause: newRem,
        durationSeconds: (timerState.durationSeconds || 86400) + secondsToAdd
      };
      setTimerState(adjustedState);
      persistLocalTimer(adjustedState);
      setRemainingMs(newRem * 1000);
    }

    try {
      const { data, error } = await supabase.rpc('adjust_event_timer', {
        p_additional_seconds: secondsToAdd
      });
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showOperatorFeedback(`Adjusted time: ${secondsToAdd > 0 ? '+' : ''}${Math.round(secondsToAdd / 60)}m.`);
    } catch (err) {
      showOperatorFeedback(`Adjusted time: ${secondsToAdd > 0 ? '+' : ''}${Math.round(secondsToAdd / 60)}m locally.`);
    } finally {
      setIsTimerLoading(false);
    }
  };

  const handleResetTimerToIdle = async () => {
    setIsTimerLoading(true);
    setShowResetModal(false);
    hasLocalIgnitionFiredRef.current = false;
    lastIgnitedStartTimeRef.current = null;
    prevStatusRef.current = 'idle';

    const idleState = {
      status: 'idle',
      is_public: timerState.is_public,
      startTime: null,
      endTime: null,
      durationSeconds: 86400,
      remainingSecondsAtPause: 86400,
      serverNow: null
    };
    setTimerState(idleState);
    persistLocalTimer(idleState);
    setRemainingMs(86400 * 1000);

    try {
      const { data, error } = await supabase.rpc('reset_event_timer', {
        p_duration_seconds: 86400
      });
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showOperatorFeedback("Stage Timer reset to IDLE (Pre-Launch).");
    } catch (err) {
      showOperatorFeedback("Stage Timer reset to IDLE (Pre-Launch).");
    } finally {
      setIsTimerLoading(false);
    }
  };

  const handleApplyCustomMinutes = (e) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (!mins || mins <= 0) {
      showOperatorFeedback("Enter a valid number of minutes.", true);
      return;
    }
    handleStartTimerPreset(mins * 60);
    setCustomMinutes('');
  };

  // --- FIBER-OPTIC STARLIGHT & CLOUDS MATRICES ---
  const canopyStars = useMemo(() => {
    const list = [];
    const waveTypes = ['wave-nw', 'wave-ne', 'wave-zenith', 'wave-anchor', 'wave-pulsar'];
    const primeDurations = [11.3, 13.1, 14.9, 16.7, 18.1, 19.9, 22.3, 25.1];
    
    for (let i = 0; i < 84; i++) {
      const top = ((Math.sin(i * 997) * 10000) % 86 + 86) % 86;
      const left = ((Math.cos(i * 733) * 10000) % 96 + 96) % 96;
      const size = 1 + (((i * 13) % 15) / 10);
      const duration = primeDurations[i % primeDurations.length];
      const delay = ((i * 17) % 150) / 10;
      const variant = i % 4 === 0 ? 'warm' : (i % 5 === 0 ? 'cyan' : 'white');
      const wave = waveTypes[i % waveTypes.length];
      const minOp = 0.1 + ((i % 3) * 0.06);
      const maxOp = 0.75 + ((i % 4) * 0.08);
      list.push({ id: i, top: `${top}%`, left: `${left}%`, size: `${size}px`, duration: `${duration}s`, delay: `${delay}s`, variant, wave, minOp, maxOp });
    }
    return list;
  }, []);

  const glassStars = useMemo(() => {
    const list = [];
    const waveTypes = ['wave-nw', 'wave-ne', 'wave-anchor', 'wave-pulsar'];
    const primeDurations = [9.7, 12.3, 15.1, 17.9];

    for (let i = 0; i < 32; i++) {
      const top = ((Math.sin(i * 389) * 10000) % 78 + 78) % 78 + 10;
      const left = ((Math.cos(i * 491) * 10000) % 88 + 88) % 88 + 5;
      const size = 1.3 + (((i * 7) % 15) / 10);
      const duration = primeDurations[i % primeDurations.length];
      const delay = ((i * 11) % 100) / 10;
      const variant = i % 3 === 0 ? 'cyan' : (i % 4 === 0 ? 'warm' : 'white');
      const wave = waveTypes[i % waveTypes.length];
      list.push({ id: `glass-${i}`, top: `${top}%`, left: `${left}%`, size: `${size}px`, duration: `${duration}s`, delay: `${delay}s`, variant, wave, minOp: 0.22, maxOp: 0.95 });
    }
    return list;
  }, []);

  const clouds = useMemo(() => [
    { id: 1, top: '10%', left: '5%', width: '380px', height: '90px', driftTime: '52s' },
    { id: 2, top: '22%', left: '40%', width: '480px', height: '110px', driftTime: '65s' },
    { id: 3, top: '6%', left: '72%', width: '350px', height: '80px', driftTime: '46s' }
  ], []);

  // --- 8-PHASE CIRCADIAN & 3D POINT-LIGHT RAY TRACING ENGINE ---
  const celestialData = useMemo(() => {
    let currentHourDecimal = 10;

    if (timerState.status === 'running' && timerState.startTime) {
      const currentRealTime = Date.now() + clockOffset;
      const d = new Date(currentRealTime);
      currentHourDecimal = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    } else {
      const d = new Date(Date.now() + clockOffset);
      currentHourDecimal = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    }

    const isSprint = isRunning && remainingMs <= 3600 * 1000 && remainingMs > 0;
    const Rx = 46;
    const Ry = 38;
    const CenterY = 48;

    const sunTheta = ((currentHourDecimal - 6 + 24) % 24) / 12 * Math.PI;
    const sunX = 50 - Rx * Math.cos(sunTheta);
    const sunY = CenterY - Ry * Math.sin(sunTheta);

    const nightHours = (currentHourDecimal - 18 + 24) % 24;
    const moonTheta = (nightHours / 12) * Math.PI;
    const moonX = 50 - Rx * Math.cos(moonTheta);
    const moonY = CenterY - Ry * Math.sin(moonTheta);

    const sunAltitude = CenterY - sunY;
    const moonAltitude = CenterY - moonY;

    const sunOpacity = Math.max(0, Math.min(1, (sunAltitude + 6) / 14));
    const moonOpacity = Math.max(0, Math.min(1, (moonAltitude + 6) / 14));
    const starlightOpacity = Math.max(0, Math.min(1, (moonAltitude + 4) / 16));
    const cloudOpacity = Math.max(0, Math.min(0.85, (sunAltitude + 4) / 18));

    const isGoldenHour = (currentHourDecimal >= 5.5 && currentHourDecimal <= 7.5) || (currentHourDecimal >= 16.8 && currentHourDecimal <= 18.8);
    const isSolarDominant = sunAltitude >= moonAltitude;
    const dominantX = isSolarDominant ? sunX : moonX;
    const dominantY = isSolarDominant ? sunY : moonY;
    const dominantOpacity = isSolarDominant ? sunOpacity : moonOpacity;

    let skyAmbientGradient = 'radial-gradient(circle at 50% 48%, rgba(0, 229, 255, 0.04) 0%, rgba(4, 13, 33, 0.88) 55%, rgba(2, 2, 4, 0.99) 100%)';

    if (currentHourDecimal >= 10 && currentHourDecimal < 13) {
      skyAmbientGradient = 'radial-gradient(circle at 50% 48%, rgba(0, 229, 255, 0.05) 0%, rgba(4, 13, 33, 0.88) 55%, rgba(2, 2, 4, 0.99) 100%)';
    } else if (currentHourDecimal >= 13 && currentHourDecimal < 17) {
      skyAmbientGradient = 'radial-gradient(circle at 50% 48%, rgba(41, 121, 255, 0.06) 0%, rgba(3, 8, 20, 0.9) 55%, rgba(2, 2, 4, 0.99) 100%)';
    } else if (currentHourDecimal >= 17 && currentHourDecimal < 19.5) {
      skyAmbientGradient = 'radial-gradient(circle at 50% 48%, rgba(245, 158, 11, 0.07) 0%, rgba(66, 29, 59, 0.4) 35%, rgba(4, 4, 8, 0.92) 65%, rgba(2, 2, 4, 0.99) 100%)';
    } else if (currentHourDecimal >= 19.5 && currentHourDecimal < 22.5) {
      skyAmbientGradient = 'radial-gradient(circle at 50% 48%, rgba(139, 92, 246, 0.05) 0%, rgba(7, 12, 30, 0.92) 55%, rgba(2, 2, 4, 0.99) 100%)';
    } else if (currentHourDecimal >= 22.5 || currentHourDecimal < 5.5) {
      skyAmbientGradient = 'radial-gradient(circle at 50% 48%, rgba(0, 229, 255, 0.02) 0%, rgba(2, 4, 10, 0.94) 55%, rgba(1, 1, 2, 0.99) 100%)';
    } else {
      skyAmbientGradient = 'radial-gradient(circle at 50% 48%, rgba(245, 158, 11, 0.06) 0%, rgba(44, 27, 61, 0.4) 35%, rgba(4, 4, 8, 0.92) 65%, rgba(2, 2, 4, 0.99) 100%)';
    }

    if (isSprint) {
      skyAmbientGradient = 'radial-gradient(circle at 50% 48%, rgba(239, 68, 68, 0.12) 0%, rgba(43, 6, 10, 0.5) 40%, rgba(8, 2, 3, 0.94) 65%, rgba(2, 1, 1, 1) 100%)';
    }

    // Ray Tracing Calculation per digit:
    const UNIT_POSITIONS = {
      hours: { x: 25, y: 48 },
      sep1: { x: 38, y: 48 },
      minutes: { x: 50, y: 48 },
      sep2: { x: 62, y: 48 },
      seconds: { x: 75, y: 48 }
    };

    const computeRayTracedUnit = (unitKey) => {
      const pos = UNIT_POSITIONS[unitKey];
      const dx = pos.x - dominantX;
      const dy = pos.y - dominantY;

      const rayAngle = Math.round((Math.atan2(dx, dy) * (180 / Math.PI) + 180) % 360);
      const relX = Math.round(Math.max(5, Math.min(95, 50 - (dx / 40) * 50)));
      const relY = Math.round(Math.max(5, Math.min(95, 50 - (dy / 40) * 50)));
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0.7, Math.min(1.35, 1.25 / (1 + 0.00035 * dist * dist)));

      const shadowX = Math.round(dx * 0.42);
      const shadowY = Math.round(Math.max(12, dy * 0.42 + 14));
      const shadowBlur = Math.round(Math.min(32, Math.max(16, dist * 0.45)));

      let specularColor = '#ffffff';
      let highlightColor = '#fff9c4';
      let midColor = '#90a4ae';
      let shadowColor = '#263238';
      let glowColor = 'rgba(255, 214, 0, 0.45)';

      if (isSprint) {
        specularColor = '#ffffff';
        highlightColor = '#ffcdd2';
        midColor = '#ef5350';
        shadowColor = '#200000';
        glowColor = 'rgba(239, 68, 68, 0.55)';
      } else if (isSolarDominant && isGoldenHour) {
        specularColor = '#fff8e1';
        highlightColor = '#ffe082';
        midColor = '#ffb74d';
        shadowColor = '#3e1b00';
        glowColor = 'rgba(255, 152, 0, 0.55)';
      } else if (isSolarDominant) {
        specularColor = '#ffffff';
        highlightColor = '#fff9c4';
        midColor = '#90a4ae';
        shadowColor = '#263238';
        glowColor = 'rgba(255, 214, 0, 0.45)';
      } else {
        specularColor = '#ffffff';
        highlightColor = '#e0f7fa';
        midColor = '#80deea';
        shadowColor = '#0f172a';
        glowColor = 'rgba(0, 229, 255, 0.45)';
      }

      const layeredGradient = `radial-gradient(circle at ${relX}% ${relY}%, ${specularColor} 0%, rgba(255, 255, 255, 0.88) 18%, transparent 60%), linear-gradient(${rayAngle}deg, ${highlightColor} 0%, ${midColor} 55%, ${shadowColor} 100%)`;
      const filterStyle = `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 ${Math.round(26 * proximity)}px ${glowColor})`;

      return {
        backgroundImage: layeredGradient,
        filter: filterStyle,
        rayAngle,
        proximity
      };
    };

    const units = {
      hours: computeRayTracedUnit('hours'),
      sep1: computeRayTracedUnit('sep1'),
      minutes: computeRayTracedUnit('minutes'),
      sep2: computeRayTracedUnit('sep2'),
      seconds: computeRayTracedUnit('seconds')
    };

    const cDx = 50 - dominantX;
    const cDy = CenterY - dominantY;
    const chassisShadowX = Math.round(cDx * 0.48);
    const chassisShadowY = Math.round(Math.max(16, cDy * 0.48 + 18));
    const boxGlow = isSprint ? 'rgba(239, 68, 68, 0.3)' : (isSolarDominant ? (isGoldenHour ? 'rgba(255, 111, 0, 0.25)' : 'rgba(255, 193, 7, 0.2)') : 'rgba(0, 229, 255, 0.15)');

    const godRayColor = isSolarDominant ? (isGoldenHour ? 'rgba(255, 167, 38, 0.22)' : 'rgba(255, 238, 88, 0.2)') : 'rgba(0, 229, 255, 0.18)';
    const godRayPath = `M ${dominantX * 12.8} ${dominantY * 5.2} L 240 460 L 1040 460 Z`;

    return {
      sunX: `${sunX.toFixed(2)}%`,
      sunY: `${sunY.toFixed(2)}%`,
      sunOpacity,
      isGoldenHour,
      moonX: `${moonX.toFixed(2)}%`,
      moonY: `${moonY.toFixed(2)}%`,
      moonOpacity,
      starlightOpacity,
      cloudOpacity,
      skyAmbientGradient,
      units,
      shadowStyle: `${chassisShadowX}px ${chassisShadowY}px 90px rgba(0, 0, 0, 0.88), 0 0 50px ${boxGlow}`,
      godRayPath,
      godRayColor,
      godRayOpacity: Math.max(0, Math.min(0.85, dominantOpacity * 0.9)),
      isSprint,
      isSolarDominant
    };
  }, [remainingMs, isRunning, timerState.status, timerState.startTime, clockOffset]);

  // --- REGISTRATIONS DESK FUNCTIONS ---
  const fetchTeamsData = async () => {
    setIsLoadingTeams(true);
    setTeamsError(null);
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_members(*)');
        
      if (error) throw error;
      const sortedTeams = (data || []).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setTeams(sortedTeams);
    } catch (err) {
      setTeamsError(err.message);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const handleViewReceipt = async (path) => {
    setIsReceiptLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('receipts')
        .createSignedUrl(path, 60);
      if (error) throw error;
      setReceiptUrl(data.signedUrl);
    } catch (err) {
      alert("Failed to load receipt: " + err.message);
    } finally {
      setIsReceiptLoading(false);
    }
  };

  const updatePaymentStatus = async (teamId, status) => {
    try {
      const { error } = await supabase.rpc('update_payment_status', {
        p_team_id: teamId,
        p_status: status
      });
      if (error) throw error;
      setTeams(teams.map(t => t.id === teamId ? { ...t, payment_status: status } : t));
    } catch (err) {
      alert("Failed to update status: " + err.message);
      fetchTeamsData();
    }
  };

  useEffect(() => {
    let timer;
    if (teamToDelete && deleteCountdown > 0 && !isDeleting) {
      timer = setInterval(() => {
        setDeleteCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [teamToDelete, deleteCountdown, isDeleting]);

  const initiateDelete = (team) => {
    setTeamToDelete(team);
    setDeleteCountdown(3);
    setDeleteError(null);
    setIsDeleting(false);
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const { error: dbError } = await supabase.from('teams').delete().eq('id', teamToDelete.id);
      if (dbError) {
        setDeleteError(`Database deletion failed: ${dbError.message}.`);
        setIsDeleting(false);
        return;
      }
      const { error: storageError } = await supabase.storage.from('receipts').remove([teamToDelete.receipt_url]);
      if (storageError) {
        setDeleteError(`PARTIAL DELETION: Receipt could not be removed: ${storageError.message}`);
        setTeams(teams.filter(t => t.id !== teamToDelete.id));
        setIsDeleting(false);
        return;
      }
      setTeams(teams.filter(t => t.id !== teamToDelete.id));
      setTeamToDelete(null);
      fetchTeamsData();
    } catch (err) {
      setDeleteError(`Unexpected error: ${err.message}`);
      setIsDeleting(false);
    }
  };

  const exportToExcel = () => {
    const wsData = [];
    wsData.push(["S.No", "Team Name", "Student Name", "Role", "Email Address", "Mobile Number", "College / Organization", "Department", "Degree"]);
    
    let studentRowIndex = 2;
    const merges = [];
    let sNo = 1;

    filteredTeams.forEach((team) => {
      const startRow = studentRowIndex - 1;
      team.team_members.forEach((member) => {
        wsData.push([
          sNo++,
          team.team_name,
          member.member_name,
          member.role,
          member.email,
          member.phone,
          member.college_org,
          member.department,
          member.degree
        ]);
        studentRowIndex++;
      });
      const endRow = studentRowIndex - 2;
      if (endRow > startRow) {
        merges.push({ s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } });
      }
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'] = merges;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "Hackathon_Registrations.xlsx");
  };

  // Attendance Management State
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [attendanceRecordsMap, setAttendanceRecordsMap] = useState({});
  const [activeAdminSlot, setActiveAdminSlot] = useState('slot_1_morning');
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // 'all' | 'missing' | 'complete'
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);

  const fetchAttendanceData = async () => {
    setIsAttendanceLoading(true);
    try {
      const { data: sData, error: sErr } = await supabase
        .from('attendance_sessions')
        .select('*')
        .order('session_key', { ascending: true });

      if (!sErr && sData) {
        setAttendanceSessions(sData);
        const liveSession = sData.find(s => s.is_active);
        if (liveSession && !activeAdminSlot) {
          setActiveAdminSlot(liveSession.session_key);
        }
      }

      const { data: rData, error: rErr } = await supabase
        .from('attendance_records')
        .select('*');

      if (!rErr && rData) {
        const map = {};
        rData.forEach(r => {
          map[`${r.session_key}_${r.team_id}`] = r;
        });
        setAttendanceRecordsMap(map);
      }
    } catch (err) {
      console.warn("Attendance fetch notice:", err);
    } finally {
      setIsAttendanceLoading(false);
    }
  };

  useEffect(() => {
    if (session && isAdmin && adminTab === 'attendance') {
      fetchAttendanceData();
    }
  }, [session, isAdmin, adminTab]);

  const handleEnableSingleAttendanceSlot = async (sessionKey) => {
    try {
      const { error } = await supabase.rpc('toggle_attendance_session', {
        p_session_key: sessionKey,
        p_is_active: true
      });
      if (error) throw error;
      setActiveAdminSlot(sessionKey);
      fetchAttendanceData();
    } catch (err) {
      alert("Failed to enable session: " + err.message);
    }
  };

  const handleCloseAllAttendanceSessions = async () => {
    try {
      const { error } = await supabase.rpc('close_all_attendance_sessions');
      if (error) throw error;
      fetchAttendanceData();
    } catch (err) {
      alert("Failed to close sessions: " + err.message);
    }
  };

  const handleAdminToggleMemberPresence = async (sessionKey, teamId, memberIndex) => {
    const key = `${sessionKey}_${teamId}`;
    const existing = attendanceRecordsMap[key] || {
      leader_present: false,
      member1_present: false,
      member2_present: false,
      member3_present: false
    };

    const updated = { ...existing };
    if (memberIndex === 0) updated.leader_present = !existing.leader_present;
    if (memberIndex === 1) updated.member1_present = !existing.member1_present;
    if (memberIndex === 2) updated.member2_present = !existing.member2_present;
    if (memberIndex === 3) updated.member3_present = !existing.member3_present;

    setAttendanceRecordsMap(prev => ({ ...prev, [key]: updated }));

    try {
      await supabase.rpc('save_team_attendance', {
        p_session_key: sessionKey,
        p_team_id: teamId,
        p_leader_present: !!updated.leader_present,
        p_member1_present: !!updated.member1_present,
        p_member2_present: !!updated.member2_present,
        p_member3_present: !!updated.member3_present,
        p_marked_by: 'Admin Override'
      });
    } catch (err) {
      console.warn("Admin attendance toggle failed:", err);
      fetchAttendanceData();
    }
  };

  const handleAdminMarkTeamAllPresent = async (sessionKey, teamId) => {
    const key = `${sessionKey}_${teamId}`;
    const allPresent = {
      leader_present: true,
      member1_present: true,
      member2_present: true,
      member3_present: true
    };

    setAttendanceRecordsMap(prev => ({ ...prev, [key]: allPresent }));

    try {
      await supabase.rpc('save_team_attendance', {
        p_session_key: sessionKey,
        p_team_id: teamId,
        p_leader_present: true,
        p_member1_present: true,
        p_member2_present: true,
        p_member3_present: true,
        p_marked_by: 'Admin Override'
      });
    } catch (err) {
      console.warn("Admin mark all present failed:", err);
      fetchAttendanceData();
    }
  };

  const exportAttendanceToExcel = () => {
    const wsData = [];
    wsData.push([
      "S.No", 
      "Team Name", 
      "Type", 
      "Leader Name", 
      "Leader Phone", 
      "College / Org",
      "Attendance 1 (Morning)", 
      "Attendance 2 (Evening)", 
      "Attendance 3 (Midnight)", 
      "Attendance 4 (Breakfast)",
      "Total Check-ins (Max 4)"
    ]);

    teams.forEach((team, idx) => {
      const leader = team.team_members?.find(m => m.role === 'Leader') || team.team_members?.[0] || {};
      
      const s1 = attendanceRecordsMap[`slot_1_morning_${team.id}`];
      const s2 = attendanceRecordsMap[`slot_2_evening_${team.id}`];
      const s3 = attendanceRecordsMap[`slot_3_midnight_${team.id}`];
      const s4 = attendanceRecordsMap[`slot_4_breakfast_${team.id}`];

      const s1Count = s1 ? (s1.leader_present ? 1 : 0) + (s1.member1_present ? 1 : 0) + (s1.member2_present ? 1 : 0) + (s1.member3_present ? 1 : 0) : 0;
      const s2Count = s2 ? (s2.leader_present ? 1 : 0) + (s2.member1_present ? 1 : 0) + (s2.member2_present ? 1 : 0) + (s2.member3_present ? 1 : 0) : 0;
      const s3Count = s3 ? (s3.leader_present ? 1 : 0) + (s3.member1_present ? 1 : 0) + (s3.member2_present ? 1 : 0) + (s3.member3_present ? 1 : 0) : 0;
      const s4Count = s4 ? (s4.leader_present ? 1 : 0) + (s4.member1_present ? 1 : 0) + (s4.member2_present ? 1 : 0) + (s4.member3_present ? 1 : 0) : 0;

      const totalPresentSlots = (s1Count > 0 ? 1 : 0) + (s2Count > 0 ? 1 : 0) + (s3Count > 0 ? 1 : 0) + (s4Count > 0 ? 1 : 0);

      wsData.push([
        idx + 1,
        team.team_name,
        team.is_onspot ? "ON-SPOT" : "ONLINE",
        leader.member_name || "N/A",
        leader.phone || "N/A",
        leader.college_org || "N/A",
        `${s1Count}/4 Present`,
        `${s2Count}/4 Present`,
        `${s3Count}/4 Present`,
        `${s4Count}/4 Present`,
        `${totalPresentSlots} / 4 Slots`
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance_Matrix");
    XLSX.writeFile(wb, "Hackathon_Attendance_Master.xlsx");
  };

  const filteredTeams = teams.filter(team => {
    const q = searchQuery.toLowerCase();
    if (team.team_name.toLowerCase().includes(q)) return true;
    return team.team_members.some(m => 
      m.member_name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      m.college_org.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: teams.length,
    online: teams.filter(t => !t.is_onspot).length,
    onspot: teams.filter(t => t.is_onspot).length,
    pending: teams.filter(t => t.payment_status === 'pending').length,
    verified: teams.filter(t => t.payment_status === 'verified').length,
    rejected: teams.filter(t => t.payment_status === 'rejected').length,
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  if (!session || !isAdmin) {
    return (
      <div className="admin-login-page">
        <GlassCard className="admin-login-card">
          <h2>Admin Master Portal</h2>
          <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Participants Management & 24-Hour Smart Board Timer Control
          </p>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Admin Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? 'Authenticating...' : 'Enter Admin Portal'}
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="admin-master-container">
      {/* --- TOP ADMIN CONTROL BAR (Apple-Style Minimal Glass Bar) --- */}
      <header className={`admin-unified-bar ${adminTab === 'stage' ? 'stage-mode-bar' : ''}`}>
        <div className="bar-brand">
          <span className="brand-title">VELTRAXX’26</span>
        </div>

        {/* Center: Apple-Style Glass Segmented Tabs */}
        <nav className="admin-center-segmented-nav" aria-label="Admin Navigation">
          <button 
            onClick={() => setAdminTab('stage')}
            className={`segmented-tab-btn ${adminTab === 'stage' ? 'active-segmented' : ''}`}
          >
            <span className="tab-icon">👑</span>
            <span className="tab-text">Stage View</span>
          </button>

          <button 
            onClick={() => setAdminTab('controls')}
            className={`segmented-tab-btn ${adminTab === 'controls' ? 'active-segmented' : ''}`}
          >
            <span className="tab-icon">⚙️</span>
            <span className="tab-text">Timer Controls</span>
          </button>

          <button 
            onClick={() => setAdminTab('registrations')}
            className={`segmented-tab-btn ${adminTab === 'registrations' ? 'active-segmented' : ''}`}
          >
            <span className="tab-icon">📋</span>
            <span className="tab-text">Registrations ({stats.total})</span>
          </button>

          <button 
            onClick={() => setAdminTab('attendance')}
            className={`segmented-tab-btn ${adminTab === 'attendance' ? 'active-segmented' : ''}`}
          >
            <span className="tab-icon">📊</span>
            <span className="tab-text">Attendance & Slots</span>
          </button>
        </nav>

        <div className="bar-actions">
          {/* Public Stage Broadcast Master Switch */}
          <button 
            onClick={() => handleTogglePublicVisibility(!timerState.is_public)}
            disabled={isTimerLoading}
            className={`btn-broadcast-toggle ${timerState.is_public ? 'is-public' : 'is-private'}`}
            title={timerState.is_public ? "Public Broadcast ON (Click to make Private)" : "Public Broadcast OFF (Click to Broadcast Live)"}
          >
            <span className="broadcast-dot" />
            <span>{timerState.is_public ? 'PUBLIC BROADCAST · LIVE' : 'PRIVATE · STANDBY'}</span>
          </button>

          <button onClick={toggleFullscreen} className="btn-bar-pill">
            ⛶ Fullscreen
          </button>

          {adminTab !== 'stage' && (
            <button onClick={handleLogout} className="btn-bar-danger">
              Logout
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* VIEW 1: CHIEF GUEST STAGE VIEW                                            */}
      {/* (PRE-LAUNCH: ONLY BIG RED BUTTON | POST-LAUNCH: LIVE RAY-TRACED CLOCK)    */}
      {/* ========================================================================= */}
      {adminTab === 'stage' && (
        <div className={`arena-page admin-arena-view ${celestialData.isSprint ? 'circadian-sprint' : ''}`}>
          {/* Atmospheric Ambient Sky Overlay */}
          <div 
            className="arena-overlay" 
            style={{ '--sky-ambient-gradient': celestialData.skyAmbientGradient }} 
          />

          {/* Daylight Clouds */}
          <div className="daylight-clouds-container" style={{ opacity: celestialData.cloudOpacity }}>
            {clouds.map(c => (
              <div 
                key={c.id} 
                className="daylight-cloud" 
                style={{ top: c.top, left: c.left, width: c.width, height: c.height, '--drift-time': c.driftTime }} 
              />
            ))}
          </div>

          {/* Rolls-Royce Starlight Canopy */}
          <div className="starlight-canopy" style={{ opacity: celestialData.starlightOpacity }}>
            {canopyStars.map(star => (
              <div
                key={star.id}
                className={`starlight-star ${star.variant} ${star.wave}`}
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  '--duration': star.duration,
                  '--delay': star.delay,
                  '--min-opacity': star.minOp,
                  '--max-opacity': star.maxOp
                }}
              />
            ))}
          </div>

          {/* Razor-Sharp 3-2-1 Stage Ignition Overlay */}
          {ignitionStep && (
            <div className="ignition-overlay">
              {typeof ignitionStep === 'number' && (
                <div key={ignitionStep} className="ignition-number">
                  0{ignitionStep}
                </div>
              )}
              {ignitionStep === 'LIVE' && (
                <div className="ignition-burst-text">
                  VELTRAXX IS OFFICIALLY LIVE 🚀
                </div>
              )}
            </div>
          )}

          {/* --- MAIN STAGE VIEWPORT --- */}
          <main className="arena-main stage-interactive-main">
            <div className="celestial-stage-wrapper">
              {/* Celestial Astronomical Core (Orbit, Sun, Moon, Volumetric God-Rays) - Hidden on Pre-Launch Button, Slow 8s Awakening Post-Launch */}
              <div className={`celestial-system-layer ${timerState.status === 'running' && !ignitionStep ? 'is-awake' : 'is-dormant'}`}>
                {/* 360° Circular Orbit SVG */}
                <svg className="celestial-orbit-svg" viewBox="0 0 1280 520" fill="none">
                  <ellipse 
                    cx="640" 
                    cy="310" 
                    rx="580" 
                    ry="260" 
                    stroke={celestialData.isSolarDominant ? "rgba(255, 238, 88, 0.12)" : "rgba(0, 229, 255, 0.12)"} 
                    strokeWidth="1.5" 
                    strokeDasharray="4 8" 
                  />
                </svg>

                {/* God-Ray Light Cone */}
                <svg className="celestial-god-rays" viewBox="0 0 1280 520" fill="none" style={{ opacity: celestialData.godRayOpacity }}>
                  <defs>
                    <linearGradient id="godRayGradientAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={celestialData.godRayColor} stopOpacity="0.8" />
                      <stop offset="60%" stopColor={celestialData.godRayColor} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={celestialData.godRayColor} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={celestialData.godRayPath} fill="url(#godRayGradientAdmin)" className="god-ray-polygon" />
                </svg>

                {/* Refined Sun */}
                <div 
                  className="celestial-body"
                  style={{ left: celestialData.sunX, top: celestialData.sunY, opacity: celestialData.sunOpacity }}
                >
                  <div className={`celestial-sun-refined ${celestialData.isGoldenHour ? 'golden-mode' : ''}`}>
                    <div className="sun-soft-ambient-halo" />
                    <div className="sun-core-sphere" title="The Sun" />
                  </div>
                </div>

                {/* Moon */}
                <div 
                  className="celestial-body"
                  style={{ left: celestialData.moonX, top: celestialData.moonY, opacity: celestialData.moonOpacity }}
                >
                  <div className="celestial-moon" title="The Moon" />
                </div>
              </div>

              {/* POST-LAUNCH ONLY: Double-Bezel Rolls-Royce Glass Clock Chassis */}
              <AnimatePresence>
                {timerState.status !== 'idle' && !ignitionStep && (
                  <motion.div 
                    className={`arena-clock-shell ${isRunning ? 'heartbeat-active' : ''}`} 
                    style={{ boxShadow: celestialData.shadowStyle }}
                    initial={{ opacity: 0, scale: 0.92, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="glass-embedded-stars" style={{ opacity: celestialData.starlightOpacity }}>
                      {glassStars.map(star => (
                        <div
                          key={star.id}
                          className={`glass-star-node ${star.variant} ${star.wave}`}
                          style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            '--duration': star.duration,
                            '--delay': star.delay,
                            '--min-opacity': star.minOp,
                            '--max-opacity': star.maxOp
                          }}
                        />
                      ))}
                    </div>

                    <div className="arena-clock-core">
                      <div className="arena-clock-digits-row">
                        <div className="digit-unit-block">
                          <div className="digit-number" style={celestialData.units.hours}>{pad(hours)}</div>
                          <div className="digit-label">HOURS</div>
                        </div>

                        <div className="digit-separator" style={celestialData.units.sep1}>:</div>

                        <div className="digit-unit-block">
                          <div className="digit-number" style={celestialData.units.minutes}>{pad(minutes)}</div>
                          <div className="digit-label">MINUTES</div>
                        </div>

                        <div className="digit-separator" style={celestialData.units.sep2}>:</div>

                        <div className="digit-unit-block">
                          <div className="digit-number" style={celestialData.units.seconds}>{pad(seconds)}</div>
                          <div className="digit-label">SECONDS</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PRE-LAUNCH ONLY: MASSIVE TACTILE 3D "TOUCH TO LAUNCH VELTRAXX'26" BUTTON */}
              <AnimatePresence>
                {timerState.status === 'idle' && !ignitionStep && (
                  <motion.div 
                    className="stage-launch-hero-housing"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="launch-button-housing">
                      <div className="launch-button-ring-glow" />
                      <button 
                        onClick={handleChiefGuestLaunch}
                        disabled={isTimerLoading}
                        className="big-red-launch-button stage-launch-trigger"
                        title="Touch to Launch VELTRAXX'26 Arena Clock"
                      >
                        <div className="button-inner-recess">
                          <span className="button-icon">🚀</span>
                          <span className="button-text">TOUCH TO LAUNCH VELTRAXX’26</span>
                          <span className="button-subtext">START 24-HOUR HACKATHON</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ADMIN TIMER OPERATOR CONTROLS                                     */}
      {/* ========================================================================= */}
      {adminTab === 'controls' && (
        <div className="admin-timer-controls-view">
          <div className="timer-controls-card">
            <div className="controls-card-header">
              <div>
                <h2>⚙️ Backstage Timer Operator Dashboard</h2>
                <p style={{ color: 'var(--admin-text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                  Manage duration presets, public visibility gates, and real-time adjustments for the stage arena.
                </p>
              </div>
              <span className={`live-status-pill ${timerState.status}`}>
                STATUS: {timerState.status.toUpperCase()}
              </span>
            </div>

            {operatorFeedback && (
              <div className={`timer-feedback-banner ${operatorFeedback.isError ? 'is-error' : 'is-success'}`}>
                {operatorFeedback.isError ? '⚠️' : '✅'} {operatorFeedback.text}
              </div>
            )}

            {/* Public Stage Visibility Gate Card */}
            <div className="public-broadcast-gate-card">
              <div className="broadcast-gate-info">
                <div className="broadcast-gate-title">
                  <span>🌐</span>
                  <span>Public Stage Visibility Gate: <strong>{timerState.is_public ? 'PUBLIC (Broadcasting Live)' : 'PRIVATE (Standby Screen)'}</strong></span>
                </div>
                <p className="broadcast-gate-desc">
                  {timerState.is_public 
                    ? "The live 24-hour countdown is currently BROADCASTING PUBLICLY to all participants on /#/arena." 
                    : "The countdown is currently LOCKED BACKSTAGE. Anyone visiting the public /#/arena page sees ONLY the 'Stage on Standby' lock screen."}
                </p>
              </div>
              <button 
                onClick={() => handleTogglePublicVisibility(!timerState.is_public)}
                disabled={isTimerLoading}
                className={`btn-gate-switch ${timerState.is_public ? 'switch-to-private' : 'switch-to-public'}`}
              >
                {timerState.is_public ? '🔒 Make Stage Private (Lock)' : '🚀 Publish Stage to Public'}
              </button>
            </div>

            {/* Active Countdown Preview */}
            <div className="preview-digits-row" style={{ margin: '24px 0' }}>
              <div className="digit-card">
                <span className="digit-val">{pad(hours)}</span>
                <span className="digit-sub">HOURS</span>
              </div>
              <span className="digit-sep">:</span>
              <div className="digit-card">
                <span className="digit-val">{pad(minutes)}</span>
                <span className="digit-sub">MINUTES</span>
              </div>
              <span className="digit-sep">:</span>
              <div className="digit-card">
                <span className="digit-val">{pad(seconds)}</span>
                <span className="digit-sub">SECONDS</span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="presets-section">
              <h3 className="section-title">⏱️ Set Duration & Broadcast Live to Stage:</h3>
              <div className="presets-grid">
                <button 
                  onClick={() => handleStartTimerPreset(600)} 
                  disabled={isTimerLoading}
                  className={`preset-btn ${timerState.durationSeconds === 600 && timerState.status === 'running' ? 'active-preset' : ''}`}
                >
                  <span className="preset-time">10</span>
                  <span className="preset-unit">MINUTES</span>
                  <span className="preset-tag">Testing / Sprint</span>
                </button>

                <button 
                  onClick={() => handleStartTimerPreset(900)} 
                  disabled={isTimerLoading}
                  className={`preset-btn ${timerState.durationSeconds === 900 && timerState.status === 'running' ? 'active-preset' : ''}`}
                >
                  <span className="preset-time">15</span>
                  <span className="preset-unit">MINUTES</span>
                  <span className="preset-tag">Pitch / Checkpoint</span>
                </button>

                <button 
                  onClick={() => handleStartTimerPreset(1200)} 
                  disabled={isTimerLoading}
                  className={`preset-btn ${timerState.durationSeconds === 1200 && timerState.status === 'running' ? 'active-preset' : ''}`}
                >
                  <span className="preset-time">20</span>
                  <span className="preset-unit">MINUTES</span>
                  <span className="preset-tag">Sprint Block</span>
                </button>

                <button 
                  onClick={() => handleStartTimerPreset(3600)} 
                  disabled={isTimerLoading}
                  className={`preset-btn ${timerState.durationSeconds === 3600 && timerState.status === 'running' ? 'active-preset' : ''}`}
                >
                  <span className="preset-time">1</span>
                  <span className="preset-unit">HOUR</span>
                  <span className="preset-tag">Phase Sprint</span>
                </button>

                <button 
                  onClick={() => handleStartTimerPreset(86400)} 
                  disabled={isTimerLoading}
                  className={`preset-btn gold-preset ${timerState.durationSeconds === 86400 && timerState.status === 'running' ? 'active-preset' : ''}`}
                >
                  <span className="preset-time">24</span>
                  <span className="preset-unit">HOURS</span>
                  <span className="preset-tag">Official Hackathon</span>
                </button>
              </div>

              {/* Custom Minutes Input */}
              <form onSubmit={handleApplyCustomMinutes} className="custom-duration-form">
                <label htmlFor="custom-mins">Custom Duration (Minutes):</label>
                <div className="custom-input-group">
                  <input 
                    id="custom-mins"
                    type="number" 
                    min="1" 
                    max="2880"
                    placeholder="e.g. 45" 
                    value={customMinutes}
                    onChange={e => setCustomMinutes(e.target.value)}
                    className="custom-input"
                  />
                  <button type="submit" disabled={isTimerLoading || !customMinutes} className="btn-apply-custom">
                    Apply & Start ⚡
                  </button>
                </div>
              </form>
            </div>

            {/* Live Controls & Actions */}
            <div className="preview-actions-bar" style={{ marginTop: '24px' }}>
              {timerState.status === 'running' ? (
                <button onClick={handlePauseTimer} disabled={isTimerLoading} className="btn-ctrl btn-pause">
                  ⏸️ Pause Stage Clock
                </button>
              ) : (
                <button onClick={handleResumeTimer} disabled={isTimerLoading} className="btn-ctrl btn-resume">
                  ▶️ Resume Stage Clock
                </button>
              )}

              <button onClick={() => setShowResetModal(true)} disabled={isTimerLoading} className="btn-ctrl btn-reset">
                🔄 Reset to Idle (Pre-Launch)
              </button>
            </div>

            {/* Real-time Adjustments */}
            <div className="adjust-time-section" style={{ marginTop: '24px' }}>
              <h4 className="adjust-title">⚙️ On-The-Fly Clock Adjustments:</h4>
              <div className="adjust-buttons-row">
                <button onClick={() => handleAdjustTimer(-900)} disabled={isTimerLoading} className="btn-adjust btn-neg">-15m</button>
                <button onClick={() => handleAdjustTimer(-300)} disabled={isTimerLoading} className="btn-adjust btn-neg">-5m</button>
                <button onClick={() => handleAdjustTimer(-60)} disabled={isTimerLoading} className="btn-adjust btn-neg">-1m</button>
                <button onClick={() => handleAdjustTimer(60)} disabled={isTimerLoading} className="btn-adjust btn-pos">+1m</button>
                <button onClick={() => handleAdjustTimer(300)} disabled={isTimerLoading} className="btn-adjust btn-pos">+5m</button>
                <button onClick={() => handleAdjustTimer(900)} disabled={isTimerLoading} className="btn-adjust btn-pos">+15m</button>
                <button onClick={() => handleAdjustTimer(3600)} disabled={isTimerLoading} className="btn-adjust btn-pos">+1 Hour</button>
                <button onClick={() => triggerIgnitionSequence()} className="btn-adjust btn-trigger-ignition">🚀 Trigger 3-2-1</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: PARTICIPANTS & REGISTRATIONS DESK (With Vibrant Colored Cards)     */}
      {/* ========================================================================= */}
      {adminTab === 'registrations' && (
        <div className="admin-dashboard">
          <header className="admin-header">
            <div>
              <h1>Participants & Registrations Desk</h1>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Front-Desk Team Verification, Receipts & Excel Export
              </p>
            </div>
            <div className="admin-actions">
              <button onClick={fetchTeamsData} className="btn-secondary">Refresh Data</button>
              <button onClick={exportToExcel} className="btn-primary">Export Excel</button>
              <button onClick={() => setAdminTab('stage')} className="btn-secondary" style={{ color: 'var(--admin-accent-blue-text)', borderColor: 'rgba(0, 229, 255, 0.35)' }}>
                👑 Go to Stage View
              </button>
            </div>
          </header>

          {/* Vibrant Apple-Tier Colored Glass Stat Cards */}
          <div className="admin-stats-grid">
            <div className="stat-card stat-card-total">
              <h3>Total Teams</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-card stat-card-pending">
              <h3>Pending Verification</h3>
              <p className="stat-value">{stats.pending}</p>
            </div>
            <div className="stat-card stat-card-verified">
              <h3>Verified & Paid</h3>
              <p className="stat-value">{stats.verified}</p>
            </div>
            <div className="stat-card stat-card-rejected">
              <h3>Rejected</h3>
              <p className="stat-value">{stats.rejected}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="admin-search-bar">
            <input 
              type="text" 
              placeholder="Search by team name, student name, email, college..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Teams List */}
          {isLoadingTeams ? (
            <div className="admin-loading">Loading registration records...</div>
          ) : teamsError ? (
            <div className="admin-error">Error: {teamsError}</div>
          ) : filteredTeams.length === 0 ? (
            <div className="admin-empty">No teams found.</div>
          ) : (
            <div className="teams-list">
              {filteredTeams.map(team => (
                <GlassCard key={team.id} className="team-admin-card">
                  <div className="team-card-header">
                    <div>
                      <h2>{team.team_name}</h2>
                      <span className="team-timestamp">Registered: {new Date(team.created_at).toLocaleString()}</span>
                    </div>
                    <div className="status-control">
                      <span className={`status-pill ${team.payment_status}`}>
                        {team.payment_status}
                      </span>
                      <select 
                        value={team.payment_status}
                        onChange={(e) => updatePaymentStatus(team.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button 
                        onClick={() => initiateDelete(team)}
                        className="btn-danger-icon"
                        title="Delete Team"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Transaction details & Receipt */}
                  <div className="payment-metadata">
                    <div>
                      <strong>Transaction ID / UTR:</strong> 
                      <span className="utr-code">{team.transaction_id || 'N/A'}</span>
                    </div>
                    {team.receipt_url && (
                      <button 
                        onClick={() => handleViewReceipt(team.receipt_url)}
                        className="btn-view-receipt"
                      >
                        View Payment Receipt ↗
                      </button>
                    )}
                  </div>

                  {/* Members table */}
                  <div className="members-table-wrapper">
                    <table className="members-table">
                      <thead>
                        <tr>
                          <th>Role</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>College</th>
                          <th>Dept & Degree</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.team_members.map(member => (
                          <tr key={member.id} className={member.role === 'Leader' ? 'leader-row' : ''}>
                            <td>
                              <span className={`role-badge ${member.role.toLowerCase()}`}>
                                {member.role}
                              </span>
                            </td>
                            <td><strong>{member.member_name}</strong></td>
                            <td>{member.email}</td>
                            <td>{member.phone}</td>
                            <td>{member.college_org}</td>
                            <td>{member.department} ({member.degree})</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Receipt Modal */}
          {receiptUrl && (
            <div className="receipt-modal-backdrop" onClick={() => setReceiptUrl(null)}>
              <div className="receipt-modal-content" onClick={e => e.stopPropagation()}>
                <div className="receipt-modal-header">
                  <h3>Payment Proof Document</h3>
                  <button onClick={() => setReceiptUrl(null)} className="close-btn">✕</button>
                </div>
                <div className="receipt-image-container">
                  {isReceiptLoading ? (
                    <div className="receipt-loading">Generating secure view...</div>
                  ) : (
                    <img src={receiptUrl} alt="Payment Receipt" className="receipt-image" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Permanent Delete Modal */}
          {teamToDelete && (
            <div className="receipt-modal-backdrop" onClick={() => !isDeleting && setTeamToDelete(null)}>
              <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
                <div className="delete-modal-header">
                  <span className="warning-icon">⚠️</span>
                  <h3>Permanently Delete Registration?</h3>
                </div>
                
                <div className="delete-modal-body">
                  <p>You are about to permanently delete <strong>{teamToDelete.team_name}</strong> along with all <strong>{teamToDelete.team_members?.length || 0} members</strong> and their payment receipt proof.</p>
                  <p className="delete-warning-subtext">This action cannot be undone.</p>
                  
                  {deleteError && (
                    <div className="delete-error-banner">
                      {deleteError}
                    </div>
                  )}
                </div>

                <div className="delete-modal-actions">
                  <button 
                    onClick={() => setTeamToDelete(null)} 
                    className="btn-cancel"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  
                  <button 
                    onClick={executeDelete} 
                    className="btn-confirm-delete"
                    disabled={deleteCountdown > 0 || isDeleting}
                  >
                    {isDeleting ? (
                      'Deleting...'
                    ) : deleteCountdown > 0 ? (
                      `Delete (${deleteCountdown}s)`
                    ) : (
                      'Delete Forever'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: ATTENDANCE & ON-SPOT SESSIONS HUB                                  */}
      {/* ========================================================================= */}
      {adminTab === 'attendance' && (
        <div className="admin-registrations-view" style={{ padding: '30px', maxWidth: '1480px', margin: '0 auto' }}>
          {/* Top Bar with Quick Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', color: '#ffffff', margin: '0 0 6px 0' }}>
                Attendance & On-Spot Operations Hub
              </h2>
              <p style={{ color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', margin: 0 }}>
                Control live attendance broadcasting, review missing participants, and alter check-in records anytime.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link 
                to="/onspot" 
                target="_blank"
                style={{
                  padding: '10px 18px',
                  background: 'rgba(0, 229, 255, 0.12)',
                  border: '1px solid rgba(0, 229, 255, 0.4)',
                  borderRadius: '8px',
                  color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                💵 Open On-Spot Desk ↗
              </Link>
              <Link 
                to="/attendance" 
                target="_blank"
                style={{
                  padding: '10px 18px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '8px',
                  color: '#34d399',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📱 Volunteer Mobile Sheet ↗
              </Link>
              <button 
                onClick={exportAttendanceToExcel}
                className="btn-export-excel"
              >
                📥 Export Master Sheet (.xlsx)
              </button>
            </div>
          </div>

          {/* 1. MASTER SESSION BROADCAST CONTROLS */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                  📡 VOLUNTEER MOBILE BROADCAST CONTROLLER
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#ffffff', margin: '4px 0 0 0' }}>
                  {attendanceSessions.some(s => s.is_active) ? (
                    <span style={{ color: '#34d399' }}>
                      🟢 LIVE NOW: {attendanceSessions.find(s => s.is_active)?.title}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--admin-text-secondary)' }}>
                      🔒 ALL ATTENDANCE SESSIONS CLOSED (STANDBY)
                    </span>
                  )}
                </h3>
              </div>

              {attendanceSessions.some(s => s.is_active) && (
                <button
                  onClick={handleCloseAllAttendanceSessions}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: 'rgba(255, 77, 79, 0.18)',
                    border: '1px solid rgba(255, 77, 79, 0.5)',
                    color: '#ff7875',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🔒 Close Active Session
                </button>
              )}
            </div>

            {/* Direct 4 Buttons to Enable Attendance 1, 2, 3, 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {[
                { key: 'slot_1_morning', num: 1, label: 'Attendance 1: Morning Check-In', time: '09:30 AM – 10:15 AM' },
                { key: 'slot_2_evening', num: 2, label: 'Attendance 2: Evening Refreshments', time: '06:00 PM – 07:00 PM' },
                { key: 'slot_3_midnight', num: 3, label: 'Attendance 3: Midnight Sprint', time: '01:00 AM – 02:00 AM' },
                { key: 'slot_4_breakfast', num: 4, label: 'Attendance 4: Morning Breakfast', time: '08:00 AM – 09:00 AM' }
              ].map((slot) => {
                const isLive = attendanceSessions.find(s => s.session_key === slot.key)?.is_active;
                return (
                  <div
                    key={slot.key}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: isLive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: isLive ? '1px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: '700', color: isLive ? '#34d399' : 'var(--admin-text-secondary)' }}>
                          {isLive ? '● BROADCASTING LIVE' : `SLOT ${slot.num}`}
                        </span>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff', marginBottom: '2px' }}>
                        {slot.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                        {slot.time}
                      </div>
                    </div>

                    <button
                      onClick={() => isLive ? handleCloseAllAttendanceSessions() : handleEnableSingleAttendanceSlot(slot.key)}
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: isLive ? '1px solid rgba(255, 77, 79, 0.5)' : '1px solid rgba(16, 185, 129, 0.5)',
                        background: isLive ? 'rgba(255, 77, 79, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isLive ? '#ff7875' : '#34d399'
                      }}
                    >
                      {isLive ? '🔒 Close Session' : `▶ Enable Attendance ${slot.num}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. HISTORICAL SLOT INSPECTOR TABS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                🔍 INSPECT & ALTER RECORDS
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#ffffff', margin: '2px 0 0 0' }}>
                Session Data Inspector
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { key: 'slot_1_morning', title: 'Attendance 1 (Morning)' },
                { key: 'slot_2_evening', title: 'Attendance 2 (Evening)' },
                { key: 'slot_3_midnight', title: 'Attendance 3 (Midnight)' },
                { key: 'slot_4_breakfast', title: 'Attendance 4 (Breakfast)' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveAdminSlot(tab.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: activeAdminSlot === tab.key ? 'rgba(0, 229, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    border: activeAdminSlot === tab.key ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: activeAdminSlot === tab.key ? '#ffffff' : 'var(--admin-text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          {/* 3. SLOT ANALYTICS CARDS (FOR SELECTED SLOT) */}
          {(() => {
            let fullTeamsCount = 0;
            let partialTeamsCount = 0;
            let absentTeamsCount = 0;
            let totalPresentMembersInSlot = 0;

            teams.forEach(t => {
              const rec = attendanceRecordsMap[`${activeAdminSlot}_${t.id}`];
              const count = (rec?.leader_present ? 1 : 0) +
                            (rec?.member1_present ? 1 : 0) +
                            (rec?.member2_present ? 1 : 0) +
                            (rec?.member3_present ? 1 : 0);
              if (count === 4) fullTeamsCount++;
              else if (count > 0 && count < 4) partialTeamsCount++;
              else absentTeamsCount++;
              totalPresentMembersInSlot += count;
            });

            const totalExpected = teams.length * 4;
            const turnoutPct = totalExpected > 0 ? ((totalPresentMembersInSlot / totalExpected) * 100).toFixed(1) : '0.0';

            return (
              <div className="admin-stats-grid" style={{ marginBottom: '28px' }}>
                <div className="stat-card">
                  <span className="stat-label">TURNOUT IN THIS SLOT</span>
                  <span className="stat-val" style={{ color: '#00e5ff' }}>{turnoutPct}%</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                    {totalPresentMembersInSlot} / {totalExpected} Members Present
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">FULLY PRESENT TEAMS (4/4)</span>
                  <span className="stat-val" style={{ color: '#34d399' }}>{fullTeamsCount}</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                    All 4 members in attendance
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">PARTIAL TEAMS (1–3 PRESENT)</span>
                  <span className="stat-val" style={{ color: '#fbbf24' }}>{partialTeamsCount}</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                    Missing 1 or more members
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">COMPLETELY ABSENT TEAMS</span>
                  <span className="stat-val" style={{ color: '#ff7875' }}>{absentTeamsCount}</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                    0 members checked in
                  </span>
                </div>
              </div>
            );
          })()}

          {/* 4. MISSING & PARTIAL PARTICIPANTS REVISION REPORT */}
          {(() => {
            const missingTeams = teams.filter(t => {
              const rec = attendanceRecordsMap[`${activeAdminSlot}_${t.id}`];
              const count = (rec?.leader_present ? 1 : 0) +
                            (rec?.member1_present ? 1 : 0) +
                            (rec?.member2_present ? 1 : 0) +
                            (rec?.member3_present ? 1 : 0);
              return count < 4;
            });

            return (
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 77, 79, 0.25)', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🚨</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                      Missing / Absent Revision Report ({missingTeams.length} Teams with Absentees)
                    </h3>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>
                    Instant organizer audit & direct phone contact
                  </span>
                </div>

                {missingTeams.length === 0 ? (
                  <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                    🎉 100% Full Attendance! All teams and members are present in this session.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                    {missingTeams.map(team => {
                      const leader = team.team_members?.find(m => m.role === 'Leader') || team.team_members?.[0] || {};
                      const rec = attendanceRecordsMap[`${activeAdminSlot}_${team.id}`];

                      const members = team.team_members || [];
                      const absentMembers = [];
                      if (!rec?.leader_present) absentMembers.push(members[0]?.member_name || 'Leader');
                      if (!rec?.member1_present) absentMembers.push(members[1]?.member_name || 'Member 2');
                      if (!rec?.member2_present) absentMembers.push(members[2]?.member_name || 'Member 3');
                      if (!rec?.member3_present) absentMembers.push(members[3]?.member_name || 'Member 4');

                      return (
                        <div 
                          key={team.id}
                          style={{
                            padding: '14px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '10px'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <span style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>
                                {team.team_name}
                              </span>
                              <span style={{ color: '#ff7875', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: '700' }}>
                                {absentMembers.length}/4 ABSENT
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>
                              🏛️ {leader.college_org || 'College'}
                            </div>

                            {/* Missing members names */}
                            <div style={{ background: 'rgba(255, 77, 79, 0.08)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255, 77, 79, 0.2)', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#ff7875', display: 'block', marginBottom: '2px' }}>
                                Missing Members:
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>
                                {absentMembers.join(', ')}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                              Leader: {leader.member_name} ({leader.phone || 'No phone'})
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            {leader.phone && (
                              <a
                                href={`tel:${leader.phone}`}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(0, 229, 255, 0.12)',
                                  border: '1px solid rgba(0, 229, 255, 0.35)',
                                  borderRadius: '6px',
                                  color: 'var(--accent-cyan)',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.74rem',
                                  textDecoration: 'none',
                                  fontWeight: '700',
                                  textAlign: 'center',
                                  flex: 1
                                }}
                              >
                                📞 Call Leader
                              </a>
                            )}
                            <button
                              onClick={() => handleAdminMarkTeamAllPresent(activeAdminSlot, team.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                borderRadius: '6px',
                                color: '#34d399',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.74rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                flex: 1
                              }}
                            >
                              ⚡ Alter: Mark 4/4 Present
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* 5. MASTER LIVE ATTENDANCE MATRIX (SHOWING ALL 4 MEMBERS) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
                Master Attendance Matrix (All 4 Members Breakdown)
              </h3>
              <p style={{ color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', margin: 0 }}>
                Click any member's [ P / A ] chip to alter their presence in real time.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setAttendanceFilter('all')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: attendanceFilter === 'all' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: attendanceFilter === 'all' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  All ({teams.length})
                </button>
                <button
                  onClick={() => setAttendanceFilter('missing')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: attendanceFilter === 'missing' ? 'rgba(255, 77, 79, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: attendanceFilter === 'missing' ? '1px solid #ff7875' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ff7875',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  🚨 Missing Only
                </button>
                <button
                  onClick={() => setAttendanceFilter('complete')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: attendanceFilter === 'complete' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: attendanceFilter === 'complete' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#34d399',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Complete Only
                </button>
              </div>

              <div className="admin-search-wrapper" style={{ margin: 0 }}>
                <input 
                  type="text" 
                  placeholder="Search teams or members..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                  style={{ width: '220px' }}
                />
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Team & College</th>
                  <th>Type</th>
                  <th>Leader (Member 1)</th>
                  <th>Member 2</th>
                  <th>Member 3</th>
                  <th>Member 4</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.filter(team => {
                  if (attendanceFilter === 'all') return true;
                  const rec = attendanceRecordsMap[`${activeAdminSlot}_${team.id}`];
                  const c = (rec?.leader_present ? 1 : 0) + (rec?.member1_present ? 1 : 0) + (rec?.member2_present ? 1 : 0) + (rec?.member3_present ? 1 : 0);
                  if (attendanceFilter === 'missing') return c < 4;
                  if (attendanceFilter === 'complete') return c === 4;
                  return true;
                }).map((team, idx) => {
                  const members = team.team_members || [];
                  const m1 = members[0] || {};
                  const m2 = members[1] || {};
                  const m3 = members[2] || {};
                  const m4 = members[3] || {};

                  const rec = attendanceRecordsMap[`${activeAdminSlot}_${team.id}`] || {};
                  const p1 = !!rec.leader_present;
                  const p2 = !!rec.member1_present;
                  const p3 = !!rec.member2_present;
                  const p4 = !!rec.member3_present;
                  const presentCount = (p1 ? 1 : 0) + (p2 ? 1 : 0) + (p3 ? 1 : 0) + (p4 ? 1 : 0);

                  const renderMemberCell = (memberObj, isPresent, mIndex) => (
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {memberObj.member_name || 'N/A'}
                          </div>
                          {memberObj.phone && (
                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--admin-text-secondary)' }}>
                              {memberObj.phone}
                            </div>
                          )}
                        </div>

                        {/* Interactive Presence Chip (Click to alter!) */}
                        <button
                          onClick={() => handleAdminToggleMemberPresence(activeAdminSlot, team.id, mIndex)}
                          title="Click to toggle presence"
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            border: isPresent ? '1px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(255, 77, 79, 0.4)',
                            background: isPresent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 77, 79, 0.1)',
                            color: isPresent ? '#34d399' : '#ff7875',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isPresent ? 'P' : 'A'}
                        </button>
                      </div>
                    </td>
                  );

                  return (
                    <tr key={team.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--admin-text-secondary)' }}>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: '700', color: '#ffffff' }}>{team.team_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>{m1.college_org || 'College'}</div>
                      </td>
                      <td>
                        {team.is_onspot ? (
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: '700' }}>
                            ON-SPOT
                          </span>
                        ) : (
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                            ONLINE
                          </span>
                        )}
                      </td>

                      {/* 4 Member Cells with Clickable P/A Chips */}
                      {renderMemberCell(m1, p1, 0)}
                      {renderMemberCell(m2, p2, 1)}
                      {renderMemberCell(m3, p3, 2)}
                      {renderMemberCell(m4, p4, 3)}

                      {/* Team Status in Slot */}
                      <td>
                        {presentCount === 4 && <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: '700' }}>✅ 4/4 Present</span>}
                        {presentCount > 0 && presentCount < 4 && <span style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: '700' }}>⚠️ {presentCount}/4 Partial</span>}
                        {presentCount === 0 && <span style={{ color: '#ff7875', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>❌ 0/4 Absent</span>}
                      </td>

                      {/* Quick Admin Mark All Present */}
                      <td>
                        <button
                          onClick={() => handleAdminMarkTeamAllPresent(activeAdminSlot, team.id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ All 4 Present
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Global Reset Modal for Controls View */}
      {showResetModal && (
        <div className="receipt-modal-backdrop" onClick={() => setShowResetModal(false)}>
          <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-header">
              <span className="warning-icon">⚠️</span>
              <h3>Reset Stage Clock to Pre-Launch?</h3>
            </div>
            <div className="delete-modal-body">
              <p>This will stop the active countdown, hide the clock, and restore <strong>ONLY the Big Red Launch Button</strong> on the stage board.</p>
            </div>
            <div className="delete-modal-actions">
              <button onClick={() => setShowResetModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleResetTimerToIdle} className="btn-confirm-delete">Confirm Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
