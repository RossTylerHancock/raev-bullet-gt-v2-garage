import React, { useEffect, useState } from 'react';
import { Wrench, CheckCircle, Search, Filter, ShieldCheck, Zap, Compass, Tag, ExternalLink, ShoppingBag, X, Maximize2 } from 'lucide-react';
import { PART_CATEGORIES } from '../data/partsCategories.js';

function linkHostname(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return 'External website';
  }
}

export default function PartsCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalImage, setModalImage] = useState(null); // { url, title, price, buyUrl, category, svg }
  const [researchLinks, setResearchLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch('/api/parts-links').then(response => response.ok ? response.json() : Promise.reject(new Error('Saved research links could not be loaded.'))),
      fetch('/api/auth/status', { credentials: 'same-origin' }).then(response => response.ok ? response.json() : { authenticated: false })
    ]).then(([linksResult, authResult]) => {
      if (!active) return;
      setResearchLinks(Array.isArray(linksResult.links) ? linksResult.links : []);
      setIsOwner(Boolean(authResult.authenticated));
    }).catch(error => {
      if (active) setLinksError(error.message);
    }).finally(() => {
      if (active) setLinksLoading(false);
    });
    return () => { active = false; };
  }, []);

  const removeResearchLink = async id => {
    if (removingId) return;
    setRemovingId(id);
    setLinksError('');
    try {
      const response = await fetch(`/api/parts-links/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' }
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'The saved link could not be removed.');
      setResearchLinks(previous => previous.filter(link => link.id !== id));
      setConfirmRemoveId(null);
    } catch (error) {
      setLinksError(error.message);
    } finally {
      setRemovingId(null);
    }
  };

  // Custom high-resolution SVG product illustrations for 100% reliable, distinct component visuals
  const productSvgs = {
    // Tires & Armor
    'vee-speedster': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="85" fill="#18181b" stroke="#10b981" strokeWidth="4" />
        <circle cx="100" cy="100" r="55" fill="#09090b" stroke="#27272a" strokeWidth="8" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#3f3f46" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M 40 100 A 60 60 0 0 1 160 100" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="8 6" />
        <text x="100" y="105" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">VEE SPEEDSTER 20x4.0</text>
      </svg>
    ),
    'vee-huntsman': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="85" fill="#0f172a" stroke="#06b6d4" strokeWidth="4" />
        <circle cx="100" cy="100" r="50" fill="#020617" stroke="#1e293b" strokeWidth="12" />
        <path d="M 30 100 L 170 100 M 100 30 L 100 170 M 50 50 L 150 150 M 150 50 L 50 150" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 5" />
        <text x="100" y="105" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">E-HUNTSMAN MOTO</text>
      </svg>
    ),
    'vee-snowball': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="85" fill="#1e293b" stroke="#38bdf8" strokeWidth="4" />
        <circle cx="100" cy="100" r="55" fill="#0f172a" stroke="#475569" strokeWidth="8" />
        <circle cx="70" cy="70" r="3" fill="#ffffff" /><circle cx="130" cy="70" r="3" fill="#ffffff" />
        <circle cx="70" cy="130" r="3" fill="#ffffff" /><circle cx="130" cy="130" r="3" fill="#ffffff" />
        <text x="100" y="105" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">SNOWBALL WINTER</text>
      </svg>
    ),
    'cst-bft': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="85" fill="#1c1917" stroke="#f59e0b" strokeWidth="4" />
        <circle cx="100" cy="100" r="50" fill="#0c0a09" stroke="#44403c" strokeWidth="14" strokeDasharray="10 8" />
        <text x="100" y="105" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">CST BFT KNOBBY</text>
      </svg>
    ),
    'maxxis-minion': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="85" fill="#18181b" stroke="#ef4444" strokeWidth="4" />
        <circle cx="100" cy="100" r="52" fill="#09090b" stroke="#3f3f46" strokeWidth="12" strokeDasharray="14 10" />
        <text x="100" y="105" fill="#f87171" fontSize="12" fontWeight="bold" textAnchor="middle">MAXXIS MINION FBR</text>
      </svg>
    ),
    'kenda-kraze': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="85" fill="#14532d" stroke="#10b981" strokeWidth="4" />
        <circle cx="100" cy="100" r="55" fill="#052e16" stroke="#166534" strokeWidth="8" />
        <text x="100" y="105" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">KENDA KRAZE OEM</text>
      </svg>
    ),
    'inner-tube': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="100" rx="75" ry="55" fill="none" stroke="#27272a" strokeWidth="22" />
        <rect x="96" y="30" width="8" height="25" fill="#fbbf24" rx="2" />
        <text x="100" y="105" fill="#f4f4f5" fontSize="11" fontWeight="bold" textAnchor="middle">20x4.0 HEAVY TUBE</text>
      </svg>
    ),
    'tannus-armour': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="85" fill="#991b1b" stroke="#ef4444" strokeWidth="6" />
        <circle cx="100" cy="100" r="55" fill="#09090b" stroke="#7f1d1d" strokeWidth="8" />
        <text x="100" y="105" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">TANNUS 15mm ARMOUR</text>
      </svg>
    ),
    'flatout-sealant': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="70" y="50" width="60" height="110" rx="10" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="4" />
        <rect x="85" y="25" width="30" height="25" fill="#fbbf24" rx="4" />
        <rect x="95" y="10" width="10" height="15" fill="#ffffff" rx="2" />
        <text x="100" y="115" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">FLATOUT KEVLAR</text>
      </svg>
    ),

    // Brakes & Rotors
    'shimano-pads': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="45" width="55" height="85" rx="8" fill="#b45309" stroke="#f59e0b" strokeWidth="3" />
        <rect x="110" y="45" width="55" height="85" rx="8" fill="#b45309" stroke="#f59e0b" strokeWidth="3" />
        <circle cx="62" cy="65" r="8" fill="#78350f" /><circle cx="137" cy="65" r="8" fill="#78350f" />
        <path d="M 62 130 L 137 130" stroke="#fbbf24" strokeWidth="4" />
        <text x="100" y="165" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">SHIMANO D03S/D02S</text>
      </svg>
    ),
    'tektro-pads': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="50" width="50" height="80" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="3" />
        <rect x="110" y="50" width="50" height="80" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="3" />
        <text x="100" y="165" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">TEKTRO E10.11 PADS</text>
      </svg>
    ),
    'gorilla-pads': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="50" width="50" height="80" rx="6" fill="#14532d" stroke="#22c55e" strokeWidth="3" />
        <rect x="110" y="50" width="50" height="80" rx="6" fill="#14532d" stroke="#22c55e" strokeWidth="3" />
        <text x="100" y="165" fill="#86efac" fontSize="11" fontWeight="bold" textAnchor="middle">GORILLA CERAMIC</text>
      </svg>
    ),
    'galfer-pads': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="50" width="50" height="80" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="3" />
        <rect x="110" y="50" width="50" height="80" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="3" />
        <text x="100" y="165" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">GALFER SINTERED</text>
      </svg>
    ),
    'shimano-rotor': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#94a3b8" strokeWidth="16" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="#64748b" strokeWidth="6" />
        <circle cx="100" cy="100" r="8" fill="#e2e8f0" />
        <line x1="100" y1="30" x2="100" y2="70" stroke="#94a3b8" strokeWidth="4" />
        <line x1="100" y1="130" x2="100" y2="170" stroke="#94a3b8" strokeWidth="4" />
        <text x="100" y="105" fill="#f1f5f9" fontSize="10" fontWeight="bold" textAnchor="middle">180mm RT66 ROTOR</text>
      </svg>
    ),
    'galfer-rotor': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="82" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray="18 8" />
        <circle cx="100" cy="100" r="32" fill="none" stroke="#991b1b" strokeWidth="6" />
        <text x="100" y="105" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">GALFER 2.0mm WAVE</text>
      </svg>
    ),
    'tektro-brakes': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="70" width="50" height="60" rx="8" fill="#0f172a" stroke="#ef4444" strokeWidth="4" />
        <path d="M 80 100 C 120 100, 130 50, 160 50" fill="none" stroke="#ef4444" strokeWidth="5" />
        <rect x="155" y="35" width="30" height="35" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
        <text x="100" y="155" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">TEKTRO 4-PISTON HYDRAULIC</text>
      </svg>
    ),
    'magura-brakes': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="70" width="50" height="60" rx="8" fill="#18181b" stroke="#fbbf24" strokeWidth="4" />
        <path d="M 80 100 C 120 100, 130 50, 160 50" fill="none" stroke="#fbbf24" strokeWidth="5" />
        <text x="100" y="155" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">MAGURA MT5e BRAKES</text>
      </svg>
    ),

    // Suspension
    'dnm-air-shock': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="80" y="30" width="40" height="140" rx="10" fill="#b45309" stroke="#f59e0b" strokeWidth="4" />
        <rect x="85" y="65" width="30" height="60" fill="#18181b" stroke="#78350f" strokeWidth="3" />
        <circle cx="100" cy="40" r="10" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
        <circle cx="100" cy="160" r="10" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
        <text x="100" y="100" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">DNM AIR SHOCK 200mm</text>
      </svg>
    ),
    'dnm-coil-shock': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="88" y="30" width="24" height="140" fill="#27272a" />
        <path d="M 80 50 Q 120 60 80 70 Q 120 80 80 90 Q 120 100 80 110 Q 120 120 80 130 Q 120 140 80 150" fill="none" stroke="#ef4444" strokeWidth="10" />
        <circle cx="100" cy="35" r="9" fill="#ef4444" /><circle cx="100" cy="165" r="9" fill="#ef4444" />
        <text x="100" y="105" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">DNM COIL 200mm</text>
      </svg>
    ),
    'kke-fork': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="65" y="20" width="16" height="150" rx="4" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
        <rect x="119" y="20" width="16" height="150" rx="4" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
        <rect x="55" y="35" width="90" height="18" fill="#18181b" stroke="#f59e0b" strokeWidth="3" />
        <text x="100" y="110" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">KKE INVERTED AIR</text>
      </svg>
    ),
    'bucklos-fork': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="65" y="20" width="16" height="150" rx="4" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
        <rect x="119" y="20" width="16" height="150" rx="4" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
        <rect x="55" y="35" width="90" height="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
        <text x="100" y="110" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">BUCKLOS AIR FORK</text>
      </svg>
    ),

    // Drivetrain
    'dnp-freewheel': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="75" fill="none" stroke="#fbbf24" strokeWidth="8" strokeDasharray="10 6" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#d97706" strokeWidth="8" strokeDasharray="8 6" />
        <circle cx="100" cy="100" r="45" fill="none" stroke="#b45309" strokeWidth="8" strokeDasharray="6 4" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="#78350f" strokeWidth="8" strokeDasharray="4 4" />
        <text x="100" y="104" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">DNP 11-28T 7SP</text>
      </svg>
    ),
    'deckas-chainring': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="6 4" />
        <circle cx="100" cy="100" r="45" fill="none" stroke="#047857" strokeWidth="4" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="#34d399" strokeWidth="3" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="#34d399" strokeWidth="3" />
        <text x="100" y="104" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">DECKAS 52T 130BCD</text>
      </svg>
    ),
    'raceface-pedals': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="45" y="55" width="110" height="90" rx="12" fill="#18181b" stroke="#ef4444" strokeWidth="4" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="#ef4444" strokeWidth="6" />
        <circle cx="65" cy="75" r="3" fill="#fbbf24" /><circle cx="135" cy="75" r="3" fill="#fbbf24" />
        <circle cx="65" cy="125" r="3" fill="#fbbf24" /><circle cx="135" cy="125" r="3" fill="#fbbf24" />
        <text x="100" y="104" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">CHESTER PEDALS 9/16</text>
      </svg>
    ),
    'kmc-chain': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M 30 100 Q 60 70 100 100 T 170 100" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeDasharray="14 6" />
        <text x="100" y="135" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">KMC e8/e9 CHAIN</text>
      </svg>
    ),

    // Cockpit & Controls
    'wuxing-throttle': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="70" width="100" height="60" rx="8" fill="#18181b" stroke="#fbbf24" strokeWidth="4" />
        <line x1="140" y1="100" x2="185" y2="100" stroke="#fbbf24" strokeWidth="5" />
        <circle cx="185" cy="100" r="6" fill="#ef4444" />
        <text x="90" y="105" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">WUXING 130X 3-PIN</text>
      </svg>
    ),
    'raev-display': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="35" width="130" height="130" rx="14" fill="#052e16" stroke="#10b981" strokeWidth="5" />
        <rect x="45" y="45" width="110" height="110" rx="8" fill="#09090b" />
        <text x="100" y="80" fill="#34d399" fontSize="24" fontWeight="bold" textAnchor="middle">32 MPH</text>
        <text x="100" y="105" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">54.6V | 1456Wh</text>
        <text x="100" y="130" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">PAS 3 SPORT</text>
      </svg>
    ),
    'answer-bars': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 120 L 60 120 L 80 80 L 120 80 L 140 120 L 180 120" fill="none" stroke="#34d399" strokeWidth="10" strokeLinecap="round" />
        <text x="100" y="140" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">ANSWER PROTAPER 31.8</text>
      </svg>
    ),
    'surly-bars': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 130 L 60 130 L 80 70 L 120 70 L 140 130 L 180 130" fill="none" stroke="#fbbf24" strokeWidth="10" strokeLinecap="round" />
        <line x1="75" y1="95" x2="125" y2="95" stroke="#fbbf24" strokeWidth="5" />
        <text x="100" y="150" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">SURLY SUNRISE MOTO</text>
      </svg>
    ),
    'odi-grips': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="70" width="140" height="60" rx="6" fill="#27272a" stroke="#f59e0b" strokeWidth="4" />
        <rect x="30" y="70" width="15" height="60" fill="#f59e0b" />
        <rect x="155" y="70" width="15" height="60" fill="#f59e0b" />
        <text x="100" y="105" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">ODI ROGUE LOCK-ON</text>
      </svg>
    ),

    // Electrical & Storage
    'fast-charger': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="50" width="120" height="100" rx="10" fill="#18181b" stroke="#34d399" strokeWidth="4" />
        <circle cx="70" cy="100" r="10" fill="#ef4444" />
        <circle cx="100" cy="100" r="10" fill="#22c55e" />
        <text x="100" y="135" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">52V 5A FAST CHARGER</text>
      </svg>
    ),
    'dc-converter': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="45" y="55" width="110" height="90" rx="8" fill="#334155" stroke="#38bdf8" strokeWidth="4" />
        <line x1="20" y1="80" x2="45" y2="80" stroke="#ef4444" strokeWidth="5" />
        <line x1="20" y1="120" x2="45" y2="120" stroke="#000000" strokeWidth="5" />
        <line x1="155" y1="80" x2="180" y2="80" stroke="#fbbf24" strokeWidth="5" />
        <line x1="155" y1="120" x2="180" y2="120" stroke="#000000" strokeWidth="5" />
        <text x="100" y="105" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">52V to 12V 10A BUCK</text>
      </svg>
    ),
    'kemimoto-bags': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="55" width="60" height="90" rx="10" fill="#1c1917" stroke="#fbbf24" strokeWidth="3" />
        <rect x="105" y="55" width="60" height="90" rx="10" fill="#1c1917" stroke="#fbbf24" strokeWidth="3" />
        <text x="100" y="165" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">KEMIMOTO SADDLEBAGS</text>
      </svg>
    ),
    'quad-lock': (
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="45" fill="#0284c7" stroke="#38bdf8" strokeWidth="6" />
        <rect x="90" y="70" width="20" height="60" fill="#ffffff" rx="4" />
        <rect x="70" y="90" width="60" height="20" fill="#ffffff" rx="4" />
        <text x="100" y="165" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">QUAD LOCK MOTO</text>
      </svg>
    )
  };

  const partsCatalog = [
    // 1. TIRES & TUBES & FLAT ARMOR
    {
      id: 'tire-1',
      category: 'Tires & Tubes',
      partName: 'Vee Tire Co. Speedster 20" x 4.0"',
      type: 'Street Slick Fat Tire (MPC E-50 Rated)',
      compatibility: '20" Alloy Double-Wall Rim (80mm Wide)',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'MPC E-Bike 50 Rated Compound, 30 TPI, Whisper-Quiet City Roll, 20-30 PSI',
      whyFits: 'Matches 20x4.0 stock dimension. Reduces rolling resistance and adds +2 to 4 miles of range.',
      priceEst: '$65 - $75',
      buyUrl: 'https://veetireco.com/product/fat-bike-speedster/',
      svgKey: 'vee-speedster'
    },
    {
      id: 'tire-2',
      category: 'Tires & Tubes',
      partName: 'Vee Tire Co. E-Huntsman 20" x 4.0"',
      type: 'Heavy Duty Moto Street Tire',
      compatibility: '20" Alloy Double-Wall Rim (80mm Wide)',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Over-Ride Puncture Layer, Moto-style tread, 26 PSI Max, 120 TPI carcass',
      whyFits: 'Exact stock dimension. Thick rubber compound prevents thorn punctures and gives superior cornering grip at 35 MPH.',
      priceEst: '$79 - $89',
      buyUrl: 'https://veetireco.com/product/fat-bike-e-huntsman/',
      svgKey: 'vee-huntsman'
    },
    {
      id: 'tire-3',
      category: 'Tires & Tubes',
      partName: 'Vee Tire Co. Snowball 20" x 4.0"',
      type: 'Winter / Snow Fat Bike Tire',
      compatibility: '20" Alloy Double-Wall Rim (80mm Wide)',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Silica Compound, Studdable Tread Knobs, Cold Weather Rubber',
      whyFits: 'Exact 20x4.0 size. Designed for riding on ice, snow, and wet slippery pavement.',
      priceEst: '$85 - $95',
      buyUrl: 'https://veetireco.com/product/fat-bike-snowball/',
      svgKey: 'vee-snowball'
    },
    {
      id: 'tire-4',
      category: 'Tires & Tubes',
      partName: 'CST BFT (Big Fat Tire) 20" x 4.0"',
      type: 'Off-Road Trail Knobby Tire',
      compatibility: '20" Alloy Double-Wall Rim (80mm Wide)',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Aggressive side knobs, EPS Puncture Shield, 60 TPI Casing',
      whyFits: 'Exact 20x4.0 tire envelope. Ideal for loose sand, gravel, mud, and trail riding.',
      priceEst: '$45 - $55',
      buyUrl: 'https://www.csttires.com/us/tire/bft-c1752/',
      svgKey: 'cst-bft'
    },
    {
      id: 'tire-5',
      category: 'Tires & Tubes',
      partName: 'Maxxis Minion FBR / FBF 20" x 4.0"',
      type: 'Downhill Off-Road Fat Tire',
      compatibility: '20" Alloy Double-Wall Rim (80mm Wide)',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'EXO Puncture Protection, Dual Compound Rubber, Tubeless Ready',
      whyFits: 'Extreme trail grip for high-speed off-road riding on dirt and loose rocks.',
      priceEst: '$95 - $110',
      buyUrl: 'https://www.maxxis.com/us/tire/minion-fbr/',
      svgKey: 'maxxis-minion'
    },
    {
      id: 'tire-6',
      category: 'Tires & Tubes',
      partName: 'Kenda Kraze 20" x 4.0" (OEM Replacement)',
      type: 'Street Fat Tire',
      compatibility: '20" Alloy Double-Wall Rim (80mm Wide)',
      fitmentStatus: 'Factory OEM Replacement',
      specs: '60 TPI, Wire Bead, 30 PSI Max',
      whyFits: 'Official factory tire supplied on RAEV Bullet GT V2 out of the box.',
      priceEst: '$50 - $60',
      buyUrl: 'https://raevbikes.com/collections/parts-accessories',
      svgKey: 'kenda-kraze'
    },
    {
      id: 'tube-1',
      category: 'Tires & Tubes',
      partName: 'Heavy-Duty 20" x 4.0" / 4.25" Inner Tubes',
      type: 'Butyl Rubber Inner Tube',
      compatibility: 'AV33mm Schrader Valve Rim Hole',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: '2.2mm thick wall butyl rubber, AV33mm threaded Schrader valve',
      whyFits: 'Exact rim diameter & valve stem length for stock 80mm wide fat bike rims.',
      priceEst: '$14 - $18',
      buyUrl: 'https://www.amazon.com/dp/B07Z4QW3Z9',
      svgKey: 'inner-tube'
    },
    {
      id: 'armor-1',
      category: 'Tires & Tubes',
      partName: 'Tannus Armour 20" x 4.0" Foam Inserts',
      type: 'Puncture Protection Armor',
      compatibility: 'Fits 20x4.0 tires with 20x3.0 inner tubes',
      fitmentStatus: 'Verified Compatible',
      specs: '15mm Aither 1.1 patented micro-cellular foam shield',
      whyFits: 'Wraps around inner tube inside 20x4.0 tire. Eliminates 90%+ of thorn, glass, nail, and pinch flats.',
      priceEst: '$99 (Pair)',
      buyUrl: 'https://tannusamerica.com/products/tannus-armour',
      svgKey: 'tannus-armour'
    },
    {
      id: 'sealant-1',
      category: 'Tires & Tubes',
      partName: 'FlatOut Sportsman Formula Tire Sealant',
      type: 'Kevlar Fiber Tire Sealant',
      compatibility: '20x4.0 Fat Tubes (Requires 8-16 oz per tire)',
      fitmentStatus: 'Verified Compatible',
      specs: 'Kevlar synthetic fibers, Seals up to 1/2 inch punctures instantly',
      whyFits: 'Injected into Schrader valve stem. Prevents slow leaks and flats at 35 MPH.',
      priceEst: '$18 - $24',
      buyUrl: 'https://www.amazon.com/dp/B08X69Q3R6',
      svgKey: 'flatout-sealant'
    },

    // 2. BRAKE PADS, ROTORS & CALIPERS
    {
      id: 'brake-pad-1',
      category: 'Brakes & Rotors',
      partName: 'Shimano D03S (Resin) / D02S (Sintered Metallic) Pads',
      type: '4-Piston Hydraulic Disc Brake Pads',
      compatibility: 'RAEV 4-Piston Hydraulic Disc Calipers (Tektro Footprint)',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Shimano 4-Piston shape (Zee / Saint / XT D-type shape)',
      whyFits: 'Matches the exact caliper pad cavity of RAEV 4-piston brakes. Metallic D02S recommended for 35 MPH stopping.',
      priceEst: '$18 - $26',
      buyUrl: 'https://bike.shimano.com/en-US/product/service-upgradeparts/shimano/Y8FF98010.html',
      svgKey: 'shimano-pads'
    },
    {
      id: 'brake-pad-2',
      category: 'Brakes & Rotors',
      partName: 'Tektro E10.11 / P20.11 Brake Pads',
      type: 'Resin / Organic Disc Brake Pads',
      compatibility: 'Tektro HD-E350 / HD-E725 4-Piston Calipers',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Organic compound on steel backing plate',
      whyFits: 'OEM match footprint. Offers silent, progressive bite for city cruising.',
      priceEst: '$14 - $18',
      buyUrl: 'https://www.tektro.com/products.php?p=229',
      svgKey: 'tektro-pads'
    },
    {
      id: 'brake-pad-3',
      category: 'Brakes & Rotors',
      partName: 'Miles Wide / Gorilla Brakes Ceramic Pads',
      type: 'Ceramic Composite Heavy Duty Pads',
      compatibility: 'RAEV 4-Piston Calipers (Shimano D-Type Footprint)',
      fitmentStatus: 'Verified Compatible',
      specs: 'High thermal resistance compound, Steel backing plate',
      whyFits: 'Eliminates brake squeal and heat fade under heavy 90 lb e-bike braking loads.',
      priceEst: '$25 - $32',
      buyUrl: 'https://gorillabrakes.com/',
      svgKey: 'gorilla-pads'
    },
    {
      id: 'brake-pad-4',
      category: 'Brakes & Rotors',
      partName: 'Galfer FD426 Sintered G1375 / Pro G1554 Pads',
      type: 'Race-Grade Sintered Metal Pads',
      compatibility: '4-Piston Downhill Footprint',
      fitmentStatus: 'Verified Compatible',
      specs: 'Severe duty sintered compound for downhill e-bikes',
      whyFits: 'Maximum thermal resistance for aggressive downhill or emergency 35 MPH stops.',
      priceEst: '$29 - $38',
      buyUrl: 'https://galferusa.com/bicycle/',
      svgKey: 'galfer-pads'
    },
    {
      id: 'rotor-1',
      category: 'Brakes & Rotors',
      partName: 'Shimano SM-RT66 180mm Stainless Rotor',
      type: 'ISO 6-Bolt Stainless Steel Disc Rotor',
      compatibility: 'Standard ISO 6-Bolt Hub Flange (M5x10mm Torx T25)',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: '180mm Diameter, 1.8mm thickness, precision heat treatment',
      whyFits: 'Exact 180mm rotor diameter matching front and rear hub caliper mounts.',
      priceEst: '$24 - $28',
      buyUrl: 'https://bike.shimano.com/en-US/product/component/slx-m7000/SM-RT66.html',
      svgKey: 'shimano-rotor'
    },
    {
      id: 'rotor-2',
      category: 'Brakes & Rotors',
      partName: 'Galfer Fixed Wave 180mm 2.0mm Heavy Duty Rotor',
      type: 'Heavy Duty 2.0mm Thick E-Bike Rotor',
      compatibility: 'Standard ISO 6-Bolt Flange (M5 Torx T25)',
      fitmentStatus: 'Verified Compatible',
      specs: '2.0mm Extra Thick Stainless Steel, Wave Anti-Warp Profile',
      whyFits: 'Thicker 2.0mm steel prevents rotor warping under intense heat at high speed.',
      priceEst: '$36 - $44',
      buyUrl: 'https://galferusa.com/product/fixed-wave-rotors-bike/',
      svgKey: 'galfer-rotor'
    },
    {
      id: 'brake-kit-1',
      category: 'Brakes & Rotors',
      partName: 'Tektro HD-E350 4-Piston Hydraulic E-Bike Brake Set',
      type: 'Complete Hydraulic Brake Assembly',
      compatibility: '2-Pin Red Julet Motor Cutoff Sensor Plug',
      fitmentStatus: 'Verified Compatible',
      specs: 'Mineral oil, integrated electric cut-off reed switch levers',
      whyFits: 'Plug-and-play 2-pin Julet motor safety cutoff plugs connect directly to RAEV main harness.',
      priceEst: '$140 - $170',
      buyUrl: 'https://www.tektro.com/products.php?p=242',
      svgKey: 'tektro-brakes'
    },
    {
      id: 'brake-kit-2',
      category: 'Brakes & Rotors',
      partName: 'Magura MT5e 4-Piston Hydraulic E-Bike Brakes',
      type: 'High Performance 4-Piston Hydraulic Brakes',
      compatibility: '2-Pin HIGO / Julet Motor Cutoff Switch',
      fitmentStatus: 'Verified Compatible',
      specs: 'Carbotecture caliper body, 4-piston power, 2-finger alloy lever',
      whyFits: 'Pro-grade 4-piston stopping power with integrated motor cutoff safety switches.',
      priceEst: '$220 - $260',
      buyUrl: 'https://magura.com/en/EUR/bicycle/brakes/e-bikes/mt5e/p/mt5e',
      svgKey: 'magura-brakes'
    },

    // 3. SUSPENSION SHOCKS & FORKS
    {
      id: 'shock-1',
      category: 'Suspension',
      partName: 'DNM AOY-36RC Air Suspension Shock (200mm x 55mm)',
      type: 'Dual Chamber Air Rear Shock',
      compatibility: '200mm (7.87") Eye-to-Eye, 8x24mm Mounting Bushings',
      fitmentStatus: '#1 Community Upgrade (Verified)',
      specs: 'Main Air Chamber + Negative Air Chamber, Rebound Dial, Lockout Lever',
      whyFits: 'Exact 200mm eye-to-eye eyelet spacing. Transforms rear end cushion on Bullet GT V2 frame.',
      priceEst: '$135 - $155',
      buyUrl: 'https://www.dnmshock.com/products/rear-shocks/aoy-36rc.html',
      svgKey: 'dnm-air-shock'
    },
    {
      id: 'shock-2',
      category: 'Suspension',
      partName: 'DNM DV-22AR Coil Rear Shock (200mm)',
      type: 'Hydraulic Rebound Coil Shock',
      compatibility: '200mm Eye-to-Eye, 750 / 1000 lb Spring Options',
      fitmentStatus: 'Verified Compatible',
      specs: 'Hydraulic rebound adjustment dial, heavy payload steel coil',
      whyFits: 'Exact 200mm length. Great for riders over 220 lbs who want stiff, predictable spring response.',
      priceEst: '$85 - $105',
      buyUrl: 'https://www.dnmshock.com/products/rear-shocks/dv-22ar.html',
      svgKey: 'dnm-coil-shock'
    },
    {
      id: 'fork-1',
      category: 'Suspension',
      partName: 'KKE 20" Fat Tire Inverted Air Suspension Fork',
      type: 'Inverted Dual Crown Air Fork',
      compatibility: '1-1/8" Straight Steerer (28.6mm), 135mm Front Dropout',
      fitmentStatus: 'Verified Compatible',
      specs: '120mm Travel, 34mm Stanchions, Rebound Dial & Air Valve',
      whyFits: 'Matches 1-1/8" straight steerer tube and 135mm front axle dropout spacing. Gives moto styling.',
      priceEst: '$280 - $340',
      buyUrl: 'https://www.amazon.com/dp/B09V7SGHZF',
      svgKey: 'kke-fork'
    },
    {
      id: 'fork-2',
      category: 'Suspension',
      partName: 'Bucklos 20x4.0 Dual Crown Air Suspension Fork',
      type: 'Dual Crown Fat Tire Air Fork',
      compatibility: '1-1/8" Straight Steerer (28.6mm), 135mm Front Dropout',
      fitmentStatus: 'Verified Compatible',
      specs: '100mm Travel, Manual Lockout Lever, Preload Air Adjust',
      whyFits: 'Direct replacement for stock dual crown hydraulic fork with lighter air spring weight.',
      priceEst: '$160 - $190',
      buyUrl: 'https://bucklos.com/collections/suspension-forks',
      svgKey: 'bucklos-fork'
    },

    // 4. DRIVETRAIN: FREEWHEELS, SPROCKETS, CRANKS, PEDALS & CHAINS
    {
      id: 'freewheel-1',
      category: 'Drivetrain',
      partName: 'DNP Epoch 7-Speed Screw-On Freewheel (11-28T)',
      type: 'High-Speed 7-Speed Freewheel',
      compatibility: 'Standard Threaded Rear Hub Motor Axle (Shimano Step)',
      fitmentStatus: 'Top Speed Pedaling Upgrade (Verified)',
      specs: '11-13-15-18-21-24-28T (11T high gear vs stock 14T)',
      whyFits: 'Threads directly onto rear hub motor. The 11T small gear allows comfortable pedaling input at 32-35 MPH without ghost pedaling!',
      priceEst: '$32 - $42',
      buyUrl: 'https://www.amazon.com/dp/B007A8RPUS',
      svgKey: 'dnp-freewheel'
    },
    {
      id: 'chainring-1',
      category: 'Drivetrain',
      partName: 'Deckas 52T 130 BCD Narrow-Wide Alloy Chainring',
      type: 'Narrow-Wide Single Chainring',
      compatibility: '130mm BCD 5-Bolt Crank Spider',
      fitmentStatus: 'Verified Compatible',
      specs: 'CNC 7075-T6 Aluminum, Alternating Narrow-Wide Teeth',
      whyFits: 'Matches stock 52T chainring diameter and 130 BCD bolt circle. Prevents chain drops at high speeds.',
      priceEst: '$22 - $28',
      buyUrl: 'https://www.amazon.com/dp/B07G316R96',
      svgKey: 'deckas-chainring'
    },
    {
      id: 'pedal-1',
      category: 'Drivetrain',
      partName: 'Race Face Chester Composite Flat Pedals',
      type: 'Platform Bike Pedals',
      compatibility: '9/16" Spindle Thread (M12 x 1.25mm)',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Tough Nylon Composite Body, Chromoly Steel Axle, 8 Replaceable Pins per side',
      whyFits: 'Standard 9/16" thread fits stock 170mm crank arms perfectly. Superior shoe grip.',
      priceEst: '$45 - $55',
      buyUrl: 'https://www.raceface.com/products/chester-pedal',
      svgKey: 'raceface-pedals'
    },
    {
      id: 'chain-1',
      category: 'Drivetrain',
      partName: 'KMC e8 / KMC e9 E-Bike Heavy Duty Chain (124+ Links)',
      type: 'E-Bike Specific Chain',
      compatibility: '1/2" x 3/32" 7/8/9-Speed Drivetrain',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Nickel Plated, Pin Power Cut 450kgf Tensile Strength',
      whyFits: 'Designed for 1500W peak motor torque loads. 124 link count fits Bullet GT V2 chainstay length.',
      priceEst: '$28 - $38',
      buyUrl: 'https://www.kmcchain.us/products/e8',
      svgKey: 'kmc-chain'
    },

    // 5. THROTTLES & COCKPIT CONTROLS
    {
      id: 'throttle-1',
      category: 'Cockpit & Throttles',
      partName: 'Wuxing 130X Half-Twist Throttle Kit',
      type: 'Half-Twist Throttle Assembly',
      compatibility: '3-Pin Female Julet Yellow Waterproof Connector',
      fitmentStatus: 'Plug-and-Play (Verified)',
      specs: 'Red (+5V), Black (GND), Green/White (Signal), 22.2mm Bar Clamp',
      whyFits: 'Plug-and-play connector matches RAEV right-hand throttle harness. Prevents thumb fatigue on long rides.',
      priceEst: '$20 - $28',
      buyUrl: 'https://www.amazon.com/dp/B07YDJ7S25',
      svgKey: 'wuxing-throttle'
    },
    {
      id: 'display-1',
      category: 'Cockpit & Throttles',
      partName: 'Official RAEV 3.5" Full Color IPS LCD Display',
      type: 'Upgraded Full Color Cockpit Telemetry Display',
      compatibility: '5-Pin Female Julet Green Waterproof Connector',
      fitmentStatus: 'Official Upgrade Option (Verified)',
      specs: '0.1V Precision Voltage Readout, Wattmeter Output (0-1560W), Dual Battery Telemetry',
      whyFits: 'Official plug-and-play upgrade designed by RAEV for Bullet GT V2 52V 30A controller.',
      priceEst: '$80',
      buyUrl: 'https://raevbikes.com/products/colored-display',
      svgKey: 'raev-display'
    },

    // 6. HANDLEBARS, STEMS & GRIPS
    {
      id: 'bars-1',
      category: 'Handlebars & Stem',
      partName: 'Answer ProTAPER 31.8mm 3" / 4" Moto Riser Handlebars',
      type: 'Aluminum Riser Handlebars',
      compatibility: '31.8mm Stem Clamp Area / 22.2mm Grip Area',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: '7050-T6 Aluminum, 780mm Width (Trimmable), 75mm / 100mm Rise',
      whyFits: 'Matches 31.8mm stem clamp and 22.2mm controls. Raises riding stance for taller riders.',
      priceEst: '$65 - $85',
      buyUrl: 'https://protaper.com/',
      svgKey: 'answer-bars'
    },
    {
      id: 'bars-2',
      category: 'Handlebars & Stem',
      partName: 'Surly Sunrise Handlebar (31.8mm Clamp)',
      type: 'BMX Moto Riser Bar with Crossbar',
      compatibility: '31.8mm Clamp / 22.2mm Grip Area',
      fitmentStatus: 'Verified Compatible',
      specs: '820mm Width, 83mm Rise, Chromoly Steel with Crossbar',
      whyFits: 'Heavy duty steel moto handlebar with crossbar for mounting accessory clamps.',
      priceEst: '$75 - $90',
      buyUrl: 'https://surlybikes.com/parts/sunrise_handlebar',
      svgKey: 'surly-bars'
    },
    {
      id: 'grips-1',
      category: 'Handlebars & Stem',
      partName: 'ODI Rogue Lock-On Grips (130mm)',
      type: 'Dual Locking Handlebar Grips',
      compatibility: '22.2mm (7/8") Handlebar Ends',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Large raised pads, Snap-Cap end plugs, Dual aluminum lock rings',
      whyFits: 'Exact 22.2mm handlebar diameter. Lock rings eliminate grip twisting under heavy throttle torque.',
      priceEst: '$28 - $34',
      buyUrl: 'https://www.odigrips.com/products/rogue-v2-1-lock-on-grips-130mm',
      svgKey: 'odi-grips'
    },

    // 7. BATTERIES, CHARGERS & ELECTRICAL
    {
      id: 'charger-1',
      category: 'Electrical & Batteries',
      partName: '52V (58.8V 4A / 5A) Smart Fast Lithium Charger',
      type: 'CC/CV Smart Battery Fast Charger',
      compatibility: 'XLR / 3-Pin Aircraft Plug / DC5521 (52V Battery)',
      fitmentStatus: 'Verified Compatible',
      specs: '58.8V Max Voltage, Auto Cutoff, Thermal Cooling Fan',
      whyFits: 'Charges 52V Samsung 21700 battery pack safely in ~4 hours (vs 7 hrs on 3A stock charger).',
      priceEst: '$55 - $75',
      buyUrl: 'https://raevbikes.com/collections/parts-accessories',
      svgKey: 'fast-charger'
    },
    {
      id: 'converter-1',
      category: 'Electrical & Batteries',
      partName: '52V to 12V 10A (120W) DC-DC Step-Down Buck Converter',
      type: 'Voltage Step-Down Module',
      compatibility: 'Wires to main 52V battery bus (XT60 / XT90 splitter)',
      fitmentStatus: 'Verified Compatible',
      specs: 'Input: 36V-72V DC | Output: 12V DC at 10A Max',
      whyFits: 'Allows adding aftermarket 12V motorcycle lights, USB fast chargers, turn signals, and horn kits.',
      priceEst: '$18 - $25',
      buyUrl: 'https://www.amazon.com/dp/B08CH3S4G7',
      svgKey: 'dc-converter'
    },

    // 8. STORAGE BAGS & ACCESSORIES
    {
      id: 'bag-1',
      category: 'Storage & Accessories',
      partName: 'Kemimoto Heavy Duty Motorcycle Side Saddlebags',
      type: 'Frame Mounted Storage Bags',
      compatibility: 'Attaches to RAEV Bullet GT V2 Rear Subframe Rails',
      fitmentStatus: 'Verified Compatible',
      specs: 'Waterproof PU Synthetic Leather, Quick-Release Straps',
      whyFits: 'Straps snugly onto the rear subframe under the bench seat for carrying tools, locks, and gear.',
      priceEst: '$45 - $65',
      buyUrl: 'https://www.kemimoto.com/',
      svgKey: 'kemimoto-bags'
    },
    {
      id: 'phone-1',
      category: 'Storage & Accessories',
      partName: 'Quad Lock Handlebar Phone Mount + Vibration Dampener',
      type: 'Smartphone Mount',
      compatibility: '22.2mm / 31.8mm Handlebars',
      fitmentStatus: 'Direct Fit (Verified)',
      specs: 'Dual-Stage Lock, Silicone Vibration Dampener (Protects Phone Camera)',
      whyFits: 'Clamps securely onto 22.2mm or 31.8mm handlebar section next to display screen.',
      priceEst: '$69 - $89',
      buyUrl: 'https://www.quadlockcase.com/collections/shop-motorcycle',
      svgKey: 'quad-lock'
    }
  ];

  const categories = ['All', ...PART_CATEGORIES];

  const filteredParts = partsCatalog.filter(part => {
    const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
    const matchesSearch = part.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.whyFits.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.compatibility.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredResearchLinks = researchLinks.filter(link => {
    const matchesCategory = selectedCategory === 'All' || link.category === selectedCategory;
    const matchesSearch = !normalizedSearch || link.title.toLowerCase().includes(normalizedSearch) ||
      link.url.toLowerCase().includes(normalizedSearch) || link.category.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <ShoppingBag size={26} color="#34d399" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Master Verified Replacement Parts Store</h2>
            <p style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Click any product's thumbnail graphic to enlarge in full-screen mode, or click Buy Product to visit the store page.</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search parts by name, brake, tire, shock, freewheel, throttle, or spec..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px 10px 40px',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === cat ? '#ffffff' : '#9ca3af',
                  border: `1px solid ${selectedCategory === cat ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Owner-curated external research links use the same bike-part taxonomy. */}
      <section className="glass-card" style={{ padding: '24px', border: '1px solid rgba(245,158,11,0.28)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: filteredResearchLinks.length ? 16 : 0 }}>
          <div>
            <div style={{ color: '#fbbf24', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Owner-saved research links</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f3f4f6' }}>External Parts & Component Leads</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: 5, maxWidth: 760 }}>Useful websites saved by the owner from approved AI research. These listings are supplementary and may change; confirm current price, availability, dimensions, and fitment before purchasing.</p>
          </div>
          <span style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', borderRadius: 9999, padding: '5px 10px', fontSize: '0.7rem', fontWeight: 700 }}>{researchLinks.length} SAVED</span>
        </div>

        {linksLoading && <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Loading saved research links…</p>}
        {linksError && <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '9px 11px', fontSize: '0.78rem', marginTop: 12 }}>{linksError}</div>}
        {!linksLoading && !linksError && researchLinks.length === 0 && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: 10 }}>No research links have been saved yet. The owner can save useful sources directly from the AI Researcher.</p>}
        {!linksLoading && researchLinks.length > 0 && filteredResearchLinks.length === 0 && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: 10 }}>No saved research links match the selected category or search.</p>}

        {filteredResearchLinks.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {filteredResearchLinks.map(link => (
              <article key={link.id} style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(0,0,0,0.24)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                  <span className="badge badge-emerald">{link.category}</span>
                  <span style={{ color: '#fbbf24', fontSize: '0.64rem', fontWeight: 800 }}>EXTERNAL LEAD</span>
                </div>
                <div>
                  <h4 style={{ color: '#f3f4f6', fontSize: '0.94rem', fontWeight: 750, overflowWrap: 'anywhere' }}>{link.title}</h4>
                  <div style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: 3, overflowWrap: 'anywhere' }}>{linkHostname(link.url)}</div>
                </div>
                <div style={{ color: '#d1d5db', fontSize: '0.75rem', lineHeight: 1.5, background: 'rgba(245,158,11,0.07)', borderRadius: 7, padding: 8 }}>Owner-saved web listing. Compatibility and availability are not internally verified.</div>
                <div style={{ color: '#6b7280', fontSize: '0.68rem' }}>Saved {new Date(link.savedAt).toLocaleDateString()}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, minWidth: 150, justifyContent: 'center', padding: '8px 10px', fontSize: '0.76rem', textDecoration: 'none' }}>Visit website <ExternalLink size={13} /></a>
                  {isOwner && confirmRemoveId !== link.id && <button type="button" onClick={() => setConfirmRemoveId(link.id)} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', borderRadius: 7, padding: '7px 9px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>Remove</button>}
                  {isOwner && confirmRemoveId === link.id && (
                    <div style={{ display: 'flex', gap: 6, flexBasis: '100%', alignItems: 'center' }}>
                      <span style={{ color: '#fca5a5', fontSize: '0.7rem', flex: 1 }}>Remove this public link?</span>
                      <button type="button" disabled={removingId === link.id} onClick={() => removeResearchLink(link.id)} style={{ background: '#b91c1c', border: 'none', color: '#fff', borderRadius: 6, padding: '6px 8px', cursor: removingId === link.id ? 'wait' : 'pointer', fontSize: '0.7rem', fontWeight: 700 }}>{removingId === link.id ? 'Removing…' : 'Confirm'}</button>
                      <button type="button" disabled={removingId === link.id} onClick={() => setConfirmRemoveId(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#9ca3af', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', fontSize: '0.7rem' }}>Cancel</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Parts Grid with Product-Specific Component Thumbnails */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredParts.map((part) => (
          <div 
            key={part.id}
            className="glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              {/* Product Component SVG Graphic Thumbnail */}
              <div 
                onClick={() => setModalImage(part)}
                style={{
                  width: '100%',
                  height: '180px',
                  background: 'rgba(5, 14, 12, 0.95)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  position: 'relative',
                  cursor: 'pointer',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px'
                }}
              >
                {productSvgs[part.svgKey]}

                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(5, 14, 12, 0.85)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <Maximize2 size={12} /> Click to enlarge
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' }}>
                <span className="badge badge-emerald">{part.category}</span>
                <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.95rem' }}>{part.priceEst}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f3f4f6', marginBottom: '4px' }}>
                {part.partName}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, marginBottom: '12px' }}>
                {part.type}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Compatibility Target:</span>
                  <span style={{ color: '#d1d5db' }}>{part.compatibility}</span>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <span style={{ color: '#34d399', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Why It Fits & Advantage:</span>
                  <span style={{ color: '#f3f4f6' }}>{part.whyFits}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <CheckCircle size={14} color="#34d399" /> {part.fitmentStatus}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                  Specs: {part.specs.slice(0, 35)}...
                </span>
              </div>

              {/* Direct Purchase Link Button */}
              <a
                href={part.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                <ShoppingBag size={16} /> View & Buy Product <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen Zoom Lightbox Modal */}
      {modalImage && (
        <div 
          onClick={() => setModalImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(3, 9, 8, 0.92)',
            backdropFilter: 'blur(16px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-card"
            style={{
              maxWidth: '750px',
              width: '100%',
              padding: '32px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.5)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalImage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>{modalImage.category}</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px', textAlign: 'center' }}>
              {modalImage.partName}
            </h3>
            <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px' }}>
              {modalImage.priceEst}
            </p>

            {/* High Res SVG Component Illustration */}
            <div style={{
              width: '100%',
              height: '340px',
              background: 'rgba(5, 14, 12, 0.95)',
              borderRadius: '16px',
              overflow: 'hidden',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              {productSvgs[modalImage.svgKey]}
            </div>

            <div style={{ width: '100%', display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setModalImage(null)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Close Preview
              </button>
              <a
                href={modalImage.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
              >
                <ShoppingBag size={18} /> View & Buy Product ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
