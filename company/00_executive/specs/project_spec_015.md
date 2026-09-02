# Master Project Specification 015: Mobile-First Overhaul & Apple Design System

- **Version**: 15.0
- **Target Branch**: `dev_1`
- **Execution Mode**: Mode 1 (Full 7-Step Agency Pipeline)

---

## 1. Scope & Architecture Breakdown

### Component 1: `src/components/Navbar.tsx`
- **Desktop**:
  - Implement dynamic scroll-spy tracking (`activeSection` state synced via `IntersectionObserver` / scroll window listener).
  - Floating oval highlight pill (`bg-purple-100 text-purple-950 font-semibold shadow-sm`) that glides behind the active link with smooth spring transition.
  - Retain clean monogram and CTA pass reservation pill.
- **Mobile**:
  - Compact header bar with refined padding (`py-2.5 px-4`).
  - Redesigned mobile slide-down drawer with large touch targets, clear dividers, and primary CTA.

### Component 2: `src/components/Hero.tsx`
- **Mobile Typography Rebalancing**:
  - Scale masterclass headline (`text-3xl sm:text-5xl lg:text-7xl`) so editorial font is prominent.
  - Subdued, proportional metrics pill grid (`grid-cols-2 sm:grid-cols-4`) with scaled typography (`text-base sm:text-2xl`) so it never overpowers the headline.
  - Refined live green beacon (`w-2 h-2` / delicate ping).
- **Mobile Image Layout (Unblocked Silicon Die)**:
  - Keep 16:9 silicon die photo (`synopsys_silicon_chip.jpg`) 100% visible on mobile.
  - On mobile screens (`block sm:hidden`), place the architecture explanation card and workstation badge directly **below the image frame**, rather than covering the center of the photo. On desktop (`hidden sm:flex`), retain the luxury glass floating overlay.

### Component 3: `src/components/VlsiFlowVisualizer.tsx`
- **Touch-Friendly Code Carousel**:
  - Mobile stage selector pills with horizontal swipe/scroll (`overflow-x-auto`).
  - Code window with explicit smooth horizontal scrolling (`overflow-x-auto touch-pan-x`) and copy/syntax badge.

### Component 4: `src/components/EdaConsoleSimulator.tsx`
- **Mobile Oscilloscope Stack**:
  - Mobile responsive stack: Waveform oscilloscope on top, hardware stimulus generator buttons below with generous touch heights (`h-12`).
  - Compact SVG waveform traces with responsive viewbox scaling.

### Component 5: `src/components/WorkstationGuarantee.tsx` & `src/components/CertificateShowcase.tsx`
- **Unblocked Visuals on Mobile**:
  - Ensure the 50 CAD Lab photo (`vlsi_cad_lab.jpg`) and Certificate mockup (`certificate_mockup.jpg`) are completely unobscured on mobile by moving badges below the photo container on mobile viewports.

### Component 6: `src/components/FaqAccordion.tsx`
- **Apple Collapsible Accordion**:
  - Default state: Clean collapsed question list.
  - Active toggle: Expands single/multiple items with fluid CSS height/grid transitions, pushing subsequent cards down smoothly.
  - Zero disappearance bug: Card container remains permanent in DOM.
