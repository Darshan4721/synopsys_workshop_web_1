# Delta Plan 014: Trinity Unified Master Header Synthesis

- **Sprint**: 14
- **Branch**: `dev_1`
- **Department Leads**: Design Director (`design-director/SKILL.md`), Motion Animator (`motion-animator/SKILL.md`), Tech Architect (`tech-architect/SKILL.md`)

---

## Subagent Work Packages

### WP-1: Trinity Header Architecture (`src/components/Navbar.tsx`)
- Combine all 3 design directions:
  - **Dynamic Island Capsule (Option 1)**: Scroll listener triggers morphing from expanded luxury header (`py-4 sm:py-5 px-6 sm:px-8`) into a compact Dynamic Island capsule (`py-2.5 px-6`) with smooth spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - **Silicon Studio Features (Option 2)**: Hairline laser highlight rim (`shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)]`), segmented pill hover states, and live hardware badge (*"50 CAD Stations 1:1"*).
  - **Swiss Editorial Aesthetics (Option 3)**: Precision serif typography, SSIET / ECE (VDT) monogram badge, warm pearl frosted glass surface (`backdrop-blur-2xl bg-white/80`).
  - **Active Section Highlighting**: Dynamic observer updating the active pill as the user scrolls through `#curriculum`, `#workstations`, `#schedule`, `#certificate`, `#venue`, `#faq`.
  - **iOS 26 Style Mobile Control Center**: Fluid fullscreen drawer with spring physics and 1-click booking action.

### WP-2: Quality Assurance & Build Verification
- Execute `node scripts/test_verification.js`.
- Execute `npm run build` and ensure exit code 0.
- Push to `dev_1` and merge to `main` on GitHub.
