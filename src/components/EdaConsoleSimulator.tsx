'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  CheckCircle,
  RefreshCw,
  Cpu,
  FileCode2,
  Sliders,
  ShieldCheck,
  Activity,
  Zap,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const EDA_FILES = [
  {
    id: 'waveform',
    title: 'verdi_waveform.fsdb',
    badge: 'Live Interactive Waveform',
    icon: Activity,
    code: `// Synopsys Verdi Interactive Digital Signal Trace Analyzer
// Real-time bus simulation driven by hardware state machine.
// Click buttons on the right to pulse CLK, toggle signals, and see SVG waveforms update!`,
    command: 'verdi -ssf counter_8bit.fsdb -dbdir simv.daidir &',
    output: `[VERDI FSDB] Interactive Waveform Engine active. Live hardware state synced.`
  },
  {
    id: 'verilog',
    title: 'counter_8bit.v',
    badge: 'Verilog RTL',
    icon: FileCode2,
    code: `// 8-bit Up/Down Synchronous Counter with Asynchronous Reset
\`timescale 1ns / 1ps
module counter_8bit (
    input  wire        clk,
    input  wire        rst_n,
    input  wire        up_down, // 1 = Up, 0 = Down
    input  wire        enable,
    output reg  [7:0]  count_out,
    output wire        overflow
);

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count_out <= 8'h00;
    end else if (enable) begin
      if (up_down)
        count_out <= count_out + 1'b1;
      else
        count_out <= count_out - 1'b1;
    end
  end

  assign overflow = (up_down) ? (count_out == 8'hFF) : (count_out == 8'h00);
endmodule`,
    command: 'vcs -sverilog counter_8bit.v tb_counter.v -debug_access+all',
    output: `[VCS INFO] Compiling 'counter_8bit.v' with SystemVerilog extensions...
[VCS SUCCESS] Compilation finished in 0.42s. Executable './simv' generated.
[VERDI INFO] FSDB dumping enabled for top-level module 'tb_counter'.`
  },
  {
    id: 'sdc',
    title: 'timing_constraints.sdc',
    badge: 'Synopsys SDC',
    icon: Sliders,
    code: `#############################################################
# Synopsys Design Constraints (SDC 2.1)
#############################################################
current_design counter_8bit

# Create 200 MHz System Clock (5.0ns Period)
create_clock -name "SYS_CLK" -period 5.00 -waveform {0.0 2.5} [get_ports clk]
set_clock_uncertainty -setup 0.15 [get_clocks SYS_CLK]
set_clock_uncertainty -hold  0.05 [get_clocks SYS_CLK]
set_clock_transition 0.10 [get_clocks SYS_CLK]

# Constrain Input Ports (Setup/Hold arrival times)
set_input_delay -max 1.20 -clock SYS_CLK [get_ports {up_down enable}]
set_input_delay -min 0.30 -clock SYS_CLK [get_ports {up_down enable}]

# Constrain Output Ports
set_output_delay -max 1.50 -clock SYS_CLK [get_ports {count_out overflow}]
set_load -pin_load 0.05 [get_ports {count_out overflow}]`,
    command: 'dc_shell -f apply_sdc.tcl',
    output: `[SDC CHECK] Clock 'SYS_CLK' period: 5.000ns. 100% ports constrained.
[SDC CHECK] 0 Unconstrained Endpoints. SDC sanity check passed.`
  },
  {
    id: 'dc_shell',
    title: 'synthesize.tcl',
    badge: 'Design Compiler',
    icon: Cpu,
    code: `#############################################################
# Synopsys Design Compiler (dc_shell-t) Synthesis Script
#############################################################
set target_library  "saed32rvt_tt1p05v25c.db"
set link_library    "* saed32rvt_tt1p05v25c.db"

# Analyze and Elaborate
analyze -format verilog {counter_8bit.v}
elaborate counter_8bit
link
check_design > check_design.rpt

# Read Constraints & Compile with Ultra Optimization
source timing_constraints.sdc
compile_ultra -gate_clock -scan

# Generate Sign-off Reports
report_timing -max_paths 5 > reports/timing_max.rpt
report_area -hierarchy    > reports/area.rpt
report_power              > reports/power.rpt

# Export Netlist
write -format verilog -hierarchy -output netlist/counter_8bit_gate.v`,
    command: 'dc_shell -f synthesize.tcl -output_log_file dc_compile.log',
    output: `[DC INFO] Library 'saed32rvt' loaded. Mapping to standard cells...
[DC ULTRA] Optimizing Critical Paths with Clock-Gating Insertion...
[DC SUCCESS] Timing Slack: +0.48ns (MET) | Area: 86.4 um² | Gate Count: 48`
  },
  {
    id: 'spyglass',
    title: 'spyglass_lint.tcl',
    badge: 'SpyGlass CDC',
    icon: ShieldCheck,
    code: `#############################################################
# Synopsys SpyGlass Lint & CDC Script
#############################################################
set_option top counter_8bit
set_option language_mode mixed
set_option projectwdir ./spyglass_work

# Read Design Files
read_file -type verilog counter_8bit.v

# Run Goal 1: Structural Linting
current_goal lint/lint_rtl -top counter_8bit
run_goal

# Run Goal 2: Clock Domain Crossing Verification
current_goal cdc/cdc_verify_struct -top counter_8bit
run_goal

# Export Reports
write_report spyglass_violations.rpt`,
    command: 'spyglass -batch -project spyglass.prj -goals lint/lint_rtl',
    output: `[SPYGLASS SUMMARY] Total Rules Checked: 142 | Violations: 0
[SPYGLASS-CDC] Synchronizer validation: 0 Metastability Risks Detected.`
  }
];

export default function EdaConsoleSimulator() {
  const [selectedFile, setSelectedFile] = useState(EDA_FILES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  // Live Waveform Oscilloscope State
  const [clockCycles, setClockCycles] = useState<number[]>([1, 2, 3, 4, 5]);
  const [countValue, setCountValue] = useState<number>(3);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [isEnable, setIsEnable] = useState<boolean>(true);
  const [isUp, setIsUp] = useState<boolean>(true);
  const [historyValues, setHistoryValues] = useState<number[]>([0, 1, 2, 3]);

  // Clock Pulse Simulator
  const pulseClock = () => {
    if (isReset) {
      setCountValue(0);
      setHistoryValues((prev) => [...prev.slice(-5), 0]);
    } else if (isEnable) {
      setCountValue((prev) => {
        const nextVal = isUp ? (prev + 1) % 256 : prev === 0 ? 255 : prev - 1;
        setHistoryValues((h) => [...h.slice(-5), nextVal]);
        return nextVal;
      });
    }
    setClockCycles((prev) => [...prev.slice(-5), prev[prev.length - 1] + 1]);
  };

  // Auto simulation burst
  const autoSimulate = () => {
    let count = 0;
    const interval = setInterval(() => {
      pulseClock();
      count++;
      if (count >= 6) clearInterval(interval);
    }, 250);
  };

  const handleRun = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 900);
  };

  return (
    <section id="eda-simulator" className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Apple Pro Ambient Glow */}
      <div className="absolute inset-0 bg-silicon-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-40 right-10 w-96 h-96 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-10 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-8 sm:mb-12 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full apple-dark-card border border-purple-500/30 text-purple-300 text-[10px] sm:text-xs font-mono font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Lab EDA & Waveform Studio</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
            Preview Real EDA Scripts & Waveforms
          </h2>
          <p className="text-xs sm:text-base text-slate-400 font-normal px-2 sm:px-0">
            Interact directly with synthesizable Verilog modules, live Verdi FSDB digital logic waveforms, and Synopsys synthesis constraints.
          </p>
        </div>

        {/* Studio Window Card (Apple Dark Frame) */}
        <div className="rounded-2xl sm:rounded-[2.5rem] apple-dark-card border border-purple-800/40 p-2.5 sm:p-5 shadow-2xl reveal-on-scroll delay-150">
          {/* Top Bar with File Tabs (Horizontal scroll on mobile) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 p-2 sm:p-2.5 bg-slate-900/95 rounded-xl sm:rounded-2xl border border-purple-900/40 mb-3 sm:mb-4 overflow-x-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {EDA_FILES.map((file) => {
                const Icon = file.icon;
                const isSelected = file.id === selectedFile.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => {
                      setSelectedFile(file);
                      setHasRun(false);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono transition-all duration-200 shrink-0 ${
                      isSelected
                        ? 'bg-purple-900 text-white font-semibold shadow-md shadow-purple-950 border border-purple-500/40'
                        : 'bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-300" />
                    <span>{file.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Run / Trigger Button */}
            {selectedFile.id === 'waveform' ? (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={autoSimulate}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-semibold shadow-md active:scale-95 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Auto-Simulate 6 Cycles</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-semibold shadow-md shadow-purple-950 disabled:opacity-50 active:scale-95 transition-all"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Simulating in dc_shell...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute on CAD Workstation</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Main Visualizer Area */}
          {selectedFile.id === 'waveform' ? (
            /* -------------------------------------------------------------
               LIVE INTERACTIVE VERDI WAVEFORM OSCILLOSCOPE (MOBILE-STACKED)
               ------------------------------------------------------------- */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              {/* Left Column: Interactive Digital Waveforms Canvas */}
              <div className="lg:col-span-8 rounded-xl sm:rounded-2xl bg-slate-950 border border-purple-950/60 p-3.5 sm:p-6 font-mono text-xs text-purple-100 space-y-4 sm:space-y-6">
                <div className="flex flex-wrap items-center justify-between border-b border-purple-900/40 pb-2.5 sm:pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-white text-xs sm:text-sm">
                      VERDI® TIMING TRACE SIMULATOR
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800">
                      FSDB DUMP
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                    Time: {clockCycles[clockCycles.length - 1] * 5.0}ns | 200 MHz
                  </span>
                </div>

                {/* SVG Digital Logic Waveform Display */}
                <div className="space-y-3 sm:space-y-4 pt-1">
                  {/* Signal 1: CLK */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-16 sm:w-24 text-right shrink-0">
                      <span className="text-purple-300 font-bold text-[11px] sm:text-xs">CLK</span>
                    </div>
                    <div className="flex-1 bg-black/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-purple-900/30 overflow-x-auto flex items-center gap-1.5 sm:gap-2">
                      {clockCycles.map((c) => (
                        <div key={c} className="flex items-center shrink-0">
                          <svg className="w-12 sm:w-16 h-6 sm:h-8" viewBox="0 0 60 30" fill="none">
                            <path
                              d="M0 25 L15 25 L15 5 L45 5 L45 25 L60 25"
                              stroke="#a855f7"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signal 2: RST_N */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-16 sm:w-24 text-right shrink-0">
                      <span className="text-purple-300 font-bold text-[11px] sm:text-xs">RST_N</span>
                    </div>
                    <div className="flex-1 bg-black/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-purple-900/30 overflow-x-auto flex items-center">
                      <svg className="w-full h-6 sm:h-8" viewBox="0 0 300 30" fill="none" preserveAspectRatio="none">
                        <path
                          d={isReset ? "M0 5 L50 5 L50 25 L300 25" : "M0 5 L300 5"}
                          stroke={isReset ? "#f43f5e" : "#10b981"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Signal 3: ENABLE */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-16 sm:w-24 text-right shrink-0">
                      <span className="text-purple-300 font-bold text-[11px] sm:text-xs">ENABLE</span>
                    </div>
                    <div className="flex-1 bg-black/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-purple-900/30 overflow-x-auto flex items-center">
                      <svg className="w-full h-6 sm:h-8" viewBox="0 0 300 30" fill="none" preserveAspectRatio="none">
                        <path
                          d={isEnable ? "M0 5 L300 5" : "M0 25 L300 25"}
                          stroke={isEnable ? "#38bdf8" : "#64748b"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Signal 4: COUNT_OUT[7:0] Hex Bus */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-16 sm:w-24 text-right shrink-0">
                      <span className="text-amber-300 font-bold text-[10px] sm:text-xs">COUNT</span>
                    </div>
                    <div className="flex-1 bg-black/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-purple-900/30 overflow-x-auto flex items-center gap-1.5 sm:gap-2">
                      {historyValues.map((val, idx) => (
                        <div
                          key={idx}
                          className="px-2 sm:px-3 py-1 rounded-md sm:rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold text-[10px] sm:text-xs shrink-0 flex items-center gap-1 shadow-sm"
                        >
                          <span className="text-[9px] text-amber-500">HEX:</span>
                          <span>0x{val.toString(16).toUpperCase().padStart(2, '0')}</span>
                        </div>
                      ))}
                      <div className="px-2.5 sm:px-3.5 py-1 rounded-md sm:rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold text-[10px] sm:text-xs shrink-0 animate-pulse">
                        <span>NOW: 0x{countValue.toString(16).toUpperCase().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Hardware Control Deck (Touch Friendly) */}
              <div className="lg:col-span-4 rounded-xl sm:rounded-2xl bg-black/80 border border-purple-900/50 p-3.5 sm:p-5 font-mono text-xs space-y-3 sm:space-y-4 flex flex-col justify-between">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                    <span className="text-purple-400 font-bold text-[11px] sm:text-xs">LIVE STIMULUS GENERATOR</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  </div>

                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Inject test stimuli into the synthesizable Verilog model to witness state machine responses:
                  </p>

                  <div className="space-y-2 pt-1">
                    {/* Pulse Clock Button */}
                    <button
                      onClick={pulseClock}
                      className="w-full py-2.5 sm:py-3 px-3 rounded-lg sm:rounded-xl bg-purple-900/90 hover:bg-purple-800 text-white font-bold flex items-center justify-between shadow-md active:scale-95 transition-all text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-300" />
                        <span>Pulse Clock (CLK ↑)</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded">
                        +5.0ns
                      </span>
                    </button>

                    {/* Toggle Reset */}
                    <button
                      onClick={() => setIsReset(!isReset)}
                      className={`w-full py-2.5 px-3 rounded-lg sm:rounded-xl font-bold flex items-center justify-between border text-xs transition-all active:scale-95 ${
                        isReset
                          ? 'bg-rose-950 text-rose-200 border-rose-600'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span>{isReset ? '🛑 RST_N Asserted (Low)' : '🟢 RST_N Deasserted (Normal)'}</span>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Enable */}
                    <button
                      onClick={() => setIsEnable(!isEnable)}
                      className={`w-full py-2.5 px-3 rounded-lg sm:rounded-xl font-bold flex items-center justify-between border text-xs transition-all active:scale-95 ${
                        isEnable
                          ? 'bg-sky-950 text-sky-200 border-sky-600'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span>{isEnable ? '⚡ Count ENABLED' : '⏸️ Count PAUSED'}</span>
                      <span className="text-[10px]">{isEnable ? 'HIGH' : 'LOW'}</span>
                    </button>

                    {/* Toggle Direction */}
                    <button
                      onClick={() => setIsUp(!isUp)}
                      className="w-full py-2.5 px-3 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold flex items-center justify-between text-xs transition-all active:scale-95"
                    >
                      <span>Direction: {isUp ? '⬆️ Count UP (+1)' : '⬇️ Count DOWN (-1)'}</span>
                      <span className="text-[10px]">{isUp ? 'UP=1' : 'DOWN=0'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3 border-t border-purple-950 text-[10px] sm:text-[11px] text-slate-500">
                  <span>Simulated on 50 Dedicated Workstations • Tech Park VLSI Lab</span>
                </div>
              </div>
            </div>
          ) : (
            /* -------------------------------------------------------------
               STANDARD CODE & TERMINAL VIEW FOR VERILOG / SDC / TCL
               ------------------------------------------------------------- */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              {/* Code Pane */}
              <div className="lg:col-span-7 rounded-xl sm:rounded-2xl bg-slate-950 border border-purple-950/60 p-3 sm:p-4 font-mono text-xs sm:text-sm text-purple-100 overflow-x-auto min-h-[260px] sm:min-h-[320px] max-h-[420px] leading-relaxed">
                <pre>
                  <code>{selectedFile.code}</code>
                </pre>
              </div>

              {/* Terminal Output Pane */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-xl sm:rounded-2xl bg-black/80 border border-purple-900/50 p-3.5 sm:p-4 font-mono text-xs text-slate-300 space-y-3">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-900/40 pb-2 text-[10px] sm:text-[11px] text-purple-400">
                    <span>TERMINAL: CAD-SERVER-JSS01</span>
                    <span>LINUX x86_64</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-purple-400 text-xs">$ {selectedFile.command}</p>
                    {isRunning && (
                      <p className="text-amber-400 animate-pulse text-xs">
                        [RUNNING] Spawning Synopsys license worker thread...
                      </p>
                    )}
                    {hasRun ? (
                      <div className="pt-2 text-emerald-300 space-y-1">
                        <p className="whitespace-pre-wrap text-[11px] sm:text-xs">{selectedFile.output}</p>
                        <p className="text-slate-500 text-[10px] sm:text-[11px] pt-1.5">
                          [PROCESS COMPLETE] Return Code: 0 (Execution Success)
                        </p>
                      </div>
                    ) : !isRunning ? (
                      <p className="text-slate-500 text-xs italic pt-2 sm:pt-4">
                        Click "Execute on CAD Workstation" above to simulate running this module through the Synopsys toolchain.
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Status footer */}
                <div className="pt-3 border-t border-purple-950 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                  <span>Target: 50 Workstations</span>
                  <span className="text-purple-400 font-semibold">{selectedFile.badge}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
