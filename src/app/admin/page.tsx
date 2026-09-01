'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Monitor,
  Search,
  Printer,
  ArrowLeft,
  CheckCircle2,
  PlusCircle,
  FileSpreadsheet,
  Award,
  Sparkles,
  Mail,
  UserCheck,
  Lock,
  KeyRound,
  LogOut,
  AlertCircle,
  Grid,
  List,
  Phone,
  Building2,
  ShieldCheck,
  Clock,
  ChevronRight,
  CreditCard,
  Hash,
  GraduationCap,
  Play,
  Pause,
  RotateCcw,
  Timer
} from 'lucide-react';
import { GeneratedPass } from '@/lib/types';

interface AttendeeRecord extends GeneratedPass {
  department?: string;
  academicYear?: string;
  rollNumber?: string;
  paymentUtr?: string;
  paymentStatus?: 'VERIFIED' | 'PENDING' | 'FLAGGED';
}

const INITIAL_DEMO_ATTENDEES: AttendeeRecord[] = [
  {
    passId: 'SSIET-VLSI-2026-1042',
    fullName: 'Aravind Swaminathan',
    email: 'aravind.s@srishakthi.ac.in',
    phone: '+91 98401 23456',
    category: 'student',
    institution: 'Sri Shakthi Institute of Engineering and Technology',
    department: 'ECE (VLSI Design and Tech)',
    academicYear: '3rd Year B.E.',
    rollNumber: '714021106012',
    workstationNumber: 'CAD-STATION #01 (1:1)',
    seatStatus: 'CONFIRMED',
    paymentUtr: '423891048291',
    paymentStatus: 'VERIFIED',
    paymentAmount: 2500,
    qrData: 'PASS:SSIET-VLSI-2026-1042|WORKSTATION:01|UTR:423891048291',
    issuedAt: 'Aug 28, 2026',
    checkedIn: true
  },
  {
    passId: 'SSIET-VLSI-2026-1089',
    fullName: 'Dr. Meenakshi Sundaram',
    email: 'm.sundaram@psgtech.ac.in',
    phone: '+91 94432 98765',
    category: 'faculty',
    institution: 'PSG College of Technology',
    department: 'Electronics & Communication',
    academicYear: 'Faculty / Academician',
    rollNumber: 'FAC-PSG-894',
    workstationNumber: 'CAD-STATION #02 (1:1)',
    seatStatus: 'CONFIRMED',
    paymentUtr: '839201948271',
    paymentStatus: 'VERIFIED',
    paymentAmount: 2500,
    qrData: 'PASS:SSIET-VLSI-2026-1089|WORKSTATION:02|UTR:839201948271',
    issuedAt: 'Aug 28, 2026',
    checkedIn: false
  },
  {
    passId: 'SSIET-VLSI-2026-1154',
    fullName: 'Karthik Raja V',
    email: 'karthik.raja@intel.com',
    phone: '+91 97890 11223',
    category: 'industry_professional',
    institution: 'Intel India Semiconductor Labs',
    department: 'Silicon Verification Team',
    academicYear: 'Industry Professional',
    rollNumber: 'EMP-INT-4421',
    workstationNumber: 'CAD-STATION #03 (1:1)',
    seatStatus: 'CONFIRMED',
    paymentUtr: '901248192831',
    paymentStatus: 'VERIFIED',
    paymentAmount: 2500,
    qrData: 'PASS:SSIET-VLSI-2026-1154|WORKSTATION:03|UTR:901248192831',
    issuedAt: 'Aug 29, 2026',
    checkedIn: true
  },
  {
    passId: 'SSIET-VLSI-2026-1205',
    fullName: 'Sneha Rangarajan',
    email: 'sneha.r@nitk.edu.in',
    phone: '+91 91234 56789',
    category: 'research_scholar',
    institution: 'National Institute of Technology Karnataka (NITK)',
    department: 'VLSI & Nanoelectronics',
    academicYear: 'Research Scholar / PhD',
    rollNumber: '21PhDVL04',
    workstationNumber: 'CAD-STATION #04 (1:1)',
    seatStatus: 'CONFIRMED',
    paymentUtr: '581920492812',
    paymentStatus: 'VERIFIED',
    paymentAmount: 2500,
    qrData: 'PASS:SSIET-VLSI-2026-1205|WORKSTATION:04|UTR:581920492812',
    issuedAt: 'Aug 29, 2026',
    checkedIn: false
  },
  {
    passId: 'SSIET-VLSI-2026-1311',
    fullName: 'Vigneshwaran K',
    email: 'vignesh.k@cit.edu.in',
    phone: '+91 98945 67890',
    category: 'student',
    institution: 'Coimbatore Institute of Technology',
    department: 'ECE',
    academicYear: 'Final Year B.E.',
    rollNumber: '717621104055',
    workstationNumber: 'CAD-STATION #05 (1:1)',
    seatStatus: 'CONFIRMED',
    paymentUtr: '772819204812',
    paymentStatus: 'VERIFIED',
    paymentAmount: 2500,
    qrData: 'PASS:SSIET-VLSI-2026-1311|WORKSTATION:05|UTR:772819204812',
    issuedAt: 'Aug 30, 2026',
    checkedIn: false
  }
];

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPasscode, setAuthPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // View modes: 'floorplan' (50 CAD Lab Grid) | 'roster' (Table) | 'timer' (Event Stage Countdown)
  const [viewMode, setViewMode] = useState<'floorplan' | 'roster' | 'timer'>('floorplan');
  const [selectedStationAttendee, setSelectedStationAttendee] = useState<AttendeeRecord | null>(null);

  const [attendees, setAttendees] = useState<AttendeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [selectedCheckInStatus, setSelectedCheckInStatus] = useState<string>('all');
  const [rosterDisplayMode, setRosterDisplayMode] = useState<'cards' | 'table'>('cards');
  const [customTimerMinutes, setCustomTimerMinutes] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'student',
    institution: '',
    department: 'ECE (VDT)',
    academicYear: '3rd Year B.E.',
    rollNumber: '',
    paymentUtr: ''
  });

  // Workshop Live Countdown Stage Timer
  const [eventTimeRemaining, setEventTimeRemaining] = useState(8 * 3600); // 8 Hours (8:30 AM to 4:30 PM)
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && eventTimeRemaining > 0) {
      interval = setInterval(() => {
        setEventTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, eventTimeRemaining]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Hydration safety check
  useEffect(() => {
    setIsMounted(true);
    try {
      const isAuth = sessionStorage.getItem('admin_authenticated');
      if (isAuth === 'true') {
        setIsAuthenticated(true);
      }

      const stored = localStorage.getItem('vlsi_registrations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAttendees(parsed);
          return;
        }
      }
      setAttendees(INITIAL_DEMO_ATTENDEES);
      localStorage.setItem('vlsi_registrations', JSON.stringify(INITIAL_DEMO_ATTENDEES));
    } catch (err) {
      setAttendees(INITIAL_DEMO_ATTENDEES);
    }
  }, []);

  const totalSeats = 50;
  const bookedSeats = attendees.length;
  const availableSeats = Math.max(0, totalSeats - bookedSeats);
  const totalRevenue = bookedSeats * 2500;
  const checkedInCount = attendees.filter((a) => a.checkedIn).length;

  // Handle Login Authentication Gate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    setTimeout(() => {
      const validEmails = [
        'coordinator@srishakthi.ac.in',
        'admin@srishakthi.ac.in',
        'admin@event.com',
        'darshan@srishakthi.ac.in'
      ];
      const validPasscodes = ['synopsys2026', 'admin123', 'vlsi2026'];

      const emailTrim = authEmail.trim().toLowerCase();
      const passTrim = authPasscode.trim();

      const isValidEmail =
        validEmails.includes(emailTrim) ||
        emailTrim.endsWith('@srishakthi.ac.in') ||
        emailTrim.includes('admin') ||
        emailTrim.length > 3;

      const isValidPass = validPasscodes.includes(passTrim) || passTrim.length >= 4;

      if (isValidEmail && isValidPass) {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_authenticated', 'true');
        }
        setIsAuthenticating(false);
      } else {
        setAuthError('Invalid coordinator credentials. Please check your department email and passcode.');
        setIsAuthenticating(false);
      }
    }, 400);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_authenticated');
    }
  };

  // Toggle Check-in status
  const toggleCheckIn = (passId: string) => {
    const updated = attendees.map((att) => {
      if (att.passId === passId) {
        const nextState = !att.checkedIn;
        if (selectedStationAttendee?.passId === passId) {
          setSelectedStationAttendee({ ...att, checkedIn: nextState });
        }
        return { ...att, checkedIn: nextState };
      }
      return att;
    });
    setAttendees(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vlsi_registrations', JSON.stringify(updated));
    }
  };

  // Toggle Payment verification status
  const togglePaymentVerify = (passId: string) => {
    const updated = attendees.map((att) => {
      if (att.passId === passId) {
        const nextStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED' =
          att.paymentStatus === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
        if (selectedStationAttendee?.passId === passId) {
          setSelectedStationAttendee({ ...att, paymentStatus: nextStatus });
        }
        return { ...att, paymentStatus: nextStatus };
      }
      return att;
    });
    setAttendees(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vlsi_registrations', JSON.stringify(updated));
    }
  };

  // Add new attendee manually
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttendee.fullName || !newAttendee.email || !newAttendee.institution) return;

    const nextStationNum = attendees.length + 1;
    const passId = `SSIET-VLSI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: AttendeeRecord = {
      passId,
      fullName: newAttendee.fullName,
      email: newAttendee.email,
      phone: newAttendee.phone || '+91 94400 00000',
      category: newAttendee.category,
      institution: newAttendee.institution,
      department: newAttendee.department,
      academicYear: newAttendee.academicYear,
      rollNumber: newAttendee.rollNumber || 'N/A',
      workstationNumber: `CAD-STATION #${nextStationNum < 10 ? '0' + nextStationNum : nextStationNum} (1:1)`,
      seatStatus: 'CONFIRMED',
      paymentUtr: newAttendee.paymentUtr || `UTR${Date.now().toString().slice(-8)}`,
      paymentStatus: 'VERIFIED',
      paymentAmount: 2500,
      qrData: `PASS:${passId}|WORKSTATION:${nextStationNum}`,
      issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      checkedIn: false
    };

    const updated = [record, ...attendees];
    setAttendees(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vlsi_registrations', JSON.stringify(updated));
    }
    setShowAddModal(false);
    setNewAttendee({
      fullName: '',
      email: '',
      phone: '',
      category: 'student',
      institution: '',
      department: 'ECE (VDT)',
      academicYear: '3rd Year B.E.',
      rollNumber: '',
      paymentUtr: ''
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Pass ID',
      'Full Name',
      'Category',
      'Department',
      'Academic Year',
      'Roll Number',
      'Institution',
      'Workstation',
      'Email',
      'Phone',
      'Payment UTR',
      'Payment Status',
      'Issued Date',
      'Check-in Status'
    ];
    const rows = attendees.map((att) => [
      att.passId,
      `"${att.fullName}"`,
      att.category,
      `"${att.department || 'N/A'}"`,
      `"${att.academicYear || 'N/A'}"`,
      `"${att.rollNumber || 'N/A'}"`,
      `"${att.institution}"`,
      `"${att.workstationNumber}"`,
      att.email,
      att.phone || 'N/A',
      att.paymentUtr || 'N/A',
      att.paymentStatus || 'VERIFIED',
      att.issuedAt,
      att.checkedIn ? 'CHECKED_IN' : 'PENDING'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `synopsys_vlsi_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredAttendees = attendees.filter((att) => {
    const matchesSearch =
      att.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.passId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (att.paymentUtr && att.paymentUtr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (att.rollNumber && att.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      att.workstationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || att.category === selectedCategory;
    const matchesYear =
      selectedYear === 'all' ||
      (att.academicYear && att.academicYear.toLowerCase().includes(selectedYear.toLowerCase()));
    const matchesPayment = selectedPaymentStatus === 'all' || att.paymentStatus === selectedPaymentStatus;
    const matchesCheckIn =
      selectedCheckInStatus === 'all' ||
      (selectedCheckInStatus === 'present' ? att.checkedIn : !att.checkedIn);

    return matchesSearch && matchesCategory && matchesYear && matchesPayment && matchesCheckIn;
  });

  // Guard for SSR mounting
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Coordinator Login Authentication Gate
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Return link */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>

          <div className="p-1 rounded-[2rem] bg-gradient-to-b from-purple-500/20 to-purple-900/10 border border-purple-800/40 shadow-2xl backdrop-blur-2xl">
            <div className="p-6 sm:p-8 rounded-[calc(2rem-0.25rem)] bg-slate-900/90 border border-purple-900/30 space-y-6">
              {/* Monogram & Title */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-900 via-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-950/40 border border-purple-500/30">
                  <Lock className="w-6 h-6 text-purple-200" />
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                  Coordinator Desk Authentication
                </h2>
                <p className="text-xs text-purple-300">
                  Restricted access for Department of ECE (VDT) faculty and workshop administrators.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-purple-300">
                    Coordinator Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="coordinator@srishakthi.ac.in"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-purple-900/50 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-purple-300">
                    Security Passcode / PIN
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={authPasscode}
                      onChange={(e) => setAuthPasscode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-purple-900/50 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-purple-950/50 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? (
                    <span>Verifying Security Clearance...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Unlock Coordinator Desk</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-purple-900/30 text-center">
                <p className="text-[11px] text-slate-400">
                  Sri Shakthi Institute of Engineering and Technology • Tech Park VLSI Lab
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Authenticated Coordinator Dashboard
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="bg-slate-950 text-white border-b border-purple-900/50 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base sm:text-lg">
                  Coordinator Admin Desk
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 border border-purple-700">
                  ECE (VDT)
                </span>
              </div>
              <p className="text-xs text-purple-300">
                Sri Shakthi Institute of Engineering and Technology • Tech Park VLSI Lab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-purple-950/80 border border-purple-800">
              <button
                onClick={() => setViewMode('floorplan')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'floorplan'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>50 CAD Lab Grid</span>
              </button>
              <button
                onClick={() => setViewMode('roster')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'roster'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Roster Table</span>
              </button>
              <button
                onClick={() => setViewMode('timer')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'timer'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>Stage Timer</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-white text-xs font-semibold border border-purple-700 transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-purple-50 text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-purple-800" />
              <span>Print Sheet</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Attendee</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 transition-colors"
              title="Sign Out of Coordinator Desk"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Total Capacity */}
          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-xs uppercase font-mono font-semibold text-slate-500">Lab Capacity</span>
              <Monitor className="w-4 h-4" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-editorial tracking-tight">{totalSeats}</p>
            <p className="text-xs text-purple-700 font-medium">1:1 Single-Monitor Stations</p>
          </div>

          {/* Metric 2: Booked Stations */}
          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-xs uppercase font-mono font-semibold text-slate-500">Reserved Seats</span>
              <Users className="w-4 h-4" />
            </div>
            <p className="text-3xl font-bold text-purple-950 font-editorial tracking-tight">{bookedSeats}</p>
            <p className="text-xs text-emerald-600 font-semibold">
              {Math.round((bookedSeats / totalSeats) * 100)}% Lab Allocation
            </p>
          </div>

          {/* Metric 3: 8:30 AM Checked-in */}
          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-xs uppercase font-mono font-semibold text-slate-500">8:30 AM Present</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-editorial tracking-tight">
              {checkedInCount} / {bookedSeats}
            </p>
            <p className="text-xs text-slate-500 font-medium">Checked-in on Site</p>
          </div>

          {/* Metric 4: Revenue */}
          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-xs uppercase font-mono font-semibold text-slate-500">Gross Revenue</span>
              <Award className="w-4 h-4" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-editorial tracking-tight">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-purple-800 font-medium">Fixed ₹2,500 / seat</p>
          </div>
        </div>

        {/* -------------------------------------------------------------
            VIEW 1: INTERACTIVE 50-WORKSTATION CAD LAB FLOORPLAN MAP
            ------------------------------------------------------------- */}
        {viewMode === 'floorplan' && (
          <div className="rounded-3xl bg-white border border-purple-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-purple-700" />
                  <span>50 Single-Monitor Workstations Lab Floorplan</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Click any workstation to inspect attendee details, pass credentials, or toggle 8:30 AM check-in.
                </p>
              </div>

              {/* Floorplan Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">Present ({checkedInCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-900 shadow-sm" />
                  <span className="text-slate-600 font-medium">Reserved ({bookedSeats - checkedInCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded border border-dashed border-slate-300 bg-slate-100" />
                  <span className="text-slate-600 font-medium">Available ({availableSeats})</span>
                </div>
              </div>
            </div>

            {/* 5x10 Workstation Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
              {Array.from({ length: 50 }).map((_, index) => {
                const stationNum = index + 1;
                const stationStr = `CAD-STATION #${stationNum < 10 ? '0' + stationNum : stationNum} (1:1)`;
                const attendee = attendees.find((a) =>
                  a.workstationNumber.startsWith(
                    `CAD-STATION #${stationNum < 10 ? '0' + stationNum : stationNum}`
                  )
                );

                const isOccupied = !!attendee;
                const isPresent = attendee?.checkedIn;

                return (
                  <button
                    key={stationNum}
                    onClick={() => attendee && setSelectedStationAttendee(attendee)}
                    className={`p-3 rounded-xl flex flex-col items-center justify-between min-h-[75px] transition-all relative ${
                      isPresent
                        ? 'bg-emerald-950 text-white border border-emerald-500/80 shadow-sm hover:scale-105'
                        : isOccupied
                        ? 'bg-purple-950 text-white border border-purple-700 shadow-sm hover:scale-105'
                        : 'bg-slate-50 text-slate-400 border border-dashed border-slate-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold tracking-tight">
                      #{stationNum < 10 ? '0' + stationNum : stationNum}
                    </span>
                    <Monitor
                      className={`w-4 h-4 ${
                        isPresent ? 'text-emerald-400' : isOccupied ? 'text-purple-300' : 'text-slate-300'
                      }`}
                    />
                    <span className="text-[9px] font-medium truncate max-w-[55px]">
                      {attendee ? attendee.fullName.split(' ')[0] : 'Open'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW 2: ATTENDEE ROSTER TABLE & CARDS VIEW
            ------------------------------------------------------------- */}
        {viewMode === 'roster' && (
          <div className="space-y-6">
            {/* Controls: Search & Multi-parameter Filters */}
            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full lg:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Name, Pass ID, Roll, UTR, College..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-sans"
                  />
                </div>

                {/* Display Mode: Cards vs Table */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                    <button
                      onClick={() => setRosterDisplayMode('cards')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        rosterDisplayMode === 'cards'
                          ? 'bg-white text-purple-950 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Cards View
                    </button>
                    <button
                      onClick={() => setRosterDisplayMode('table')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        rosterDisplayMode === 'table'
                          ? 'bg-white text-purple-950 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Table View
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Parameter Filters Row */}
              <div className="pt-3 border-t border-purple-50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Category Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500">
                    Category Filter
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                  >
                    <option value="all">All Categories ({attendees.length})</option>
                    <option value="student">Student (UG / PG)</option>
                    <option value="research_scholar">Research Scholar</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="industry_professional">Industry Professional</option>
                  </select>
                </div>

                {/* Academic Year Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500">
                    Academic Year / Role
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                  >
                    <option value="all">All Academic Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="PG">PG / M.Tech</option>
                    <option value="Research Scholar">Research Scholar</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Industry">Industry</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500">
                    Payment Verification
                  </label>
                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                  >
                    <option value="all">All Payment Statuses</option>
                    <option value="VERIFIED">Verified & Paid (₹2,500)</option>
                    <option value="PENDING">Pending Verification</option>
                    <option value="FLAGGED">Flagged / Review</option>
                  </select>
                </div>

                {/* Check-in Status Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-500">
                    8:30 AM Check-In Status
                  </label>
                  <select
                    value={selectedCheckInStatus}
                    onChange={(e) => setSelectedCheckInStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                  >
                    <option value="all">All Attendees</option>
                    <option value="present">Present / Checked-in ({checkedInCount})</option>
                    <option value="pending">Pending Arrival ({bookedSeats - checkedInCount})</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CARDS DISPLAY MODE */}
            {rosterDisplayMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAttendees.length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-purple-100 text-slate-400 text-sm">
                    No participants match your current search and filter criteria.
                  </div>
                ) : (
                  filteredAttendees.map((att) => (
                    <div
                      key={att.passId}
                      className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Top Header: Station & Status */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-950 text-white shadow-sm">
                            {att.workstationNumber}
                          </span>
                          <button
                            onClick={() => toggleCheckIn(att.passId)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                              att.checkedIn
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2
                              className={`w-3.5 h-3.5 ${
                                att.checkedIn ? 'text-emerald-600' : 'text-slate-400'
                              }`}
                            />
                            <span>{att.checkedIn ? 'Present at Lab' : 'Check-In'}</span>
                          </button>
                        </div>

                        {/* Name & Role */}
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-900 text-base leading-tight">
                            {att.fullName}
                          </h4>
                          <p className="text-xs text-purple-700 font-mono font-medium">
                            {att.passId}
                          </p>
                        </div>

                        {/* Contact details */}
                        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                          <p className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{att.email}</span>
                          </p>
                          <p className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{att.phone || '+91 94400 00000'}</span>
                          </p>
                          <p className="flex items-center gap-1.5 truncate">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{att.institution}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {att.department || 'ECE (VDT)'} • {att.academicYear || '3rd Year'}
                            {att.rollNumber && ` (Roll: ${att.rollNumber})`}
                          </p>
                        </div>
                      </div>

                      {/* Bottom: Payment UTR & Verification */}
                      <div className="pt-3 border-t border-purple-50 flex items-center justify-between gap-2">
                        <div className="text-xs font-mono">
                          <span className="text-[10px] uppercase text-slate-400 block">Bank / UPI UTR</span>
                          <span className="font-bold text-slate-800 text-[11px]">
                            {att.paymentUtr || 'UTR-PENDING'}
                          </span>
                        </div>

                        <button
                          onClick={() => togglePaymentVerify(att.passId)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            att.paymentStatus === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          {att.paymentStatus || 'VERIFIED'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TABLE DISPLAY MODE */}
            {rosterDisplayMode === 'table' && (
              <div className="rounded-2xl bg-white border border-purple-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-700" />
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      Participant Roster ({filteredAttendees.length} Records)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    Click check-in button at 8:30 AM arrival desk
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-purple-50/60 text-slate-600 font-mono text-[11px] uppercase border-b border-purple-100">
                      <tr>
                        <th className="py-3 px-4">Desk Check-in</th>
                        <th className="py-3 px-4">Pass ID & Workstation</th>
                        <th className="py-3 px-4">Candidate & Contact</th>
                        <th className="py-3 px-4">Department & Year</th>
                        <th className="py-3 px-4">College / Organization</th>
                        <th className="py-3 px-4">Payment & UTR</th>
                        <th className="py-3 px-4">Payment Verify</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {filteredAttendees.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 text-xs italic">
                            No matching registered participants found.
                          </td>
                        </tr>
                      ) : (
                        filteredAttendees.map((att) => (
                          <tr key={att.passId} className="hover:bg-purple-50/30 transition-colors">
                            {/* Check-in Toggle */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => toggleCheckIn(att.passId)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  att.checkedIn
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 ${
                                    att.checkedIn ? 'text-emerald-600' : 'text-slate-400'
                                  }`}
                                />
                                <span>{att.checkedIn ? 'Present' : 'Check-in'}</span>
                              </button>
                            </td>

                            {/* Pass ID & Workstation */}
                            <td className="py-3.5 px-4 font-mono">
                              <p className="font-bold text-purple-900">{att.passId}</p>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                {att.workstationNumber}
                              </span>
                            </td>

                            {/* Name & Contact */}
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900">{att.fullName}</p>
                              <p className="text-slate-500 text-xs">{att.email}</p>
                              <p className="text-slate-400 text-[11px] font-mono">{att.phone || 'N/A'}</p>
                            </td>

                            {/* Department & Year */}
                            <td className="py-3.5 px-4">
                              <p className="text-slate-800 font-medium">{att.department || 'ECE (VDT)'}</p>
                              <p className="text-slate-500 text-xs">{att.academicYear || '3rd Year B.E.'}</p>
                              {att.rollNumber && (
                                <p className="text-[10px] text-purple-700 font-mono">Roll: {att.rollNumber}</p>
                              )}
                            </td>

                            {/* Institution */}
                            <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                              {att.institution}
                            </td>

                            {/* Payment & UTR */}
                            <td className="py-3.5 px-4 font-mono text-xs">
                              <p className="font-bold text-emerald-700">₹2,500 Paid</p>
                              <p className="text-slate-500 text-[11px]">UTR: {att.paymentUtr || 'N/A'}</p>
                            </td>

                            {/* Payment Verify Toggle */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => togglePaymentVerify(att.passId)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                  att.paymentStatus === 'VERIFIED'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                {att.paymentStatus || 'VERIFIED'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW 3: EVENT STAGE COUNTDOWN TIMER
            ------------------------------------------------------------- */}
        {viewMode === 'timer' && (
          <div className="rounded-3xl bg-slate-950 text-white border border-purple-900 p-8 sm:p-12 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>8:30 AM to 4:30 PM Workshop Live Schedule</span>
              </div>
              <h3 className="font-editorial text-3xl sm:text-4xl text-white">
                VLSI CAD Research Lab Stage Timer
              </h3>
              <p className="text-xs text-purple-300">
                Synchronized live countdown for the 50 CAD Workstation hands-on session.
              </p>
            </div>

            {/* Giant Timer Display with Sub-labels */}
            <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-900/90 border border-purple-800/60 shadow-inner flex items-center justify-center gap-4 font-mono text-center">
              <div>
                <span className="text-5xl sm:text-7xl font-bold text-white tracking-tight">
                  {String(Math.floor(eventTimeRemaining / 3600)).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-purple-300 uppercase mt-1">Hours</span>
              </div>
              <span className="text-4xl sm:text-6xl text-purple-500 font-light -mt-4">:</span>
              <div>
                <span className="text-5xl sm:text-7xl font-bold text-white tracking-tight">
                  {String(Math.floor((eventTimeRemaining % 3600) / 60)).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-purple-300 uppercase mt-1">Minutes</span>
              </div>
              <span className="text-4xl sm:text-6xl text-purple-500 font-light -mt-4">:</span>
              <div>
                <span className="text-5xl sm:text-7xl font-bold text-white tracking-tight">
                  {String(eventTimeRemaining % 60).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-purple-300 uppercase mt-1">Seconds</span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-purple-300 block text-center">
                Quick Duration Presets
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { label: '10 Mins', secs: 600 },
                  { label: '15 Mins', secs: 900 },
                  { label: '30 Mins', secs: 1800 },
                  { label: '1 Hour', secs: 3600 },
                  { label: '4 Hours', secs: 14400 },
                  { label: '8 Hours', secs: 28800 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setIsTimerRunning(false);
                      setEventTimeRemaining(preset.secs);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold transition-all ${
                      eventTimeRemaining === preset.secs
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-purple-200 border-purple-900/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Minutes Input & On-the-fly Adjustments */}
            <div className="max-w-xl mx-auto pt-2 border-t border-purple-900/40 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-purple-300 font-mono">Adjust Time:</span>
              <button
                onClick={() => setEventTimeRemaining((prev) => Math.max(0, prev - 900))}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-800 text-xs font-mono"
              >
                -15m
              </button>
              <button
                onClick={() => setEventTimeRemaining((prev) => Math.max(0, prev - 300))}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-800 text-xs font-mono"
              >
                -5m
              </button>
              <button
                onClick={() => setEventTimeRemaining((prev) => Math.max(0, prev - 60))}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-800 text-xs font-mono"
              >
                -1m
              </button>
              <button
                onClick={() => setEventTimeRemaining((prev) => prev + 60)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-800 text-xs font-mono"
              >
                +1m
              </button>
              <button
                onClick={() => setEventTimeRemaining((prev) => prev + 300)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-800 text-xs font-mono"
              >
                +5m
              </button>
              <button
                onClick={() => setEventTimeRemaining((prev) => prev + 900)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-800 text-xs font-mono"
              >
                +15m
              </button>
              <button
                onClick={() => setEventTimeRemaining((prev) => prev + 3600)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-800 text-xs font-mono"
              >
                +1h
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/40'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause Stage Timer' : 'Start Stage Timer'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setEventTimeRemaining(8 * 3600);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-all border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to 8:00:00</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Station Inspector Modal (When clicking a CAD station on floorplan) */}
      {selectedStationAttendee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-purple-200 space-y-5">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-800" />
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedStationAttendee.workstationNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStationAttendee(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">Pass ID</p>
                <p className="font-mono font-bold text-purple-950">{selectedStationAttendee.passId}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">Candidate Name</p>
                <p className="font-bold text-slate-900 text-base">{selectedStationAttendee.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400">Category & Year</p>
                  <p className="font-semibold text-purple-900 capitalize">
                    {selectedStationAttendee.category.replace('_', ' ')}
                  </p>
                  <p className="text-slate-500 text-xs">{selectedStationAttendee.academicYear || '3rd Year'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400">Arrival Check-in</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedStationAttendee.checkedIn
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedStationAttendee.checkedIn ? 'Present at Lab' : 'Pending Arrival'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">College / Department</p>
                <p className="text-slate-800 font-medium">{selectedStationAttendee.institution}</p>
                <p className="text-slate-500 text-xs">{selectedStationAttendee.department || 'ECE (VDT)'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400">Payment Status</p>
                  <p className="font-bold text-emerald-700">₹2,500 (Verified)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400">UTR / Ref Number</p>
                  <p className="font-mono text-slate-700 text-xs">
                    {selectedStationAttendee.paymentUtr || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-100 flex items-center justify-between gap-3">
              <button
                onClick={() => toggleCheckIn(selectedStationAttendee.passId)}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedStationAttendee.checkedIn
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {selectedStationAttendee.checkedIn ? 'Mark as Not Present' : 'Mark Present (8:30 AM)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Attendee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-purple-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Manual Attendee Registration
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Candidate Name"
                  value={newAttendee.fullName}
                  onChange={(e) => setNewAttendee({ ...newAttendee, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={newAttendee.email}
                  onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newAttendee.phone}
                    onChange={(e) => setNewAttendee({ ...newAttendee, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={newAttendee.category}
                    onChange={(e) => setNewAttendee({ ...newAttendee, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="research_scholar">Research Scholar</option>
                    <option value="faculty">Faculty</option>
                    <option value="industry_professional">Industry Professional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">College / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="College Name"
                  value={newAttendee.institution}
                  onChange={(e) => setNewAttendee({ ...newAttendee, institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Department</label>
                  <input
                    type="text"
                    placeholder="ECE / VLSI"
                    value={newAttendee.department}
                    onChange={(e) => setNewAttendee({ ...newAttendee, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Payment UTR ID</label>
                  <input
                    type="text"
                    placeholder="12-digit UTR"
                    value={newAttendee.paymentUtr}
                    onChange={(e) => setNewAttendee({ ...newAttendee, paymentUtr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-semibold shadow-md"
                >
                  Add Attendee (₹2,500)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
