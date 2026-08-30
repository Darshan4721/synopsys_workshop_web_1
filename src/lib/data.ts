import { VlsiStage, ScheduleItem } from './types';

export const WORKSHOP_DETAILS = {
  title: "National-Level Hands-on Workshop on Front-End VLSI Design Flow in Synopsys EDA Suite",
  institution: "Sri Shakthi Institute of Engineering and Technology",
  department: "Department of ECE (VDT) [VLSI Design and Technology]",
  venue: "VLSI Research Lab, Tech Park, Sri Shakthi Campus",
  time: "8:30 AM – 4:30 PM (Full Day Intensive)",
  dateNotice: "Dates to be Announced Soon • Registrations Open",
  fee: "₹2,500",
  seatsTotal: 50,
  seatsRemaining: 14,
  mode: "1:1 Dedicated Single-Monitor CAD Workstation (Hands-on, Zero Laptop Required)",
  certificate: "Unified Official Certificate of Participation & Synopsys Front-End VLSI Design Training",
  organizingBody: "Department of ECE (VDT)",
  patrons: [
    { name: "MeitY", label: "Ministry of Electronics & IT, Govt. of India" },
    { name: "C2S", label: "Chip to Startup Programme" },
    { name: "IIC", label: "Institution's Innovation Council" },
    { name: "Synopsys", label: "Synopsys University Program & EDA Suite" }
  ]
};

export const VLSI_FLOW_STAGES: VlsiStage[] = [
  {
    id: 'stage-1',
    stepNumber: '01',
    name: 'VLSI Architecture & Verilog RTL',
    tool: 'Verilog / SystemVerilog',
    tagline: 'Synthesizable Hardware Modeling',
    description: 'Transform algorithmic specifications into clean, synthesizable register-transfer level (RTL) code using Verilog/SystemVerilog with strict hardware structuring rules.',
    keyConcepts: [
      'Hardware Description vs Software Execution',
      'Non-blocking (<=) vs Blocking (=) Assignments',
      'Synchronous & Asynchronous Reset Strategies',
      'Mealy & Moore Finite State Machine (FSM) Architectures'
    ],
    sampleCodeOrCommand: {
      language: 'verilog',
      filename: 'traffic_controller_fsm.v',
      code: `// Synthesizable FSM Module
module traffic_fsm (
    input  wire        clk,
    input  wire        rst_n,
    input  wire        car_sensor,
    output reg  [2:0]  state_lights
);
  typedef enum logic [1:0] {S_RED=2'b00, S_YELLOW=2'b01, S_GREEN=2'b10} state_t;
  state_t current_state, next_state;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) current_state <= S_RED;
    else        current_state <= next_state;
  end
  // Combinational Next State Logic...
endmodule`
    },
    outputSnippet: `[RTL LINT] Parsing 'traffic_controller_fsm.v' ... 0 Syntax Errors, Synthesizable Structure Verified.`
  },
  {
    id: 'stage-2',
    stepNumber: '02',
    name: 'Simulation & Waveform Debug',
    tool: 'Synopsys VCS® & Verdi®',
    tagline: 'Functional Verification & Interactive Debug',
    description: 'Compile high-speed native testbenches using Synopsys VCS and debug state transitions, race conditions, and signal glitches in the Verdi GUI environment.',
    keyConcepts: [
      'High-Speed VCS Simulation Compilation (`vcs -sverilog`)',
      'FSDB (Fast Signal Database) Waveform Generation',
      'Verdi Schematic & Temporal Waveform Correlation',
      'Code Coverage & Assertion-Based Verification (SVA)'
    ],
    sampleCodeOrCommand: {
      language: 'bash',
      filename: 'run_simulation.sh',
      code: `# Compile & Simulate with Synopsys VCS & Verdi FSDB dump
vcs -full64 -sverilog +v2k -debug_access+all \\
    -kdb -lca \\
    traffic_fsm.v tb_traffic_fsm.v -l vcs_compile.log

# Run simulation binary and output FSDB
./simv +fsdb+autoflush -l simulation.log

# Invoke Verdi debugger
verdi -ssf inter_dump.fsdb -dbdir simv.daidir &`
    },
    outputSnippet: `VCS Simulation Sign-off: 10,000 cycles completed. 0 Assertions Failed. FSDB generated.`
  },
  {
    id: 'stage-3',
    stepNumber: '03',
    name: 'Linting & Clock Domain Crossing (CDC)',
    tool: 'Synopsys SpyGlass®',
    tagline: 'Static Rule Checking & Synchronization',
    description: 'Catch elusive structural defects, clock domain crossing (CDC) hazards, reset domain anomalies, and synthesis pitfalls early in the design cycle.',
    keyConcepts: [
      'SpyGlass Lint Rules (Structural & Synthesizability)',
      'Clock Domain Crossing (CDC) Metastability Detection',
      '2-DFF & FIFO Synchronizer Verification',
      'Reset Domain Crossing (RDC) glitch checks'
    ],
    sampleCodeOrCommand: {
      language: 'tcl',
      filename: 'spyglass_cdc.tcl',
      code: `# SpyGlass CDC Configuration Script
set_option top traffic_fsm
set_option projectwdir ./spyglass_work

current_goal cdc/cdc_verify_struct -top traffic_fsm
run_goal

current_goal lint/lint_rtl -top traffic_fsm
run_goal

# Generate SpyGlass violation summary
write_report spyglass_summary.rpt`
    },
    outputSnippet: `[SPYGLASS-CDC] 0 Fatal Errors, 0 Metastability Violations detected in 2-DFF synchronizer.`
  },
  {
    id: 'stage-4',
    stepNumber: '04',
    name: 'Logic Synthesis & SDC Constraints',
    tool: 'Synopsys Design Compiler (DC NXT)',
    tagline: 'RTL to Technology Gate-Level Mapping',
    description: 'Map behavioral RTL logic into real standard-cell library gates in `dc_shell` using Synopsys Design Constraints (SDC) for timing, area, and power targets.',
    keyConcepts: [
      'Interactive Synthesis in `dc_shell-t`',
      'SDC Clocks, Input/Output Delays & Slew Rates',
      'High-Performance Optimization (`compile_ultra`)',
      'Design Rule Constraints (DRC: max_transition, max_capacitance)'
    ],
    sampleCodeOrCommand: {
      language: 'tcl',
      filename: 'constraints.sdc & dc_script.tcl',
      code: `# Synopsys Design Constraints (SDC)
create_clock -name "SYS_CLK" -period 5.0 [get_ports clk]
set_clock_uncertainty 0.2 [get_clocks SYS_CLK]
set_input_delay -max 1.2 -clock SYS_CLK [get_ports car_sensor]
set_output_delay -max 1.0 -clock SYS_CLK [get_ports state_lights]

# In dc_shell:
compile_ultra -gate_clock -scan
write -format verilog -hierarchy -output netlist_gate.v`
    },
    outputSnippet: `Design Compiler: Target Frequency 200 MHz Met. Critical Path Slack: +0.42ns (MET).`
  },
  {
    id: 'stage-5',
    stepNumber: '05',
    name: 'Gate-Level Netlist & Timing Sign-off',
    tool: 'Synopsys Timing Reports',
    tagline: 'Area, Power & Slack Sign-off',
    description: 'Generate production gate-level netlists and analyze comprehensive area, power, and setup/hold timing slack reports before handoff.',
    keyConcepts: [
      'Detailed Timing Reports (`report_timing -delay max`)',
      'Combinational vs Sequential Area Breakdown (`report_area`)',
      'Dynamic & Leakage Power Reports (`report_power`)',
      'Clock Gating Efficiency & Sign-off Netlist Verification'
    ],
    sampleCodeOrCommand: {
      language: 'tcl',
      filename: 'generate_reports.tcl',
      code: `# DC Shell Sign-off Verification
report_timing -delay_type max -nworst 5 > timing_setup.rpt
report_timing -delay_type min -nworst 5 > timing_hold.rpt
report_area -hierarchy > area_breakdown.rpt
report_power -analysis_effort high > power_summary.rpt
report_qor > quality_of_results.rpt`
    },
    outputSnippet: `Synthesis QOR: Total Cell Area: 142.3 um² | Dynamic Power: 312 uW | Worst Slack: +0.38ns.`
  }
];

export const SCHEDULE_DATA: ScheduleItem[] = [
  {
    time: "08:30 AM – 09:30 AM",
    duration: "60 mins",
    title: "Check-in, 1:1 CAD Workstation Allocation & Server Setup",
    type: "session",
    toolBadge: "Lab CAD Environment",
    description: "Welcome to the VLSI Research Lab at Tech Park. Registration desk check-in, allocation of individual single-monitor Linux CAD workstations, and Synopsys license server initialization.",
    highlights: [
      "Individual single-monitor workstation allocation (1:1)",
      "Linux terminal environment & shell variable configuration",
      "Synopsys licensing daemon verification"
    ]
  },
  {
    time: "09:30 AM – 11:00 AM",
    duration: "90 mins",
    title: "Session 1: VLSI Front-End Architecture & Synthesizable Verilog",
    type: "hands-on",
    toolBadge: "Verilog / SystemVerilog",
    description: "Deep dive into front-end design flow. Architectural decomposition, writing synthesizable RTL code, FSM modeling, and avoiding simulation-synthesis mismatches.",
    highlights: [
      "Specification to hardware microarchitecture",
      "Synthesizable coding standards & register inference",
      "Hands-on Verilog RTL creation on workstation"
    ]
  },
  {
    time: "11:00 AM – 11:15 AM",
    duration: "15 mins",
    title: "Morning Networking Tea & Refreshments",
    type: "break",
    description: "High-tea and peer networking break at Sri Shakthi Tech Park lounge.",
    highlights: ["Tea, coffee, and refreshments provided"]
  },
  {
    time: "11:15 AM – 01:00 PM",
    duration: "105 mins",
    title: "Session 2: Simulation with Synopsys VCS & Waveform Debug in Verdi",
    type: "hands-on",
    toolBadge: "Synopsys VCS® & Verdi®",
    description: "Compiling testbenches with VCS compiler, generating FSDB waveform databases, and utilizing Verdi's interactive debug schematic & signal tracer.",
    highlights: [
      "VCS command-line compilation & performance switches",
      "Dumping and analyzing FSDB in Verdi GUI",
      "Tracing glitches and active state transitions"
    ]
  },
  {
    time: "01:00 PM – 02:00 PM",
    duration: "60 mins",
    title: "Lunch Break & Informal Interaction",
    type: "break",
    description: "Mid-day break for lunch and informal technical discussions across campus facilities.",
    highlights: ["1-hour dedicated break for dining & campus exploration"]
  },
  {
    time: "02:00 PM – 03:15 PM",
    duration: "75 mins",
    title: "Session 3: Code Quality, Linting & CDC Analysis with SpyGlass",
    type: "hands-on",
    toolBadge: "Synopsys SpyGlass®",
    description: "Static rule checking, linting best practices, clock domain crossing (CDC) metastability checks, and synchronizer validation.",
    highlights: [
      "Setting up SpyGlass project scripts (`.tcl`)",
      "Running structural lint & waiver management",
      "Clock Domain Crossing (CDC) verification"
    ]
  },
  {
    time: "03:15 PM – 04:15 PM",
    duration: "60 mins",
    title: "Session 4: Logic Synthesis with Design Compiler (DC Shell) & SDC",
    type: "hands-on",
    toolBadge: "Synopsys Design Compiler®",
    description: "Interactive synthesis in `dc_shell-t`, applying Synopsys Design Constraints (SDC), timing budgeting, `compile_ultra` optimization, and netlist generation.",
    highlights: [
      "SDC clock definition, jitter & I/O timing margins",
      "Standard-cell technology library mapping",
      "Generating gate-level netlist, timing, area, and power reports"
    ]
  },
  {
    time: "04:15 PM – 04:30 PM",
    duration: "15 mins",
    title: "Valedictory & Unified Certificate Distribution",
    type: "keynote",
    toolBadge: "Official Certification",
    description: "Concluding remarks, distribution of the official Certificate of Participation & Synopsys Front-End VLSI Design Training, and collection of project takeaways.",
    highlights: [
      "One Unified Official Certificate issued to all attendees",
      "Take-home code repositories & SDC templates",
      "Vote of thanks by Department of ECE (VDT)"
    ]
  }
];

export const FAQS = [
  {
    question: "Do I need to bring my own laptop with software installed?",
    answer: "No, absolutely not. The workshop is conducted in the state-of-the-art VLSI Research Lab at Sri Shakthi Tech Park. Every single participant is provided an individual, dedicated enterprise CAD workstation with a single high-resolution monitor and pre-configured Synopsys EDA tools and server licenses. You only need to bring your curiosity."
  },
  {
    question: "What certificate will I receive upon completing the workshop?",
    answer: "Every participant who attends and completes the hands-on lab sessions will receive one unified official Certificate of Participation & Synopsys Front-End VLSI Design Training, accredited with the seals of Sri Shakthi Institute of Engineering and Technology, the MeitY Chip to Startup (C2S) Programme, and the Institution's Innovation Council (IIC)."
  },
  {
    question: "Who is eligible to register for this workshop?",
    answer: "The workshop is open to all engineering students (B.Tech, B.E., M.Tech, M.E. in ECE, EE, VLSI, CSE), PhD research scholars, academic faculty members, and working industry professionals wanting hands-on exposure to the Synopsys front-end design suite."
  },
  {
    question: "What is included in the ₹2,500 registration fee?",
    answer: "The fee covers full-day hands-on access to 1:1 dedicated single-monitor CAD workstations, access to premium Synopsys EDA tools (VCS, Verdi, SpyGlass, Design Compiler), complete starter RTL code packs and SDC scripts, the official unified training certificate, and morning/afternoon networking refreshments."
  },
  {
    question: "When will the exact workshop date be finalized?",
    answer: "Dates will be announced shortly. Since capacity is strictly capped at 50 dedicated workstations to ensure 1:1 individual hands-on attention, registrations are open on a first-come, first-served basis. Reserving your seat now locks in your workstation allocation."
  }
];
