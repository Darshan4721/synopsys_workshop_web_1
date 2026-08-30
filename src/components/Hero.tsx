'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Monitor, Award, ArrowRight, Layers, Users, Zap, Cpu, Activity, Clock, CheckCircle2 } from 'lucide-react';
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
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200/80 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
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
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-slate-950 tracking-tight leading-[1.08]">
            Front-End{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              VLSI Design Flow
            </span>{' '}
            in Synopsys EDA Suite
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            An intensive, full-day national hands-on masterclass from synthesizable Verilog RTL to Synopsys Design Compiler synthesis, VCS simulation, Verdi debug, and SpyGlass CDC analysis on <strong className="text-purple-950 font-semibold">50 dedicated single-monitor CAD workstations</strong>.
          </p>

          {/* Quick Metrics Ribbon (Double-Bezel Architecture) */}
          <div className="pt-2 max-w-4xl mx-auto">
            <div className="double-bezel-card">
              <div className="double-bezel-inner py-4 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-purple-100">
                <div className="text-center pt-2 md:pt-0">
                  <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Workstations
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">50 Systems</p>
                  <p className="text-[11px] text-purple-800 font-medium">Single-Monitor (1:1)</p>
                </div>

                <div className="text-center pt-2 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Registration Fee
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-950 tracking-tight">{WORKSHOP_DETAILS.fee}</p>
                  <p className="text-[11px] text-purple-800 font-medium">Fixed per Participant</p>
                </div>

                <div className="text-center pt-2 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-1.5 text-purple-700 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Certification
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">1 Unified</p>
                  <p className="text-[11px] text-purple-800 font-medium">Official Certificate</p>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
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
          <div className="pt-2">
            <p className="text-xs text-purple-900/80 font-medium inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/60 border border-purple-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              <span>{WORKSHOP_DETAILS.dateNotice}</span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-purple-950">Strictly 50 Participants Max</span>
            </p>
          </div>
        </div>

        {/* Bespoke Interactive Semiconductor Architecture HUD (Replacing AI-slop visual) */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="double-bezel-card overflow-hidden">
            <div className="double-bezel-inner p-6 sm:p-8 bg-slate-950 text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-900/50 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-500/40 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-xl sm:text-2xl font-normal text-white">
                      Synopsys Front-End ASIC / FPGA Pipeline Architecture
                    </h3>
                    <p className="text-xs text-purple-300 font-mono">
                      Sri Shakthi Tech Park • VLSI Research CAD Server Grid
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>50 LICENSE SLOTS ACTIVE</span>
                  </span>
                </div>
              </div>

              {/* Hardware Microarchitecture Flow Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-900/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-400">
                    <span>STAGE 01</span>
                    <span>RTL</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Synthesizable Verilog</h4>
                  <p className="text-xs text-slate-400">
                    FSM state encoding, synchronous resets & datapath structures.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-purple-300 bg-purple-950/60 p-2 rounded">
                    Tool: Verilog-2001 / SystemVerilog
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-900/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-400">
                    <span>STAGE 02</span>
                    <span>DEBUG</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">VCS® & Verdi® Debug</h4>
                  <p className="text-xs text-slate-400">
                    Native high-speed simulation & FSDB temporal waveform tracing.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-purple-300 bg-purple-950/60 p-2 rounded">
                    Tool: Synopsys VCS & Verdi GUI
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-900/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-400">
                    <span>STAGE 03</span>
                    <span>STATIC QA</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">SpyGlass® CDC & Lint</h4>
                  <p className="text-xs text-slate-400">
                    Metastability detection, 2-DFF synchronizers & linting rules.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-purple-300 bg-purple-950/60 p-2 rounded">
                    Tool: Synopsys SpyGlass
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-900/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-400">
                    <span>STAGE 04</span>
                    <span>SYNTHESIS</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Design Compiler (DC)</h4>
                  <p className="text-xs text-slate-400">
                    SDC constraints, standard cell mapping & gate-level netlists.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-purple-300 bg-purple-950/60 p-2 rounded">
                    Tool: dc_shell-t / SDC 2.1
                  </div>
                </div>
              </div>

              {/* Bottom Realtime Status Metrics */}
              <div className="mt-6 pt-4 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>Cadence Target: 200 MHz Setup/Hold Sign-off</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400">Slack: +0.42ns (MET)</span>
                  <span className="text-purple-300">1:1 Workstation Workload Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
