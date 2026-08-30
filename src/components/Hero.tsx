'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Monitor, Award, ArrowRight, Layers, Zap, Cpu } from 'lucide-react';
import { WORKSHOP_DETAILS } from '@/lib/data';

interface HeroProps {
  onOpenRegister: () => void;
}

export default function Hero({ onOpenRegister }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-purple-mesh">
      {/* Background Circuit Grid Texture */}
      <div className="absolute inset-0 bg-silicon-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-400/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Institutional & Patronage Eyebrow */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200/80 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-purple-950 uppercase tracking-wider">
              {WORKSHOP_DETAILS.institution}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-xs font-semibold">
            <span>Department of ECE (VDT)</span>
          </div>
        </div>

        {/* Masterclass Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-slate-950 tracking-tight leading-[1.08] reveal-on-scroll delay-75">
            Front-End{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              VLSI Design Flow
            </span>{' '}
            in Synopsys EDA Suite
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto reveal-on-scroll delay-150">
            An intensive, full-day national hands-on masterclass from synthesizable Verilog RTL to Synopsys Design Compiler synthesis, VCS simulation, Verdi debug, and SpyGlass CDC analysis on <strong className="text-purple-950 font-semibold">50 dedicated 1:1 single-monitor CAD workstations</strong>.
          </p>

          {/* Quick Metrics Ribbon (Double-Bezel Architecture) */}
          <div className="pt-2 max-w-4xl mx-auto reveal-on-scroll delay-225">
            <div className="double-bezel-card">
              <div className="double-bezel-inner py-4 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-purple-100">
                <div className="text-center pt-2 md:pt-0">
                  <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Workstations
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">50 Dedicated</p>
                  <p className="text-[11px] text-purple-800 font-medium">1:1 Single-Monitor System</p>
                </div>

                <div className="text-center pt-2 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Fee (Fixed)
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-950 tracking-tight">{WORKSHOP_DETAILS.fee}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">All-Inclusive Lab Pass</p>
                </div>

                <div className="text-center pt-2 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Certification
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">1 Official</p>
                  <p className="text-[11px] text-purple-800 font-medium">Participation & Training</p>
                </div>

                <div className="text-center pt-2 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Setup Required
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">0 Laptops</p>
                  <p className="text-[11px] text-slate-500 font-medium">Pre-loaded Linux Lab</p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTA & Interactive Triggers */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 reveal-on-scroll delay-300">
            <button
              onClick={onOpenRegister}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white font-semibold text-base shadow-xl shadow-purple-900/25 hover:shadow-purple-900/40 active:scale-[0.98] transition-all duration-200"
            >
              <span>Reserve 1:1 Workstation Pass</span>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>

            <a
              href="#curriculum"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/90 hover:bg-white text-slate-800 font-medium text-base border border-purple-200/80 shadow-sm hover:shadow active:scale-[0.98] transition-all duration-200"
            >
              <span>Explore Synopsys Flow</span>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </a>
          </div>

          {/* Date Notice Banner */}
          <div className="pt-2 reveal-on-scroll delay-300">
            <p className="text-xs text-purple-900/80 font-medium inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/60 border border-purple-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              <span>{WORKSHOP_DETAILS.dateNotice}</span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-purple-950">Strictly 50 Participants Max</span>
            </p>
          </div>
        </div>

        {/* Visual Hero Feature Showcase: Macro Semiconductor Wafer Die */}
        <div className="mt-14 max-w-5xl mx-auto reveal-on-scroll delay-400">
          <div className="double-bezel-card overflow-hidden">
            <div className="double-bezel-inner p-3 sm:p-4 bg-slate-950">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden group">
                <Image
                  src="/images/synopsys_silicon_chip.jpg"
                  alt="Authentic Semiconductor Integrated Circuit Die with Microscopic Gold Interconnects"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Floating Micro-Highlights over Image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/80 backdrop-blur-md border border-purple-400/30 text-white text-[11px] font-semibold">
                      <Cpu className="w-3.5 h-3.5 text-purple-300" />
                      <span>Synopsys Front-End EDA CAD Pipeline</span>
                    </div>
                    <h3 className="text-white font-editorial text-xl sm:text-2xl font-normal tracking-wide">
                      Verilog RTL ➔ VCS Simulation ➔ SpyGlass CDC ➔ Design Compiler Synthesis
                    </h3>
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-right">
                      <p className="text-[10px] text-purple-300 uppercase tracking-widest font-mono">Location</p>
                      <p className="text-xs font-semibold text-white">VLSI Research Lab • Tech Park</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
