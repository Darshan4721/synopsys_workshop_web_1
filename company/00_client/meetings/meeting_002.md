# Client - CEO Review & Refinement Meeting Minutes (Meeting #002)

- **Date / Time**: 2026-08-30T15:47:55+05:30
- **Attendees**: Client, CEO & Executive Orchestrator (`website_company`)
- **Status**: IN_PROGRESS / REFINEMENT SPRINT

---

## 1. Executive Summary & Sprint Directives
The client reviewed the initial build for **Sri Shakthi Institute of Engineering and Technology** (₹2,500 Registration Fee), commended the spotless luxury typography, interactive EDA console, 5-stage VLSI visualizer, and realtime pass generation. 

A structured refinement sprint was requested to eliminate inaccuracies (lunch, certificate count, dual-monitor imagery, organizing body naming), elevate the header/hero aesthetic, enhance FAQ animations, switch backend strategy to Firebase, and establish the GitHub multi-branch workflow (`main` and `dev1`).

---

## 2. Feedback & Directives Captured

### 2.1 Git & Branching Strategy
- **Repository Remote**: `https://github.com/Darshan4721/synopsys_workshop_web_1.git`
- **Branches**:
  - `main`: Production release branch for deployment.
  - `dev1`: Development and testing branch for staged validation.
- All code and documentation to be committed and pushed to both branches.

### 2.2 Backend Architecture Update
- Integrate **Firebase** (Firestore & Client SDK setup) for real-time registration persistence and pass retrieval.

### 2.3 Visual & Asset Refinements (Anti-AI Slop Enforcement)
- **CAD Lab Image**: Strictly single-monitor enterprise CAD workstations. No dual monitors.
- **Certificate Image**: Strictly **ONE single certificate frame** for the unified *Certificate of Participation & Synopsys Front-End VLSI Design Training*. Remove dual-certificate graphic.
- **Hero Silicon Die / Visual**: Upgrade hero visual to an ultra-refined, non-AI-slop bespoke studio semiconductor wafer / interactive hardware architecture card.
- **Sponsors Asset Directory**: Create dedicated migration folder (`public/images/sponsors/`) with fallback handling for incoming client logos.

### 2.4 Critical Content Corrections
- **Lunch**: REMOVE "complimentary lunch provided" everywhere. Replace with "1:00 PM – 2:00 PM: Lunch Break & Informal Interaction" (lunch at participant discretion / campus food court).
- **Organizing Body**: Update to **Department of ECE (VDT)** [Department of Electronics and Communication Engineering (VLSI Design and Technology)]. Remove "S2S/C2S Centre" from organizing body title (keep C2S as national sponsor/patron).
- **FAQ Animations**: Enhance accordion expand/collapse transitions with smooth spring dynamics and subtle glow.
- **Header / Navigation**: Further refine the floating navbar with polished micro-borders and enhanced contrast.

---

## 3. Action Items
- [ ] Initialize git repository and configure `.gitignore`.
- [ ] Push clean codebase to `main` and `dev1` on GitHub.
- [ ] Generate new single-monitor lab visual and single-frame unified certificate visual.
- [ ] Update `src/lib/data.ts` and all components (removing lunch references, updating Dept to ECE (VDT)).
- [ ] Add Firebase configuration (`src/lib/firebase.ts`).
- [ ] Enhance FAQ micro-interactions and animations.
- [ ] Execute build validation (`npm run build`) and update meeting minutes.
