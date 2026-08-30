# Technical Architecture Specification

- **Project**: Sri Shakthi Synopsys Front-End VLSI Workshop Web Application
- **Lead**: Technical Architect (`website_company`)
- **Stack**: Next.js 14/15 App Router, React, TypeScript, Tailwind CSS, Lucide Icons, Canvas/SVG Pass Generator, LocalStorage / API mock database layer.

---

## 1. Project Directory Structure
```text
web_test/
├── company/
│   ├── 00_client/meetings/meeting_001.md
│   ├── 02_product/requirements.md
│   ├── 03_design/tokens.json, design_system.md
│   ├── 04_technical/architecture.md
│   ├── backend/sql/001_initial_schema.sql
│   └── state.json
├── public/
│   ├── images/
│   │   ├── synopsys_silicon_chip.jpg
│   │   ├── vlsi_cad_lab.jpg
│   │   └── dual_certificate_mockup.jpg
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       └── register/
│   │           └── route.ts
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── SponsorsStrip.tsx
│   │   ├── VlsiFlowVisualizer.tsx
│   │   ├── ToolsetBento.tsx
│   │   ├── EdaConsoleSimulator.tsx
│   │   ├── WorkstationGuarantee.tsx
│   │   ├── ScheduleTimeline.tsx
│   │   ├── CertificateShowcase.tsx
│   │   ├── RegistrationModal.tsx
│   │   ├── DigitalPassPreview.tsx
│   │   ├── VenueAndContact.tsx
│   │   ├── FaqAccordion.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   └── data.ts
│   └── ...
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── next.config.js / next.config.mjs
```

---

## 2. Component Responsibility Matrix
- **`Navbar.tsx`**: Detached floating glass pill with Sri Shakthi and Synopsys branding, smooth scroll anchors, and "Register" CTA.
- **`Hero.tsx`**: Editorial high-contrast serif headlines, MeitY C2S + IIC badges, fee pill (₹2,500), 50-workstation count, and direct registration action.
- **`VlsiFlowVisualizer.tsx`**: Interactive 5-stage front-end EDA flow (RTL ➔ VCS/Verdi ➔ SpyGlass ➔ Design Compiler / SDC ➔ Netlist).
- **`EdaConsoleSimulator.tsx`**: Live interactive code/terminal inspector with real Verilog code, SDC constraints, and DC Shell scripts.
- **`WorkstationGuarantee.tsx`**: Feature card on the 50 single-monitor workstations in the VLSI Research Lab (zero laptop needed).
- **`ScheduleTimeline.tsx`**: Tabbed / chronological schedule of the full-day masterclass (9:30 AM to 4:30 PM).
- **`CertificateShowcase.tsx`**: Presentation of the unified official Certificate of Participation & Synopsys Training.
- **`RegistrationModal.tsx` + `DigitalPassPreview.tsx`**: Complete registration flow with real-time digital pass generation and download.
- **`VenueAndContact.tsx`**: VLSI Research Lab, Tech Park, Sri Shakthi campus directions & coordinator hotline.
