# Delta Plan 007: FAQ Accordion Bug Fix & Scroll Animation Reliability

- **Sprint**: 6 (Defect Remediation & Admin Validation)
- **Target Branch**: `dev_1`
- **Goal**: Resolve FAQ answer text disappearance on click, verify rock-solid scroll animations, and certify the interactive 50-CAD lab floorplan admin dashboard.

---

## Work Packages

### WP-1: FAQ Accordion Component Overhaul (`src/components/FaqAccordion.tsx`)
- Replace experimental `grid-rows-[1fr]` with deterministic conditional rendering.
- Add clear high-contrast typography (`text-slate-800 font-normal leading-relaxed`).
- Ensure multiple items can be opened or toggled cleanly without layout collapse.
- Add subtle accent highlight on open state.

### WP-2: Scroll Observer & Animation Safety (`src/components/ScrollObserver.tsx` & `src/app/globals.css`)
- Set `once: true` behavior so revealed elements lock in full visibility (`opacity: 1 !important; filter: none !important; transform: none !important;`).
- Prevent any interaction or expansion from re-triggering opacity resets.

### WP-3: Admin Portal (`src/app/admin/page.tsx`) Verification
- Verify both the 50 CAD lab floorplan seating map and the participant roster table work with zero errors.

### WP-4: End-to-End Verification & Build
- Run automated QA test script.
- Verify `npm run build` exits code 0.
- Push to `dev_1` and merge to `main`.
