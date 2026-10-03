'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Layers,
  Monitor,
  Calendar,
  Award,
  MapPin,
  HelpCircle,
  Radio,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

interface NavLinkItem {
  id: string;
  label: string;
  subtitle: string;
  chip: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavLinkItem[] = [
  {
    id: 'curriculum',
    label: 'EDA Flow',
    subtitle: 'Synthesis to Signoff • Verdi Waveforms',
    chip: '5 Stages',
    icon: Layers,
  },
  {
    id: 'workstations',
    label: '1:1 Lab',
    subtitle: '50 Dedicated Intel Xeon CAD Stations',
    chip: '50 Open',
    icon: Monitor,
  },
  {
    id: 'schedule',
    label: 'Schedule',
    subtitle: '2-Day Intensive • March 15–16, 2026',
    chip: '16 Hours',
    icon: Calendar,
  },
  {
    id: 'certificate',
    label: 'Certificate',
    subtitle: 'Synopsys & SSIET Dual-Authenticated',
    chip: 'Dual Auth',
    icon: Award,
  },
  {
    id: 'venue',
    label: 'Venue',
    subtitle: 'Tech Park Seminar Hall, Coimbatore',
    chip: 'Hall C',
    icon: MapPin,
  },
  {
    id: 'faq',
    label: 'FAQ',
    subtitle: 'Prerequisites, Tools & Pass Inclusions',
    chip: 'Instant Help',
    icon: HelpCircle,
  },
];

export default function Navbar({ onOpenRegister }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('curriculum');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Scroll detection & active section tracking (Scroll-Spy)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ['curriculum', 'workstations', 'schedule', 'certificate', 'venue', 'faq'];
      const scrollPosition = window.scrollY + 220;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentDisplaySection = hoveredSection || activeSection;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
      {/* Main Floating Apple Dynamic Capsule Navigation Bar (Desktop & Mobile) */}
      <nav
        className={`max-w-7xl mx-auto pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full border ${
          scrolled
            ? 'bg-slate-950/90 backdrop-blur-2xl border-white/15 text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6),0_0_24px_rgba(147,51,234,0.2)] py-2 sm:py-2.5 px-3.5 sm:px-6'
            : 'bg-slate-950/85 backdrop-blur-2xl border-purple-500/30 text-white shadow-[0_16px_40px_-12px_rgba(15,23,42,0.45),0_0_16px_rgba(147,51,234,0.12)] py-2.5 sm:py-3 px-4 sm:px-7'
        } flex items-center justify-between gap-2 sm:gap-4`}
      >
        {/* Brand & Department Monogram with Live Lab Status Beacon */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            {/* Sleek SSIET / VDT Badge with Apple Specular Bezel */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center shadow-lg shadow-purple-950/40 border border-purple-500/40 group-hover:scale-105 group-hover:border-purple-400/70 transition-all duration-300">
              <span className="text-[9px] sm:text-[11px] font-bold font-mono text-purple-200 tracking-tighter leading-none">
                SSIET
              </span>
              <span className="text-[7px] sm:text-[8px] font-semibold text-purple-400 font-mono tracking-tight leading-none mt-0.5">
                VDT
              </span>
              <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-white tracking-tight text-xs sm:text-base group-hover:text-purple-200 transition-colors">
                  Sri Shakthi
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/40 font-mono tracking-tight shadow-inner">
                  ECE (VDT)
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden md:block">
                Synopsys Front-End VLSI Workshop
              </p>
            </div>
          </a>

          {/* Desktop Integrated Live Lab Beacon */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-200 tracking-tight">50 CAD Stations Open</span>
            <span className="text-[10px] text-emerald-400/80">• Tech Park Lab</span>
          </div>
        </div>

        {/* Desktop Navigation with Apple Gliding Liquid Oval Pill Indicator */}
        <div
          onMouseLeave={() => setHoveredSection(null)}
          className="hidden lg:flex items-center relative p-1 rounded-full bg-slate-900/80 border border-white/10 shadow-inner backdrop-blur-md"
        >
          {NAV_LINKS.map((link) => {
            const isSelected = currentDisplaySection === link.id;

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onMouseEnter={() => setHoveredSection(link.id)}
                onClick={() => {
                  setActiveSection(link.id);
                  setHoveredSection(null);
                }}
                className={`relative px-3.5 xl:px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300 z-10 select-none flex items-center gap-1.5 ${
                  isSelected ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Gliding Oval Pill Background with Apple Spring Physics */}
                {isSelected && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600 border border-purple-400/40 shadow-[0_0_16px_rgba(168,85,247,0.45)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10 animate-in fade-in zoom-in-95 duration-200" />
                )}
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Mini Live Beacon */}
          <div className="flex sm:hidden items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>50 Open</span>
          </div>

          {/* Holographic Gradient CTA Button with Iridescent Sheen */}
          <button
            onClick={onOpenRegister}
            className="group relative overflow-hidden inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white text-[11px] sm:text-xs font-bold tracking-tight shadow-[0_0_20px_rgba(147,51,234,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] active:scale-95 transition-all duration-300 border border-purple-300/30"
          >
            {/* Iridescent Specular Sheen Sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-purple-200 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Reserve Pass (₹2,500)</span>
            <span className="sm:hidden">Reserve (₹2,500)</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-200 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* Mobile Menu Toggle Button with Spring Rotation */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 active:scale-90 transition-all"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-purple-300 transition-transform rotate-90 duration-300" />
            ) : (
              <Menu className="w-5 h-5 text-slate-200" />
            )}
          </button>
        </div>
      </nav>

      {/* VisionOS-Style Floating Frosted Glass Mobile Drawer (Wow Factor) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto pointer-events-auto bg-slate-950/95 backdrop-blur-3xl border border-purple-500/30 rounded-3xl p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_30px_rgba(147,51,234,0.2)] animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Drawer Live Status Banner */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 mb-3 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300">
                50 / 50 CAD Workstations Open
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
              1:1 Guaranteed
            </span>
          </div>

          {/* 6 Interactive Section Cards with Subtitles & Chevron Highlights */}
          <div className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => {
                    setActiveSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border ${
                    isActive
                      ? 'bg-purple-950/70 border-purple-500/60 shadow-[0_0_20px_rgba(147,51,234,0.3)] text-white'
                      : 'bg-slate-900/50 border-white/5 hover:bg-slate-800/80 hover:border-purple-500/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isActive
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/40 border border-purple-400/40'
                          : 'bg-slate-800/90 text-purple-300 border border-purple-500/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white tracking-tight group-hover:text-purple-200 transition-colors">
                          {link.label}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-purple-300 border border-purple-500/20">
                          {link.chip}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 group-hover:text-slate-300 transition-colors">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                    )}
                    <ChevronRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isActive ? 'text-purple-300' : 'text-slate-500 group-hover:text-purple-300'
                      }`}
                    />
                  </div>
                </a>
              );
            })}

            {/* Bottom Full-Width Pass Reservation Trigger */}
            <div className="pt-3 mt-1 border-t border-purple-500/20">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="group relative overflow-hidden w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold text-center text-sm shadow-[0_0_24px_rgba(147,51,234,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-purple-400/30"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                <span>Reserve 1:1 CAD Workstation (₹2,500)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-2 font-mono">
                Zero laptops required • Official Unified Certificate included
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

