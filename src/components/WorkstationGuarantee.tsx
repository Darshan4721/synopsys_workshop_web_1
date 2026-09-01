'use client';

import React from 'react';
import Image from 'next/image';
import { Monitor, Cpu, CheckCircle2, Server, Users, ArrowRight } from 'lucide-react';

interface WorkstationGuaranteeProps {
  onOpenRegister: () => void;
}

export default function WorkstationGuarantee({ onOpenRegister }: WorkstationGuaranteeProps) {
  return (
    <section id="workstations" className="py-24 bg-purple-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full apple-glass-card text-purple-900 border border-purple-200 text-xs font-semibold uppercase tracking-wider">
            <Monitor className="w-3.5 h-3.5 text-purple-700" />
            <span>Infrastructure & Laboratory Guarantee</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-slate-950 font-normal tracking-tight">
            50 Dedicated Workstations •{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              1:1 Individual Access
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            No video playbacks, no shared screens, and zero laptops required. Every participant gets an individual enterprise single-monitor Linux CAD workstation connected directly to the Synopsys EDA license servers.
          </p>
        </div>

        {/* Feature Bento Grid (Apple Glass Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Real Lab Photo in Apple Pro Frame */}
          <div className="lg:col-span-7 reveal-on-scroll delay-150">
            <div className="rounded-[2.5rem] p-2 bg-gradient-to-b from-purple-300/40 via-purple-100/20 to-purple-400/30 border border-purple-200/80 shadow-2xl shadow-purple-950/10">
              <div className="relative aspect-[16/10] w-full rounded-[2.25rem] overflow-hidden group bg-slate-950">
                <Image
                  src="/images/vlsi_cad_lab.jpg"
                  alt="VLSI Research Lab at Sri Shakthi Tech Park with 50 Dedicated Single-Monitor Workstations"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Micro-badge overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex items-center justify-between">
                  <div className="px-4 py-2 rounded-2xl apple-dark-card border border-white/15 text-white">
                    <p className="text-[10px] text-purple-300 uppercase tracking-widest font-mono font-bold">Location</p>
                    <p className="text-xs sm:text-sm font-semibold">VLSI Research Lab • Tech Park</p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl apple-dark-card border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>50 Single-Monitor Stations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Infrastructure Pillars */}
          <div className="lg:col-span-5 space-y-4 reveal-on-scroll delay-225">
            {/* Pillar 1 */}
            <div className="p-5 rounded-3xl apple-glass-card border border-purple-200/80 hover:border-purple-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-950 text-white flex items-center justify-center shrink-0 font-bold shadow-md">
                  <Monitor className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">1:1 Dedicated Single-Monitor Stations</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    You sit in front of your own high-performance single-monitor workstation for the entire 8-hour workshop. No rotating seats, no shared keyboards.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-3xl apple-glass-card border border-purple-200/80 hover:border-purple-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-950 text-white flex items-center justify-center shrink-0 font-bold shadow-md">
                  <Server className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Pre-Configured Linux EDA Environment</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Zero installation headaches. Tools (VCS, Verdi, SpyGlass, Design Compiler) are licensed and ready the moment you log in.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-3xl apple-glass-card border border-purple-200/80 hover:border-purple-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-950 text-white flex items-center justify-center shrink-0 font-bold shadow-md">
                  <Users className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Direct Instructor-Led Interaction</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Faculty coordinators and industry specialists guide you live in the lab, debugging code on your screen in real time.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="pt-2">
              <button
                onClick={onOpenRegister}
                className="w-full py-4 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 hover:from-purple-900 hover:to-indigo-800 text-white text-sm font-semibold shadow-xl shadow-purple-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Claim 1 of 50 Workstations (₹2,500)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
