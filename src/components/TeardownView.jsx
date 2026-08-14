import React, { useState } from 'react';
import { RAEV_BIKE_DATA } from '../data/bikeData';
import { Cpu, Zap, Shield, Wrench, BatteryCharging, Info, Layers } from 'lucide-react';

export default function TeardownView() {
  const [activeSubTab, setActiveSubTab] = useState('wiring');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.15)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(6, 182, 212, 0.4)'
          }}>
            <Layers size={26} color="#38bdf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Master Hardware Teardown, Electrical Voltage Map & Component Matrix</h2>
            <p style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Granular technical reference for customizing, rewiring, and upgrading your RAEV Bullet GT V2.</p>
          </div>
        </div>

        {/* Sub Navigation Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {[
            { key: 'wiring', label: '⚡ Electrical Voltage & Harness Map' },
            { key: 'battery', label: '🔋 Battery Internal Cell Architecture' },
            { key: 'motor', label: '⚙️ Motor BLDC Teardown' },
            { key: 'display', label: '🖥️ Upgraded Color Display Teardown' },
            { key: 'fasteners', label: '🔧 Master Bolt & Fastener Sizes' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: activeSubTab === tab.key ? 'linear-gradient(135deg, #06b6d4, #047857)' : 'rgba(255, 255, 255, 0.05)',
                border: activeSubTab === tab.key ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                color: activeSubTab === tab.key ? '#ffffff' : '#9ca3af',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subtab Content 1: Wiring Map */}
      {activeSubTab === 'wiring' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', marginBottom: '16px' }}>
            Comprehensive Harness, Connector & Operating Voltage Map
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {RAEV_BIKE_DATA.wireMap.map((wire, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>{wire.harness}</h4>
                  <span className="badge badge-cyan">{wire.connector}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.82rem', marginTop: '4px' }}>
                  <div>
                    <span style={{ color: '#9ca3af', fontWeight: 600 }}>Wire Gauge: </span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>{wire.gauge}</span>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af', fontWeight: 600 }}>Operating Voltage: </span>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>{wire.voltage}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#d1d5db' }}>
                  <strong>Pinout & Color Coding: </strong>{wire.colors}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                  <strong>Circuit Function: </strong>{wire.function}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab Content 2: Battery Architecture */}
      {activeSubTab === 'battery' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', marginBottom: '12px' }}>
              Main Down-Tube Battery (52V 20Ah / 1,040 Wh)
            </h3>
            <ul style={{ fontSize: '0.85rem', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '18px' }}>
              <li><strong>Cell Architecture:</strong> 14S4P (14 Series x 4 Parallel = 56 Total Cells)</li>
              <li><strong>Cell Type:</strong> Samsung 21700-50E Lithium-Ion (3.7V, 5,000 mAh per cell)</li>
              <li><strong>Spot Welding Interconnects:</strong> 0.2mm pure nickel strips with 6-point matrix micro-welds</li>
              <li><strong>Smart BMS:</strong> 52V (14S) 35A Continuous / 70A Peak BMS with cell balancing & dual NTC temperature sensors (&gt;65°C cutoff)</li>
              <li><strong>Cutoff Thresholds:</strong> Over-charge (58.8V) / Over-discharge (41.5V)</li>
              <li><strong>Position:</strong> Mounted on main diagonal down tube</li>
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginBottom: '12px' }}>
              Secondary Lower Battery (52V 8Ah / 416 Wh)
            </h3>
            <ul style={{ fontSize: '0.85rem', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '18px' }}>
              <li><strong>Position / Placement:</strong> Mounted directly **BELOW the main down-tube battery**</li>
              <li><strong>Cell Architecture:</strong> 14S2P (14 Series x 2 Parallel = 28 Total Cells)</li>
              <li><strong>Cell Type:</strong> Samsung 21700 High-Discharge Cells</li>
              <li><strong>Smart BMS:</strong> 52V (14S) 20A Continuous BMS</li>
              <li><strong>Total System Energy:</strong> Combined 52V 28Ah (**1,456 Wh Total Capacity**)</li>
            </ul>
          </div>

        </div>
      )}

      {/* Subtab Content 3: Motor Teardown */}
      {activeSubTab === 'motor' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399', marginBottom: '14px' }}>
            52V High-Torque Brushless DC Hub Motor Internal Teardown
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '16px' }}>
            100% Brushless Motor Design (BLDC - No mechanical carbon brushes to wear out).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Stator Core Stack:</strong>
              <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '4px' }}>{RAEV_BIKE_DATA.motorInternalArchitecture.statorCore}</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Copper Windings:</strong>
              <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '4px' }}>{RAEV_BIKE_DATA.motorInternalArchitecture.windings}</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Rotor Magnets:</strong>
              <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '4px' }}>{RAEV_BIKE_DATA.motorInternalArchitecture.magnets}</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Hall Effect Sensors:</strong>
              <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '4px' }}>{RAEV_BIKE_DATA.motorInternalArchitecture.hallSensors}</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Sealed Bearings:</strong>
              <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '4px' }}>{RAEV_BIKE_DATA.motorInternalArchitecture.bearings}</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Axle Shaft:</strong>
              <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '4px' }}>{RAEV_BIKE_DATA.motorInternalArchitecture.axle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab Content 4: Upgraded Display */}
      {activeSubTab === 'display' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Cpu size={22} color="#fbbf24" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24' }}>
              Official RAEV Upgraded Full-Color IPS LCD Display
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Display Matrix:</span>
              <div style={{ fontWeight: 700, color: '#ffffff' }}>3.5" High-Contrast Full-Color IPS Screen</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Waterproof Harness:</span>
              <div style={{ fontWeight: 700, color: '#34d399' }}>5-Pin Female Julet Green Connector</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Operating Voltage:</span>
              <div style={{ fontWeight: 700, color: '#fbbf24' }}>52V DC Input (Supports 24V-60V)</div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '8px' }}>Telemetry Features & Display Capabilities:</h4>
          <ul style={{ fontSize: '0.85rem', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '18px' }}>
            {RAEV_BIKE_DATA.upgradedDisplay.features.map((feat, fIdx) => (
              <li key={fIdx}>{feat}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Subtab Content 5: Fasteners */}
      {activeSubTab === 'fasteners' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399', marginBottom: '16px' }}>
            Master Hardware Fastener & Torque Reference Table
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
                  <th style={{ padding: '10px' }}>Component Location</th>
                  <th style={{ padding: '10px' }}>Bolt / Nut Size</th>
                  <th style={{ padding: '10px' }}>Thread Type</th>
                  <th style={{ padding: '10px' }}>Tool Required</th>
                  <th style={{ padding: '10px' }}>Torque Spec</th>
                </tr>
              </thead>
              <tbody>
                {RAEV_BIKE_DATA.boltSizes.map((bolt, bIdx) => (
                  <tr key={bIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#d1d5db' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{bolt.component}</td>
                    <td style={{ padding: '10px', color: '#38bdf8' }}>{bolt.size}</td>
                    <td style={{ padding: '10px' }}>{bolt.thread}</td>
                    <td style={{ padding: '10px' }}>{bolt.tool}</td>
                    <td style={{ padding: '10px', color: '#fbbf24', fontWeight: 700 }}>{bolt.torque}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
