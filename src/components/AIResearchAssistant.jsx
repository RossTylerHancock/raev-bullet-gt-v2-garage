import React, { useEffect, useRef, useState } from 'react';
import { Bot, CheckCircle, HelpCircle, KeyRound, Lock, Search, Send, ShieldAlert, Sparkles, Unlock, User } from 'lucide-react';
import { PART_CATEGORIES, suggestPartCategory } from '../data/partsCategories.js';

const INITIAL_MESSAGE = {
  sender: 'ai',
  text: 'Hello Ross! Ask me anything about your RAEV Bullet GT V2. I answer from this app’s verified bike knowledge first. If that knowledge is not enough, I will ask before doing any online research.'
};

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: { 'content-type': 'application/json', ...options.headers }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || 'The request failed.');
    error.code = body.code;
    error.status = response.status;
    throw error;
  }
  return body;
}

export default function AIResearchAssistant() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sourceSaveState, setSourceSaveState] = useState({});
  const conversationRef = useRef(null);

  useEffect(() => {
    let active = true;
    apiRequest('/api/auth/status')
      .then(result => { if (active) setIsUnlocked(result.authenticated); })
      .catch(() => { if (active) setIsUnlocked(false); })
      .finally(() => { if (active) setCheckingAccess(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation) return;
    conversation.scrollTo({
      top: conversation.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isThinking]);

  const sampleQuestions = [
    'What replacement front forks can I use?',
    'What handlebar, grip and stem options fit my bike?',
    'Where is the secondary battery mounted?',
    'How do I change the P08 speed setting?',
    'What brake pads fit my calipers?',
    'What freewheel upgrade reduces ghost pedaling?'
  ];

  const handleUnlock = async event => {
    event.preventDefault();
    if (!pinInput.trim() || unlocking) return;
    setUnlocking(true);
    setPinError('');
    try {
      await apiRequest('/api/auth/unlock', {
        method: 'POST',
        body: JSON.stringify({ pin: pinInput.trim() })
      });
      setIsUnlocked(true);
      setPinInput('');
    } catch (error) {
      setPinError(error.message);
    } finally {
      setUnlocking(false);
    }
  };

  const handleLockTool = async () => {
    await apiRequest('/api/auth/lock', { method: 'POST', body: '{}' }).catch(() => {});
    setIsUnlocked(false);
    setMessages([INITIAL_MESSAGE]);
    setSourceSaveState({});
  };

  const updateSourceSaveState = (key, changes) => {
    setSourceSaveState(previous => ({
      ...previous,
      [key]: { ...previous[key], ...changes }
    }));
  };

  const openSourceSave = (key, source, question) => {
    updateSourceSaveState(key, {
      status: 'choosing',
      category: suggestPartCategory(`${question} ${source.title}`),
      error: ''
    });
  };

  const saveSource = async (key, source) => {
    const category = sourceSaveState[key]?.category;
    if (!category || sourceSaveState[key]?.status === 'saving') return;
    updateSourceSaveState(key, { status: 'saving', error: '' });
    try {
      const result = await apiRequest('/api/parts-links', {
        method: 'POST',
        body: JSON.stringify({ title: source.title, url: source.url, category })
      });
      updateSourceSaveState(key, {
        status: 'saved',
        category: result.link.category,
        created: result.created
      });
    } catch (error) {
      if (error.status === 401) setIsUnlocked(false);
      updateSourceSaveState(key, { status: 'error', error: error.message });
    }
  };

  const submitResearch = async (question, allowWeb = false, confirmationIndex = null) => {
    if (!question.trim() || isThinking) return;
    setMessages(previous => [
      ...previous.map((message, index) => index === confirmationIndex && message.externalConfirmation
        ? {
            ...message,
            externalConfirmation: {
              ...message.externalConfirmation,
              status: 'searching'
            }
          }
        : message),
      {
        sender: 'user',
        text: allowWeb
          ? 'Yes—research this online. Keep the app’s verified RAEV information authoritative.'
          : question.trim()
      }
    ]);
    if (!allowWeb) setInputQuery('');
    setIsThinking(true);
    try {
      const result = await apiRequest('/api/research', {
        method: 'POST',
        body: JSON.stringify({ question: question.trim(), allowWeb })
      });
      setMessages(previous => [
        ...previous.map((message, index) => index === confirmationIndex && message.externalConfirmation
          ? {
              ...message,
              externalConfirmation: {
                ...message.externalConfirmation,
                status: 'completed'
              }
            }
          : message),
        {
          sender: 'ai',
          text: result.answer,
          question: question.trim(),
          sources: result.sources,
          usedWeb: result.usedWeb,
          externalConfirmation: result.needsExternalResearch ? {
            question: question.trim(),
            reason: result.externalResearchReason,
            status: 'awaiting'
          } : null
        }
      ]);
    } catch (error) {
      if (error.status === 401) setIsUnlocked(false);
      setMessages(previous => [
        ...previous.map((message, index) => index === confirmationIndex && message.externalConfirmation
          ? {
              ...message,
              externalConfirmation: {
                ...message.externalConfirmation,
                status: 'awaiting'
              }
            }
          : message),
        { sender: 'ai', isError: true, text: error.message }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  if (checkingAccess) {
    return (
      <div className="card" style={{ maxWidth: 600, margin: '40px auto', padding: 36, textAlign: 'center' }}>
        <Bot size={28} color="#34d399" />
        <p style={{ color: '#9ca3af', marginTop: 12 }}>Checking owner access…</p>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto 0', animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(5, 14, 12, 0.95), rgba(6, 78, 59, 0.4))', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)', textAlign: 'center', padding: '36px 28px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #10b981, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}>
            <Lock size={32} color="#fff" />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '4px 12px', borderRadius: 9999, marginBottom: 14 }}>
            <ShieldAlert size={14} color="#34d399" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.05em' }}>OWNER ACCESS RESTRICTED</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f3f4f6', marginBottom: 8 }}>Ross Owner Access Required</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 24px' }}>
            Enter your owner PIN. It is verified securely by the server and is not stored in the browser.
          </p>
          {pinError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: '0.85rem', fontWeight: 600 }}>{pinError}</div>}
          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
              <KeyRound size={18} color="#6b7280" style={{ position: 'absolute', left: 14, top: 14 }} />
              <input type="password" inputMode="numeric" autoComplete="current-password" maxLength={12} placeholder="Enter owner PIN" value={pinInput} onChange={event => setPinInput(event.target.value)} style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10, background: 'rgba(3, 9, 8, 0.9)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#fff', fontSize: '1.1rem', letterSpacing: '0.2em', textAlign: 'center', outline: 'none' }} />
            </div>
            <button type="submit" disabled={unlocking} style={{ width: '100%', maxWidth: 280, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: unlocking ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Unlock size={18} /> {unlocking ? 'Checking…' : 'Unlock AI Researcher'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: 10, borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.3)' }}><Sparkles size={24} color="#34d399" /></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>RAEV Bike Research Assistant</h2>
                <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Unlock size={12} /> OWNER UNLOCKED</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: 2 }}>Verified app knowledge first. Online research only after you approve it.</p>
            </div>
          </div>
          <button onClick={handleLockTool} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#9ca3af', padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={14} /> Lock AI Tool</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {sampleQuestions.map(question => (
          <button key={question} disabled={isThinking} onClick={() => submitResearch(question)} style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 9999, padding: '6px 14px', color: '#34d399', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><HelpCircle size={14} /> {question}</button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: 560 }}>
        <div ref={conversationRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 6 }}>
          {messages.map((message, index) => (
            <div key={`${message.sender}-${index}`} style={{ display: 'flex', gap: 12, alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
              {message.sender === 'ai' && <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={18} color="#fff" /></div>}
              <div style={{ background: message.sender === 'user' ? 'linear-gradient(135deg, #10b981, #047857)' : 'rgba(255,255,255,0.05)', border: message.sender === 'user' ? 'none' : `1px solid ${message.isError ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.25)'}`, color: '#fff', padding: '14px 18px', borderRadius: message.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px', fontSize: '0.88rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {message.text}
                {message.usedWeb && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fbbf24', fontSize: '0.75rem', marginTop: 12 }}><Search size={13} /> Supplementary online research used with your approval</div>}
                {message.sources?.length > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <strong style={{ fontSize: '0.76rem', color: '#9ca3af' }}>Supplementary sources</strong>
                    {message.sources.map((source, sourceIndex) => {
                      const sourceKey = `${index}:${sourceIndex}`;
                      const saveState = sourceSaveState[sourceKey];
                      return (
                        <div key={source.url} style={{ marginTop: 8, padding: 8, borderRadius: 8, background: 'rgba(0,0,0,0.2)' }}>
                          <a href={source.url} target="_blank" rel="noreferrer" style={{ display: 'block', color: '#60a5fa', fontSize: '0.78rem', overflowWrap: 'anywhere' }}>{source.title}</a>
                          {!saveState && <button type="button" onClick={() => openSourceSave(sourceKey, source, message.question || '')} style={{ marginTop: 7, padding: '5px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#34d399', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}>Save to Parts Catalog</button>}
                          {saveState?.status === 'saved' && <div style={{ marginTop: 7, color: '#34d399', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><CheckCircle size={12} /> {saveState.created ? `Saved to ${saveState.category}` : `Already saved in ${saveState.category}`}</div>}
                          {saveState && saveState.status !== 'saved' && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 7 }}>
                              <select aria-label={`Category for ${source.title}`} value={saveState.category} disabled={saveState.status === 'saving'} onChange={event => updateSourceSaveState(sourceKey, { category: event.target.value, status: 'choosing', error: '' })} style={{ flex: 1, minWidth: 160, padding: '5px 7px', borderRadius: 6, background: '#0b1714', border: '1px solid rgba(255,255,255,0.18)', color: '#f3f4f6', fontSize: '0.7rem' }}>
                                {PART_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                              </select>
                              <button type="button" disabled={saveState.status === 'saving'} onClick={() => saveSource(sourceKey, source)} style={{ padding: '5px 9px', borderRadius: 6, background: '#059669', border: 'none', color: '#fff', cursor: saveState.status === 'saving' ? 'wait' : 'pointer', fontSize: '0.7rem', fontWeight: 700 }}>{saveState.status === 'saving' ? 'Saving…' : 'Save link'}</button>
                              <button type="button" disabled={saveState.status === 'saving'} onClick={() => setSourceSaveState(previous => { const next = { ...previous }; delete next[sourceKey]; return next; })} style={{ padding: '5px 7px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#9ca3af', cursor: 'pointer', fontSize: '0.7rem' }}>Cancel</button>
                              {saveState.error && <div style={{ flexBasis: '100%', color: '#f87171', fontSize: '0.7rem' }}>{saveState.error}</div>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {message.externalConfirmation && (
                  <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)' }}>
                    <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.8rem' }}>Internal knowledge is incomplete</div>
                    <div style={{ color: '#d1d5db', fontSize: '0.78rem', margin: '4px 0 10px' }}>{message.externalConfirmation.reason}</div>
                    {message.externalConfirmation.status === 'completed' ? (
                      <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> Online research approved</div>
                    ) : (
                      <button type="button" disabled={isThinking || message.externalConfirmation.status === 'searching'} onClick={() => submitResearch(message.externalConfirmation.question, true, index)} style={{ background: '#d97706', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 12px', cursor: isThinking ? 'wait' : 'pointer', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}><Search size={14} /> {message.externalConfirmation.status === 'searching' ? 'Searching online…' : 'Approve online research'}</button>
                    )}
                  </div>
                )}
              </div>
              {message.sender === 'user' && <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={18} color="#fff" /></div>}
            </div>
          ))}
          {isThinking && <div aria-live="polite" style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#9ca3af', fontSize: '0.8rem' }}><Bot size={18} color="#34d399" /> Researching the verified RAEV knowledge base…</div>}
        </div>
        <form onSubmit={event => { event.preventDefault(); submitResearch(inputQuery); }} style={{ display: 'flex', gap: 10, marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
          <input type="text" maxLength={2000} placeholder="Ask any question about your RAEV Bullet GT V2…" value={inputQuery} onChange={event => setInputQuery(event.target.value)} disabled={isThinking} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
          <button type="submit" className="btn-primary" disabled={isThinking || !inputQuery.trim()} style={{ padding: '0 20px' }}><Send size={18} /> Ask</button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: '0.7rem', marginTop: 9 }}><CheckCircle size={12} /> Internal RAEV data remains authoritative if web results disagree.</div>
      </div>
    </div>
  );
}
