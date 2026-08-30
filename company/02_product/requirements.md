# Product Requirements Document (PRD) — Front-End VLSI Synopsys Workshop Website

- **Document ID**: `PRD-VLSI-SYNOPSYS-001`
- **Owner**: Product Lead (`website_company`)
- **Institution**: Sri Shakthi Institute of Engineering and Technology
- **Department**: Department of Electronics Engineering (VLSI Design and Technology) [EE (VDT)]
- **Venue**: VLSI Research Lab, Tech Park, Sri Shakthi Campus
- **Status**: APPROVED / IN EXECUTION

---

## 1. Executive Summary & Vision
A flagship, high-converting, agency-grade digital portal for the **National-Level Hands-on Workshop on Front-End VLSI Design Flow in Synopsys EDA Suite** hosted at Sri Shakthi Institute of Engineering and Technology. 

The website communicates institutional prestige, EDA tool sophistication, national patronage (MeitY C2S & IIC), and the 1:1 dedicated CAD lab infrastructure (50 dedicated workstations with single monitors).

---

## 2. Target Audience & Personas
1. **Undergraduate & Graduate Scholars (B.Tech / B.E. / M.Tech / M.E.)**: Eager to bridge the academia-industry gap by mastering real Synopsys tools (VCS, Verdi, SpyGlass, Design Compiler).
2. **PhD / Research Scholars & Faculty Members**: Looking to conduct advanced RTL synthesis, CDC analysis, and timing sign-off on ASIC/FPGA flows.
3. **Early Career VLSI Engineers**: Seeking formal hands-on exposure to standard EDA toolchains under MeitY C2S patronage.

---

## 3. Core Functional Modules & Feature Scope

### 3.1 Hero & Value Proposition
- Clear title: **Front-End VLSI Design Flow in Synopsys EDA Suite**.
- Subtitle: *Department of Electronics Engineering (VLSI Design & Technology), Sri Shakthi Institute of Engineering and Technology*.
- Institutional & National Badges: **Ministry of Electronics & IT (MeitY)**, **Chip to Startup (C2S) Programme**, **Institution's Innovation Council (IIC)**.
- Key Metrics Ribbon:
  - `50` Dedicated Single-Monitor CAD Workstations (1:1 Ratio)
  - `₹2,500` All-Inclusive Registration Fee
  - `0` Laptops Required (Full Linux CAD Environment Provided)
  - `1` Official Synopsys & C2S Endorsed Certificate
- Primary Call to Action: **"Reserve 1:1 Workstation Pass"** (triggers registration drawer) + Secondary CTA: **"Explore EDA Curriculum"** (smooth scroll to flow visualizer).

### 3.2 Interactive Front-End VLSI Design Flow Visualizer
Interactive 5-stage pipeline with real-time detail pane, block diagrams, and code snippets:
1. **Stage 1: Architecture & Verilog RTL Coding** (FSM, Datapath, Structural Verilog).
2. **Stage 2: Simulation & Waveform Debug** (Synopsys VCS Compiler + Verdi Waveform GUI).
3. **Stage 3: Linting & Clock Domain Crossing (CDC)** (Synopsys SpyGlass static verification).
4. **Stage 4: Logic Synthesis & SDC Constraints** (Synopsys Design Compiler in `dc_shell`, timing/area optimization).
5. **Stage 5: Gate-Level Netlist & Timing Sign-off** (Generating `.v` netlist, `report_timing`, slack checks).

### 3.3 Interactive Synopsys EDA Console & Code Studio
A live tabbed code inspector allowing participants to preview what they will run in the lab:
- **Tab 1 (`counter.v`)**: Synthesizable RTL Code.
- **Tab 2 (`constraints.sdc`)**: Synopsys Design Constraints (`create_clock`, `set_input_delay`).
- **Tab 3 (`dc_shell.tcl`)**: Design Compiler Synthesis Script (`compile_ultra`, `report_timing`).
- **Tab 4 (`spyglass.tcl`)**: SpyGlass Lint & CDC run commands.

### 3.4 Hands-on Schedule & Day Timeline
Detailed session breakdown (8:30 AM Check-in to 4:30 PM Valedictory):
- **08:30 – 09:30 AM**: Registration, Workstation Allocation & CAD License Activation
- **09:30 – 11:00 AM**: Session 1 — VLSI Architecture & Synthesizable RTL in Verilog
- **11:00 – 11:15 AM**: Networking Tea & Refreshments Break
- **11:15 – 01:00 PM**: Session 2 — Advanced Simulation (VCS) & Interactive Debugging (Verdi)
- **01:00 – 02:00 PM**: Executive Networking Lunch (Provided at Tech Park)
- **02:00 – 03:15 PM**: Session 3 — SpyGlass Linting & Clock Domain Crossing (CDC) Analysis
- **03:15 – 04:15 PM**: Session 4 — Logic Synthesis with Design Compiler (`dc_shell`) & SDC Optimization
- **04:15 – 04:30 PM**: Valedictory & Unified Certificate Distribution

### 3.5 Infrastructure & 1:1 Lab Guarantee
- Highlights the **VLSI Research Lab at Tech Park**.
- 50 Single-Monitor high-performance enterprise systems.
- Zero-laptop setup with pre-mounted Synopsys tools on Red Hat Enterprise Linux / CentOS CAD servers.

### 3.6 Official Certification Showcase
- Presentation of the single unified **Certificate of Participation & Synopsys Front-End VLSI Design Training**.
- Displaying official seals from MeitY C2S, Synopsys, and Sri Shakthi Institute.

### 3.7 Interactive Registration Drawer & Instant Pass Generator
- Dynamic multi-tier form (Student, Research Scholar, Faculty, Industry Professional).
- Inputs: Full Name, Email, Phone, College / Organization, Roll/ID Number, Designation.
- Instant **Digital Workstation Pass Preview** with custom Pass ID (`JSS-VLSI-2026-XXXX`), attendee QR code, seat allocation, and print/download pass feature.

### 3.8 Venue, Map & Helpdesk
- Location: VLSI Research Lab, Tech Park, Sri Shakthi Institute of Engineering and Technology, Coimbatore, Tamil Nadu.
- Contacts, helpline email, directions, and FAQ accordions.

---

## 4. Gherkin Acceptance Criteria

```gherkin
Feature: Synopsys Front-End VLSI Workshop Portal

  Scenario: User visits the homepage
    Given the user navigates to the landing page
    Then the hero displays "Sri Shakthi Institute of Engineering and Technology"
    And the department displays "Department of Electronics Engineering (VLSI Design and Technology)"
    And the fee is clearly displayed as "₹2,500"
    And the workstation count is indicated as "50 Dedicated Single-Monitor Workstations"

  Scenario: User interacts with the VLSI Flow Visualizer
    Given the user is on the VLSI Flow section
    When the user clicks on "Stage 4: Logic Synthesis (Design Compiler)"
    Then the visualizer updates to show Design Compiler architecture
    And displays the corresponding SDC constraints and dc_shell commands

  Scenario: User completes registration
    Given the user clicks "Reserve 1:1 Workstation Pass"
    When the user fills in their name, email, college, and selects "Student (B.Tech/M.Tech)"
    And clicks "Confirm Reservation"
    Then the interactive digital pass is generated with a unique Pass ID and QR code
    And the user can view or save their digital workstation ticket
```
