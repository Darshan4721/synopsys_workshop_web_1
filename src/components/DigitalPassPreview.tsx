'use client';

import React from 'react';
import { GeneratedPass } from '@/lib/types';
import { Cpu, QrCode, Sparkles, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';

interface DigitalPassPreviewProps {
  pass: GeneratedPass;
  onClose: () => void;
}

export default function DigitalPassPreview({ pass, onClose }: DigitalPassPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Workstation Confirmed & Reserved</span>
        </div>
        <h3 className="font-editorial text-2xl sm:text-3xl text-slate-900 font-normal">
          Your 1:1 CAD Workstation Pass
        </h3>
        <p className="text-xs text-slate-500">
          Present this digital pass at the Tech Park check-in desk (8:30 AM).
        </p>
      </div>

      {/* Luxury Boarding Pass Ticket */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-purple-800/50 overflow-hidden">
        {/* Decorative Circuit watermark */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-purple-800/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-900 border border-purple-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-purple-300">
                Sri Shakthi Institute of Engg & Tech
              </p>
              <p className="text-xs font-bold text-white">Dept of EE (VDT) • Synopsys Masterclass</p>
            </div>
          </div>

          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            CONFIRMED
          </span>
        </div>

        {/* Middle Body */}
        <div className="py-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-purple-800/40">
          <div>
            <p className="text-[10px] font-mono uppercase text-purple-300/80">Attendee Name</p>
            <p className="text-sm sm:text-base font-bold text-white truncate">{pass.fullName}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase text-purple-300/80">Category</p>
            <p className="text-xs sm:text-sm font-semibold text-purple-200 capitalize">
              {pass.category.replace('_', ' ')}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase text-purple-300/80">Allocated Workstation</p>
            <p className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1">
              <span>{pass.workstationNumber}</span>
            </p>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <p className="text-[10px] font-mono uppercase text-purple-300/80">Institution / Org</p>
            <p className="text-xs sm:text-sm font-medium text-slate-300 truncate">{pass.institution}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase text-purple-300/80">Registration Fee</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-400">₹2,500 (PAID)</p>
          </div>
        </div>

        {/* Bottom Footer with Pass ID and QR Simulation */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase text-purple-300/80">Pass Identifier</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-purple-200">{pass.passId}</p>
            <p className="text-[10px] text-slate-400">Venue: VLSI Research Lab • Tech Park</p>
          </div>

          {/* QR Code Graphic */}
          <div className="p-2.5 rounded-xl bg-white text-slate-950 flex items-center gap-2">
            <QrCode className="w-10 h-10" />
            <div className="text-left">
              <p className="text-[9px] font-mono uppercase font-bold leading-tight">OFFICIAL PASS</p>
              <p className="text-[8px] font-mono text-slate-500">C2S • SYN • SSIET</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-purple-950 hover:bg-purple-900 text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Pass PDF</span>
        </button>

        <button
          onClick={onClose}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-all"
        >
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
