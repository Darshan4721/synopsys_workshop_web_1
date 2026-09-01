# Delta Plan 013: Apple Design Polish Pass & Advanced Interactive Motion System

- **Sprint**: 13
- **Branch**: `dev_1`
- **Department Leads**: Design Director (`design-director/SKILL.md`), Motion Animator (`motion-animator/SKILL.md`)

---

## Subagent Work Packages

### WP-1: Apple Design Language Overhaul (Design Director)
- Apply Apple Pro industrial aesthetic:
  - Frosted glassmorphism (`backdrop-blur-2xl bg-white/75` with `border border-white/40` and inner highlight `shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]`).
  - High-contrast typography with tight tracking (`tracking-tight`), editorial serif accents, and ultra-crisp monospaced status badges.
  - Asymmetric Bento Grid layout with refined 28px/32px paddings and rounded-3xl corners.
  - Refined color system: Deep cosmic violet `#0f051d`, Synopsys royal purple `#7e22ce`, luminous emerald `#10b981`, and crisp slate text `#0f172a`.

### WP-2: Advanced Motion & Interactive Physics (Motion Animator)
- Integrate Emil Kowalski spring tokens (`cubic-bezier(0.16, 1, 0.3, 1)` and `cubic-bezier(0.23, 1, 0.32, 1)`).
- Add animated floating semiconductor particle field & glowing circuit grid in `Hero.tsx`.
- Enhance the **Verdi® Digital Waveform Simulator** (`EdaConsoleSimulator.tsx`) with animated clock trace pulses, glowing bus indicators, and interactive step simulations.
- Add magnetic haptic hover lifts on all cards (`hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300`).
- Ensure all scroll reveal animations trigger smoothly without layout shift.

### WP-3: Verification & Certification
- Automated QA test suite `node scripts/test_verification.js`.
- Clean production build `npm run build` (Exit Code 0).
- Push to `dev_1` and merge to `main` on GitHub.
