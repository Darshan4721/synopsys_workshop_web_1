'use client';

import React, { useState } from 'react';
import { X, Sparkles, Monitor, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { RegistrationFormData, GeneratedPass } from '@/lib/types';
import DigitalPassPreview from './DigitalPassPreview';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    category: 'student',
    institution: '',
    idNumber: '',
    experienceLevel: 'beginner',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<GeneratedPass | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.institution) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Simulate backend allocation & registration storage
    setTimeout(() => {
      const randomStation = Math.floor(Math.random() * 50) + 1;
      const passNumber = `SSIET-VLSI-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newPass: GeneratedPass = {
        passId: passNumber,
        fullName: formData.fullName,
        email: formData.email,
        category: formData.category,
        institution: formData.institution,
        workstationNumber: `CAD-STATION #${randomStation < 10 ? '0' + randomStation : randomStation} (1:1 Dedicated)`,
        seatStatus: 'CONFIRMED',
        qrData: `PASS:${passNumber}|WORKSTATION:${randomStation}|NAME:${formData.fullName}`,
        issuedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      // Save in localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('vlsi_registrations') || '[]');
        stored.push(newPass);
        localStorage.setItem('vlsi_registrations', JSON.stringify(stored));
      } catch (err) {
        console.error('Storage error', err);
      }

      setGeneratedPass(newPass);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-purple-200/80 z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-purple-50 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {generatedPass ? (
          <DigitalPassPreview pass={generatedPass} onClose={onClose} />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold">
                <Monitor className="w-3.5 h-3.5" />
                <span>1:1 Workstation Allocation Desk</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-slate-900 font-normal">
                Reserve Your Synopsys CAD Workstation
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Fee: <strong>₹2,500 per head</strong> (includes dedicated 1:1 single-monitor CAD system, licenses, refreshments, lunch, and official unified certificate).
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Priya Sharma / K. Rahul"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@college.edu / name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Participant Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
                  >
                    <option value="student">Student (B.Tech / B.E. / M.Tech)</option>
                    <option value="research_scholar">PhD / Research Scholar</option>
                    <option value="faculty">Faculty / Academician</option>
                    <option value="industry_professional">Industry Professional / Engineer</option>
                  </select>
                </div>

                {/* Institution / College */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">
                    College / University / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Shakthi Institute of Engg & Tech / ABC Semi"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Roll Number / Employee ID */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Roll No / Employee ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 21EE042 / EMP-991"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Experience Level */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">EDA Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, experienceLevel: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
                  >
                    <option value="beginner">Beginner (New to Synopsys Tools)</option>
                    <option value="intermediate">Intermediate (Know Verilog / Basic EDA)</option>
                    <option value="advanced">Advanced (Familiar with Synthesis / SDC)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white font-semibold text-sm sm:text-base shadow-xl shadow-purple-900/25 hover:shadow-purple-900/40 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Allocating Workstation & Generating Pass...'
                    : 'Confirm Registration & Generate Pass (₹2,500)'}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500">
                🔒 Strictly limited to 50 dedicated workstations. Instant digital confirmation provided.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
