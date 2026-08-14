import React, { useState } from 'react';
import { RAEV_BIKE_DATA } from '../data/bikeData';
import { ShieldAlert, Search, CheckSquare, Wrench, AlertTriangle, LifeBuoy, ArrowRight } from 'lucide-react';

export default function DiagnosticTool() {
  const [selectedCode, setSelectedCode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedSteps, setCheckedSteps] = useState({});

  const toggleCheck = (stepIdx) => {
    setCheckedSteps(prev => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const filteredErrors = RAEV_BIKE_DATA.errorCodes.filter(err => 
    err.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    err.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    err.cause.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeError = selectedCode || RAEV_BIKE_DATA.errorCodes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.4)'
          }}>
            <ShieldAlert size={26} color="#ef4444" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Diagnostic Error Code Center & Wire Inspection</h2>
            <p style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Troubleshoot electrical telemetry faults, hall sensor disconnections, and motor cutoffs.</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginTop: '16px' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search error codes (e.g. E07, Motor, Voltage)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '10px 12px 10px 38px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Main Grid: Code Selector + Step-by-Step Diagnostic */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Error Code Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredErrors.map((err) => (
            <div
              key={err.code}
              className="glass-card"
              onClick={() => setSelectedCode(err)}
              style={{
                padding: '18px',
                cursor: 'pointer',
                border: activeError.code === err.code ? '1px solid #ef4444' : '1px solid rgba(16, 185, 129, 0.2)',
                background: activeError.code === err.code ? 'rgba(239, 68, 68, 0.12)' : 'rgba(10, 29, 24, 0.75)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  {err.code}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>RAEV System Code</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6' }}>{err.title}</h4>
              <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>{err.cause}</p>
            </div>
          ))}
        </div>

        {/* Right Column: Detailed Diagnostic Checklist */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <AlertTriangle size={22} color="#f87171" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>
                {activeError.code}: {activeError.title}
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#d1d5db' }}>{activeError.cause}</p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#34d399' }}>Recommended Solution Protocol:</h4>
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: '#e5e7eb'
            }}>
              {activeError.solution}
            </div>
          </div>

          {/* Interactive Inspection Checklist */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: '#f3f4f6' }}>Physical Wire Inspection Checklist:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                "Turn off bike & disconnect 52V 20Ah frame battery terminal.",
                "Locate the primary 9-pin motor connector on rear right chainstay.",
                "Ensure connector arrows line up strictly and pushed completely tight.",
                "Inspect handlebar harness connections behind headlight for bent pins.",
                "Reinstall battery packs & perform hard restart by holding power for 3s."
              ].map((step, idx) => (
                <label 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.82rem',
                    color: checkedSteps[idx] ? '#9ca3af' : '#d1d5db',
                    textDecoration: checkedSteps[idx] ? 'line-through' : 'none',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '10px 12px',
                    borderRadius: '8px'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={!!checkedSteps[idx]}
                    onChange={() => toggleCheck(idx)}
                    style={{ accentColor: '#10b981' }}
                  />
                  <span>{step}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
