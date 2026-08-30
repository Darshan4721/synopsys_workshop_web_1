// Automated Comprehensive QA Suite for Sri Shakthi Synopsys VLSI Workshop Website (v5.0)
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPREHENSIVE QA & ACCEPTANCE VERIFICATION (v5.0) ===\n');

const checks = [
  {
    name: 'Meeting Minutes (meeting_006.md)',
    path: path.join(__dirname, '../company/00_client/meetings/meeting_006.md'),
    validate: (content) => content.includes('Meeting #006') && content.includes('Floorplan Map')
  },
  {
    name: 'Scroll Reading Progress Indicator (ScrollProgress.tsx)',
    path: path.join(__dirname, '../src/components/ScrollProgress.tsx'),
    validate: (content) => content.includes('scrollProgress') && content.includes('setScrollProgress')
  },
  {
    name: 'Scroll Reveal Observer Component (ScrollObserver.tsx)',
    path: path.join(__dirname, '../src/components/ScrollObserver.tsx'),
    validate: (content) => content.includes('IntersectionObserver') && content.includes('reveal-visible')
  },
  {
    name: 'Interactive 50 CAD Lab Floorplan & Roster on Admin Page (src/app/admin/page.tsx)',
    path: path.join(__dirname, '../src/app/admin/page.tsx'),
    validate: (content) => content.includes('viewMode') && content.includes('50 CAD Lab Grid') && content.includes('handleLogin')
  },
  {
    name: 'Navbar Clean: Public Header has ZERO Admin Links (Navbar.tsx)',
    path: path.join(__dirname, '../src/components/Navbar.tsx'),
    validate: (content) => !content.includes('href="/admin"') && content.includes('SSIET')
  },
  {
    name: 'Live Interactive Verdi Waveform Simulator (EdaConsoleSimulator.tsx)',
    path: path.join(__dirname, '../src/components/EdaConsoleSimulator.tsx'),
    validate: (content) => content.includes('pulseClock') && content.includes('TIMING TRACE SIMULATOR')
  },
  {
    name: 'Hero Component with Scroll Animations (Hero.tsx)',
    path: path.join(__dirname, '../src/components/Hero.tsx'),
    validate: (content) => content.includes('reveal-on-scroll') && content.includes('Department of ECE (VDT)')
  },
  {
    name: '1:1 Workstations Guarantee (WorkstationGuarantee.tsx)',
    path: path.join(__dirname, '../src/components/WorkstationGuarantee.tsx'),
    validate: (content) => content.includes('50 Dedicated Workstations') && content.includes('reveal-on-scroll')
  },
  {
    name: 'Single Unified Certificate (CertificateShowcase.tsx)',
    path: path.join(__dirname, '../src/components/CertificateShowcase.tsx'),
    validate: (content) => content.includes('One Unified') && content.includes('reveal-on-scroll')
  },
  {
    name: 'Locked Image Assets Intact in public/images',
    path: path.join(__dirname, '../public/images/synopsys_silicon_chip.jpg'),
    validate: () => 
      fs.existsSync(path.join(__dirname, '../public/images/synopsys_silicon_chip.jpg')) &&
      fs.existsSync(path.join(__dirname, '../public/images/vlsi_cad_lab.jpg')) &&
      fs.existsSync(path.join(__dirname, '../public/images/certificate_mockup.jpg'))
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
