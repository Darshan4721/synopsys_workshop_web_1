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
  Cpu,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

const NAV_LINKS = [
  { id: 'curriculum', label: 'EDA Flow', subtitle: '5 Industrial ASIC/FPGA Stages', icon: Layers },
  { id: 'workstations', label: '1:1 Lab', subtitle: '50 Dedicated CAD Workstations', icon: Monitor },
  { id: 'schedule', label: 'Schedule', subtitle: '8:30 AM – 4:30 PM Hands-on', icon: Calendar },
  { id: 'certificate', label: 'Certificate', subtitle: 'Unified Official Credential', icon: Award },
  { id: 'venue', label: 'Venue & Lab', subtitle: 'Tech Park, Sri Shakthi Campus', icon: MapPin },
  { id: 'faq', label: 'FAQ', subtitle: 'Essential Workshop Details', icon: HelpCircle },
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
      {/* Main Floating Apple Dynamic Capsule Navigation Bar */}
      <nav
        className={`max-w-7xl mx-auto pointer-events-auto transition-all duration-500 ease-out rounded-full border ${
          scrolled
            ? 'bg-white/85 backdrop-blur-2xl border-purple-200/90 shadow-[0_20px_40px_-15px_rgba(76,29,149,0.14),inset_0_1px_1px_rgba(255,255,255,0.9)] py-2 sm:py-2.5 px-3.5 sm:px-6'
            : 'bg-white/75 backdrop-blur-xl border-purple-100/70 shadow-[0_10px_30px_-10px_rgba(76,29,149,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] py-2.5 sm:py-3 px-4 sm:px-8'
        } flex items-center justify-between`}
      >
        {/* Brand & Department Monogram with Live Beacon */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            {/* Sleek SSIET / VDT Badge */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col items-center justify-center shadow-md shadow-purple-950/20 border border-purple-800/40 group-hover:scale-105 transition-transform duration-300">
              <span className="text-[9px] sm:text-[11px] font-bold font-mono text-purple-200 tracking-tighter leading-none">
                SSIET
              </span>
              <span className="text-[7px] sm:text-[8px] font-semibold text-purple-400 font-mono tracking-tight leading-none mt-0.5">
                VDT
              </span>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-xs sm:text-base">
                  Sri Shakthi
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-mono">
                  ECE (VDT)
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden md:block">
                Synopsys Front-End VLSI Masterclass
              </p>
            </div>
          </a>

          {/* Desktop Live Status Beacon */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 border border-purple-100/90 text-[11px] font-medium text-purple-950">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono font-bold">50 CAD Stations</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Tech Park Lab</span>
          </div>
        </div>

        {/* Desktop Navigation with Apple Liquid Sliding Oval Pill Indicator */}
        <div
          onMouseLeave={() => setHoveredSection(null)}
          className="hidden lg:flex items-center p-1.5 rounded-full bg-purple-50/70 border border-purple-100/80 backdrop-blur-md relative"
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
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 z-10 select-none ${
                  isSelected
                    ? 'text-purple-950 font-bold'
                    : 'text-slate-600 hover:text-purple-900'
                }`}
              >
                {/* Gliding Oval Pill Background with Apple Spring Physics */}
                {isSelected && (
                  <span className="absolute inset-0 rounded-full bg-white shadow-[0_4px_16px_rgba(76,29,149,0.1),0_1px_2px_rgba(0,0,0,0.05)] border border-purple-200/80 transition-all duration-300 -z-10 animate-in fade-in zoom-in-95 duration-200" />
                )}
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CTA Reservation Button */}
          <button
            onClick={onOpenRegister}
            className="group relative inline-flex items-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 hover:from-purple-900 hover:to-indigo-800 text-white text-[11px] sm:text-sm font-semibold shadow-lg shadow-purple-950/20 hover:shadow-purple-950/35 active:scale-95 transition-all duration-300"
          >
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-purple-300 animate-pulse" />
            <span className="hidden sm:inline">Reserve Pass (₹2,500)</span>
            <span className="sm:hidden">Reserve (₹2,500)</span>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-slate-800 hover:bg-purple-100/60 active:scale-90 transition-all"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-purple-950" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </nav>

      {/* VisionOS-Style Floating Glass Mobile Drawer (Wow Factor) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto pointer-events-auto bg-white/95 backdrop-blur-3xl border border-purple-200/90 rounded-[2rem] p-4 sm:p-5 shadow-[0_25px_60px_-15px_rgba(76,29,149,0.25)] animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Mobile Header Brand Bar */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-purple-100 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-mono font-bold text-purple-950">
                50 Dedicated 1:1 CAD Workstations
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Tech Park Lab</span>
          </div>

          {/* Navigation Cards Stack */}
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
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-100/90 text-purple-950 font-bold border border-purple-200 shadow-sm'
                      : 'bg-white/70 hover:bg-purple-50 text-slate-700 border border-purple-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-purple-950 text-white shadow-md'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-bold text-slate-950 leading-tight">
                        {link.label}
                      </p>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              );
            })}

            {/* Bottom Pass Reservation Action Box */}
            <div className="pt-3 mt-1 border-t border-purple-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 text-white font-semibold text-center text-xs sm:text-sm shadow-xl shadow-purple-950/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Claim 1:1 CAD Workstation Pass (₹2,500)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Zero laptops required • Official Unified Certificate included
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
