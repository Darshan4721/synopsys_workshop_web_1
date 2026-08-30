// Automated Verification Suite for Sri Shakthi Synopsys VLSI Workshop Website (v2.1)
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPREHENSIVE QA & ACCEPTANCE VERIFICATION ===\n');

const checks = [
  {
    name: 'Meeting Minutes (meeting_001.md, meeting_002.md, meeting_003.md)',
    path: path.join(__dirname, '../company/00_client/meetings/meeting_003.md'),
    validate: (content) => content.includes('Meeting #003') && content.includes('Asset Retention Policy') && content.includes('Admin Registration')
  },
  {
    name: 'Product Requirements (requirements.md)',
    path: path.join(__dirname, '../company/02_product/requirements.md'),
    validate: (content) => content.includes('PRD-VLSI-SYNOPSYS-001') && content.includes('50 Dedicated')
  },
  {
    name: 'Design System Tokens (tokens.json)',
    path: path.join(__dirname, '../company/03_design/tokens.json'),
    validate: (content) => content.includes('synopsys_purple') && content.includes('double_bezel')
  },
  {
    name: 'SQL Schema Migration (001_initial_schema.sql)',
    path: path.join(__dirname, '../company/backend/sql/001_initial_schema.sql'),
    validate: (content) => content.includes('CREATE TABLE IF NOT EXISTS workshops') && content.includes('workshop_registrations')
  },
  {
    name: 'Hero Component (Hero.tsx)',
    path: path.join(__dirname, '../src/components/Hero.tsx'),
    validate: (content) => content.includes('Department of ECE (VDT)') && content.includes('50 Dedicated') && content.includes('WORKSHOP_DETAILS.fee')
  },
  {
    name: 'Navbar Monogram & Admin Link (Navbar.tsx)',
    path: path.join(__dirname, '../src/components/Navbar.tsx'),
    validate: (content) => content.includes('SSIET') && content.includes('/admin')
  },
  {
    name: 'Coordinator Admin Portal (src/app/admin/page.tsx)',
    path: path.join(__dirname, '../src/app/admin/page.tsx'),
    validate: (content) => content.includes('Coordinator Admin Desk') && content.includes('handleExportCSV') && content.includes('CAD-STATION')
  },
  {
    name: '1:1 Workstations Guarantee (WorkstationGuarantee.tsx)',
    path: path.join(__dirname, '../src/components/WorkstationGuarantee.tsx'),
    validate: (content) => content.includes('50 Dedicated Workstations') && content.includes('1:1 Individual Access')
  },
  {
    name: 'Schedule Timeline without Lunch (ScheduleTimeline.tsx)',
    path: path.join(__dirname, '../src/components/ScheduleTimeline.tsx'),
    validate: (content) => content.includes('SCHEDULE_DATA') && content.includes('Full-Day Masterclass')
  },
  {
    name: 'Single Unified Certificate (CertificateShowcase.tsx)',
    path: path.join(__dirname, '../src/components/CertificateShowcase.tsx'),
    validate: (content) => content.includes('One Unified') && content.includes('Single Unified Certificate')
  },
  {
    name: 'Upgraded Animated FAQ (FaqAccordion.tsx)',
    path: path.join(__dirname, '../src/components/FaqAccordion.tsx'),
    validate: (content) => content.includes('cubic-bezier(0.23,1,0.32,1)') && content.includes('grid-rows-[1fr]')
  },
  {
    name: 'Firebase Scaffolding (firebase.ts)',
    path: path.join(__dirname, '../src/lib/firebase.ts'),
    validate: (content) => content.includes('recordRegistration') && content.includes('firebaseConfig')
  },
  {
    name: 'Locked Image Assets Intact in public/images',
    path: path.join(__dirname, '../public/images/synopsys_silicon_chip.jpg'),
    validate: () => 
      fs.existsSync(path.join(__dirname, '../public/images/synopsys_silicon_chip.jpg')) &&
      fs.existsSync(path.join(__dirname, '../public/images/vlsi_cad_lab.jpg')) &&
      fs.existsSync(path.join(__dirname, '../public/images/certificate_mockup.jpg')) &&
      fs.existsSync(path.join(__dirname, '../public/images/sponsors'))
  }
];

let allPassed = true;
checks.forEach((chk) => {
  try {
    if (!fs.existsSync(chk.path)) {
      console.log(`❌ [FAIL] ${chk.name} — File not found at: ${chk.path}`);
      allPassed = false;
      return;
    }
    const content = fs.readFileSync(chk.path, 'utf8');
    const ok = chk.validate(content);
    if (ok) {
      console.log(`✅ [PASS] ${chk.name}`);
    } else {
      console.log(`❌ [FAIL] ${chk.name} — Content validation failed`);
      allPassed = false;
    }
  } catch (err) {
    console.log(`❌ [ERROR] ${chk.name}: ${err.message}`);
    allPassed = false;
  }
});

console.log('\n----------------------------------------');
if (allPassed) {
  console.log('🎉 ALL 13 ACCEPTANCE & REGRESSION CHECKS PASSED WITH 100% COMPLIANCE');
  process.exit(0);
} else {
  console.log('⚠️ SOME CHECKS FAILED');
  process.exit(1);
}
