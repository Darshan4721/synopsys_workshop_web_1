'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

export default function Navbar({ onOpenRegister }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
      <nav
        className={`max-w-7xl mx-auto pointer-events-auto transition-all duration-500 rounded-full border ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl border-purple-200/90 shadow-[0_16px_36px_-10px_rgba(76,29,149,0.12)] py-3 px-6'
            : 'bg-white/70 backdrop-blur-xl border-purple-100/70 shadow-sm py-3.5 px-6 md:px-8'
        } flex items-center justify-between`}
      >
        {/* Brand & Department Monogram */}
        <a href="#" className="flex items-center gap-3 group">
          {/* Sleek Minimalist Institutional Monogram */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col items-center justify-center shadow-md shadow-purple-950/20 border border-purple-800/40 group-hover:scale-105 transition-transform duration-300">
            <span className="text-[11px] font-bold font-mono text-purple-200 tracking-tighter leading-none">
              SSIET
            </span>
            <span className="text-[8px] font-semibold text-purple-400 font-mono tracking-tight leading-none mt-0.5">
              VDT
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
                Sri Shakthi
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-mono">
                ECE (VDT)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Synopsys Front-End VLSI Workshop
            </p>
          </div>
        </a>

        {/* Navigation Links (Desktop) - 100% Attendee Focused */}
        <div className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-600">
          <a href="#curriculum" className="hover:text-purple-700 transition-colors">
            EDA Flow
          </a>
          <a href="#workstations" className="hover:text-purple-700 transition-colors">
            1:1 Workstations
          </a>
          <a href="#schedule" className="hover:text-purple-700 transition-colors">
            Day Schedule
          </a>
          <a href="#certificate" className="hover:text-purple-700 transition-colors">
            Certification
          </a>
          <a href="#venue" className="hover:text-purple-700 transition-colors">
            Venue & Lab
          </a>
          <a href="#faq" className="hover:text-purple-700 transition-colors">
            FAQ
          </a>
        </div>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRegister}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-950/20 hover:shadow-purple-950/30 active:scale-95 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>Reserve Pass (₹2,500)</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-purple-100/50 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu - 100% Attendee Focused */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto pointer-events-auto bg-white/95 backdrop-blur-2xl border border-purple-200/80 rounded-3xl p-6 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col gap-4 text-sm font-medium text-slate-800">
            <a
              href="#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-purple-100 hover:text-purple-700"
            >
              EDA Front-End Flow
            </a>
            <a
              href="#workstations"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-purple-100 hover:text-purple-700"
            >
              1:1 Dedicated CAD Workstations
            </a>
            <a
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-purple-100 hover:text-purple-700"
            >
              Full Day Schedule (8:30 AM - 4:30 PM)
            </a>
            <a
              href="#certificate"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-purple-100 hover:text-purple-700"
            >
              Official Unified Certification
            </a>
            <a
              href="#venue"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-purple-100 hover:text-purple-700"
            >
              Tech Park Venue & Contacts
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-purple-700"
            >
              Frequently Asked Questions
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="mt-2 w-full py-3.5 rounded-full bg-purple-950 text-white font-semibold text-center shadow-lg shadow-purple-950/25"
            >
              Reserve 1:1 Workstation Pass (₹2,500)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
