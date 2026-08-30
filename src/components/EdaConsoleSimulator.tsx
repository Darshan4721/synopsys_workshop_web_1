'use client';

import React, { useState } from 'react';
import { Terminal, Play, CheckCircle, RefreshCw, Cpu, FileCode2, Sliders, ShieldCheck } from 'lucide-react';

const EDA_FILES = [
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

  const handleRun = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 900);
  };

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Circuit Traces */}
      <div className="absolute inset-0 bg-silicon-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-40 right-10 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Lab EDA Code Studio</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
            Preview the Real EDA Scripts You Will Execute
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal">
            Every attendee receives real synthesizable Verilog modules, SDC constraint scripts, and Synopsys Tool Command Language (TCL) synthesis pipelines.
          </p>
        </div>

        {/* Studio Window Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-purple-800/40 p-2 sm:p-4 shadow-2xl backdrop-blur-xl">
          {/* Top Bar with File Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950 rounded-2xl border border-purple-900/30 mb-4">
            <div className="flex flex-wrap items-center gap-2">
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
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-purple-900 text-white font-semibold shadow-md shadow-purple-950 border border-purple-500/40'
                        : 'bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-300" />
                    <span>{file.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-950 disabled:opacity-50 active:scale-95 transition-all"
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
          </div>

          {/* Editor & Output Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Code Pane */}
            <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-purple-950/60 p-4 font-mono text-xs sm:text-sm text-purple-100 overflow-x-auto min-h-[320px] max-h-[420px] leading-relaxed">
              <pre>
                <code>{selectedFile.code}</code>
              </pre>
            </div>

            {/* Terminal Output Pane */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-black/80 border border-purple-900/50 p-4 font-mono text-xs text-slate-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-purple-900/40 pb-2 text-[11px] text-purple-400">
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
                      <p className="whitespace-pre-wrap">{selectedFile.output}</p>
                      <p className="text-slate-500 text-[11px] pt-2">
                        [PROCESS COMPLETE] Return Code: 0 (Execution Success)
                      </p>
                    </div>
                  ) : !isRunning ? (
                    <p className="text-slate-500 text-xs italic pt-4">
                      Click "Execute on CAD Workstation" above to simulate running this module through the Synopsys toolchain.
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-4 border-t border-purple-950 flex items-center justify-between text-[11px] text-slate-500">
                <span>Target: 50 Workstations</span>
                <span className="text-purple-400 font-semibold">{selectedFile.badge}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
