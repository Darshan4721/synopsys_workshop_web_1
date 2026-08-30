'use client';

import React, { useState } from 'react';
import { FAQS } from '@/lib/data';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-purple-mesh relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Accordion Stack with Spring Physics (Emil Design Polish) */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 reveal-on-scroll delay-${(idx % 4) * 75 + 75} ${
                  isOpen
                    ? 'bg-white border border-purple-300 shadow-[0_10px_30px_-10px_rgba(126,34,206,0.15)] ring-1 ring-purple-400/20'
                    : 'bg-white/80 hover:bg-white border border-purple-100/80 shadow-sm'
                } overflow-hidden`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors active:scale-[0.99]"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2.5">
                    {isOpen && <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />}
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-purple-950 text-white rotate-180 scale-105'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </button>

                {/* Animated Dropdown Body with CSS Spring Easing */}
                <div
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-purple-50 pt-4">
                      <p>{faq.answer}</p>
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
