'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SponsorsStrip from '@/components/SponsorsStrip';
import VlsiFlowVisualizer from '@/components/VlsiFlowVisualizer';
import EdaConsoleSimulator from '@/components/EdaConsoleSimulator';
import WorkstationGuarantee from '@/components/WorkstationGuarantee';
import ScheduleTimeline from '@/components/ScheduleTimeline';
import CertificateShowcase from '@/components/CertificateShowcase';
import VenueAndContact from '@/components/VenueAndContact';
import FaqAccordion from '@/components/FaqAccordion';
import Footer from '@/components/Footer';
import RegistrationModal from '@/components/RegistrationModal';

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Floating Navigation Pill */}
      <Navbar onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Hero Section */}
      <Hero onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* National Patronage & Sponsors Bar */}
      <SponsorsStrip />

      {/* Interactive 5-Stage VLSI EDA Flow Visualizer */}
      <VlsiFlowVisualizer />

      {/* Interactive EDA Code & Terminal Simulator */}
      <EdaConsoleSimulator />

      {/* 50 Single-Monitor Workstations Lab Guarantee */}
      <WorkstationGuarantee onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Full-Day Hands-on Masterclass Schedule */}
      <ScheduleTimeline />

      {/* Unified Official Certification Presentation */}
      <CertificateShowcase />

      {/* Venue, Map, Tech Park & Helpdesk Desk */}
      <VenueAndContact />

      {/* Frequently Asked Questions */}
      <FaqAccordion />

      {/* Institutional Footer */}
      <Footer onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Interactive Registration Modal & Digital Boarding Pass */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </main>
  );
}
