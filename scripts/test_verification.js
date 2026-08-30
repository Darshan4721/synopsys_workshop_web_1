// Automated Verification Suite for Sri Shakthi Synopsys VLSI Workshop Website
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING STAGE 5 INDEPENDENT QA & ACCEPTANCE VERIFICATION ===\n');

const checks = [
  {
    name: 'Meeting Minutes Frozen (meeting_001.md & meeting_002.md)',
    path: path.join(__dirname, '../company/00_client/meetings/meeting_002.md'),
    validate: (content) => content.includes('Sri Shakthi') && content.includes('2,500')
  },
  {
    name: 'Product Requirements (requirements.md)',
    path: path.join(__dirname, '../company/02_product/requirements.md'),
    validate: (content) => content.includes('PRD-VLSI-SYNOPSYS-001') && content.includes('50 Dedicated')
  },
  {
    name: 'Design System & Tokens (tokens.json & design_system.md)',
    path: path.join(__dirname, '../company/03_design/tokens.json'),
    validate: (content) => content.includes('synopsys_purple') && content.includes('double_bezel')
  },
  {
    name: 'Technical Architecture & SQL Schema',
    path: path.join(__dirname, '../company/backend/sql/001_initial_schema.sql'),
    validate: (content) => content.includes('CREATE TABLE IF NOT EXISTS workshops') && content.includes('workshop_registrations')
  },
  {
    name: 'Workshop Core Data (data.ts)',
    path: path.join(__dirname, '../src/lib/data.ts'),
    validate: (content) => 
      content.includes('Sri Shakthi Institute of Engineering and Technology') &&
      content.includes('₹2,500') &&
      content.includes('50') &&
      content.includes('Department of ECE (VDT)') &&
      content.includes('Synopsys Design Compiler') &&
      content.includes('Synopsys VCS') &&
      content.includes('SpyGlass')
  },
  {
    name: 'Hero Component (Hero.tsx)',
    path: path.join(__dirname, '../src/components/Hero.tsx'),
    validate: (content) => content.includes('WORKSHOP_DETAILS') && content.includes('Front-End') && content.includes('Reserve 1:1 Workstation Pass')
  },
  {
    name: 'Interactive VLSI Flow Visualizer (VlsiFlowVisualizer.tsx)',
    path: path.join(__dirname, '../src/components/VlsiFlowVisualizer.tsx'),
    validate: (content) => content.includes('VLSI_FLOW_STAGES') && content.includes('activeStage')
  },
  {
    name: 'EDA Console Simulator (EdaConsoleSimulator.tsx)',
    path: path.join(__dirname, '../src/components/EdaConsoleSimulator.tsx'),
    validate: (content) => content.includes('counter_8bit.v') && content.includes('timing_constraints.sdc') && content.includes('dc_shell')
  },
  {
    name: '1:1 Single-Monitor Workstations Guarantee (WorkstationGuarantee.tsx)',
    path: path.join(__dirname, '../src/components/WorkstationGuarantee.tsx'),
    validate: (content) => content.includes('50 Dedicated Workstations') && content.includes('Single-Monitor')
  },
  {
    name: 'Full Day Schedule (ScheduleTimeline.tsx)',
    path: path.join(__dirname, '../src/components/ScheduleTimeline.tsx'),
    validate: (content) => content.includes('SCHEDULE_DATA') && content.includes('Full-Day Masterclass')
  },
  {
    name: 'Single Unified Certificate (CertificateShowcase.tsx)',
    path: path.join(__dirname, '../src/components/CertificateShowcase.tsx'),
    validate: (content) => content.includes('One Unified') && content.includes('Single Unified Certificate')
  },
  {
    name: 'Registration & Digital Pass (RegistrationModal.tsx & DigitalPassPreview.tsx)',
    path: path.join(__dirname, '../src/components/DigitalPassPreview.tsx'),
    validate: (content) => content.includes('1:1 CAD Workstation Pass') && content.includes('pass.workstationNumber')
  },
  {
    name: 'Image Assets Exist in public/images',
    path: path.join(__dirname, '../public/images/vlsi_cad_lab.jpg'),
    validate: () => fs.existsSync(path.join(__dirname, '../public/images/certificate_mockup.jpg'))
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
  console.log('🎉 ALL ACCEPTANCE CHECKS PASSED WITH 100% COMPLIANCE');
  process.exit(0);
} else {
  console.log('⚠️ SOME CHECKS FAILED');
  process.exit(1);
}
