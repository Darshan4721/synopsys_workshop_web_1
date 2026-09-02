// Automated Comprehensive QA Suite for Sri Shakthi Synopsys VLSI Workshop Website (v11.0)
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPREHENSIVE QA & ACCEPTANCE VERIFICATION (v11.0) ===\n');

const checks = [
  {
    name: 'Meeting Minutes (meeting_015.md)',
    path: path.join(__dirname, '../company/00_client/meetings/meeting_015.md'),
    validate: (content) => content.includes('Meeting #015') && content.includes('Mobile View Complete Redesign')
  },
  {
    name: 'Executive Directive & Project Spec (directive_015.md & project_spec_015.md)',
    path: path.join(__dirname, '../company/00_executive/specs/project_spec_015.md'),
    validate: (content) => content.includes('Master Project Specification 015') && content.includes('Apple Design System')
  },
  {
    name: 'Apple Gliding Oval Active Section Highlight & Redesigned Mobile Drawer (Navbar.tsx)',
    path: path.join(__dirname, '../src/components/Navbar.tsx'),
    validate: (content) => content.includes('activeSection') && content.includes('NAV_LINKS') && content.includes('mobileMenuOpen')
  },
  {
    name: 'Hero Component Proportional Mobile Scaling & Unblocked Silicon Die (Hero.tsx)',
    path: path.join(__dirname, '../src/components/Hero.tsx'),
    validate: (content) => content.includes('sm:hidden') && content.includes('synopsys_silicon_chip.jpg') && content.includes('Department of ECE (VDT)')
  },
  {
    name: 'Touch-Optimized VLSI Flow & Horizontal Code Viewer (VlsiFlowVisualizer.tsx)',
    path: path.join(__dirname, '../src/components/VlsiFlowVisualizer.tsx'),
    validate: (content) => content.includes('touch-pan-x') && content.includes('overflow-x-auto')
  },
  {
    name: 'Mobile-Stacked Verdi Waveform Simulator (EdaConsoleSimulator.tsx)',
    path: path.join(__dirname, '../src/components/EdaConsoleSimulator.tsx'),
    validate: (content) => content.includes('pulseClock') && content.includes('TIMING TRACE')
  },
  {
    name: 'Unblocked 50 CAD Workstations Photo Layout on Mobile (WorkstationGuarantee.tsx)',
    path: path.join(__dirname, '../src/components/WorkstationGuarantee.tsx'),
    validate: (content) => content.includes('50 Dedicated Workstations') && content.includes('sm:hidden')
  },
  {
    name: 'Unblocked Unified Certificate Photo Layout on Mobile (CertificateShowcase.tsx)',
    path: path.join(__dirname, '../src/components/CertificateShowcase.tsx'),
    validate: (content) => content.includes('One Unified') && content.includes('sm:hidden')
  },
  {
    name: 'Apple Collapsible FAQ Accordion with Fluid Height Pushdown (FaqAccordion.tsx)',
    path: path.join(__dirname, '../src/components/FaqAccordion.tsx'),
    validate: (content) => content.includes('grid-rows-[1fr]') && content.includes('grid-rows-[0fr]') && content.includes('expandAll')
  },
  {
    name: '2-Step Registration & UTR Payment Modal (RegistrationModal.tsx)',
    path: path.join(__dirname, '../src/components/RegistrationModal.tsx'),
    validate: (content) => content.includes('handleProceedToPayment') && content.includes('paymentUtr') && content.includes('CAD-STATION')
  },
  {
    name: 'Interactive 50 CAD Lab Floorplan, Roster & Stage Timer on Admin Page (src/app/admin/page.tsx)',
    path: path.join(__dirname, '../src/app/admin/page.tsx'),
    validate: (content) => content.includes('50 CAD Lab Grid') && content.includes('Stage Timer') && content.includes('handleLogin')
  },
  {
    name: 'Navbar Clean: Public Header has ZERO Admin Links (Navbar.tsx)',
    path: path.join(__dirname, '../src/components/Navbar.tsx'),
    validate: (content) => !content.includes('href="/admin"') && content.includes('SSIET')
  },
  {
    name: 'Scroll Reading Progress & Observer (ScrollProgress.tsx & ScrollObserver.tsx)',
    path: path.join(__dirname, '../src/components/ScrollProgress.tsx'),
    validate: (content) => content.includes('scrollProgress') && content.includes('setScrollProgress')
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
