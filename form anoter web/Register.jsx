import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { supabase } from '../supabaseClient';
import { motionTokens } from '../utils/motionTokens';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [expandedMember, setExpandedMember] = useState(1);
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [wasValidated, setWasValidated] = useState(false);
  
  // Registration Capacity State
  const [regStatus, setRegStatus] = useState({
    loading: true,
    count: 0,
    maxCapacity: 35,
    isClosed: false
  });

  useEffect(() => {
    async function fetchStatus() {
      try {
        const { data, error } = await supabase.rpc('get_registration_status');
        if (!error && data) {
          setRegStatus({
            loading: false,
            count: Number(data.count) || 0,
            maxCapacity: Number(data.max_capacity) || 35,
            isClosed: Boolean(data.is_closed) || Number(data.count) >= 35
          });
        } else {
          setRegStatus(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.warn("Capacity status check failed:", err);
        setRegStatus(prev => ({ ...prev, loading: false }));
      }
    }
    fetchStatus();
  }, []);
  
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('hackathon_draft');
      return saved ? JSON.parse(saved) : { teamName: '' };
    } catch (e) {
      return { teamName: '' };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hackathon_draft', JSON.stringify(formData));
    } catch (e) {
      console.warn("Could not save to localStorage");
    }
  }, [formData]);

  useEffect(() => {
    if (paymentStep || isSuccess) {
      // Delay the scroll slightly to ensure the DOM has updated
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [paymentStep, isSuccess]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setPaymentStep(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (!paymentProof) {
        throw new Error("Payment screenshot is required.");
      }

      // 1. Prepare exactly 4 members mapping to the DB schema
      const members = [];
      for (let num = 1; num <= 4; num++) {
        members.push({
          member_name: formData[`member${num}_name`] || '',
          email: formData[`member${num}_email`] || '',
          phone: formData[`member${num}_phone`] || '',
          college_org: formData[`member${num}_org`] || '',
          department: formData[`member${num}_dept`] || '',
          degree: formData[`member${num}_degree`] || '',
          role: num === 1 ? 'Leader' : 'Participant'
        });
      }

      // 2. Generate a non-guessable cryptographically random filename
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      // 3. Upload the receipt to the private 'receipts' bucket
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('receipts')
        .upload(fileName, paymentProof);
        
      if (uploadError) {
        throw new Error(`Receipt upload failed: ${uploadError.message}`);
      }
      
      const receiptUrl = uploadData.path;

      // 4. Call the RPC to register team and members atomically
      const { data, error } = await supabase.rpc('register_team', {
        p_team_name: formData.teamName || '',
        p_receipt_url: receiptUrl,
        p_members: members
      });
        
      if (error) {
        // Attempt compensating cleanup for the orphaned receipt
        try {
          const { error: cleanupError } = await supabase.storage.from('receipts').remove([receiptUrl]);
          if (cleanupError) {
            console.log(`[SAFE DIAGNOSTIC] Storage cleanup failed for ${receiptUrl}: [${cleanupError.code || 'UNKNOWN'}]`);
          }
        } catch (cleanupErr) {
          console.log(`[SAFE DIAGNOSTIC] Storage cleanup exception for ${receiptUrl}: [${cleanupErr.message || 'UNKNOWN'}]`);
        }

        // If it's a capacity closed error from the DB
        if (error.message && (error.message.toLowerCase().includes('maximum capacity') || error.message.toLowerCase().includes('closed'))) {
          setRegStatus(prev => ({ ...prev, isClosed: true, count: 35 }));
          throw new Error("Registrations are now closed. The maximum capacity of 35 teams has been reached.");
        }

        // If it's a unique constraint error from the DB, show a friendly message
        if (error.message && error.message.includes('already taken')) {
          throw new Error(error.message);
        }
        throw new Error(`Registration failed: ${error.message}`);
      }
      
      // 5. Success! Attempt EmailJS notification silently
      try {
        if (window.VELTRAXX_EMAILJS && window.emailjs) {
          const { SERVICE_ID, TEMPLATE_ID } = window.VELTRAXX_EMAILJS;
          
          // Convert the paymentProof file to base64 for email attachment
          const getBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
          
          const base64Receipt = paymentProof ? await getBase64(paymentProof) : '';

          const templateParams = {
            team_name: formData.teamName || '',
            registration_id: data ? data.toString() : 'N/A', // Using returned team ID if available
            registration_time: new Date().toLocaleString(),
            payment_status: 'Receipt Uploaded',
            receipt_url: receiptUrl,
            receipt_attachment: base64Receipt, // Base64 data for attachment
            member1_name: formData.member1_name || '',
            member1_email: formData.member1_email || '',
            member1_phone: formData.member1_phone || '',
            member2_name: formData.member2_name || '',
            member2_email: formData.member2_email || '',
            member2_phone: formData.member2_phone || '',
            member3_name: formData.member3_name || '',
            member3_email: formData.member3_email || '',
            member3_phone: formData.member3_phone || '',
            member4_name: formData.member4_name || '',
            member4_email: formData.member4_email || '',
            member4_phone: formData.member4_phone || ''
          };
          await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        }
      } catch (emailErr) {
        console.log(`[EmailJS] Registration email failed`);
      }
      
      // 6. Final UI Success state
      localStorage.removeItem('hackathon_draft');
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: reduce ? 0 : motionTokens.distance.lg },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : motionTokens.duration.normal, ease: motionTokens.easing.smooth }
  };

  const scaleUp = {
    initial: { opacity: 0, scale: reduce ? 1 : 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: reduce ? 0 : motionTokens.duration.normal, ease: motionTokens.easing.smooth }
  };

  if (isSuccess) {
    return (
      <div className="reg-page">
        <div className="bg-overlay" />
        <div className="register-container">
          <motion.div initial={scaleUp.initial} animate={scaleUp.animate} transition={scaleUp.transition}>
            <GlassCard className="success-card">
               <h1 style={{fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-2px'}}>You're <br/> officially in.</h1>
               <p className="team-id" style={{marginTop: '20px', display: 'inline-block', border: '1px solid var(--accent-cyan)', padding: '10px 24px', borderRadius: '100px', backgroundColor: 'rgba(0, 229, 255, 0.05)'}}>TEAM ID: VLSI-{Math.floor(Math.random() * 9000 + 1000)}</p>
               <div style={{ maxWidth: '450px', margin: '30px auto 0 auto', padding: '20px', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', textAlign: 'left' }}>
                 <strong>What's Next?</strong> Payment verification is underway. You will receive an official confirmation email within <strong>2–3 working days</strong> with next steps.<br/><br/>
                 If you have queries, contact student coordinators:<br/>
                 • Darshan (+91 97513 40838)<br/>
                 • Kavya (+91 94430 65492)
               </div>
               
               <div className="mt-40">
                 <PrimaryButton onClick={() => navigate('/')}>Return Home</PrimaryButton>
               </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  if (regStatus.isClosed && !isSuccess) {
    return (
      <div className="reg-page">
        <div className="bg-overlay" />
        <div className="register-container" style={{ maxWidth: '820px' }}>
          <motion.div initial={scaleUp.initial} animate={scaleUp.animate} transition={scaleUp.transition}>
            <GlassCard className="closed-card-wrapper">
              <div className="closed-eyebrow">
                <span className="closed-dot"></span>
                <span>Capacity Reached · 35 / 35 Teams</span>
              </div>

              <h1 className="closed-heading">
                Registrations<br />Are Officially Closed
              </h1>

              <p className="closed-lead-text">
                Thank you for the extraordinary and overwhelming response from engineering colleges and universities across the nation!
              </p>

              <p className="closed-body-text">
                VELTRAXX'26 was originally scheduled to accept registrations until <strong>25th August 2026</strong>. However, to maintain industry-standard lab infrastructure, ensure dedicated hardware workstations for every team, and provide high-touch mentorship, our competition hall capacity was strictly capped at <strong>35 teams</strong>.
                <br /><br />
                All <strong>35 team slots have now been claimed ahead of schedule</strong>. We sincerely apologize to teams and participants who were unable to register before capacity was reached.
              </p>

              {/* Bento Stats */}
              <div className="closed-bento-grid">
                <div className="closed-stat-card">
                  <div className="closed-stat-num">35 / 35</div>
                  <div className="closed-stat-label">Teams Registered</div>
                </div>
                <div className="closed-stat-card">
                  <div className="closed-stat-num">140</div>
                  <div className="closed-stat-label">Engineers Competing</div>
                </div>
                <div className="closed-stat-card">
                  <div className="closed-stat-num">28–29 AUG</div>
                  <div className="closed-stat-label">24-Hour Hackathon</div>
                </div>
              </div>

              {/* Verified Registrations & Support */}
              <div className="closed-support-box">
                <div className="closed-support-title">
                  <span>📞</span> Submitted Registrations & Inquiries
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                  If you have already submitted your team registration, payment verification is actively underway. For payment receipt questions, verification status, or event details, please contact our student coordinators:
                </p>
                <div className="closed-support-grid">
                  <div className="contact-pill">
                    <span className="contact-name">R.A. Darshan (Student Coordinator)</span>
                    <a href="tel:+919751340838" className="contact-phone">+91 97513 40838</a>
                  </div>
                  <div className="contact-pill">
                    <span className="contact-name">M. Kavya (Student Coordinator)</span>
                    <a href="tel:+919443065492" className="contact-phone">+91 94430 65492</a>
                  </div>
                </div>
              </div>

              <div className="closed-actions-row">
                <PrimaryButton onClick={() => navigate('/')}>
                  Return to Homepage
                </PrimaryButton>
                <button onClick={() => navigate('/rules')} className="btn-secondary-link">
                  View Rules & Schedule
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  if (paymentStep && !isSuccess) {
    return (
      <div className="reg-page">
        <div className="bg-overlay" />
        <div className="register-container">
          <motion.div initial={scaleUp.initial} animate={scaleUp.animate} transition={scaleUp.transition}>
            <GlassCard className="form-section" style={{textAlign: 'center', padding: '60px 30px'}}>
               <h3 style={{fontSize: '1.5rem', marginBottom: '10px', color: 'var(--accent-cyan)'}}>04 COMPLETE PAYMENT</h3>
               <p className="text-secondary-p" style={{marginBottom: '30px', fontSize: '1.1rem'}}>
                 Scan the QR code below to pay <strong>₹1,000</strong>. <br/>
                 <span style={{color: '#ff4d4f', fontSize: '0.9rem', marginTop: '10px', display: 'inline-block'}}>* Registration is only through online mode, no offline payments are accepted.</span>
               </p>
               
               <img 
                 src="/optimized/register_payment_qr.webp" 
                 alt="Payment QR Code" 
                 style={{
                   width: '100%',
                   maxWidth: '250px',
                   height: 'auto',
                   aspectRatio: '1/1',
                   objectFit: 'contain',
                   backgroundColor: '#ffffff',
                   padding: '10px',
                   margin: '0 auto 30px auto', 
                   display: 'block', 
                   borderRadius: '16px', 
                   border: '4px solid rgba(255,255,255,0.1)'
                 }} 
               />
               
               <div style={{ maxWidth: '400px', margin: '0 auto 30px auto', padding: '15px', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', textAlign: 'left' }}>
                 <strong>📩 Verification Notice:</strong> Once you upload your receipt and submit, organizers will verify the transaction. A confirmation email with next-step instructions will be sent within 2–3 working days. If you do not receive it, contact coordinators for assistance.
               </div>

               <div style={{textAlign: 'left', maxWidth: '400px', margin: '0 auto'}}>
                 <label style={{display: 'block', color: 'var(--text-secondary)', marginBottom: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem'}}>UPLOAD PAYMENT SCREENSHOT *</label>
                 <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 2 * 1024 * 1024) {
                        setErrorMsg("Image size must be less than 2MB.");
                        e.target.value = '';
                        setPaymentProof(null);
                      } else {
                        setErrorMsg(null);
                        setPaymentProof(file);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem'
                    }}
                 />
               </div>

               {errorMsg && (
                 <div className="error-message" style={{ color: '#ff4d4f', padding: '10px', marginTop: '20px', border: '1px solid #ff4d4f', borderRadius: '4px', background: 'rgba(255, 77, 79, 0.1)', maxWidth: '400px', margin: '20px auto 0 auto' }}>
                   {errorMsg}
                 </div>
               )}

               <div className="mt-40" style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
                 <button 
                   onClick={() => setPaymentStep(false)} 
                   style={{
                     background: 'transparent', 
                     border: '1px solid var(--text-secondary)', 
                     color: 'var(--text-secondary)', 
                     padding: '16px 32px', 
                     borderRadius: '4px', 
                     cursor: 'pointer', 
                     fontFamily: 'var(--font-display)', 
                     textTransform: 'uppercase',
                     fontSize: '1rem',
                     letterSpacing: '1px'
                   }}
                 >
                   Back
                 </button>
                 <PrimaryButton onClick={handleFinalSubmit} disabled={isSubmitting || !paymentProof}>
                   {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                 </PrimaryButton>
               </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-page">
      <div className="bg-overlay" />
      <div className="register-container">
        <motion.header 
          className="reg-hero" style={{marginTop: '120px'}}
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={fadeUp.transition}
        >
          <h1>Build your team.<br/>Enter the challenge.</h1>
          <div className="info-strip" style={{border: '1px solid rgba(255, 255, 255, 0.15)', display: 'inline-block', padding: '12px 24px', borderRadius: '100px', backdropFilter: 'blur(10px)', color: 'var(--text-primary)'}}>28–29 AUGUST · 24 HOURS · ₹1,000 / TEAM · 4 MEMBERS</div>
        </motion.header>
        
        <form onSubmit={handleProceedToPayment} onInvalid={() => setWasValidated(true)} className={`reg-form ${wasValidated ? 'was-validated' : ''}`}>
          {errorMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-message" style={{ color: '#ff4d4f', padding: '10px', border: '1px solid #ff4d4f', borderRadius: '4px', background: 'rgba(255, 77, 79, 0.1)' }}>
              {errorMsg}
            </motion.div>
          )}

          {regStatus.count === 34 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="urgent-slot-banner"
            >
              <span className="pulse-indicator"></span>
              <div>
                <strong>⚡ FINAL TEAM SLOT REMAINING:</strong> 34 of 35 teams registered. Only <strong>1 spot left</strong> before registrations permanently close!
              </div>
            </motion.div>
          )}
          
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ ...fadeUp.transition, delay: reduce ? 0 : 0.1 }}>
            <GlassCard className="form-section">
              <h3>01 TEAM NAME</h3>
              <input 
                type="text" 
                placeholder="Enter your team name *" 
                required 
                value={formData.teamName || ''}
                onChange={(e) => handleInputChange('teamName', e.target.value)}
              />
            </GlassCard>
          </motion.div>

          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ ...fadeUp.transition, delay: reduce ? 0 : 0.2 }}>
            <GlassCard className="form-section">
              <h3>02 TEAM MEMBERS</h3>
              <p className="autosave-text">
                We auto-save your draft. Your progress won't be lost if you accidentally refresh.
              </p>
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="member-accordion">
                  <button 
                    type="button" 
                    className="accordion-header"
                    onClick={(e) => { e.preventDefault(); setExpandedMember(num); }}
                  >
                    <span>● 0{num} {num === 1 ? 'Team Leader' : 'Member'}</span> 
                    <span>{expandedMember === num ? '↓' : '→'}</span>
                  </button>
                  {expandedMember === num && (
                    <motion.div 
                      className="accordion-body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: reduce ? 0 : motionTokens.duration.fast, ease: motionTokens.easing.sharp }}
                    >
                      <input 
                        type="text" 
                        placeholder="Full Name *" 
                        required 
                        value={formData[`member${num}_name`] || ''}
                        onChange={(e) => handleInputChange(`member${num}_name`, e.target.value)}
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address *" 
                        required 
                        value={formData[`member${num}_email`] || ''}
                        onChange={(e) => handleInputChange(`member${num}_email`, e.target.value)}
                      />
                      <input 
                        type="tel" 
                        placeholder="Mobile Number *" 
                        required 
                        value={formData[`member${num}_phone`] || ''}
                        onChange={(e) => handleInputChange(`member${num}_phone`, e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="College Name / Organization Name *" 
                        required 
                        value={formData[`member${num}_org`] || ''}
                        onChange={(e) => handleInputChange(`member${num}_org`, e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Department *" 
                        required 
                        value={formData[`member${num}_dept`] || ''}
                        onChange={(e) => handleInputChange(`member${num}_dept`, e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Degree (e.g. BE, BTech, MTech) *" 
                        required 
                        value={formData[`member${num}_degree`] || ''}
                        onChange={(e) => handleInputChange(`member${num}_degree`, e.target.value)}
                      />
                    </motion.div>
                  )}
                </div>
              ))}
            </GlassCard>
          </motion.div>

          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={{ ...fadeUp.transition, delay: reduce ? 0 : 0.3 }}>
            <GlassCard className="form-section">
               <h3>03 DECLARATIONS</h3>
               <label className="checkbox-label">
                 <input type="checkbox" required /> 
                 We confirm we have exactly 4 members. Inter-college and mixed teams are permitted.
               </label>
               <label className="checkbox-label">
                 <input type="checkbox" required /> 
                 We agree to the ₹1,000/team fee. (Registration closes 25/08/2026)
               </label>
               <label className="checkbox-label">
                 <input type="checkbox" required /> 
                 We understand the organizers do not provide hardware or EDA licenses.
               </label>
               <label className="checkbox-label">
                 <input type="checkbox" required /> 
                 We have read and understood the rules and logistics of the event.
               </label>
               
               <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                 <strong>ℹ️ Confirmation Email:</strong> Once submitted and payment is verified, the organizers will send a confirmation email with hackathon guidelines to all registered team members within 2–3 working days.
               </div>
               
               <div className="payment-summary">
                 <p>Registration: ₹1,000</p>
                 <PrimaryButton type="submit" disabled={isSubmitting}>
                   {isSubmitting ? 'Processing...' : 'Pay ₹1,000 & Register'}
                 </PrimaryButton>
               </div>
            </GlassCard>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
