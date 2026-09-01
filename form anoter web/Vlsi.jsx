import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import './Vlsi.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Vlsi() {
  return (
    <div className="vlsi-page-wrapper">
      
      {/* 1. HERO SECTION */}
      <section className="bg-section vlsi-hero-section">
        <div className="bg-overlay" />
        <div className="content-container">
          <motion.section 
            className="vlsi-hero"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h1 className="vlsi-hero-title" variants={fadeUp}>
              Our Journey: Building Engineers Beyond the Classroom
            </motion.h1>
            <motion.p className="vlsi-hero-subtitle" variants={fadeUp}>
              A continuous journey of hands-on semiconductor training, industry exposure, and project-driven learning through Cadence, Synopsys, and direct interaction with the VLSI industry.
            </motion.p>
            
            <motion.div className="vlsi-stats-grid" variants={staggerContainer}>
              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-stat-card">
                <div className="vlsi-stat-value">3+</div>
                <div className="vlsi-stat-label">Industry Tool Workshops</div>
              </GlassCard>
              </motion.div>
              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-stat-card">
                <div className="vlsi-stat-value">20+</div>
                <div className="vlsi-stat-label">Days Specialized Training</div>
              </GlassCard>
              </motion.div>
              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-stat-card">
                <div className="vlsi-stat-value">Top</div>
                <div className="vlsi-stat-label">HR & Industry Engagements</div>
              </GlassCard>
              </motion.div>
              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-stat-card">
                <div className="vlsi-stat-value">100%</div>
                <div className="vlsi-stat-label">Project Driven Learning</div>
              </GlassCard>
              </motion.div>
            </motion.div>
          </motion.section>
        </div>
      </section>

      {/* 2. WORKSHOPS TIMELINE */}
      <section className="bg-section vlsi-workshops-section">
        <div className="bg-overlay" />
        <div className="content-container">
          <motion.section 
            className="vlsi-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="vlsi-section-header">
              <motion.h2 className="vlsi-section-title" variants={fadeUp}>Industry Tool Workshops</motion.h2>
              <motion.p className="vlsi-section-subtitle" variants={fadeUp}>
                Students worked directly with industry-standard EDA workflows used in semiconductor design.
              </motion.p>
            </div>

            <div className="vlsi-timeline">
              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-timeline-item">
                <div className="vlsi-timeline-badge">01</div>
                <div className="vlsi-timeline-content">
                  <h3 className="vlsi-timeline-title">Front-End Design</h3>
                  <div className="vlsi-timeline-meta">
                    <span>Feb 5 and 6</span>
                    <span>• 2 Days</span>
                    <span>• 5-Member VLSI Faculty Team</span>
                    <span>• 50+ Participants</span>
                  </div>
                  <p className="vlsi-timeline-desc">
                    A massive, intensive 2-day workshop inaugurating our students into the Cadence front-end ecosystem. Over 50 participants tackled industry-grade semiconductor design workflows, mastering core verification and synthesis tools including Cadence Incisive, IMC, Genus, and LEC. This foundational training set a powerful precedent for engineering excellence at scale.
                  </p>
                  <div className="vlsi-tags">
                    <span className="vlsi-tag">Cadence</span>
                    <span className="vlsi-tag">Incisive</span>
                    <span className="vlsi-tag">IMC</span>
                    <span className="vlsi-tag">Genus</span>
                    <span className="vlsi-tag">LEC</span>
                  </div>
                </div>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-timeline-item">
                <div className="vlsi-timeline-badge">02</div>
                <div className="vlsi-timeline-content">
                  <h3 className="vlsi-timeline-title">Advanced Front-End (Kalam Fest)</h3>
                  <div className="vlsi-timeline-meta">
                    <span>12 and 13 March</span>
                    <span>• 2 Days</span>
                    <span>• Entuple Industry Mentor</span>
                    <span>• 60+ Participants</span>
                  </div>
                  <p className="vlsi-timeline-desc">
                    Conducted during the Kalam cultural fest, this session brought an industry expert from Entuple to dive deeper into Cadence front-end workflows, exposing students to real-world industrial environments.
                  </p>
                  <div className="vlsi-tags">
                    <span className="vlsi-tag">Cadence</span>
                    <span className="vlsi-tag">Industry Mentoring</span>
                  </div>
                </div>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-timeline-item">
                <div className="vlsi-timeline-badge">03</div>
                <div className="vlsi-timeline-content">
                  <h3 className="vlsi-timeline-title">Back-End Physical Design</h3>
                  <div className="vlsi-timeline-meta">
                    <span>June 12 and 13</span>
                    <span>• 2 Days</span>
                    <span>• 5-Member VLSI Faculty Team</span>
                    <span>• 50+ Participants (EAC Dedicated Rooms)</span>
                  </div>
                  <p className="vlsi-timeline-desc">
                    A massive undertaking moving from front-end to back-end using GPDK 90nm technology. Students handled floorplanning, placement, routing, CTS, sign-off, and power plans in Innovus. They also performed static timing analysis (setup/hold) in Tempus and DFT in Modus, with individual dedicated Linux PCs.
                  </p>
                  <div className="vlsi-tags">
                    <span className="vlsi-tag">Innovus</span>
                    <span className="vlsi-tag">Tempus (STA)</span>
                    <span className="vlsi-tag">Modus (DFT)</span>
                    <span className="vlsi-tag">GPDK90nm</span>
                  </div>
                </div>
              </GlassCard>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </section>

      {/* 3. STUDENT TRAINING PROGRAM */}
      <section className="bg-section vlsi-training-section">
        <div className="bg-overlay" />
        <div className="content-container">
          <motion.section 
            className="vlsi-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="vlsi-section-header">
              <motion.h2 className="vlsi-section-title" variants={fadeUp}>Student Training Program</motion.h2>
              <motion.p className="vlsi-section-subtitle" variants={fadeUp}>
                From fundamentals to industry tools: Learn → Apply → Transfer Knowledge
              </motion.p>
            </div>

            <div className="vlsi-flow">
              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-flow-card">
                <div className="vlsi-flow-duration">11 to 23 Dec 2025</div>
                <h3 className="vlsi-flow-title">Cadence: Core Design Training</h3>
                <p className="vlsi-flow-desc">
                  Foundational EDA workflow led by a Cadence expert from the industry Entuple. This was the very first Linux operating system environment for our college, acquired through the government's C2S program. Covered the complete RTL to GDSII flow, pushing 20+ hands-on experiments including FIFO, UART, SPI, and many more.
                </p>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-flow-card">
                <div className="vlsi-flow-duration">Feb 16 to 20, 2026</div>
                <h3 className="vlsi-flow-title">Synopsys: Industry Tool Exposure</h3>
                <p className="vlsi-flow-desc">
                  Five experts from VLSI Minds provided mentoring. Each day a specialized industry professional taught specific tools, such as PrimeTime for STA and DC Compiler for synthesis. Exposure to a second major semiconductor EDA ecosystem.
                </p>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-flow-card">
                <div className="vlsi-flow-duration">Jul 16 to 22, 2026</div>
                <h3 className="vlsi-flow-title">Cadence: Junior Training</h3>
                <p className="vlsi-flow-desc">
                  Structured knowledge transfer where 6 highly trained seniors took the helm to train 50 incoming juniors from both the VLSI and ECE departments, passing down their inheritance of the complete RTL to GDSII flow.
                </p>
              </GlassCard>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </section>

      {/* 4. STUDENT PROJECTS & INDUSTRY */}
      <section className="bg-section vlsi-projects-section">
        <div className="bg-overlay" />
        <div className="content-container">
          <motion.section 
            className="vlsi-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="vlsi-section-header">
              <motion.h2 className="vlsi-section-title" variants={fadeUp}>Engineering Beyond the Classroom</motion.h2>
              <motion.p className="vlsi-section-subtitle" variants={fadeUp}>
                Real projects built by our students, acting as proof of capability.
              </motion.p>
            </div>

            <div className="vlsi-projects">
              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-project-card">
                <div className="vlsi-project-type">Hardware Security</div>
                <h3 className="vlsi-project-title">Built-In Self-Test (BIST)</h3>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-project-card">
                <div className="vlsi-project-type">Computer Architecture</div>
                <h3 className="vlsi-project-title">RISC Processor</h3>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-project-card">
                <div className="vlsi-project-type">AI Hardware</div>
                <h3 className="vlsi-project-title">Prefetcher for AI Acceleration</h3>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-project-card">
                <div className="vlsi-project-type">Optimization</div>
                <h3 className="vlsi-project-title">Branch Predictor</h3>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-project-card">
                <div className="vlsi-project-type">Memory Systems</div>
                <h3 className="vlsi-project-title">DDR3 with AI Accelerator</h3>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-project-card">
                <div className="vlsi-project-type">Neural Processing</div>
                <h3 className="vlsi-project-title">TPU (Tensor Processing Unit)</h3>
              </GlassCard>
              </motion.div>
            </div>
          </motion.section>

          {/* 5. HR / INDUSTRY CONCLAVE */}
          <motion.section 
            className="vlsi-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="vlsi-section-header">
              <motion.h2 className="vlsi-section-title" variants={fadeUp}>Connecting Students With the Industry</motion.h2>
              <motion.p className="vlsi-section-subtitle" variants={fadeUp}>
                Industry professionals from Microsoft, Google (DFT), and Alims interact directly with students, review their projects, and provide practical feedback.
              </motion.p>
            </div>

            <div className="vlsi-industry">
              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-industry-pillar">
                <h3 className="vlsi-industry-title">Project Review</h3>
                <p className="vlsi-industry-desc">Industry professionals examine student projects, evaluating RTL to GDS flows and real-world applicability.</p>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-industry-pillar">
                <h3 className="vlsi-industry-title">Career Guidance</h3>
                <p className="vlsi-industry-desc">Students receive direct feedback on skills, roles, and what the semiconductor industry actually expects.</p>
              </GlassCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlassCard className="vlsi-industry-pillar">
                <h3 className="vlsi-industry-title">Internship Exposure</h3>
                <p className="vlsi-industry-desc">Students get opportunities to understand and pursue industry internships through direct networking.</p>
              </GlassCard>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-section vlsi-testimonials-section">
        <div className="bg-overlay" />
        <div className="content-container" style={{ maxWidth: '100%' }}>
          <motion.section 
            className="vlsi-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="vlsi-section-header" style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto 60px' }}>
              <motion.h2 className="vlsi-section-title" variants={fadeUp}>What Students Say</motion.h2>
            </div>

            <div className="vlsi-marquee-wrapper">
              {/* Marquee Row 1 */}
              <motion.div className="vlsi-marquee-container" variants={fadeUp}>
                <div className="vlsi-marquee-track forward">
                  {[...Array(2)].map((_, trackIdx) => (
                    <React.Fragment key={`row1-${trackIdx}`}>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"The physical-design session helped me understand how RTL eventually becomes a physical layout."</p>
                        <p className="vlsi-testimonial-author">— Student, II Year VLSI</p>
                      </div>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"The training gave us exposure to tools that we normally wouldn't get to use in regular laboratory sessions."</p>
                        <p className="vlsi-testimonial-author">— Student, III Year ECE</p>
                      </div>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"Having an industry expert from Endevor review our code completely changed my perspective on optimization."</p>
                        <p className="vlsi-testimonial-author">— Senior Participant</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>

              {/* Marquee Row 2 (Reverse) */}
              <motion.div className="vlsi-marquee-container" variants={fadeUp}>
                <div className="vlsi-marquee-track reverse">
                  {[...Array(2)].map((_, trackIdx) => (
                    <React.Fragment key={`row2-${trackIdx}`}>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"Learning GPDK 90nm and running static timing analysis in Tempus was the highlight of the backend workshop."</p>
                        <p className="vlsi-testimonial-author">— Student Participant</p>
                      </div>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"The 1-on-1 mentoring by VLSI Minds for the Synopsys tools gave me the confidence to pursue a career in DFT."</p>
                        <p className="vlsi-testimonial-author">— Student, II Year VLSI</p>
                      </div>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"Teaching the juniors as a senior mentor was an incredible experience to solidify my own RTL to GDS fundamentals."</p>
                        <p className="vlsi-testimonial-author">— Senior Mentor</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>

              {/* Marquee Row 3 (Forward) */}
              <motion.div className="vlsi-marquee-container" variants={fadeUp}>
                <div className="vlsi-marquee-track forward" style={{ animationDuration: '45s' }}>
                  {[...Array(2)].map((_, trackIdx) => (
                    <React.Fragment key={`row3-${trackIdx}`}>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"The HR conclave allowed me to directly pitch my RISC controller to Google and Microsoft engineers."</p>
                        <p className="vlsi-testimonial-author">— Final Year Student</p>
                      </div>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"I never thought I'd get to build a Test-Free Processor and verify it using industry-standard Cadence workflows."</p>
                        <p className="vlsi-testimonial-author">— VLSI Participant</p>
                      </div>
                      <div className="vlsi-testimonial">
                        <p className="vlsi-testimonial-quote">"The 10-day core training was grueling but completely transformed my understanding of semiconductor design."</p>
                        <p className="vlsi-testimonial-author">— ECE Junior</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </section>

    </div>
  );
}
