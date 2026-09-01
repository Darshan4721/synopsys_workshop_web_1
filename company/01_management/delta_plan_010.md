# Delta Plan 010: Ingesting Reference Registration Schema & Admin Analytics

- **Sprint**: 9
- **Branch**: `dev_1`
- **Reference Files Ingested**: `form anoter web/Register.jsx`, `form anoter web/Admin.jsx`, `form anoter web/TimerControl.jsx`

---

## Subagent Work Packages

### WP-1: Reference Code Ingestion & Type Contracts (`src/lib/types.ts` & `src/lib/data.ts`)
- Ingest comprehensive participant fields from `Register.jsx`:
  - Candidate Full Name
  - Primary Contact Email
  - WhatsApp / Mobile Phone Number
  - College / Institution Name & City/State
  - Department / Degree (e.g. ECE, EEE, VLSI, CSE, Mechatronics)
  - Academic Year (1st, 2nd, 3rd, 4th Year, PG/M.Tech, Research Scholar, Faculty, Industry Professional)
  - College Roll / Register Number
  - Payment Details: Fixed ₹2,500, Payment Mode, UTR / Transaction Reference ID, Payment Timestamp.

### WP-2: Public Registration Modal Overhaul (`src/components/RegistrationModal.tsx` & `src/components/DigitalPassPreview.tsx`)
- Enhance the modal into a multi-step or comprehensive structured registration flow matching the depth of `form anoter web/Register.jsx`.
- Real-time client-side validation for phone, email, and UTR number.
- Instant 1:1 single-monitor workstation assignment (`CAD-STATION #XX`).
- Generates VIP holographic boarding pass ticket with QR code.

### WP-3: Admin Console Alignment (`src/app/admin/page.tsx`)
- Incorporate features inspired by `form anoter web/Admin.jsx`:
  - Rich registration cards with payment verification status (Verified, Pending, Flagged).
  - Multi-parameter filter (by Department, Year of Study, Category, Payment Status, Check-in Status).
  - Search by Name, Email, Phone, College, Roll Number, or UTR ID.
  - Interactive 50-Workstation Floorplan Map sync with newly registered attendees.
  - Quick Export CSV, Print Attendance Sheet, and Timer / Countdown status.

### WP-4: End-to-End Build & QA Certification
- Run `node scripts/test_verification.js`.
- Execute `npm run build` and certify exit code 0.
