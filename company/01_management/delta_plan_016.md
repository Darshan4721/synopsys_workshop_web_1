# Delta Plan 016: Apple Header Wow-Factor Redesign (PC & Mobile)

- **Sprint**: 16
- **Target Branches**: `dev_1` & `main`
- **Department Leads**: Design Director (`design-director/SKILL.md`), Motion Animator (`motion-animator/SKILL.md`)

---

## 1. Technical Deliverables
- **`src/components/Navbar.tsx`**:
  - Full rewrite with Apple Dynamic Island aesthetics.
  - Desktop: Spring-animated active sliding pill with hover and scroll-spying synchronization.
  - Desktop: Integrated live lab beacon (`🟢 50 CAD Stations Open`).
  - Mobile: Ultra-compact glass header with smooth spring SVG hamburger-to-close morphing.
  - Mobile: VisionOS-style frosted glass slide-down drawer with 6 interactive section cards with subtitles and chevron highlights.
  - Desktop & Mobile: High-energy pass reservation CTA with iridescent sheen.
- **Verification**:
  - `node scripts/test_verification.js` ➔ 14/14 checks pass.
  - `npm run build` ➔ Exit Code 0.
  - Push to `dev_1`, merge to `main`, and push to `main` on GitHub.
