import React, { useState } from 'react';
import { RAEV_BIKE_DATA } from '../data/bikeData';
import { Cpu, Search, Check, Info } from 'lucide-react';

export default function SpecMatrix() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...RAEV_BIKE_DATA.specs.map(s => s.category)];

  const filteredSpecs = RAEV_BIKE_DATA.specs.map(cat => {
    if (selectedCategory !== 'All' && cat.category !== selectedCategory) {
      return null;
    }
    const matchingItems = cat.items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchingItems.length === 0) return null;
    return { ...cat, items: matchingItems };
  }).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Filter Controls */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Complete Master Specification Matrix</h2>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Comprehensive technical data for RAEV Bullet GT V2 (Metallic Green Edition).</p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search specs, parts, dimensions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '10px 12px 10px 38px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
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

      {/* Specifications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredSpecs.map((catGroup, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
              paddingBottom: '12px',
              marginBottom: '16px'
            }}>
              <Cpu size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6' }}>{catGroup.category}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {catGroup.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', textAlign: 'right' }}>{item.value}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Info size={12} color="#4b5563" /> {item.details}
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
