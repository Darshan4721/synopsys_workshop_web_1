# Design System & Apple Design Polish Specification

- **System Name**: Synopsys Luxury Semiconductor Editorial System
- **Lead**: Design Director (`website_company`)
- **Status**: FROZEN / READY FOR CODING

---

## 1. Typography Hierarchy (Strict Anti-AI Slop)
- **Display Headlines (H1 / Large Titles)**:
  - Font: High-contrast luxury editorial serif (e.g. *Instrument Serif / Cormorant Garamond / Playfair Display* matching the elegance of *Parode / Mailendra*).
  - Styling: `font-serif tracking-tight font-normal text-slate-900 leading-[1.1]`.
  - Gradient Accents: Purple-to-violet linear gradients `bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-700 bg-clip-text text-transparent`.
- **Subheadings & Eyebrow Badges**:
  - Eyebrows: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-100 text-purple-900 border border-purple-200/80`.
- **Body Text**:
  - Font: Geometric grotesk (*Plus Jakarta Sans / Syne / Inter* with refined letter-spacing).
  - Styling: `text-slate-600 font-normal leading-relaxed`.
- **EDA Code & Terminal**:
  - Font: *JetBrains Mono*, `text-xs md:text-sm font-mono text-purple-200 bg-slate-950 p-4 rounded-xl`.

---

## 2. Component Architecture (Double-Bezel & Doppelrand)

### 2.1 Double-Bezel Nested Card Pattern
```html
<div class="p-2 rounded-[2rem] bg-purple-950/[0.04] border border-purple-500/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
  <div class="p-6 md:p-8 rounded-[calc(2rem-0.5rem)] bg-white/95 border border-purple-100 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
    <!-- Card Content -->
  </div>
</div>
```

### 2.2 Nested Island CTA Button Pattern
```html
<button class="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white font-medium shadow-lg shadow-purple-900/20 hover:shadow-purple-900/35 active:scale-[0.98] transition-all duration-200">
  <span>Reserve 1:1 Workstation Pass</span>
  <span class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
    <svg class="w-4 h-4 text-white" ... />
  </span>
</button>
```

---

## 3. Motion & Micro-Interactions (Emil Kowalski Philosophy)
1. **Interactive VLSI Flow**: Active tab transitions with animated indicator pills and instantaneous state syncing.
2. **Registration Drawer / Modal**: Smooth spring entrance (`scale(0.96) -> scale(1)` with `opacity: 0 -> 1`), backdrop-blur on overlay.
3. **Instant Pass Generator**: Real-time canvas/SVG rendering of personalized pass with QR Code, participant name, institution, and 1:1 allocated workstation number.
4. **Tool Tabs Console**: Hardware-accelerated transitions with syntax highlighted Verilog and SDC code blocks.
