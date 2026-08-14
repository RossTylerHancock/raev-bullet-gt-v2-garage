import React, { useState, useEffect } from 'react';
import { RAEV_BIKE_DATA } from '../data/bikeData';
import { Wrench, Plus, Trash2, Tag, Calendar, DollarSign, Scale, CheckCircle } from 'lucide-react';

export default function ModTracker() {
  const [mods, setMods] = useState(() => {
    const saved = localStorage.getItem('raev_bullet_gt_v2_mods');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return RAEV_BIKE_DATA.presetMods;
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Accessories');
  const [cost, setCost] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('raev_bullet_gt_v2_mods', JSON.stringify(mods));
  }, [mods]);

  const handleAddMod = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMod = {
      id: `mod-${Date.now()}`,
      title: title.trim(),
      category,
      cost: cost ? parseFloat(cost) : 0,
      weight: weight ? `${weight} lbs` : '0 lbs',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active',
      notes: notes.trim() || 'Custom modification'
    };

    setMods([newMod, ...mods]);
    setTitle('');
    setCost('');
    setWeight('');
    setNotes('');
  };

  const handleDeleteMod = (id) => {
    setMods(mods.filter(m => m.id !== id));
  };

  const totalCost = mods.reduce((acc, m) => acc + (parseFloat(m.cost) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header & Stats Banner */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Wrench size={24} color="#10b981" />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Custom Modifications & Parts Garage</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Log aftermarket upgrades, calculate total accessory costs, and track weight deltas.</p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>TOTAL MOD INVESTMENT</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>${totalCost.toFixed(2)}</div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>TOTAL LOGGED MODS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>{mods.length} Parts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Add Mod Form + Mod List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Form Card */}
        <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="#10b981" /> Add New Modification
          </h3>

          <form onSubmit={handleAddMod} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Modification Title</label>
              <input 
                type="text"
                placeholder="e.g. Mirrors, Rear Rack, Leather Grips..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0a1d18',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '10px 8px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="Accessories">Accessories</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Storage">Storage</option>
                  <option value="Tires & Brakes">Tires & Brakes</option>
                  <option value="Software Tuning">Software Tuning</option>
                  <option value="Comfort & Ergonomics">Comfort & Ergonomics</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Cost ($ USD)</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Added Weight (lbs)</label>
              <input 
                type="number"
                step="0.1"
                placeholder="e.g. 1.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Notes & Install Details</label>
              <textarea 
                rows="3"
                placeholder="Details on installation, part numbers, compatibility..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px' }}>
              <Plus size={18} /> Save Modification
            </button>
          </form>
        </div>

        {/* Mod List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mods.map((mod) => (
            <div 
              key={mod.id}
              className="glass-card"
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-emerald">{mod.category}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{mod.date}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6' }}>{mod.title}</h4>
                </div>

                <button 
                  onClick={() => handleDeleteMod(mod.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Delete Modification"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>{mod.notes}</p>

              <div style={{
                display: 'flex',
                gap: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '10px',
                marginTop: '4px',
                fontSize: '0.8rem'
              }}>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Cost: ${parseFloat(mod.cost || 0).toFixed(2)}</span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>Weight: {mod.weight}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
