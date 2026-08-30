# Client - CEO Review & Iteration Meeting Minutes (Meeting #002)

- **Date / Time**: 2026-08-30T16:02:59+05:30
- **Attendees**: Client, CEO & Executive Orchestrator (`website_company`)
- **Status**: ACTIVE & IN PROGRESS (Iterative Polish & Branch Dispatch)

---

## 1. Executive Summary & Client Review
- The client commended the flawless typography, clean layout structure, real-time code preview console, and overall production polish.
- Code successfully pushed to GitHub remote repository (`https://github.com/Darshan4721/synopsys_workshop_web_1.git`) across both `main` and `dev_1` branches.
- Client provided specific feedback and corrective directives to remove any inaccuracies or AI-slop appearance.

---

## 2. Directives & Corrective Actions

### A. Repository & Branch Strategy
- `main`: Production release branch.
- `dev_1`: Active feature and testing branch.
- All subsequent iterations committed and pushed to `dev_1` and synced with `main`.

### B. Backend Architecture Strategy
- Configure Firebase client SDK integration (`src/lib/firebase.ts`) for real-time registration storage alongside local fallback.

### C. Visual & Image Asset Refinements
1. **Lab Image**:
   - **Correction**: Replaced with **Single-Monitor** enterprise CAD laboratory photo (50 single-monitor workstations). No dual-monitor images.
2. **Certificate Mockup**:
   - **Correction**: Replaced with a **Single Unified Official Certificate** (Certificate of Participation & Synopsys Front-End VLSI Design Training on one parchment).
3. **Hero Header Visual**:
   - **Correction**: Replaced with a realistic, high-tech industrial semiconductor die / EDA hardware visual.

### D. Content & Inclusions Hygiene (Zero Guessing Enforcement)
1. **No Lunch Claims**:
   - Removed all references to "buffet lunch" or "complimentary lunch".
   - Kept scheduled afternoon break (01:00 PM – 02:00 PM: Afternoon Break / Intermission) and morning tea/refreshments.
2. **Organizing Body Nomenclature**:
   - Updated organizing body to strictly **Department of ECE (VDT)** / Department of Electronics Engineering (VLSI Design and Technology) [ECE (VDT)].
   - Removed "S2S Center / C2S Center" from organizing body labels.
3. **Sponsor Logos Asset Directory**:
   - Created `public/images/sponsors/` ready for client-supplied sponsor assets.

### E. Micro-Animations & FAQ Polish (Emil Kowalski Philosophy)
- Upgraded FAQ accordion transitions with CSS spring-like cubic-bezier curves (`cubic-bezier(0.23, 1, 0.32, 1)`), smooth height interpolation, and micro-press physics.

---

## 3. Action Items & Execution
- [x] Push baseline repository to GitHub `main` and `dev_1`.
- [x] Generate replacement single-monitor CAD lab, single-certificate, and industrial die assets.
- [x] Refactor all components to reflect Department of ECE (VDT) and accurate break schedule (no lunch claims).
- [x] Add Firebase integration scaffolding.
- [x] Upgrade FAQ accordion animations.
- [x] Verify production build (`npm run build` exit code 0).
- [x] Commit and push refined codebase to `dev_1` and `main`.
