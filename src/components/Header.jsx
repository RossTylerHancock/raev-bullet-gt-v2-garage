import React from 'react';
import { Zap, BatteryCharging, ShieldAlert, Cpu, Wrench, Search, Sparkles, Compass, Layers, Mail } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, unlockedMode, setUnlockedMode }) {
  return (
    <header style={{
      background: 'rgba(5, 14, 12, 0.9)',
      borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
          }}>
            <Zap size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.05em', color: '#f3f4f6' }}>
                RAEV BULLET GT <span style={{ color: '#10b981' }}>V2</span>
              </h1>
              <span className="badge badge-emerald">METALLIC GREEN</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>52V 28Ah Dual Battery System (Main + Lower Battery)</span>
              <span>•</span>
              <span style={{ color: unlockedMode ? '#f59e0b' : '#34d399', fontWeight: 600 }}>
                {unlockedMode ? '⚡ Off-Road Unlocked (32-35 MPH)' : '🔒 Class 2 / 3 Factory Spec'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setUnlockedMode(!unlockedMode)}
            style={{
              background: unlockedMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${unlockedMode ? '#f59e0b' : '#10b981'}`,
              color: unlockedMode ? '#fbbf24' : '#34d399',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Cpu size={16} />
            {unlockedMode ? 'UNLOCKED P08 (35 MPH)' : 'CLASS 2 LEGAL (20 MPH)'}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '6px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <BatteryCharging size={18} color="#34d399" />
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700, color: '#f3f4f6' }}>1,456 Wh Total</div>
              <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>52V 20Ah + 8Ah Dual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto'
      }}>
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Zap size={16} /> Garage Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          <Cpu size={16} /> Technical Specs
        </button>
        <button 
          className={`nav-tab ${activeTab === 'ptuner' ? 'active' : ''}`}
          onClick={() => setActiveTab('ptuner')}
        >
          <Cpu size={16} /> LCD P-Settings
        </button>
        <button 
          className={`nav-tab ${activeTab === 'mods' ? 'active' : ''}`}
          onClick={() => setActiveTab('mods')}
        >
          <Wrench size={16} /> Modifications Garage
        </button>
        <button 
          className={`nav-tab ${activeTab === 'teardown' ? 'active' : ''}`}
          onClick={() => setActiveTab('teardown')}
        >
          <Layers size={16} color="#38bdf8" /> Wiring & Teardown Map
        </button>
        <button 
          className={`nav-tab ${activeTab === 'community-mods' ? 'active' : ''}`}
          onClick={() => setActiveTab('community-mods')}
        >
          <Compass size={16} color="#fbbf24" /> Community Mods & Research
        </button>
        <button 
          className={`nav-tab ${activeTab === 'parts-catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('parts-catalog')}
        >
          <Wrench size={16} color="#34d399" /> Verified Parts Catalog
        </button>
        <button 
          className={`nav-tab ${activeTab === 'diagnostics' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagnostics')}
        >
          <ShieldAlert size={16} color="#f87171" /> Diagnostics (E06-E12)
        </button>
        <button 
          className={`nav-tab ${activeTab === 'ai-research' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-research')}
        >
          <Sparkles size={16} color="#34d399" /> AI Bike Researcher
        </button>
        <button 
          className={`nav-tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Mail size={16} color="#10b981" /> Contact Ross
        </button>
      </div>
    </header>
  );
}
