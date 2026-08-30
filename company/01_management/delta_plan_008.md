# Delta Plan 008: FAQ Multi-Open State, Scroll Animation Certification & Admin Floorplan

- **Sprint**: 7
- **Branch**: `dev_1`
- **Target Deliverables**:
  1. Fix FAQ text disappearance by transitioning to multi-open persistent card state.
  2. Guarantee 100% visible, high-contrast, permanent readable text across all accordion states.
  3. Ensure `/admin` interactive floorplan and roster table operate smoothly.
  4. Ensure scroll animation observer unlocks elements immediately upon scroll.

---

## Task Breakdown
1. `src/components/FaqAccordion.tsx`:
   - Replace single index state with `openIndices: Set<number>` (pre-seeded with all/multiple open by default, with "Expand All" / "Collapse All" quick controls).
   - Ensure answers render with clear dark text (`text-slate-900`/`text-slate-800`), clean bullet items, and explicit container styling.
2. `src/app/globals.css` & `src/components/ScrollObserver.tsx`:
   - Guarantee `.reveal-visible` locks elements in 100% opacity and no transforms.
3. `src/app/admin/page.tsx`:
   - Full 50-CAD Workstation floorplan grid + attendee roster table + print/export.
4. QA Test Verification & Production Build (`npm run build` exit code 0).
