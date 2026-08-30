'use client';

import React from 'react';
import Image from 'next/image';
import { Award, CheckCircle2, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { WORKSHOP_DETAILS } from '@/lib/data';

export default function CertificateShowcase() {
  return (
    <section id="certificate" className="py-24 bg-purple-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-purple-700" />
            <span>Unified Official Credential</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-slate-950 font-normal tracking-tight">
            One Unified{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Official Certificate
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Every participant receives an official, accredited <strong>Certificate of Participation & Synopsys Front-End VLSI Design Training</strong> issued directly upon completion of the hands-on lab sessions.
          </p>
        </div>

        {/* Certificate Presentation Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Visual Certificate Mockup */}
          <div className="lg:col-span-7">
            <div className="double-bezel-card">
              <div className="double-bezel-inner p-3 bg-slate-950">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden group">
                  <Image
                    src="/images/certificate_mockup.jpg"
                    alt="Single Unified Official Certificate of Participation and Synopsys Front-End VLSI Design Training"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Stamp Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex items-center justify-between">
                    <div className="px-4 py-2 rounded-xl bg-purple-950/90 backdrop-blur-md border border-purple-400/30 text-white">
                      <p className="text-[10px] text-purple-300 uppercase tracking-widest font-mono">Issued by</p>
                      <p className="text-xs sm:text-sm font-semibold">Sri Shakthi • Dept of ECE (VDT)</p>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Official Endorsement</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Features & Inclusions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Single Unified Certificate</h3>
                  <p className="text-xs text-purple-800 font-medium">Participation & Synopsys Front-End Training</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Official Endorsement:</strong> Accredited with seals from Sri Shakthi Institute of Engineering and Technology, MeitY Chip to Startup (C2S), and Institution's Innovation Council.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Verifiable Tool Modules:</strong> Explicitly certifies hands-on mastery in Verilog RTL, Synopsys VCS, Verdi, SpyGlass CDC, and Design Compiler.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Valedictory Distribution:</strong> Issued immediately at the 4:15 PM concluding session in the Tech Park lab.
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-purple-100">
                <p className="text-[11px] text-slate-500">
                  Valuable career credential for VLSI placements, higher studies, and semiconductor research resumes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
