'use client';

import React from 'react';
import { SCHEDULE_DATA } from '@/lib/data';
import { Clock, CheckCircle2, Coffee, Utensils, Award, Cpu, ChevronRight } from 'lucide-react';

export default function ScheduleTimeline() {
  return (
    <section id="schedule" className="py-24 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Full-Day Hands-on Schedule</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-slate-950 font-normal tracking-tight">
            Full-Day Masterclass{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Timeline
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto">
            From 8:30 AM workstation setup to 4:30 PM valedictory, every hour is dedicated to hands-on front-end chip design engineering.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:bg-purple-200/80 before:hidden md:before:block">
          {SCHEDULE_DATA.map((item, idx) => {
            const isBreak = item.type === 'break';
            const isKeynote = item.type === 'keynote';

            return (
              <div
                key={idx}
                className={`relative flex flex-col md:flex-row items-stretch gap-6 p-5 sm:p-6 rounded-2xl transition-all reveal-on-scroll delay-${(idx % 4) * 75 + 75} ${
                  isBreak
                    ? 'bg-amber-50/60 border border-amber-200/70'
                    : isKeynote
                    ? 'bg-purple-950 text-white shadow-xl shadow-purple-950/15 border border-purple-900'
                    : 'bg-white border border-purple-100 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Time Column */}
                <div className="md:w-1/3 flex flex-col justify-between shrink-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                        isKeynote
                          ? 'bg-purple-800/80 text-purple-200'
                          : isBreak
                          ? 'bg-amber-200/70 text-amber-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      {item.time}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isKeynote ? 'text-purple-300' : 'text-slate-400'
                      }`}
                    >
                      ({item.duration})
                    </span>
                  </div>

                  {item.toolBadge && (
                    <div className="pt-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          isKeynote
                            ? 'bg-purple-900 text-purple-200 border-purple-700'
                            : 'bg-purple-50 text-purple-800 border-purple-200'
                        }`}
                      >
                        <Cpu className="w-3 h-3" />
                        <span>{item.toolBadge}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Column */}
                <div className="md:w-2/3 space-y-2">
                  <h3
                    className={`font-editorial text-xl font-normal ${
                      isKeynote ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isKeynote ? 'text-purple-200' : 'text-slate-600'
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Highlights Bullet List */}
                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="pt-2 space-y-1.5">
                      {item.highlights.map((h, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-2 text-xs font-medium ${
                            isKeynote ? 'text-purple-300' : 'text-slate-700'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isKeynote ? 'text-purple-400' : 'text-purple-600'
                            }`}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
