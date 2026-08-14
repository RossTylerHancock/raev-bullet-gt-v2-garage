import React, { useState } from 'react';
import Header from './components/Header';
import GarageOverview from './components/GarageOverview';
import SpecMatrix from './components/SpecMatrix';
import PTuner from './components/PTuner';
import ModTracker from './components/ModTracker';
import TeardownView from './components/TeardownView';
import CommunityMods from './components/CommunityMods';
import DiagnosticTool from './components/DiagnosticTool';
import AIResearchAssistant from './components/AIResearchAssistant';
import PartsCatalog from './components/PartsCatalog';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [unlockedMode, setUnlockedMode] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unlockedMode={unlockedMode}
        setUnlockedMode={setUnlockedMode}
      />

      {/* Main App Workspace */}
      <main style={{
        maxWidth: '1300px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px 60px 24px',
        flex: 1
      }}>
        {activeTab === 'overview' && (
          <GarageOverview 
            unlockedMode={unlockedMode} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'specs' && (
          <SpecMatrix />
        )}

        {activeTab === 'ptuner' && (
          <PTuner 
            unlockedMode={unlockedMode} 
            setUnlockedMode={setUnlockedMode} 
          />
        )}

        {activeTab === 'mods' && (
          <ModTracker />
        )}

        {activeTab === 'teardown' && (
          <TeardownView />
        )}

        {activeTab === 'community-mods' && (
          <CommunityMods />
        )}

        {activeTab === 'parts-catalog' && (
          <PartsCatalog />
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticTool />
        )}

        {activeTab === 'ai-research' && (
          <AIResearchAssistant />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(3, 9, 8, 0.95)',
        borderTop: '1px solid rgba(16, 185, 129, 0.2)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#6b7280'
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <strong style={{ color: '#10b981' }}>RAEV BULLET GT V2 GARAGE & KNOWLEDGE BASE</strong> — Metallic Green Edition
          </div>
          <p>RAEV Bullet GT V2 Custom Garage & Teardown Base • Built for Ross • Powered by 52V 20Ah Samsung 21700-50E Battery Telemetry</p>
        </div>
      </footer>
    </div>
  );
}
