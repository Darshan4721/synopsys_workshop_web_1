# Delta Plan 012: Live Server Audit & Pre-Authored Subagent Verification

- **Sprint**: 12 (Pre-Authored Skill Orchestration & Live Server Health)
- **Branch**: `dev_1`
- **Assigned Subagents**: Delivery Manager (`delivery-manager/SKILL.md`), Independent QA (`independent-qa/SKILL.md`)

---

## Subagent Work Packages

### WP-1: Live Health & Performance Audit
- Verify background Next.js server instance on `http://localhost:3000`.
- Verify clean response from landing page (`/`), admin dashboard (`/admin`), and API route (`/api/register`).

### WP-2: Pre-Authored Skill Compliance
- Enforce that subagents load their assigned skill files from `C:\Users\radar\.gemini\config\skills\` / `plugins\website_company\skills\`.
- Execute full test suite `node scripts/test_verification.js`.
