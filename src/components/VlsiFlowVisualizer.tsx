'use client';

import React, { useState } from 'react';
import { VLSI_FLOW_STAGES } from '@/lib/data';
import { Terminal, CheckCircle2, ChevronRight, Code2, Sparkles, Layers, Activity, FileCheck, ArrowRight } from 'lucide-react';

export default function VlsiFlowVisualizer() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = VLSI_FLOW_STAGES[activeStageIndex];

  return (
    <section id="curriculum" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full apple-glass-card text-purple-900 border border-purple-200 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-purple-700" />
            <span>Interactive Industrial EDA Toolchain</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-slate-950 font-normal tracking-tight">
            Front-End{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              VLSI Design Flow
            </span>{' '}
            Visualizer
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Step through the exact 5-stage front-end ASIC/FPGA digital design methodology practiced in top semiconductor firms and taught hands-on in the workshop.
          </p>
        </div>

        {/* Step Navigation Bar (Apple Glass Bento Tabs) */}
        <div className="mb-8 reveal-on-scroll delay-150">
          <div className="p-2 rounded-3xl apple-glass-card border border-purple-200/80">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {VLSI_FLOW_STAGES.map((stage, idx) => {
                const isActive = idx === activeStageIndex;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-300 relative ${
                      isActive
                        ? 'bg-purple-950 text-white shadow-xl shadow-purple-950/20 scale-[1.02]'
                        : 'bg-white/70 hover:bg-white text-slate-700 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          isActive ? 'text-purple-300' : 'text-purple-700'
                        }`}
                      >
                        STAGE {stage.stepNumber}
                      </span>
                      {isActive && <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />}
                    </div>
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {stage.tool}
                    </p>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-purple-200' : 'text-slate-500'
                      }`}
                    >
                      {stage.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Stage Interactive Deep Dive */}
        <div className="rounded-[2.5rem] apple-glass-card border border-purple-200/80 p-6 sm:p-8 lg:p-10 reveal-on-scroll delay-225">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Conceptual Overview & Learning Outcomes */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold font-mono">
                  STAGE {activeStage.stepNumber} OF 05 • {activeStage.tool}
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl text-slate-950 font-normal">
                  {activeStage.name}
                </h3>
                <p className="text-sm font-medium text-purple-800">
                  {activeStage.tagline}
                </p>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {activeStage.description}
              </p>

              {/* Key Concepts Taught */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700" />
                  <span>Core Engineering Concepts Covered:</span>
                </h4>
                <ul className="space-y-2">
                  {activeStage.keyConcepts.map((concept, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0" />
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Stage Navigation Pill */}
              <div className="pt-4 flex items-center gap-3">
                {activeStageIndex < VLSI_FLOW_STAGES.length - 1 ? (
                  <button
                    onClick={() => setActiveStageIndex((prev) => prev + 1)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-purple-900 hover:text-purple-700 transition-colors"
                  >
                    <span>Next: Stage {VLSI_FLOW_STAGES[activeStageIndex + 1].stepNumber} ({VLSI_FLOW_STAGES[activeStageIndex + 1].tool})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Front-End Sign-off Complete</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Code & Output Console */}
            <div className="lg:col-span-7 space-y-4">
              {/* Code Window */}
              <div className="rounded-2xl bg-slate-950 border border-purple-900/40 overflow-hidden shadow-2xl">
                {/* Window Bar */}
                <div className="px-4 py-3 bg-slate-900/90 border-b border-purple-900/30 flex items-center justify-between text-xs font-mono text-purple-300">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-slate-400 font-semibold">{activeStage.sampleCodeOrCommand.filename}</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40">
                    {activeStage.sampleCodeOrCommand.language}
                  </span>
                </div>

                {/* Code Editor Body */}
                <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-purple-100 overflow-x-auto leading-relaxed">
                  <code>{activeStage.sampleCodeOrCommand.code}</code>
                </pre>
              </div>

              {/* Terminal Execution Output Banner */}
              <div className="rounded-2xl bg-purple-950/10 border border-purple-200 p-3.5 sm:p-4 flex items-start gap-3">
                <Terminal className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wider font-mono font-bold text-purple-900">
                    Synopsys EDA Terminal Log Output
                  </p>
                  <p className="text-xs font-mono text-slate-700 leading-snug">
                    {activeStage.outputSnippet}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
