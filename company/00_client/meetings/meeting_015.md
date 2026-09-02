# Client-CEO Meeting Minutes: Meeting #015

- **Timestamp**: 2026-09-02T20:44:16+05:30
- **Attendees**: Company Owner & Executive Chairman (User), Executive CEO & Managing Director (`website_company`), Design Director (`design-director`), Motion Animator (`motion-animator`), Delivery Manager (`delivery-manager`)
- **Status**: DISCOVERY SESSION COMPLETED • AWAITING EXECUTION MODE CONFIRMATION

---

## 1. Owner Directives & Full Problem Statement

### A. Mobile View Complete Redesign (Highest Priority)
1. **Header & Navigation (Mobile)**:
   - Header is currently cramped with overlapping elements.
   - Redesign with an ultra-clean mobile navigation bar, compact brand badge, and a smooth Apple-grade slide-down drawer.
2. **Hero Section (Mobile)**:
   - **Font Proportion**: The text in the small metric boxes (workstation allocation, fee, etc.) is currently larger than the headline on mobile. Downscale and proportionally balance metric pill typography.
   - **Green Live Beacon**: Pulse dot is currently oversized on mobile; adjust to a delicate 1.5–2px beacon.
   - **Image Overlays**: In the silicon die image (`synopsys_silicon_chip.jpg`), overlay text boxes are currently covering/hiding the photo on mobile. Restructure so the text is placed below the image on mobile or minimized into an unobtrusive micro-badge so the chip photo is 100% visible.
   - **Editorial Cursive Font**: Scale the headline serif/editorial font cleanly across mobile viewports so it remains prominent and elegant.
3. **VLSI Flow & Code Viewer (`VlsiFlowVisualizer.tsx`)**:
   - Code box feels cramped when sliding left/right on mobile. Add touch-friendly horizontal scrolling, smooth padding, and syntax badge headers.
4. **Interactive Verdi® Waveform Simulator (`EdaConsoleSimulator.tsx`)**:
   - Simulator deck is cramped on mobile. Stack the waveform trace viewer and live stimulus controls cleanly with responsive touch targets.
5. **Workstation Guarantee (`WorkstationGuarantee.tsx`)**:
   - Lab photo overlay text covers the image on mobile. Relocate overlay details below the image on mobile screens so the 50-workstation photo is completely visible.
6. **Certificate Showcase (`CertificateShowcase.tsx`)**:
   - Remove heavy overlay badges covering the certificate mockup on mobile; keep the certificate image crisp and unobstructed.

### B. PC View Preservation & Header Polish
1. **PC View Preservation**: Strictly maintain all desktop layouts, grids, and paddings using Tailwind responsive prefixes (`hidden lg:flex`, `lg:grid-cols-12`, `sm:`, `md:`, `lg:`).
2. **Apple Sliding Oval Highlight in Header**:
   - Implement an Apple-style active section indicator.
   - As the user scrolls or hovers between sections (*EDA Flow, 1:1 Workstations, Day Schedule, Certification, Venue, FAQ*), a smooth oval highlight pill glides behind the active link.
3. **FAQ Accordion Defect Fix (`FaqAccordion.tsx`)**:
   - Fix the disappearance bug when clicking expand/collapse.
   - Default state: Clean collapsed question list.
   - On click: Smoothly animate open, push subsequent questions downward fluently (Apple accordion physics), with zero disappearance or layout jumps.

---

## 2. Action Plan & Work Packages (Ready for Dispatch)
- **WP-1 (Header & Navigation)**: Apple dynamic scroll-spy oval indicator on desktop + revamped touch capsule on mobile (`Navbar.tsx`).
- **WP-2 (Mobile Hero & Image Layouts)**: Rebalance mobile typography, refine beacon sizing, unblock silicon die image (`Hero.tsx`).
- **WP-3 (Mobile EDA & Hardware Showcases)**: Mobile-optimized touch scrolling for Verilog code, responsive waveform stack (`VlsiFlowVisualizer.tsx`, `EdaConsoleSimulator.tsx`).
- **WP-4 (Unblocked Lab & Certificate Visuals)**: Responsive photo layouts for `WorkstationGuarantee.tsx` and `CertificateShowcase.tsx`.
- **WP-5 (Apple Accordion Refinement)**: Clean collapsible FAQ list with fluid height springs (`FaqAccordion.tsx`).
- **WP-6 (Verification)**: 14-point automated QA test suite (`test_verification.js`), `npm run build`, and LAN mobile testing.
