'use client';

import React, { useState } from 'react';
import { FAQS } from '@/lib/data';
import { ChevronDown, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FaqAccordion() {
  // Support active open index (defaults to first question open)
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 bg-purple-mesh relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
            <span>Essential Answers</span>
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
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 reveal-on-scroll border ${
                  isOpen
                    ? 'bg-white border-purple-300 shadow-[0_8px_24px_-8px_rgba(126,34,206,0.18)] ring-1 ring-purple-400/25'
                    : 'bg-white/85 hover:bg-white border-purple-100 shadow-sm'
                }`}
              >
                {/* Accordion Trigger Button */}
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
                    <span>{faq.question}</span>
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

                {/* Accordion Answer Content - Always 100% visible when isOpen */}
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-purple-100 bg-purple-50/20 rounded-b-2xl animate-in fade-in duration-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
                      <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
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
