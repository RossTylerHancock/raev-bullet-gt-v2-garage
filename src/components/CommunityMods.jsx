import React, { useState } from 'react';
import { RAEV_BIKE_DATA } from '../data/bikeData';
import { Wrench, Shield, Compass, Sparkles, Check, Info, ArrowRight, ExternalLink } from 'lucide-react';

export default function CommunityMods() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...RAEV_BIKE_DATA.communityMods.map(c => c.component)];

  const filteredMods = RAEV_BIKE_DATA.communityMods.filter(c => 
    selectedCategory === 'All' || c.component === selectedCategory
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <Compass size={26} color="#34d399" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Community Verified Modification & Replacement Parts Database</h2>
            <p style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Deep research aggregated from Reddit, YouTube, Facebook RAEV Groups, and e-bike forums.</p>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: selectedCategory === cat ? 'linear-gradient(135deg, #10b981, #047857)' : 'rgba(255, 255, 255, 0.05)',
                border: selectedCategory === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedCategory === cat ? '#ffffff' : '#9ca3af',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Modification Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredMods.map((sec, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>{sec.component}</h3>
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Factory Spec: {sec.stockSpec}</span>
              </div>
              <span className="badge badge-emerald">COMMUNITY TESTED</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {sec.topPicks.map((pick, pIdx) => (
                <div
                  key={pIdx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6' }}>{pick.name}</h4>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{pick.type}</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, marginBottom: '8px' }}>
                      {pick.compatibility}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5 }}>
                      {pick.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
