'use client';

import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenRegister: () => void;
}

export default function Footer({ onOpenRegister }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-white border-t border-purple-900/40 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Institution & Department Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900 flex items-center justify-center text-purple-200">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Sri Shakthi</h3>
                <p className="text-xs text-purple-300">Institute of Engineering and Technology</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Department of Electronics Engineering (VLSI Design and Technology) [ECE (VDT)]. Dedicated to cultivating world-class semiconductor EDA engineering talent under national C2S and MeitY initiatives.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NAAC 'A' Grade • Autonomous Institution</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              Workshop Highlights
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#curriculum" className="hover:text-purple-300 transition-colors">
                  Front-End EDA Flow
                </a>
              </li>
              <li>
                <a href="#workstations" className="hover:text-purple-300 transition-colors">
                  50 Dedicated Workstations (1:1)
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-purple-300 transition-colors">
                  Day Schedule (8:30 AM - 4:30 PM)
                </a>
              </li>
              <li>
                <a href="#certificate" className="hover:text-purple-300 transition-colors">
                  Official Unified Certificate
                </a>
              </li>
              <li>
                <a href="#venue" className="hover:text-purple-300 transition-colors">
                  VLSI Lab & Tech Park Venue
                </a>
              </li>
            </ul>
          </div>

          {/* National Patronage & Registration Box */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              Reserve Your CAD System
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Registrations are strictly capped at 50 participants to preserve 1:1 dedicated single-monitor workstation access.
            </p>

            <button
              onClick={onOpenRegister}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-950 active:scale-95 transition-all"
            >
              Reserve Workstation (₹2,500)
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Sri Shakthi Institute of Engineering and Technology. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Supported by MeitY C2S & IIC</span>
            <span>•</span>
            <span>Synopsys EDA Educational Program</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
