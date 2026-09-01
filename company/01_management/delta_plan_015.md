# Delta Plan 015: Android Mobile & Windows PC Dual-Platform Optimization

- **Sprint**: 15
- **Branch**: `dev_1`
- **Department Leads**: Design Director (`design-director`), Independent QA (`independent-qa`), Engineering Dispatch (`engineering-dispatch`)

---

## Subagent Work Packages

### WP-1: Android Mobile Precision (360px - 412px Viewports)
- **Safe Tap Targets**: Minimum 44px–48px interactive height for buttons, inputs, modal triggers, and tabs.
- **Mobile Registration UX (`RegistrationModal.tsx`)**:
  - 1-tap "Copy UPI ID" action with visual clipboard confirmation badge.
  - Native numeric keypad trigger (`inputMode="numeric"`) for Phone Number and 12-Digit UTR reference.
  - Safe mobile viewport scrolling (`max-h-[85vh] overflow-y-auto`) with sticky bottom action bar.
- **Mobile Digital Pass (`DigitalPassPreview.tsx`)**:
  - Full-screen mobile card preview with 1-tap "Save Digital Pass / Print PDF" button.
  - Native responsive barcode/QR code scaling for mobile entry scanners.
- **Performance Optimization**:
  - GPU compositing with `transform: translateZ(0)` and `will-change: transform, opacity` to eliminate jank on mobile Android processors.

### WP-2: Windows PC High-DPI & ClearType Rendering
- **Font Rendering**: Add font-feature-settings and text-rendering optimizations for Windows Chrome / Edge ClearType engines.
- **Desktop Bento Scaling**: Max container width `max-w-7xl` with balanced 24px/32px margins preventing awkward gaps on 1080p, 1440p, and 4K monitors.
- **Windows Scrollbar Polish**: Modern custom scrollbar styling in `globals.css`.

### WP-3: Verification & Certification
- Automated QA test suite `node scripts/test_verification.js`.
- Clean production build `npm run build` (Exit Code 0).
- Push to `dev_1` and merge to `main` on GitHub.
