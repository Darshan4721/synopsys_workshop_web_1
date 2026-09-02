'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Monitor, Award, ArrowRight, Layers, Zap, Cpu, Clock, CheckCircle2 } from 'lucide-react';
import { WORKSHOP_DETAILS } from '@/lib/data';

interface HeroProps {
  onOpenRegister: () => void;
}

export default function Hero({ onOpenRegister }: HeroProps) {
  return (
    <section className="relative min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden bg-white">
      {/* Apple Pro Ambient Glowing Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[800px] h-[300px] sm:h-[450px] bg-purple-500/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute top-12 left-6 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-500/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-6 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 blur-[90px] sm:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-silicon-grid opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Institutional & Patronage Eyebrow */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6 reveal-on-scroll">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full apple-glass-card border border-purple-200/80 shadow-sm backdrop-blur-md">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono font-bold text-purple-950 uppercase tracking-wider">
              MeitY C2S Patronage • Sri Shakthi ECE (VDT)
            </span>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 sm:py-1.5 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-[10px] sm:text-xs font-semibold font-mono">
            <span>Department of ECE (VDT)</span>
          </div>
        </div>

        {/* Masterclass Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-7xl font-normal text-slate-950 tracking-tight leading-[1.12] sm:leading-[1.08] reveal-on-scroll delay-75">
            Front-End{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              VLSI Design Flow
            </span>{' '}
            in Synopsys EDA Suite
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto px-2 sm:px-0 reveal-on-scroll delay-150">
            An intensive, full-day national hands-on masterclass from synthesizable Verilog RTL to Synopsys Design Compiler synthesis, VCS simulation, Verdi debug, and SpyGlass CDC analysis on <strong className="text-purple-950 font-semibold">50 dedicated 1:1 single-monitor CAD workstations</strong>.
          </p>

          {/* Quick Metrics Ribbon (Proportionally Scaled for Mobile & Desktop) */}
          <div className="pt-2 max-w-4xl mx-auto reveal-on-scroll delay-225">
            <div className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl apple-glass-card border border-purple-200/80 shadow-lg">
              <div className="py-2.5 sm:py-4 px-3 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 divide-y sm:divide-y-0 md:divide-x divide-purple-100">
                {/* Metric 1 */}
                <div className="text-center pt-1 sm:pt-0">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-purple-700 mb-0.5 sm:mb-1">
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500">
                      Workstations
                    </span>
                  </div>
                  <p className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight">50 Dedicated</p>
                  <p className="text-[10px] sm:text-[11px] text-purple-800 font-medium">1:1 Single-Monitor</p>
                </div>

                {/* Metric 2 */}
                <div className="text-center pt-1 sm:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-purple-700 mb-0.5 sm:mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500">
                      Registration Fee
                    </span>
                  </div>
                  <p className="text-base sm:text-2xl font-bold text-purple-950 tracking-tight">{WORKSHOP_DETAILS.fee}</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold">All-Inclusive Workshop</p>
                </div>

                {/* Metric 3 */}
                <div className="text-center pt-2 sm:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-purple-700 mb-0.5 sm:mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500">
                      Hours
                    </span>
                  </div>
                  <p className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight">8:30 AM – 4:30 PM</p>
                  <p className="text-[10px] sm:text-[11px] text-purple-800 font-medium">Full-Day Lab Flow</p>
                </div>

                {/* Metric 4 */}
                <div className="text-center pt-2 sm:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-purple-700 mb-0.5 sm:mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500">
                      Accreditation
                    </span>
                  </div>
                  <p className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight">One Unified</p>
                  <p className="text-[10px] sm:text-[11px] text-purple-800 font-medium">Official Certificate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTA & Interactive Triggers */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 reveal-on-scroll delay-300">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white font-semibold text-sm sm:text-base shadow-xl shadow-purple-900/25 hover:shadow-purple-900/40 active:scale-[0.98] transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
              <span>Register & Reserve Workstation (₹2,500)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <a
              href="#eda-simulator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full apple-glass-card hover:bg-white text-slate-800 hover:text-purple-950 font-semibold text-xs sm:text-sm border border-purple-200/80 transition-all active:scale-95 shadow-sm"
            >
              <Cpu className="w-4 h-4 text-purple-700" />
              <span>Explore Verdi® Simulator</span>
            </a>
          </div>

          {/* Date Notice Banner */}
          <div className="pt-1 sm:pt-2 reveal-on-scroll delay-300">
            <p className="text-[11px] sm:text-xs text-purple-900/80 font-medium inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-100/60 border border-purple-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              <span>{WORKSHOP_DETAILS.dateNotice}</span>
            </p>
          </div>
        </div>

        {/* Visual Hero Feature Showcase: Full-Width 16:9 Macro Semiconductor Wafer Die (UNBLOCKED ON MOBILE) */}
        <div className="mt-8 sm:mt-14 max-w-5xl mx-auto reveal-on-scroll delay-400">
          <div className="rounded-2xl sm:rounded-[2.5rem] p-1.5 sm:p-2 bg-gradient-to-b from-purple-300/40 via-purple-100/20 to-purple-400/30 border border-purple-200/80 shadow-2xl shadow-purple-950/10 overflow-hidden">
            <div className="p-2 sm:p-4 rounded-xl sm:rounded-[2.25rem] bg-slate-950">
              {/* Photo Frame */}
              <div className="relative aspect-[16/9] w-full rounded-lg sm:rounded-2xl overflow-hidden group">
                <Image
                  src="/images/synopsys_silicon_chip.jpg"
                  alt="Authentic Semiconductor Integrated Circuit Die with Microscopic Gold Interconnects"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-95"
                />
                {/* Desktop subtle overlay (hidden on mobile to keep image 100% visible) */}
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Desktop Floating Pill inside Image */}
                <div className="hidden sm:flex absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 items-center justify-between gap-3">
                  <div className="px-4 py-2.5 rounded-2xl apple-dark-card border border-white/15 text-white">
                    <p className="text-[10px] text-purple-300 uppercase tracking-widest font-mono font-bold">
                      SYNTHESIS ARCHITECTURE
                    </p>
                    <p className="text-xs sm:text-sm font-bold">
                      RTL to Gate-Level Netlist Mapping in Synopsys Design Compiler
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl apple-dark-card border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>50 Workstations (1:1 Dedicated)</span>
                  </div>
                </div>
              </div>

              {/* Mobile Spec Callout Placed BELOW the Photo (Keeping Image 100% Visible) */}
              <div className="sm:hidden mt-3 p-3 rounded-xl bg-slate-900 border border-purple-900/40 text-left space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase text-purple-300">
                    SYNTHESIS ARCHITECTURE
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    50 CAD Stations
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">
                  RTL to Gate-Level Netlist Mapping in Synopsys Design Compiler
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
