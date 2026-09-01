'use client';

import React, { useState } from 'react';
import { RegistrationFormData, GeneratedPass } from '@/lib/types';
import { WORKSHOP_DETAILS } from '@/lib/data';
import {
  X,
  Sparkles,
  ShieldCheck,
  Monitor,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  QrCode,
  CreditCard,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  User,
  Hash,
  MapPin,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import DigitalPassPreview from './DigitalPassPreview';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'pass'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    category: 'student',
    institution: '',
    department: 'ECE (VLSI Design and Technology)',
    academicYear: '3rd Year B.E. / B.Tech',
    rollNumber: '',
    cityState: 'Coimbatore, Tamil Nadu',
    experienceLevel: 'intermediate',
    paymentUtr: '',
    paymentMode: 'UPI'
  });

  const [generatedPass, setGeneratedPass] = useState<GeneratedPass | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyUpiToClipboard = () => {
    navigator.clipboard.writeText('srishakthi.vlsi@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.institution) {
      alert('Please fill in all mandatory fields.');
      return;
    }
    setStep('payment');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentUtr || formData.paymentUtr.trim().length < 6) {
      alert('Please enter a valid 12-digit Bank / UPI Transaction Reference (UTR) Number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Get next available workstation number
      let existing: GeneratedPass[] = [];
      try {
        const stored = localStorage.getItem('vlsi_registrations');
        if (stored) existing = JSON.parse(stored);
      } catch (err) {}

      const stationIndex = (existing.length % 50) + 1;
      const stationStr = `CAD-STATION #${stationIndex < 10 ? '0' + stationIndex : stationIndex} (1:1)`;
      const passId = `SSIET-VLSI-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const nowIso = new Date().toISOString();
      const pass: GeneratedPass = {
        passId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        institution: formData.institution,
        college: formData.institution,
        department: formData.department,
        academicYear: formData.academicYear,
        rollNumber: formData.rollNumber,
        cityState: formData.cityState,
        workstationNumber: stationStr,
        seatStatus: 'CONFIRMED',
        paymentUtr: formData.paymentUtr,
        paymentStatus: 'VERIFIED',
        paymentAmount: 2500,
        paymentTimestamp: nowIso,
        qrData: `PASS:${passId}|WORKSTATION:${stationIndex}|UTR:${formData.paymentUtr}`,
        issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        checkedIn: false
      };

      // Save to localStorage
      const updated = [pass, ...existing];
      try {
        localStorage.setItem('vlsi_registrations', JSON.stringify(updated));
      } catch (err) {}

      setGeneratedPass(pass);
      setIsSubmitting(false);
      setStep('pass');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-purple-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-800/80 border border-purple-400/30 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                  Sri Shakthi • ECE (VDT)
                </span>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
                  1:1 Allocation
                </span>
              </div>
              <h3 className="font-editorial text-lg sm:text-2xl text-white font-normal">
                {step === 'pass' ? 'Workstation Pass Confirmed' : 'Workshop Registration'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (for Steps 1 and 2) */}
        {step !== 'pass' && (
          <div className="px-5 sm:px-6 py-2.5 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between text-xs font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 'details' ? 'bg-purple-950 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                1
              </span>
              <span className={step === 'details' ? 'font-bold text-purple-950' : 'text-slate-500'}>
                Candidate Details
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-purple-300" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 'payment' ? 'bg-purple-950 text-white' : 'bg-purple-200 text-purple-800'
                }`}
              >
                2
              </span>
              <span className={step === 'payment' ? 'font-bold text-purple-950' : 'text-slate-400'}>
                Payment & CAD Workstation
              </span>
            </div>
          </div>
        )}

        {/* Modal Body Content (Scrollable for Android/Windows) */}
        <div className="p-5 sm:p-8 overflow-y-auto">
          {/* -------------------------------------------------------------
              STEP 1: CANDIDATE ACADEMIC & CONTACT DETAILS
              ------------------------------------------------------------- */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-700" />
                    <span>Full Name (for Certificate) *</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Aravind Swaminathan"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 min-h-[44px]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-700" />
                    <span>Email Address (for Pass) *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@college.ac.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 min-h-[44px]"
                  />
                </div>

                {/* Phone (Android Numeric Keypad) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-700" />
                    <span>WhatsApp / Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    name="phone"
                    required
                    placeholder="+91 98401 23456"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 font-mono min-h-[44px]"
                  />
                </div>

                {/* Institution Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-700" />
                    <span>College / University / Company Name *</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    required
                    placeholder="e.g. Sri Shakthi Institute of Engineering and Technology"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 min-h-[44px]"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Department / Branch</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. ECE, EEE, VLSI, CSE"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 min-h-[44px]"
                  />
                </div>

                {/* Academic Year / Designation */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Academic Year / Role</label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 min-h-[44px]"
                  >
                    <option value="1st Year B.E. / B.Tech">1st Year B.E. / B.Tech</option>
                    <option value="2nd Year B.E. / B.Tech">2nd Year B.E. / B.Tech</option>
                    <option value="3rd Year B.E. / B.Tech">3rd Year B.E. / B.Tech</option>
                    <option value="Final Year B.E. / B.Tech">Final Year B.E. / B.Tech</option>
                    <option value="PG / M.Tech / M.E. Student">PG / M.Tech / M.E. Student</option>
                    <option value="Research Scholar / PhD">Research Scholar / PhD</option>
                    <option value="Faculty / Academician">Faculty / Academician</option>
                    <option value="Industry Professional">Industry Professional</option>
                  </select>
                </div>

                {/* Roll Number (Android Numeric Keypad) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-purple-700" />
                    <span>Roll / Register Number (Optional)</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="rollNumber"
                    placeholder="e.g. 714021106012"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 font-mono min-h-[44px]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Participation Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 min-h-[44px]"
                  >
                    <option value="student">Student (UG / PG)</option>
                    <option value="research_scholar">Research Scholar</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="industry_professional">Industry Professional</option>
                  </select>
                </div>
              </div>

              {/* Bottom Submit Action */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-purple-100">
                <span className="text-xs text-slate-500 font-mono">
                  Fee: <strong className="text-purple-950 font-bold">{WORKSHOP_DETAILS.fee}</strong>
                </span>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-950 to-indigo-900 hover:from-purple-900 hover:to-indigo-800 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-950/20 active:scale-95 transition-all min-h-[44px]"
                >
                  <span>Proceed to Workstation Allocation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* -------------------------------------------------------------
              STEP 2: PAYMENT & 1:1 WORKSTATION ALLOCATION
              ------------------------------------------------------------- */}
          {step === 'payment' && (
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              {/* Allocation Notice Banner */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-purple-700 font-bold">
                    PRE-ALLOCATED CAD WORKSTATION
                  </span>
                  <p className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-purple-800" />
                    <span>Dedicated Single-Monitor System #XX</span>
                  </p>
                </div>

                <span className="text-sm font-bold text-purple-950 font-mono bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-sm">
                  {WORKSHOP_DETAILS.fee}
                </span>
              </div>

              {/* Payment Details Box */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-slate-950 text-white border border-purple-800">
                {/* QR Code */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl text-slate-950">
                  <QrCode className="w-24 h-24 text-purple-950" />
                  <span className="text-[9px] font-mono font-bold uppercase text-purple-900 mt-1">
                    UPI SCAN & PAY
                  </span>
                </div>

                {/* Bank / UPI Details */}
                <div className="sm:col-span-8 space-y-2 text-xs font-mono text-slate-300">
                  <p className="text-purple-300 font-bold text-sm">Official Event UPI / Bank Transfer</p>
                  <p>• Account: Sri Shakthi Educational Trust</p>
                  <div className="flex items-center gap-2">
                    <p>• UPI ID: <strong className="text-amber-300 font-mono">srishakthi.vlsi@upi</strong></p>
                    <button
                      type="button"
                      onClick={copyUpiToClipboard}
                      className="px-2 py-1 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-[10px] font-mono flex items-center gap-1 border border-purple-600 transition-colors"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p>• Fixed Registration Fee: <strong className="text-emerald-400">₹2,500.00</strong></p>
                  <p className="text-[11px] text-slate-400">Includes 1:1 CAD workstation access, kit & official certificate.</p>
                </div>
              </div>

              {/* UTR Input (Android Numeric Keypad) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-purple-700" />
                  <span>12-Digit Bank / UPI Transaction Reference (UTR) Number *</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="paymentUtr"
                  required
                  placeholder="e.g. 423871982341 or UPI Ref ID"
                  value={formData.paymentUtr}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-purple-300 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 min-h-[48px]"
                />
                <p className="text-[11px] text-slate-500">
                  Enter the 12-digit transaction ID generated from Google Pay, PhonePe, Paytm, or NetBanking.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors min-h-[44px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Details</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-950/20 active:scale-95 transition-all disabled:opacity-50 min-h-[48px]"
                >
                  {isSubmitting ? (
                    <span>Allocating Workstation & Generating Pass...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Issue Workstation Pass</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* -------------------------------------------------------------
              STEP 3: VIP DIGITAL PASS DISPLAY
              ------------------------------------------------------------- */}
          {step === 'pass' && generatedPass && (
            <DigitalPassPreview pass={generatedPass} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
