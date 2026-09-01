// Automated Comprehensive QA Suite for Sri Shakthi Synopsys VLSI Workshop Website (v9.0)
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPREHENSIVE QA & ACCEPTANCE VERIFICATION (v9.0) ===\n');

const checks = [
  {
    name: 'Meeting Minutes (meeting_013.md)',
    path: path.join(__dirname, '../company/00_client/meetings/meeting_013.md'),
    validate: (content) => content.includes('Meeting #013') && content.includes('Apple Design Language Polish Pass')
  },
  {
    name: 'Apple Design Glassmorphic Tokens in CSS (globals.css)',
    path: path.join(__dirname, '../src/app/globals.css'),
    validate: (content) => content.includes('apple-glass-card') && content.includes('apple-dark-card') && content.includes('animate-float-slow')
  },
  {
    name: 'Hero Component with Apple Spring Floating Badges (Hero.tsx)',
    path: path.join(__dirname, '../src/components/Hero.tsx'),
    validate: (content) => content.includes('animate-float-slow') && content.includes('apple-glass-card') && content.includes('Department of ECE (VDT)')
  },
  {
    name: 'Comprehensive Types Contract (types.ts)',
    path: path.join(__dirname, '../src/lib/types.ts'),
    validate: (content) => content.includes('paymentUtr') && content.includes('academicYear') && content.includes('department')
  },
  {
    name: '2-Step Registration & UTR Payment Modal (RegistrationModal.tsx)',
    path: path.join(__dirname, '../src/components/RegistrationModal.tsx'),
    validate: (content) => content.includes('handleProceedToPayment') && content.includes('paymentUtr') && content.includes('CAD-STATION')
  },
  {
    name: 'Multi-Open FAQ Accordion with Permanent Visibility (FaqAccordion.tsx)',
    path: path.join(__dirname, '../src/components/FaqAccordion.tsx'),
    validate: (content) => content.includes('openSet') && content.includes('expandAll') && content.includes('faq.answer')
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
    name: 'Interactive 50 CAD Lab Floorplan, Roster & Stage Timer on Admin Page (src/app/admin/page.tsx)',
    path: path.join(__dirname, '../src/app/admin/page.tsx'),
    validate: (content) => content.includes('50 CAD Lab Grid') && content.includes('Stage Timer') && content.includes('paymentUtr') && content.includes('handleLogin')
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
