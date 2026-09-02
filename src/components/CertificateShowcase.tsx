'use client';

import React from 'react';
import Image from 'next/image';
import { Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function CertificateShowcase() {
  return (
    <section id="certificate" className="py-16 sm:py-24 bg-purple-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full apple-glass-card text-purple-900 border border-purple-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-purple-700" />
            <span>Unified Official Credential</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl lg:text-5xl text-slate-950 font-normal tracking-tight">
            One Unified{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Official Certificate
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal px-2 sm:px-0">
            Every participant receives an official, accredited <strong>Certificate of Participation & Synopsys Front-End VLSI Design Training</strong> issued directly upon completion of the hands-on lab sessions.
          </p>
        </div>

        {/* Certificate Presentation Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-6xl mx-auto">
          {/* Visual Certificate Mockup (UNBLOCKED ON MOBILE) */}
          <div className="lg:col-span-7 reveal-on-scroll delay-150">
            <div className="rounded-2xl sm:rounded-[2.5rem] p-1.5 sm:p-2 bg-gradient-to-b from-purple-300/40 via-purple-100/20 to-purple-400/30 border border-purple-200/80 shadow-2xl shadow-purple-950/10">
              <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-[2.25rem] overflow-hidden group bg-slate-950">
                <Image
                  src="/images/certificate_mockup.jpg"
                  alt="Unified Official Certificate of Participation and Synopsys Front-End VLSI Design Training"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-95"
                />
                {/* Desktop subtle overlay */}
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Desktop Stamp Overlay */}
                <div className="hidden sm:flex absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 items-center justify-between">
                  <div className="px-4 py-2 rounded-2xl apple-dark-card border border-white/15 text-white">
                    <p className="text-[10px] text-purple-300 uppercase tracking-widest font-mono font-bold">Issued by</p>
                    <p className="text-xs sm:text-sm font-semibold">Sri Shakthi • Department of ECE (VDT)</p>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official Endorsement</span>
                  </div>
                </div>
              </div>

              {/* Mobile Info Strip Placed BELOW Image so Certificate Mockup is 100% Readable */}
              <div className="sm:hidden mt-2.5 p-2.5 rounded-xl bg-slate-900 border border-purple-900/40 flex items-center justify-between text-xs text-white">
                <span className="text-[10px] font-mono text-purple-300">Sri Shakthi • ECE (VDT)</span>
                <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3 h-3" />
                  Official Endorsement
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Features & Inclusions */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4 reveal-on-scroll delay-225">
            <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl apple-glass-card border border-purple-200/80 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-950 text-white flex items-center justify-center font-bold shadow-md">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">Single Unified Certificate</h3>
                  <p className="text-[11px] sm:text-xs text-purple-800 font-medium">Participation + Synopsys Front-End Training</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Official Endorsement:</strong> Accredited with seals from Sri Shakthi Institute of Engineering and Technology, MeitY Chip to Startup (C2S), and Institution's Innovation Council.
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Verifiable Tool Modules:</strong> Explicitly certifies hands-on mastery in Verilog RTL, Synopsys VCS, Verdi, SpyGlass CDC, and Design Compiler.
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Physical & Digital Issuance:</strong> Issued immediately at the 4:15 PM valedictory session at the Tech Park venue.
                  </span>
                </div>
              </div>

              <div className="pt-2 sm:pt-3 border-t border-purple-100">
                <p className="text-[10px] sm:text-[11px] text-slate-500">
                  Valuable career credential for VLSI placements, core semiconductor jobs, and research resumes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
