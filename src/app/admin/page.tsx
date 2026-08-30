'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Monitor,
  Search,
  Filter,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Building2,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  Award,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { WORKSHOP_DETAILS } from '@/lib/data';
import { GeneratedPass } from '@/lib/types';

interface AttendeeRecord extends GeneratedPass {
  phone?: string;
  checkedIn?: boolean;
}

const INITIAL_DEMO_ATTENDEES: AttendeeRecord[] = [
  {
    passId: 'SSIET-VLSI-2026-1042',
    fullName: 'Aravind Swaminathan',
    email: 'aravind.s@srishakthi.ac.in',
    phone: '+91 98401 23456',
    category: 'student',
    institution: 'Sri Shakthi Institute of Engineering and Technology',
    workstationNumber: 'CAD-STATION #01 (1:1)',
    seatStatus: 'CONFIRMED',
    qrData: 'PASS:SSIET-VLSI-2026-1042|WORKSTATION:01',
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
    workstationNumber: 'CAD-STATION #02 (1:1)',
    seatStatus: 'CONFIRMED',
    qrData: 'PASS:SSIET-VLSI-2026-1089|WORKSTATION:02',
    issuedAt: 'Aug 28, 2026',
    checkedIn: false
  },
  {
    passId: 'SSIET-VLSI-2026-1154',
    fullName: 'Karthik Raja V',
    email: 'karthik.raja@intel.com',
    phone: '+91 97890 11223',
    category: 'industry_professional',
    institution: 'Intel India Semi Labs',
    workstationNumber: 'CAD-STATION #03 (1:1)',
    seatStatus: 'CONFIRMED',
    qrData: 'PASS:SSIET-VLSI-2026-1154|WORKSTATION:03',
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
    workstationNumber: 'CAD-STATION #04 (1:1)',
    seatStatus: 'CONFIRMED',
    qrData: 'PASS:SSIET-VLSI-2026-1205|WORKSTATION:04',
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
    workstationNumber: 'CAD-STATION #05 (1:1)',
    seatStatus: 'CONFIRMED',
    qrData: 'PASS:SSIET-VLSI-2026-1311|WORKSTATION:05',
    issuedAt: 'Aug 30, 2026',
    checkedIn: false
  }
];

export default function AdminPage() {
  const [attendees, setAttendees] = useState<AttendeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'student',
    institution: ''
  });

  // Load attendees from LocalStorage or seed defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vlsi_registrations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAttendees(parsed);
          return;
        }
      }
      // Set initial defaults
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

  // Toggle Check-in status
  const toggleCheckIn = (passId: string) => {
    const updated = attendees.map((att) => {
      if (att.passId === passId) {
        return { ...att, checkedIn: !att.checkedIn };
      }
      return att;
    });
    setAttendees(updated);
    localStorage.setItem('vlsi_registrations', JSON.stringify(updated));
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
      workstationNumber: `CAD-STATION #${nextStationNum < 10 ? '0' + nextStationNum : nextStationNum} (1:1)`,
      seatStatus: 'CONFIRMED',
      qrData: `PASS:${passId}|WORKSTATION:${nextStationNum}`,
      issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      checkedIn: false
    };

    const updated = [record, ...attendees];
    setAttendees(updated);
    localStorage.setItem('vlsi_registrations', JSON.stringify(updated));
    setShowAddModal(false);
    setNewAttendee({ fullName: '', email: '', phone: '', category: 'student', institution: '' });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Pass ID', 'Full Name', 'Category', 'Institution', 'Workstation', 'Email', 'Phone', 'Issued Date', 'Check-in Status'];
    const rows = attendees.map((att) => [
      att.passId,
      `"${att.fullName}"`,
      att.category,
      `"${att.institution}"`,
      `"${att.workstationNumber}"`,
      att.email,
      att.phone || 'N/A',
      att.issuedAt,
      att.checkedIn ? 'CHECKED_IN' : 'PENDING'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
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
      att.workstationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || att.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="bg-slate-950 text-white border-b border-purple-900/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
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
              <span>Print Check-in Sheet</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Attendee</span>
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
              {Math.round((bookedSeats / totalSeats) * 100)}% Lab Utilization
            </p>
          </div>

          {/* Metric 3: Seats Available */}
          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-xs uppercase font-mono font-semibold text-slate-500">Available Seats</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-editorial tracking-tight">{availableSeats}</p>
            <p className="text-xs text-slate-500 font-medium">Seats Remaining</p>
          </div>

          {/* Metric 4: Revenue */}
          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-xs uppercase font-mono font-semibold text-slate-500">Gross Revenue</span>
              <Award className="w-4 h-4" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-editorial tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-purple-800 font-medium">Fixed ₹2,500 / seat</p>
          </div>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name, Pass ID, Email, Workstation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['all', 'student', 'research_scholar', 'faculty', 'industry_professional'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                  selectedCategory === cat
                    ? 'bg-purple-950 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Attendee Roster Table */}
        <div className="rounded-2xl bg-white border border-purple-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-700" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Participant Roster ({filteredAttendees.length} Records)
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Click Check-in box at 8:30 AM arrival desk
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-purple-50/60 text-slate-600 font-mono text-[11px] uppercase border-b border-purple-100">
                <tr>
                  <th className="py-3 px-4">Desk Check-in</th>
                  <th className="py-3 px-4">Pass ID</th>
                  <th className="py-3 px-4">Attendee Name & Email</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Allocated Station</th>
                  <th className="py-3 px-4">College / Organization</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs italic">
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
                          <CheckCircle2 className={`w-3.5 h-3.5 ${att.checkedIn ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{att.checkedIn ? 'Present' : 'Check-in'}</span>
                        </button>
                      </td>

                      {/* Pass ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-900">
                        {att.passId}
                      </td>

                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{att.fullName}</p>
                        <p className="text-slate-500 text-xs">{att.email}</p>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200 capitalize">
                          {att.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Workstation */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                          {att.workstationNumber}
                        </span>
                      </td>

                      {/* Institution */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {att.institution}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 text-xs">
                        {att.phone || 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Paid ₹2,500</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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

              <div>
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newAttendee.phone}
                  onChange={(e) => setNewAttendee({ ...newAttendee, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
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
