import React, { useState } from 'react';
import { RAEV_BIKE_DATA } from '../data/bikeData';
import { Cpu, Zap, Sliders, ShieldAlert, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PTuner({ unlockedMode, setUnlockedMode }) {
  const [settings, setSettings] = useState(() => {
    const initial = {};
    RAEV_BIKE_DATA.pSettings.forEach(p => {
      initial[p.code] = p.default;
    });
    if (unlockedMode) initial['P08'] = '100';
    return initial;
  });

  const [activePreset, setActivePreset] = useState(unlockedMode ? 'unlocked' : 'class2');

  const handlePresetSelect = (presetKey) => {
    setActivePreset(presetKey);
    const updated = { ...settings };

    if (presetKey === 'class2') {
      updated['P08'] = '32 km/h (20 MPH)';
      updated['P12'] = '3';
      updated['P14'] = '30A';
      setUnlockedMode(false);
    } else if (presetKey === 'class3') {
      updated['P08'] = '45 km/h (28 MPH)';
      updated['P12'] = '4';
      updated['P14'] = '30A';
      setUnlockedMode(false);
    } else if (presetKey === 'unlocked') {
      updated['P08'] = '100 (35+ MPH Unlocked)';
      updated['P12'] = '5 (Max Punch)';
      updated['P14'] = '30A';
      setUnlockedMode(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else if (presetKey === 'eco') {
      updated['P08'] = '25 km/h (15 MPH)';
      updated['P12'] = '1 (Soft Start)';
      updated['P14'] = '20A (Eco Range)';
      setUnlockedMode(false);
    }
    setSettings(updated);
  };

  const handleValueChange = (code, val) => {
    setSettings(prev => ({ ...prev, [code]: val }));
    if (code === 'P08') {
      if (val.includes('100') || Number(val) > 45) {
        setUnlockedMode(true);
      } else {
        setUnlockedMode(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header & Instructions Card */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <Sliders size={26} color="#34d399" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>2.2" LCD Display P-Setting Parameter Tuner</h2>
            <p style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Configure display parameters to unlock maximum speed, adjust acceleration torque, and set battery low-voltage cutoffs.</p>
          </div>
        </div>

        {/* Access Instructions Alert Box */}
        <div style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <Cpu size={22} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem', marginBottom: '4px' }}>
              How to Access P-Settings Menu on Physical Bike:
            </div>
            <ol style={{ fontSize: '0.82rem', color: '#d1d5db', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Turn on bike display by holding <strong>POWER</strong> for 2 seconds.</li>
              <li>Press and hold <strong>UP (+)</strong> and <strong>DOWN (-)</strong> buttons simultaneously for 3 seconds until <code>P01</code> is displayed.</li>
              <li>Use <strong>UP / DOWN</strong> to adjust parameter values, and tap <strong>POWER</strong> to move to the next P-code.</li>
              <li>Hold <strong>POWER</strong> for 3 seconds to save settings and exit.</li>
            </ol>
          </div>
        </div>

        {/* Video Tutorial Embed Section */}
        <div style={{
          marginTop: '20px',
          background: 'rgba(5, 14, 12, 0.8)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#ef4444', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f3f4f6' }}>Video Guide: Unlock RAEV Bullet GT Top Speed (28-35 MPH)</h4>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Step-by-step video tutorial demonstrating controller P08 speed limit removal.</p>
              </div>
            </div>

            <a 
              href="https://www.youtube.com/watch?v=_i-d3wGp6AQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', borderColor: '#ef4444', color: '#f87171' }}
            >
              Watch on YouTube ↗
            </a>
          </div>

          <div style={{
            position: 'relative',
            paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
            height: 0,
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
          }}>
            <iframe
              src="https://www.youtube.com/embed/_i-d3wGp6AQ"
              title="RAEV Bullet GT - Unlock Top Speed 28+ MPH Video Tutorial"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Preset Tuning Buttons */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: '#f3f4f6' }}>Quick Performance Presets</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          
          <button
            onClick={() => handlePresetSelect('class2')}
            style={{
              background: activePreset === 'class2' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${activePreset === 'class2' ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.95rem' }}>Class 2 Street Legal</div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>20 MPH Top Speed • Balanced Throttle & PAS</div>
          </button>

          <button
            onClick={() => handlePresetSelect('class3')}
            style={{
              background: activePreset === 'class3' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${activePreset === 'class3' ? '#06b6d4' : 'rgba(255, 255, 255, 0.1)'}`,
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem' }}>Class 3 Commuter</div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>28 MPH Pedal Assist • Faster Acceleration</div>
          </button>

          <button
            onClick={() => handlePresetSelect('unlocked')}
            style={{
              background: activePreset === 'unlocked' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${activePreset === 'unlocked' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.95rem' }}>⚡ Off-Road Unlocked</div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>35+ MPH Max Speed • 1500W Launch Punch</div>
          </button>

          <button
            onClick={() => handlePresetSelect('eco')}
            style={{
              background: activePreset === 'eco' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${activePreset === 'eco' ? '#a855f7' : 'rgba(255, 255, 255, 0.1)'}`,
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.95rem' }}>Eco Max Range</div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>15 MPH Limit • Soft Current Saver</div>
          </button>
        </div>
      </div>

      {/* P-Settings Detailed Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {RAEV_BIKE_DATA.pSettings.map((p) => (
          <div 
            key={p.code}
            className="glass-card"
            style={{
              padding: '20px',
              border: p.code === 'P08' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(16, 185, 129, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge ${p.code === 'P08' ? 'badge-gold' : 'badge-emerald'}`}>{p.code}</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f3f4f6' }}>{p.name}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '14px' }}>{p.description}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.3)', padding: '10px 14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Range: {p.range}</span>
              <input 
                type="text"
                value={settings[p.code] || p.default}
                onChange={(e) => handleValueChange(p.code, e.target.value)}
                style={{
                  width: '120px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textAlign: 'right',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
