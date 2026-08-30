# Client - CEO Consultation Minutes (Meeting #004)

- **Date / Time**: 2026-08-30T16:43:29+05:30
- **Attendees**: Client, CEO & Executive Orchestrator (`website_company`)
- **Status**: IN_PROGRESS (Direct Feedback & Remediation Plan)

---

## 1. Client Feedback & Defect Identification
- **Critical Feedback**: The link to the Admin Portal (`/admin` / "Admin Desk") was placed in the public navigation header.
- **Client Assessment**: The public header is for attendees and participants; exposing internal admin/coordinator links in the public header clutters the public interface and violates standard organizational hierarchy.
- **Root Cause**: Over-indexing on feature discoverability without strictly gating administrative routes from public navigation surfaces.

---

## 2. Immediate Remediation Action Plan
1. **Remove Admin Link from Public Header**:
   - Strip `Admin Desk` link from desktop navigation in `src/components/Navbar.tsx`.
   - Strip `Coordinator Admin Portal` link from mobile drawer in `src/components/Navbar.tsx`.
2. **Preserve Clean Public Interface**:
   - Public header retains exclusively attendee-facing anchors: `EDA Flow`, `1:1 Workstations`, `Day Schedule`, `Certification`, `Venue & Lab`, `FAQ`, and the primary CTA `Reserve Pass (₹2,500)`.
3. **Admin Route Architecture**:
   - `/admin` remains intact as a direct URL route (`http://localhost:3000/admin`) accessible only to authorized college coordinators.
4. **Verification & Git Synchronization**:
   - Re-run verification suite and production build.
   - Commit and push clean fixes to `dev_1` and `main`.

---

## 3. Action Items
- [ ] Present remediation plan to client for confirmation.
- [ ] Apply surgical removal of public admin links upon client approval.
- [ ] Push clean update to GitHub.
