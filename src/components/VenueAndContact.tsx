'use client';

import React from 'react';
import { MapPin, Mail, Phone, Clock, Building2, Monitor, Navigation, Sparkles } from 'lucide-react';
import { WORKSHOP_DETAILS } from '@/lib/data';

export default function VenueAndContact() {
  return (
    <section id="venue" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 text-purple-900 border border-purple-200 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-purple-700" />
            <span>Campus Location & Lab Logistics</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-slate-950 font-normal tracking-tight">
            Venue &{' '}
            <span className="italic font-serif bg-gradient-to-r from-purple-950 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Coordinator Desk
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Conducted on-site in the advanced VLSI Research Laboratory situated inside the Tech Park on the Sri Shakthi campus.
          </p>
        </div>

        {/* Double-Bezel Venue Hub */}
        <div className="double-bezel-card">
          <div className="double-bezel-inner p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Venue Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-700">
                    HOST FACILITY
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-slate-950 font-normal">
                    VLSI Research Lab, Tech Park
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-purple-900">
                    Sri Shakthi Institute of Engineering and Technology
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                      <Building2 className="w-4 h-4" />
                      <span>Department</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Department of ECE (VDT) [VLSI Design & Technology]
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                      <Clock className="w-4 h-4" />
                      <span>Timings & Gate Check-in</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      8:30 AM Check-in Desk • 9:30 AM to 4:30 PM Hands-on Lab
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                      <Monitor className="w-4 h-4" />
                      <span>Capacity</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      50 Dedicated Single-Monitor CAD Workstations
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                      <Navigation className="w-4 h-4" />
                      <span>Campus Tech Park</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      L&T Bypass, Chinniyampalayam Post, Coimbatore, Tamil Nadu
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-purple-100 text-xs font-mono space-y-1">
                  <p className="text-purple-300 font-bold uppercase tracking-wider">Arrival Checklist:</p>
                  <p>• Bring digital pass confirmation (SMS / Email / Pass ID)</p>
                  <p>• No personal laptops needed — CAD workstations pre-mounted</p>
                  <p>• Morning & Evening High-Tea / Refreshments provided</p>
                </div>
              </div>

              {/* Right Column: Coordinator & Support Card */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-purple-950 text-white space-y-6 shadow-xl">
                <div className="space-y-1 border-b border-purple-800/60 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800/80 text-purple-200 text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    <span>Academic Coordinators</span>
                  </div>
                  <h4 className="font-editorial text-xl font-normal text-white pt-2">
                    Department Helpdesk
                  </h4>
                  <p className="text-xs text-purple-300">
                    Contact our workshop coordinators for queries regarding registration, eligibility, or lab access.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-800 flex items-center justify-center text-purple-200 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-purple-300">Email Inquiries</p>
                      <p className="font-semibold text-white">vlsi.workshop@srishakthi.ac.in</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-800 flex items-center justify-center text-purple-200 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-purple-300">Helpdesk Hotline</p>
                      <p className="font-semibold text-white">+91 94432 00000 / +91 (0422) 2369900</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-800 flex items-center justify-center text-purple-200 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-purple-300">Organizing Body</p>
                      <p className="font-semibold text-white">Department of ECE (VDT)</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-800/60">
                  <p className="text-[11px] text-purple-300/80">
                    Sri Shakthi Institute of Engineering and Technology is an autonomous institution accredited with NAAC 'A' Grade and approved by AICTE.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
