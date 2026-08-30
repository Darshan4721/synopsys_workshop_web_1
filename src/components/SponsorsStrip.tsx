'use client';

import React from 'react';
import { Award, Landmark, Sparkles, Building2, Cpu } from 'lucide-react';

export default function SponsorsStrip() {
  return (
    <section className="py-12 bg-white border-y border-purple-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-purple-900">
            National Patronage, Governance & Academic Alliances
          </p>
          <h2 className="font-editorial text-2xl sm:text-3xl text-slate-900 font-normal">
            Supported Under National Semiconductor Initiatives
          </h2>
        </div>

        {/* Sponsor Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* MeitY */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex flex-col items-center text-center justify-center space-y-2 hover:bg-purple-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-purple-800 border border-purple-100">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">MeitY</p>
              <p className="text-[11px] text-slate-500 leading-tight">Ministry of Electronics & IT, Govt. of India</p>
            </div>
          </div>

          {/* Chip to Startup */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex flex-col items-center text-center justify-center space-y-2 hover:bg-purple-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-purple-800 border border-purple-100">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-purple-950 text-sm">C2S Programme</p>
              <p className="text-[11px] text-slate-500 leading-tight">Chip to Startup Initiative</p>
            </div>
          </div>

          {/* IIC */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex flex-col items-center text-center justify-center space-y-2 hover:bg-purple-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-purple-800 border border-purple-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">IIC</p>
              <p className="text-[11px] text-slate-500 leading-tight">Institution's Innovation Council</p>
            </div>
          </div>

          {/* Synopsys Tools */}
          <div className="p-4 rounded-2xl bg-purple-950 text-white border border-purple-900 flex flex-col items-center text-center justify-center space-y-2 shadow-md shadow-purple-950/10">
            <div className="w-10 h-10 rounded-full bg-purple-800/80 flex items-center justify-center shadow-sm text-purple-200 border border-purple-600/50">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Synopsys EDA</p>
              <p className="text-[11px] text-purple-200 leading-tight">Front-End Design Toolchain</p>
            </div>
          </div>

          {/* Sri Shakthi ECE (VDT) */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex flex-col items-center text-center justify-center space-y-2 hover:bg-purple-50 transition-colors col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-purple-800 border border-purple-100">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Sri Shakthi</p>
              <p className="text-[11px] text-slate-500 leading-tight">Department of ECE (VDT)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
