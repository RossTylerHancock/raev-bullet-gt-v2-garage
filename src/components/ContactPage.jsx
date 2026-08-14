import React, { useState } from 'react';
import { Mail, Send, Copy, Check, MessageSquare, User, AtSign, HelpCircle, Sparkles, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Custom Mod Advice',
    subject: '',
    message: ''
  });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailAddress = 'rosstylerhancock@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const mailtoSubject = encodeURIComponent(`[RAEV Garage] ${formData.category}: ${formData.subject || 'General Inquiry'}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:${emailAddress}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 78, 59, 0.25))', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.5)'
          }}>
            <Mail size={30} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f3f4f6' }}>Contact Ross</h2>
              <span className="badge badge-emerald">DIRECT MESSAGING</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.92rem', marginTop: '4px' }}>
              Have questions regarding the RAEV Bullet GT V2, custom 52V dual battery setups, controller tuning, or part compatibility? Reach out directly!
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Direct Email & Details Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AtSign size={20} /> Direct Contact Information
            </h3>
            
            <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>
              For general inquiries, technical garage questions, or community mod contributions, feel free to send an email directly to Ross Hancock.
            </p>

            <div style={{
              background: 'rgba(3, 9, 8, 0.7)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Email</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399', wordBreak: 'break-all' }}>
                  {emailAddress}
                </div>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: `1px solid ${copied ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
                  color: copied ? '#34d399' : '#f3f4f6',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <a
              href={`mailto:${emailAddress}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Mail size={18} /> Open in Default Mail App
            </a>
          </div>

          {/* Response Time & Guarantee */}
          <div className="card" style={{ background: 'rgba(5, 14, 12, 0.6)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#34d399" /> Response Time & Guidelines
            </h4>
            <ul style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.6', paddingLeft: '18px' }}>
              <li style={{ marginBottom: '6px' }}>Direct emails are typically answered within 24-48 hours.</li>
              <li style={{ marginBottom: '6px' }}>Include details about your bike build, error codes (E06-E12), or P-settings for faster support.</li>
              <li>Community mod submissions with photos/links are welcomed for inclusion in the Garage knowledge base.</li>
            </ul>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="#10b981" /> Send a Direct Message
          </h3>

          {submitted && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#34d399',
              fontSize: '0.9rem'
            }}>
              <Sparkles size={22} color="#34d399" style={{ flexShrink: 0 }} />
              <div>
                <strong>Message Formatted!</strong> Your message has been prepared for <code>{emailAddress}</code> in your mail composer. If your email app did not launch, click the "Open in Default Mail App" button on the left.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Miller"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    background: 'rgba(3, 9, 8, 0.8)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#f3f4f6',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Your Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <AtSign size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    background: 'rgba(3, 9, 8, 0.8)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#f3f4f6',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Inquiry Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(3, 9, 8, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#f3f4f6',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="Custom Mod Advice">Custom Mod Advice</option>
                <option value="P-Settings & Tuning">P-Settings & Controller Tuning</option>
                <option value="Parts & Compatibility">Verified Parts & Compatibility</option>
                <option value="Community Mod Submission">Submit a Community Mod</option>
                <option value="General Question">General Question / Feedback</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Question about 52V battery discharge balance"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(3, 9, 8, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#f3f4f6',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '6px' }}>
                Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="Type your message or question here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(3, 9, 8, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#f3f4f6',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                marginTop: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={18} /> Send Email Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
