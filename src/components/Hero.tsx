'use client';

import React from 'react';
import Image from 'next/image';
import { WORKSHOP_DETAILS } from '@/lib/data';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Monitor,
  Award,
  Layers,
  Cpu,
  CheckCircle2
} from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
}

export default function Hero({ onOpenRegister }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 overflow-hidden bg-white">
      {/* Apple-Style Ambient Lighting & Silicon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Semiconductor Grid */}
      <div className="absolute inset-0 bg-silicon-grid opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Badge (Apple Glass Pill) */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full apple-glass-card border border-purple-200/80 shadow-sm reveal-on-scroll">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-tight text-purple-950">
                MeitY C2S Patronage • Sri Shakthi ECE (VDT)
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2 reveal-on-scroll delay-75">
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[4.2rem] text-slate-950 font-normal leading-[1.08] tracking-tight">
                Front-End{' '}
                <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-600 bg-clip-text text-transparent">
                  VLSI Design Flow
                </span>{' '}
                in Synopsys EDA
              </h1>
            </div>

            {/* Subtitle / Department Statement */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl reveal-on-scroll delay-150">
              National-Level Hands-on Masterclass organized by the{' '}
              <strong className="text-slate-900 font-semibold">
                Department of Electronics Engineering (VLSI Design and Technology) [ECE (VDT)]
              </strong>{' '}
              at Sri Shakthi Institute of Engineering and Technology, Coimbatore.
            </p>

            {/* 3 Apple-Grade Metric Pills */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl reveal-on-scroll delay-225">
              <div className="p-3.5 rounded-2xl apple-glass-card space-y-1">
                <div className="flex items-center gap-1.5 text-purple-700">
                  <Monitor className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Allocation</span>
                </div>
                <p className="text-sm font-bold text-slate-950">50 Workstations</p>
                <p className="text-[11px] text-purple-800 font-medium">1:1 Dedicated Single-Monitor</p>
              </div>

              <div className="p-3.5 rounded-2xl apple-glass-card space-y-1">
                <div className="flex items-center gap-1.5 text-purple-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Duration</span>
                </div>
                <p className="text-sm font-bold text-slate-950">8:30 AM – 4:30 PM</p>
                <p className="text-[11px] text-slate-500 font-medium">Hands-on Lab Flow</p>
              </div>

              <div className="p-3.5 rounded-2xl apple-glass-card space-y-1">
                <div className="flex items-center gap-1.5 text-purple-700">
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Official Pass</span>
                </div>
                <p className="text-sm font-bold text-slate-950">₹2,500 / Seat</p>
                <p className="text-[11px] text-emerald-600 font-semibold">Unified Certificate</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4 reveal-on-scroll delay-300">
              <button
                onClick={onOpenRegister}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 hover:from-purple-900 hover:to-indigo-800 text-white font-semibold text-sm sm:text-base shadow-xl shadow-purple-950/25 active:scale-95 transition-all duration-300"
              >
                <span>Register & Reserve CAD Workstation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#eda-simulator"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full apple-glass-card hover:bg-white text-slate-800 hover:text-purple-950 font-semibold text-sm border border-purple-200/80 transition-all active:scale-95"
              >
                <Cpu className="w-4 h-4 text-purple-700" />
                <span>Explore Verdi® Simulator</span>
              </a>
            </div>

            {/* Micro Guarantees */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500 font-medium reveal-on-scroll delay-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero personal laptops required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Synopsys VCS & Design Compiler licensed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Apple-Grade Silicon Die Visual with Floating Badges */}
          <div className="lg:col-span-5 relative reveal-on-scroll delay-150">
            {/* Outer Specular Glow Frame */}
            <div className="relative rounded-[2.5rem] p-2 bg-gradient-to-b from-purple-300/40 via-purple-100/20 to-purple-400/30 border border-purple-200/80 shadow-2xl shadow-purple-950/10">
              <div className="relative rounded-[2.25rem] overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-square flex items-center justify-center group">
                <Image
                  src="/images/synopsys_silicon_chip.jpg"
                  alt="Synopsys Front-End Semiconductor Silicon Die"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-95"
                  priority
                />

                {/* Subdued Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-purple-950/20 pointer-events-none" />

                {/* Inset Label on Silicon Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl apple-dark-card border border-white/10 flex items-center justify-between z-10">
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-widest text-purple-300 font-bold">
                      SILICON ARCHITECTURE
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      RTL to Gate-Level Netlist Synthesis
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-purple-900/80 text-purple-200 border border-purple-600">
                    200 MHz
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Floating Badge 1 (Top-Right: 1:1 Lab) */}
            <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl apple-glass-card shadow-2xl border border-white/80 animate-float-slow z-20">
              <div className="w-9 h-9 rounded-xl bg-purple-950 text-white flex items-center justify-center">
                <Monitor className="w-5 h-5 text-purple-300" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-mono uppercase text-slate-400 font-bold">WORKSTATION GUARANTEE</p>
                <p className="text-xs font-bold text-slate-900">50 Single-Monitor Stations</p>
              </div>
            </div>

            {/* Floating Floating Badge 2 (Bottom-Left: Synopsys Suite) */}
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl apple-glass-card shadow-2xl border border-white/80 animate-float-reverse z-20">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-800 to-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-200" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-mono uppercase text-slate-400 font-bold">OFFICIAL CERTIFICATION</p>
                <p className="text-xs font-bold text-slate-900">Department of ECE (VDT)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
