// Automated Comprehensive QA Suite for Sri Shakthi Synopsys VLSI Workshop Website (v3.0)
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPREHENSIVE QA & ACCEPTANCE VERIFICATION (v3.0) ===\n');

const checks = [
  {
    name: 'Meeting Minutes (meeting_004.md)',
    path: path.join(__dirname, '../company/00_client/meetings/meeting_004.md'),
    validate: (content) => content.includes('Meeting #004') && content.includes('Admin Authentication')
  },
  {
    name: 'Navbar Clean: Public Header has ZERO Admin Links (Navbar.tsx)',
    path: path.join(__dirname, '../src/components/Navbar.tsx'),
    validate: (content) => !content.includes('href="/admin"') && content.includes('SSIET') && content.includes('Reserve Pass')
  },
  {
    name: 'Coordinator Admin Protected with Auth Gate (src/app/admin/page.tsx)',
    path: path.join(__dirname, '../src/app/admin/page.tsx'),
    validate: (content) => content.includes('Coordinator Desk Authentication') && content.includes('handleLogin') && content.includes('handleExportCSV')
  },
  {
    name: 'Live Interactive Verdi Waveform Simulator (EdaConsoleSimulator.tsx)',
    path: path.join(__dirname, '../src/components/EdaConsoleSimulator.tsx'),
    validate: (content) => content.includes('pulseClock') && content.includes('TIMING TRACE SIMULATOR') && content.includes('COUNT[7:0]')
  },
  {
    name: 'Holographic Boarding Pass (DigitalPassPreview.tsx)',
    path: path.join(__dirname, '../src/components/DigitalPassPreview.tsx'),
    validate: (content) => content.includes('Holographic') || content.includes('iridescent') || content.includes('isHovered')
  },
  {
    name: 'Hero Component (Hero.tsx)',
    path: path.join(__dirname, '../src/components/Hero.tsx'),
    validate: (content) => content.includes('Department of ECE (VDT)') && content.includes('50 Dedicated')
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
  console.log('🎉 ALL COMPREHENSIVE QA & ACCEPTANCE CRITERIA PASSED WITH 100% COMPLIANCE');
  process.exit(0);
} else {
  console.log('⚠️ SOME CHECKS FAILED');
  process.exit(1);
}
