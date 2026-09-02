'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Menu, X, ArrowRight, Layers, Monitor, Calendar, Award, MapPin, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

const NAV_LINKS = [
  { id: 'curriculum', label: 'EDA Flow', icon: Layers },
  { id: 'workstations', label: '1:1 Lab', icon: Monitor },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'certificate', label: 'Certificate', icon: Award },
  { id: 'venue', label: 'Venue', icon: MapPin },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
];

export default function Navbar({ onOpenRegister }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('curriculum');

  // Scroll detection & active section tracking (Scroll-Spy)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ['curriculum', 'workstations', 'schedule', 'certificate', 'venue', 'faq'];
      const scrollPosition = window.scrollY + 200;

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
      <nav
        className={`max-w-7xl mx-auto pointer-events-auto transition-all duration-300 rounded-full border ${
          scrolled
            ? 'bg-white/85 backdrop-blur-2xl border-purple-200/90 shadow-[0_16px_36px_-10px_rgba(76,29,149,0.12)] py-2 sm:py-2.5 px-4 sm:px-6'
            : 'bg-white/75 backdrop-blur-xl border-purple-100/70 shadow-sm py-2.5 sm:py-3 px-4 sm:px-8'
        } flex items-center justify-between`}
      >
        {/* Brand & Department Monogram */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col items-center justify-center shadow-md shadow-purple-950/20 border border-purple-800/40 group-hover:scale-105 transition-transform duration-300">
            <span className="text-[9px] sm:text-[11px] font-bold font-mono text-purple-200 tracking-tighter leading-none">
              SSIET
            </span>
            <span className="text-[7px] sm:text-[8px] font-semibold text-purple-400 font-mono tracking-tight leading-none mt-0.5">
              VDT
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-xs sm:text-base">
                Sri Shakthi
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-mono">
                ECE (VDT)
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden md:block">
              Synopsys Front-End VLSI Workshop
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links with Apple Gliding Oval Highlight */}
        <div className="hidden lg:flex items-center p-1 rounded-full bg-purple-50/60 border border-purple-100/80 backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActiveSection(link.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-purple-950 font-bold'
                    : 'text-slate-600 hover:text-purple-900'
                }`}
              >
                {/* Apple Gliding Oval Indicator */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-white shadow-sm border border-purple-200/80 transition-all duration-300 -z-10" />
                )}
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenRegister}
            className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 text-white text-[11px] sm:text-sm font-semibold shadow-md shadow-purple-950/20 hover:shadow-purple-950/35 active:scale-95 transition-all duration-300"
          >
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-purple-300 animate-pulse" />
            <span className="hidden sm:inline">Reserve Pass (₹2,500)</span>
            <span className="sm:hidden">Reserve (₹2,500)</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-purple-100/60 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-purple-950" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </nav>

      {/* Redesigned Mobile Drawer Menu (Un-cramped, High-End Apple Design) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto pointer-events-auto bg-white/95 backdrop-blur-2xl border border-purple-200/80 rounded-3xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col gap-1 text-sm font-medium text-slate-800">
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
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-purple-100/80 text-purple-950 font-bold border border-purple-200/60'
                      : 'hover:bg-purple-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              );
            })}

            <div className="pt-3 mt-1 border-t border-purple-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 text-white font-semibold text-center text-sm shadow-xl shadow-purple-950/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Reserve 1:1 CAD Workstation (₹2,500)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
