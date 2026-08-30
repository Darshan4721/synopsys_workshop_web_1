'use client';

import React from 'react';
import Image from 'next/image';
import { Monitor, Cpu, CheckCircle2, Server, Users } from 'lucide-react';

interface WorkstationGuaranteeProps {
  onOpenRegister: () => void;
}

export default function WorkstationGuarantee({ onOpenRegister }: WorkstationGuaranteeProps) {
  return (
    <section id="workstations" className="py-24 bg-purple-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-xs font-semibold uppercase tracking-wider">
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

        {/* Feature Bento Grid (Double-Bezel Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Real Lab Photo & Overlay */}
          <div className="lg:col-span-7 reveal-on-scroll delay-150">
            <div className="double-bezel-card overflow-hidden">
              <div className="double-bezel-inner p-3 bg-slate-950">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden group">
                  <Image
                    src="/images/vlsi_cad_lab.jpg"
                    alt="VLSI Research Lab at Sri Shakthi Tech Park with 50 Dedicated Single-Monitor Workstations"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Micro-badge overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex items-center justify-between">
                    <div className="px-4 py-2 rounded-xl bg-purple-950/90 backdrop-blur-md border border-purple-400/30 text-white">
                      <p className="text-[10px] text-purple-300 uppercase tracking-widest font-mono">Location</p>
                      <p className="text-xs sm:text-sm font-semibold">VLSI Research Lab • Tech Park</p>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>50 Single-Monitor Stations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Infrastructure Pillars */}
          <div className="lg:col-span-5 space-y-4 reveal-on-scroll delay-225">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-white/90 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-800 font-bold">
                  <Monitor className="w-5 h-5" />
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
            <div className="p-5 rounded-2xl bg-white/90 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-800 font-bold">
                  <Server className="w-5 h-5" />
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
            <div className="p-5 rounded-2xl bg-white/90 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-800 font-bold">
                  <Users className="w-5 h-5" />
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
                className="w-full py-3.5 rounded-full bg-purple-950 hover:bg-purple-900 text-white text-sm font-semibold shadow-lg shadow-purple-950/20 active:scale-[0.98] transition-all text-center"
              >
                Claim 1 of 50 Workstations (₹2,500)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
