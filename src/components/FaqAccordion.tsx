'use client';

import React, { useState } from 'react';
import { FAQS } from '@/lib/data';
import { ChevronDown, HelpCircle, CheckCircle2, ChevronUp, Layers } from 'lucide-react';

export default function FaqAccordion() {
  // Support multiple open FAQs simultaneously so clicking one never hides others!
  // Pre-seed with all key FAQs open by default for immediate readability
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));

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
    <section id="faq" className="py-24 bg-purple-mesh relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
            <span>Essential Workshop Information</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-slate-950 font-normal tracking-tight">
            Frequently Asked{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Everything you need to know about workstation allocations, single-monitor setups, certifications, and fees.
          </p>

          {/* Quick Expand / Collapse Controls */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold text-purple-800 hover:text-purple-950 px-3 py-1 rounded-full bg-purple-100/70 hover:bg-purple-200/80 border border-purple-200 transition-all"
            >
              Expand All Answers
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openSet.has(idx);

            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 reveal-on-scroll border ${
                  isOpen
                    ? 'bg-white border-purple-300 shadow-[0_8px_24px_-8px_rgba(126,34,206,0.15)] ring-1 ring-purple-400/25'
                    : 'bg-white/85 hover:bg-white border-purple-100 shadow-sm'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-purple-950 text-white'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-slate-950">{faq.question}</span>
                  </span>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-purple-950 text-white rotate-180'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Permanent High-Contrast Answer Content */}
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-3 border-t border-purple-100 bg-purple-50/25 rounded-b-2xl animate-in fade-in duration-150">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
