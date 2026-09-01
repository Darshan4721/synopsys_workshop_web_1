import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import './TimerControl.css';

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

export default function TimerControl() {
  const [timerState, setTimerState] = useState(getInitialLocalTimer);
  const [selectedDuration, setSelectedDuration] = useState(86400); // 24h default
  const [customMinutes, setCustomMinutes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [remainingSec, setRemainingSec] = useState(86400);
  const [showResetModal, setShowResetModal] = useState(false);

  const persistLocalTimer = (newState) => {
    try {
      localStorage.setItem(LOCAL_TIMER_KEY, JSON.stringify(newState));
    } catch (e) {}
  };

  const fetchTimerState = async () => {
    try {
      const { data, error } = await supabase.rpc('get_timer_state');
      if (!error && data && data.status) {
        const updated = {
          status: data.status || 'idle',
          is_public: data.is_public !== undefined ? !!data.is_public : false,
          startTime: data.start_time,
          endTime: data.end_time,
          durationSeconds: data.duration_seconds || 86400,
          remainingSecondsAtPause: data.remaining_seconds_at_pause ?? 86400,
          serverNow: data.server_now
        };
        setTimerState(updated);
        persistLocalTimer(updated);

        if (data.status === 'running') {
          if (data.remaining_seconds !== undefined) {
            setRemainingSec(data.remaining_seconds);
          }
        } else if (data.status === 'paused') {
          setRemainingSec(data.remaining_seconds_at_pause || 0);
        } else if (data.status === 'idle') {
          setRemainingSec(86400);
        } else if (data.status === 'ended') {
          setRemainingSec(0);
        }
      }
    } catch (err) {
      console.warn("Timer control fetch notice:", err);
    }
  };

  useEffect(() => {
    fetchTimerState();
    const channel = supabase
      .channel('timer_controls_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_timer' }, () => {
        fetchTimerState();
      })
      .subscribe();

    const interval = setInterval(fetchTimerState, 30000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  // Live countdown ticker
  useEffect(() => {
    if (timerState.status === 'running') {
      const interval = setInterval(() => {
        setRemainingSec(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    } else if (timerState.status === 'paused') {
      setRemainingSec(timerState.remainingSecondsAtPause || 0);
    } else {
      setRemainingSec(86400);
    }
  }, [timerState.status, timerState.remainingSecondsAtPause]);

  const showFeedback = (msg, isError = false) => {
    setFeedbackMsg({ text: msg, isError });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleTogglePublicVisibility = async (nextIsPublic) => {
    setIsLoading(true);
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
      showFeedback(
        nextIsPublic 
          ? "Stage Arena is now PUBLIC & Broadcasting to all participants!" 
          : "Stage Arena is now PRIVATE (Participants see Standby screen)."
      );
    } catch (err) {
      showFeedback(
        nextIsPublic 
          ? "Stage set to PUBLIC locally." 
          : "Stage set to PRIVATE locally."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTimerWithDuration = async (durationSec) => {
    setIsLoading(true);
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

    try {
      const { data, error } = await supabase.rpc('start_event_timer', {
        p_duration_seconds: durationSec
      });
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showFeedback(`Timer set to ${Math.round(durationSec / 60)} minutes and is RUNNING!`);
    } catch (err) {
      showFeedback(`Timer updated to ${Math.round(durationSec / 60)}m locally.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseTimer = async () => {
    setIsLoading(true);
    const currentRem = remainingSec;
    const pausedState = {
      ...timerState,
      status: 'paused',
      remainingSecondsAtPause: currentRem
    };
    setTimerState(pausedState);
    persistLocalTimer(pausedState);

    try {
      const { data, error } = await supabase.rpc('pause_event_timer');
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showFeedback("Timer PAUSED.");
    } catch (err) {
      showFeedback("Timer PAUSED locally.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeTimer = async () => {
    setIsLoading(true);
    const rem = timerState.remainingSecondsAtPause || remainingSec || 86400;
    const now = Date.now();
    const endIso = new Date(now + rem * 1000).toISOString();

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
      showFeedback("Timer RESUMED.");
    } catch (err) {
      showFeedback("Timer RESUMED locally.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustTimer = async (seconds) => {
    setIsLoading(true);

    if (timerState.status === 'running' && timerState.endTime) {
      const currentEnd = new Date(timerState.endTime).getTime();
      const newEnd = new Date(currentEnd + seconds * 1000).toISOString();
      const adjustedState = {
        ...timerState,
        endTime: newEnd,
        durationSeconds: (timerState.durationSeconds || 86400) + seconds
      };
      setTimerState(adjustedState);
      persistLocalTimer(adjustedState);
    } else if (timerState.status === 'paused') {
      const newRem = Math.max(0, (timerState.remainingSecondsAtPause || 0) + seconds);
      const adjustedState = {
        ...timerState,
        remainingSecondsAtPause: newRem,
        durationSeconds: (timerState.durationSeconds || 86400) + seconds
      };
      setTimerState(adjustedState);
      persistLocalTimer(adjustedState);
    }

    try {
      const { data, error } = await supabase.rpc('adjust_event_timer', {
        p_additional_seconds: seconds
      });
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showFeedback(`Time adjusted by ${seconds > 0 ? '+' : ''}${Math.round(seconds / 60)} minutes.`);
    } catch (err) {
      showFeedback(`Time adjusted by ${seconds > 0 ? '+' : ''}${Math.round(seconds / 60)}m locally.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToIdle = async () => {
    setIsLoading(true);
    setShowResetModal(false);

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
    setRemainingSec(86400);

    try {
      const { data, error } = await supabase.rpc('reset_event_timer', {
        p_duration_seconds: 86400
      });
      if (!error && data) {
        setTimerState(data);
        persistLocalTimer(data);
      }
      showFeedback("Timer reset to IDLE (Pre-Launch).");
    } catch (err) {
      showFeedback("Timer reset to IDLE locally.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (!mins || mins <= 0) {
      showFeedback("Please enter a valid number of minutes.", true);
      return;
    }
    const secs = mins * 60;
    setSelectedDuration(secs);
    handleStartTimerWithDuration(secs);
    setCustomMinutes('');
  };

  // Format hours, minutes, seconds for preview
  const hours = Math.floor(remainingSec / 3600);
  const minutes = Math.floor((remainingSec % 3600) / 60);
  const seconds = remainingSec % 60;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="timer-control-page">
      <div className="timer-control-container">
        {/* Header */}
        <header className="control-header">
          <div className="control-brand">
            <Link to="/" className="control-logo">VELTRAXX’26</Link>
            <span className="control-badge">OPERATOR BACKSTAGE</span>
          </div>

          <div className="control-nav-links">
            <button 
              onClick={() => handleTogglePublicVisibility(!timerState.is_public)}
              disabled={isLoading}
              className={`btn-broadcast-toggle ${timerState.is_public ? 'is-public' : 'is-private'}`}
              style={{ background: timerState.is_public ? 'rgba(0, 255, 128, 0.15)' : 'rgba(255, 204, 0, 0.12)', border: '1px solid ' + (timerState.is_public ? 'rgba(0, 255, 128, 0.4)' : 'rgba(255, 204, 0, 0.4)'), color: timerState.is_public ? '#00ff80' : '#ffcc00' }}
            >
              <span className="broadcast-dot" />
              <span>{timerState.is_public ? 'PUBLIC BROADCAST · LIVE' : 'PRIVATE · STANDBY'}</span>
            </button>
            <Link to="/admin" className="control-nav-btn">
              📋 Admin Portal
            </Link>
            <Link to="/arena" target="_blank" className="control-nav-btn" style={{ color: 'var(--accent-cyan)' }}>
              👑 Stage Arena ↗
            </Link>
          </div>
        </header>

        {/* Feedback Banner */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`feedback-banner ${feedbackMsg.isError ? 'is-error' : 'is-success'}`}
            >
              {feedbackMsg.isError ? '⚠️' : '✅'} {feedbackMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Status & Ticker Display Card */}
        <div className="current-state-card">
          <div className="state-card-header">
            <span className="state-label">LIVE STAGE COUNTDOWN PREVIEW</span>
            <span className={`state-badge ${timerState.status}`}>
              <span className="status-pulse-dot" />
              STATUS: {timerState.status.toUpperCase()}
            </span>
          </div>

          {/* Public Stage Visibility Gate Row */}
          <div style={{ margin: '16px 0', padding: '12px 18px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#b0bec5' }}>
              🌐 Public Stage Visibility: <strong style={{ color: timerState.is_public ? '#00ff80' : '#ffcc00' }}>{timerState.is_public ? 'PUBLIC (Broadcasting Live)' : 'PRIVATE (Locked Standby Screen)'}</strong>
            </span>
            <button 
              onClick={() => handleTogglePublicVisibility(!timerState.is_public)}
              disabled={isLoading}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid ' + (timerState.is_public ? 'rgba(255, 204, 0, 0.4)' : 'rgba(0, 255, 128, 0.4)'), background: timerState.is_public ? 'rgba(255, 204, 0, 0.12)' : 'rgba(0, 255, 128, 0.15)', color: timerState.is_public ? '#ffcc00' : '#00ff80', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
            >
              {timerState.is_public ? '🔒 Make Stage Private' : '🚀 Publish Stage to Public'}
            </button>
          </div>

          <div className="preview-digits-row">
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

          <div className="preview-actions-bar">
            {timerState.status === 'running' ? (
              <button onClick={handlePauseTimer} disabled={isLoading} className="btn-ctrl btn-pause">
                ⏸️ Pause Stage Clock
              </button>
            ) : (
              <button onClick={handleResumeTimer} disabled={isLoading} className="btn-ctrl btn-resume">
                ▶️ Resume Stage Clock
              </button>
            )}

            <button onClick={() => setShowResetModal(true)} disabled={isLoading} className="btn-ctrl btn-reset">
              🔄 Reset to Idle (Pre-Launch)
            </button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="presets-section">
          <h2 className="section-title">⏱️ Quick Duration Presets (Instant Stage Broadcast)</h2>
          <div className="presets-grid">
            <button
              onClick={() => handleStartTimerWithDuration(600)}
              disabled={isLoading}
              className={`preset-card ${timerState.durationSeconds === 600 && timerState.status === 'running' ? 'active-preset' : ''}`}
            >
              <span className="preset-time">10</span>
              <span className="preset-unit">MINUTES</span>
              <span className="preset-tag">Testing / Sprint</span>
            </button>

            <button
              onClick={() => handleStartTimerWithDuration(900)}
              disabled={isLoading}
              className={`preset-card ${timerState.durationSeconds === 900 && timerState.status === 'running' ? 'active-preset' : ''}`}
            >
              <span className="preset-time">15</span>
              <span className="preset-unit">MINUTES</span>
              <span className="preset-tag">Pitch / Checkpoint</span>
            </button>

            <button
              onClick={() => handleStartTimerWithDuration(1200)}
              disabled={isLoading}
              className={`preset-card ${timerState.durationSeconds === 1200 && timerState.status === 'running' ? 'active-preset' : ''}`}
            >
              <span className="preset-time">20</span>
              <span className="preset-unit">MINUTES</span>
              <span className="preset-tag">Sprint Block</span>
            </button>

            <button
              onClick={() => handleStartTimerWithDuration(3600)}
              disabled={isLoading}
              className={`preset-card ${timerState.durationSeconds === 3600 && timerState.status === 'running' ? 'active-preset' : ''}`}
            >
              <span className="preset-time">1</span>
              <span className="preset-unit">HOUR</span>
              <span className="preset-tag">Phase Sprint</span>
            </button>

            <button
              onClick={() => handleStartTimerWithDuration(86400)}
              disabled={isLoading}
              className={`preset-card gold-preset ${timerState.durationSeconds === 86400 && timerState.status === 'running' ? 'active-preset' : ''}`}
            >
              <span className="preset-time">24</span>
              <span className="preset-unit">HOURS</span>
              <span className="preset-tag">Official Hackathon</span>
            </button>
          </div>

          {/* Custom Duration Input */}
          <form onSubmit={handleCustomSubmit} className="custom-duration-form">
            <label htmlFor="custom-input">Custom Duration (Minutes):</label>
            <div className="custom-input-group">
              <input
                id="custom-input"
                type="number"
                min="1"
                max="2880"
                placeholder="e.g. 45"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="custom-input"
              />
              <button type="submit" disabled={isLoading || !customMinutes} className="btn-apply-custom">
                Set & Start ⚡
              </button>
            </div>
          </form>
        </div>

        {/* Live Overtime / Adjustment Controls */}
        <div className="adjust-time-section">
          <h2 className="section-title">⚙️ On-The-Fly Clock Adjustments</h2>
          <p className="section-subtitle">
            Add or subtract minutes from the active timer without stopping the live clock.
          </p>

          <div className="adjust-buttons-row">
            <button onClick={() => handleAdjustTimer(-900)} disabled={isLoading} className="btn-adjust btn-neg">
              -15m
            </button>
            <button onClick={() => handleAdjustTimer(-300)} disabled={isLoading} className="btn-adjust btn-neg">
              -5m
            </button>
            <button onClick={() => handleAdjustTimer(-60)} disabled={isLoading} className="btn-adjust btn-neg">
              -1m
            </button>
            <button onClick={() => handleAdjustTimer(60)} disabled={isLoading} className="btn-adjust btn-pos">
              +1m
            </button>
            <button onClick={() => handleAdjustTimer(300)} disabled={isLoading} className="btn-adjust btn-pos">
              +5m
            </button>
            <button onClick={() => handleAdjustTimer(900)} disabled={isLoading} className="btn-adjust btn-pos">
              +15m
            </button>
            <button onClick={() => handleAdjustTimer(3600)} disabled={isLoading} className="btn-adjust btn-pos">
              +1 Hour
            </button>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="modal-backdrop" onClick={() => setShowResetModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>⚠️ Confirm Timer Reset</h3>
              <p>
                Are you sure you want to reset the Stage Timer to <strong>Pre-Launch (IDLE)</strong>?
                This will restore the <strong>Touch to Launch button</strong> on the main stage screen.
              </p>
              <div className="modal-actions">
                <button onClick={() => setShowResetModal(false)} className="btn-modal-cancel">
                  Cancel
                </button>
                <button onClick={handleResetToIdle} className="btn-modal-confirm">
                  Yes, Reset to Pre-Launch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
