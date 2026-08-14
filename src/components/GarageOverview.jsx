import React, { useState } from 'react';
import { RAEV_BIKE_DATA } from '../data/bikeData';
import { Zap, Gauge, Battery, ShieldCheck, Compass, ArrowRight, Download, Sliders, CheckCircle2 } from 'lucide-react';

export default function GarageOverview({ unlockedMode, setActiveTab }) {
  const [riderWeight, setRiderWeight] = useState(175);
  const [pasLevel, setPasLevel] = useState(1);
  const [terrain, setTerrain] = useState('flat'); // flat, rolling, steep

  // Calculate dynamic range based on telemetry factors
  const calculateEstimatedRange = () => {
    let baseWhPerMile = 14; // Default PAS 1 flat terrain
    if (pasLevel === 0) baseWhPerMile = 20; // Throttle only (PAS 0)
    if (pasLevel === 1) baseWhPerMile = 14; // PAS 1 Eco
    if (pasLevel === 2) baseWhPerMile = 22; // PAS 2 Mid
    if (pasLevel === 3) baseWhPerMile = 32; // PAS 3 High/Sport

    // Terrain modifier
    if (terrain === 'rolling') baseWhPerMile *= 1.2;
    if (terrain === 'steep') baseWhPerMile *= 1.45;

    // Weight modifier (baseline 175 lbs)
    const weightFactor = 1 + (riderWeight - 175) * 0.002;
    baseWhPerMile *= weightFactor;

    // Speed unlock modifier
    if (unlockedMode && pasLevel === 3) baseWhPerMile *= 1.15;

    const totalRange = Math.round(RAEV_BIKE_DATA.batteries.systemTotalWh / baseWhPerMile);
    return Math.max(25, Math.min(115, totalRange));
  };

  const estimatedRange = calculateEstimatedRange();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Showcase Section */}
      <div className="glass-card" style={{ padding: '32px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          
          {/* Left Column: Visual Showcase */}
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <span className="badge badge-emerald">52V 28Ah DUAL BATTERY SYSTEM</span>
              <span className="badge badge-gold">METALLIC GREEN EDITION</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
              RAEV Bullet GT <span style={{ color: '#10b981' }}>V2</span>
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '1.05rem', marginBottom: '24px' }}>
              The ultimate dual-battery retro scrambler. Features a 1500W peak rear hub motor, 52V 30A controller, 4-piston hydraulic brakes, and a 1,456 Wh Dual Battery energy bank (52V 20Ah main down-tube pack + 52V 8Ah secondary pack mounted directly underneath).
            </p>

            {/* Quick Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600 }}>PEAK POWER</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>1500 Watts</div>
                <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>750W Nominal / 52V 30A</div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600 }}>TOTAL CAPACITY</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>1,456 Wh</div>
                <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>52V 20Ah + 8Ah Dual</div>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600 }}>TOP SPEED</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                  {unlockedMode ? '35+ MPH' : '28 MPH'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>{unlockedMode ? 'Off-Road Unlocked' : 'Class 3 PAS'}</div>
              </div>

              <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600 }}>MAX PAYLOAD</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc' }}>330 LBS</div>
                <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>Rider + Accessories</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => setActiveTab('ptuner')}>
                <Sliders size={18} /> Tune LCD P-Settings
              </button>
              <button className="btn-secondary" onClick={() => setActiveTab('ai-research')}>
                Ask AI Researcher <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: High Quality Photo Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
            }}>
              <img 
                src="/raev_green_side.png" 
                alt="RAEV Bullet GT V2 Metallic Green Ebike" 
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(5, 14, 12, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#34d399'
              }}>
                Official RAEV Bullet GT V2 Metallic Green Profile
              </div>
            </div>

            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              maxHeight: '220px'
            }}>
              <img 
                src="/raev_cockpit.png" 
                alt="Upgraded RAEV 3.5 inch Full Color IPS LCD Display Cockpit" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(5, 14, 12, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#fbbf24'
              }}>
                Upgraded 3.5" Full-Color IPS LCD Telemetry Display
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Range Estimator & Telemetry Calculator */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Gauge size={24} color="#10b981" />
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Interactive Battery & Range Telemetry Estimator</h3>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Simulate riding distance based on rider payload, pedal assist level, terrain gradient, and unlocked speed modes.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>Rider Payload Weight:</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>{riderWeight} LBS</span>
              </div>
              <input 
                type="range" 
                min="120" 
                max="330" 
                value={riderWeight} 
                onChange={(e) => setRiderWeight(Number(e.target.value))}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>Pedal Assist (PAS Level):</span>
                <span style={{ fontWeight: 700, color: '#fbbf24' }}>
                  {pasLevel === 0 ? 'Throttle Only (PAS 0)' : `PAS Level ${pasLevel}`}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setPasLevel(lvl)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: pasLevel === lvl ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                      color: pasLevel === lvl ? '#ffffff' : '#9ca3af',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {lvl === 0 ? 'PAS 0 (Throttle)' : `PAS ${lvl}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '8px', fontSize: '0.9rem' }}>Terrain Profile:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { key: 'flat', label: 'Flat City' },
                  { key: 'rolling', label: 'Rolling Hills' },
                  { key: 'steep', label: 'Steep Trails' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTerrain(item.key)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      background: terrain === item.key ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: terrain === item.key ? '#38bdf8' : '#9ca3af',
                      border: `1px solid ${terrain === item.key ? '#06b6d4' : 'rgba(255, 255, 255, 0.1)'}`,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Visual Display */}
          <div style={{
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.12) 0%, rgba(5, 14, 12, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>ESTIMATED BATTERY RANGE</div>
            <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }} className="glow-emerald">
              ~{estimatedRange} <span style={{ fontSize: '1.4rem' }}>MILES</span>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#6b7280' }}>
              Based on 1,040 Wh capacity (52V 20Ah Samsung 21700-50E cells)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
