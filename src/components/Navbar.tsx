'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Monitor,
  Cpu,
  Layers,
  Award,
  Calendar,
  MapPin,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

export default function Navbar({ onOpenRegister }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('curriculum');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      // Simple active section spy
      const sections = ['curriculum', 'workstations', 'schedule', 'certificate', 'venue', 'faq'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'curriculum', label: 'EDA Flow' },
    { id: 'workstations', label: '1:1 Workstations' },
    { id: 'schedule', label: 'Day Schedule' },
    { id: 'certificate', label: 'Certification' },
    { id: 'venue', label: 'Tech Park Venue' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none transition-all duration-500">
      <nav
        className={`max-w-7xl mx-auto pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full border ${
          scrolled
            ? 'bg-white/85 backdrop-blur-2xl border-purple-300/90 shadow-[0_20px_40px_-15px_rgba(76,29,149,0.14),inset_0_1px_1px_rgba(255,255,255,0.95)] py-2.5 px-4 sm:px-6 max-w-5xl'
            : 'bg-white/75 backdrop-blur-xl border-purple-200/80 shadow-[0_12px_32px_-10px_rgba(76,29,149,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] py-3 sm:py-3.5 px-4 sm:px-8'
        } flex items-center justify-between gap-4`}
      >
        {/* -------------------------------------------------------------
            1. SWISS EDITORIAL MONOGRAM & PATRONAGE BADGE (OPTION 3 & 1)
            ------------------------------------------------------------- */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          {/* Dual Monogram Badge */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col items-center justify-center shadow-md shadow-purple-950/20 border border-purple-800/50 group-hover:scale-105 transition-transform duration-300">
            <span className="text-[11px] font-bold font-mono text-purple-200 tracking-tighter leading-none">
              SSIET
            </span>
            <span className="text-[7.5px] font-bold text-purple-400 font-mono tracking-tight leading-none mt-0.5">
              VDT
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-950 tracking-tight text-sm sm:text-base font-display">
                Sri Shakthi
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200/80">
                ECE (VDT)
              </span>
            </div>
            {/* Expanded Top Subtitle with live MeitY C2S pulse */}
            <div className={`flex items-center gap-1.5 text-[11px] text-slate-500 font-medium transition-all duration-300 ${scrolled ? 'hidden md:flex' : 'flex'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Synopsys Masterclass • MeitY C2S</span>
            </div>
          </div>
        </a>

        {/* -------------------------------------------------------------
            2. SILICON STUDIO SEGMENTED SLIDING CONTROLS (OPTION 2)
            ------------------------------------------------------------- */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-purple-50/60 border border-purple-100/80">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 relative ${
                  isActive
                    ? 'bg-purple-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-purple-950 hover:bg-white/80'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-300" />
                )}
              </a>
            );
          })}
        </div>

        {/* -------------------------------------------------------------
            3. DYNAMIC ISLAND CTA & HARDWARE BADGE (OPTION 1 & 2)
            ------------------------------------------------------------- */}
        <div className="flex items-center gap-2.5">
          {/* Workstation Badge (Hidden on mobile or compact state) */}
          <div className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-[11px] font-mono font-semibold text-purple-950 transition-all ${scrolled ? 'hidden' : 'flex'}`}>
            <Monitor className="w-3.5 h-3.5 text-purple-700" />
            <span>50 Stations (1:1)</span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenRegister}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 hover:from-purple-900 hover:to-indigo-800 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-950/20 hover:shadow-purple-950/35 active:scale-95 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span className="hidden sm:inline">Reserve 1:1 Pass</span>
            <span className="sm:hidden">Register</span>
            <span className="font-mono text-purple-200 font-bold bg-white/15 px-2 py-0.5 rounded-full text-[11px]">
              ₹2,500
            </span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-purple-100/50 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* -------------------------------------------------------------
          4. iOS 26 CONTROL-CENTER STYLE MOBILE DRAWER (OPTION 1)
          ------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto pointer-events-auto bg-white/95 backdrop-blur-2xl border border-purple-200/90 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-purple-950 uppercase">
                Sri Shakthi • ECE (VDT)
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">50 CAD Workstations</span>
          </div>

          <div className="flex flex-col gap-2.5 text-sm font-semibold text-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-purple-50 flex items-center justify-between transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="mt-2 w-full py-3.5 rounded-full bg-gradient-to-r from-purple-950 to-indigo-900 text-white font-semibold text-center shadow-lg shadow-purple-950/25 flex items-center justify-center gap-2"
            >
              <span>Reserve 1:1 CAD Workstation Pass (₹2,500)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
