'use client';

import React, { useState } from 'react';
import { FAQS } from '@/lib/data';
import { ChevronDown, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function FaqAccordion() {
  // Apple Style: Collapsed clean questions by default
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const toggleFaq = (idx: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenSet(new Set(FAQS.map((_, i) => i)));
  };

  const collapseAll = () => {
    setOpenSet(new Set());
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-purple-mesh relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full apple-glass-card text-purple-900 border border-purple-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
            <span>Essential Workshop Information</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl lg:text-5xl text-slate-950 font-normal tracking-tight">
            Frequently Asked{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-normal px-2 sm:px-0">
            Everything you need to know about workstation allocations, single-monitor setups, certifications, and fees.
          </p>

          {/* Quick Expand / Collapse Controls */}
          <div className="pt-1 sm:pt-2 flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] sm:text-xs font-semibold text-purple-800 hover:text-purple-950 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-purple-100/70 hover:bg-purple-200/80 border border-purple-200 transition-all active:scale-95"
            >
              Expand All Answers
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all active:scale-95"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Accordion Stack with Fluid Height Pushdown (Apple Physics) */}
        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openSet.has(idx);

            return (
              <div
                key={idx}
                className={`rounded-2xl sm:rounded-3xl transition-all duration-300 reveal-on-scroll border overflow-hidden ${
                  isOpen
                    ? 'apple-glass-card border-purple-300 shadow-lg ring-1 ring-purple-400/30'
                    : 'bg-white/80 hover:bg-white border-purple-100/80 shadow-sm'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900 text-xs sm:text-base flex items-center gap-2.5 sm:gap-3.5">
                    <span
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-purple-950 text-white shadow-sm'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-slate-950 font-semibold">{faq.question}</span>
                  </span>

                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-purple-950 text-white rotate-180'
                        : 'bg-purple-100/80 text-purple-800 hover:bg-purple-200'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>

                {/* Fluid Height Grid Animation (Apple Pushdown Physics) */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-purple-100/80 bg-purple-50/30">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
