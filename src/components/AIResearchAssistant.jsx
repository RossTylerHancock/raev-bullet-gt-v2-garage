import React, { useState, useEffect } from 'react';
import { RAEV_BIKE_DATA } from '../data/bikeData';
import { Sparkles, Send, Bot, User, HelpCircle, CheckCircle, Lock, Unlock, KeyRound, ShieldAlert } from 'lucide-react';

export default function AIResearchAssistant() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('raev_ai_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello Ross! I am your dedicated RAEV Bullet GT V2 AI Research & Knowledge Assistant. Ask me anything about replacement parts (forks, shocks, handlebars, grips, tires, brakes, freewheels, throttles, bags), wiring pinouts, voltage maps, P-settings (P08 unlock), or battery maintenance for your Metallic Green ebike!"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput.trim() === '3520') {
      setIsUnlocked(true);
      localStorage.setItem('raev_ai_unlocked', 'true');
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect PIN. Access restricted to Ross.');
    }
  };

  const handleLockTool = () => {
    setIsUnlocked(false);
    localStorage.removeItem('raev_ai_unlocked');
  };

  const sampleQuestions = [
    "What replacement front forks can I use?",
    "What handlebar, grip & stem options fit my bike?",
    "Where is the secondary battery mounted on the bike?",
    "How do I unlock top speed to 32-35 MPH via P08?",
    "What 4-piston replacement brake pads fit my calipers?",
    "What freewheel upgrade lets me pedal comfortably at 35 MPH?"
  ];

  const handleAskQuestion = (questionText) => {
    const query = questionText || inputQuery;
    if (!query.trim()) return;

    // Add User Message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let answer = generateSmartAnswer(query);
      setMessages(prev => [...prev, { sender: 'ai', text: answer }]);
      setIsThinking(false);
    }, 400);
  };

  // Comprehensive Fuzzy Token Distance for typos like "replacemetn", "forck", "handlbar"
  const isSimilar = (word, target) => {
    if (word === target || word.includes(target) || target.includes(word)) return true;
    if (Math.abs(word.length - target.length) > 3) return false;
    let matches = 0;
    for (let i = 0; i < Math.min(word.length, target.length); i++) {
      if (word[i] === target[i]) matches++;
    }
    return (matches / Math.max(word.length, target.length)) > 0.65;
  };

  const generateSmartAnswer = (query) => {
    const raw = query.toLowerCase().trim();
    const words = raw.replace(/[^\w\s]/gi, '').split(/\s+/);

    const hasTerm = (...terms) => {
      return words.some(w => terms.some(t => isSimilar(w, t)));
    };

    // 1. FORKS & FRONT SUSPENSION (Fixes typo "replacemetn forks")
    if (hasTerm('fork', 'forks', 'front suspension', 'kke', 'bucklos', 'himalo', 'stanchion')) {
      return `**Verified Compatible Front Suspension Forks for RAEV Bullet GT V2**:
- **Stock Fork Specs**: 60mm Travel Hydraulic Dual Crown Fork, **1-1/8" Straight Steerer (28.6mm)**, **135mm Front Dropout Width**.

- **Compatible Upgrade Options**:
  1. **KKE 20" Inverted Air Suspension Dual Crown Fork**:
     - *Specs*: Motorcycle-style upside-down fork, 120mm travel, 34mm stanchions, air pressure valve & rebound adjustment dial.
     - *Fitment*: 1-1/8" straight steerer, 135mm front dropout.
     - *Price Est*: $280 – $340

  2. **Bucklos 20x4.0 Dual Crown Air Suspension Fork**:
     - *Specs*: 100mm travel air fork with manual lockout lever and preload air adjust.
     - *Fitment*: 1-1/8" straight steerer, 135mm QR dropout.
     - *Price Est*: $160 – $190

  3. **Himalo 20" Inverted Air Suspension Fat Fork**:
     - *Specs*: 120mm air travel with aluminum lower legs and rebound adjustment.
     - *Fitment*: 1-1/8" straight steerer, 135mm QR.
     - *Price Est*: $210 – $250`;
    }

    // 2. REAR SUSPENSION SHOCKS
    if (hasTerm('shock', 'shocks', 'rear shock', 'dnm', 'aoy', 'fastace', 'exa', 'coil', 'air shock')) {
      return `**Verified Compatible Rear Suspension Shocks**:
- **Stock Shock Specs**: 200mm (7.87 inch) Eye-to-Eye Length, **8mm x 24mm Mounting Hardware/Bushings**.

- **Compatible Replacement Options**:
  1. **DNM AOY-36RC Air Rear Shock (200mm x 55mm / 7.87")**:
     - *Features*: **#1 Community Upgrade**. Dual air chambers (main + negative), rebound adjustment dial, and manual lockout lever.
     - *Price Est*: $135 – $155

  2. **DNM DV-22AR Coil Rear Shock (200mm)**:
     - *Features*: Hydraulic rebound damping adjustment dial. Available in 750 lb and 1000 lb coil spring rates for heavy payload riders.
     - *Price Est*: $85 – $105

  3. **Fastace BDA53RC 200mm Air/Coil Piggyback Shock**:
     - *Features*: External oil piggyback reservoir for extreme off-road absorption.
     - *Price Est*: $160 – $190

  4. **EXA Form 291R Coil Shock (200mm)**:
     - *Features*: Adjustable spring collar with red hydraulic rebound dial.
     - *Price Est*: $55 – $70`;
    }

    // 3. HANDLEBARS, GRIPS & STEMS
    if (hasTerm('handlebar', 'handlebars', 'bar', 'bars', 'grip', 'grips', 'stem', 'riser', 'crossbar')) {
      return `**Compatible Handlebar, Grip & Stem Options**:
- **Stock Clamp Specs**: Handlebar Stem Clamp **31.8 mm**, Grip Control Area **22.2 mm (7/8")**, Steerer Tube **1-1/8" (28.6mm threadless)**.

- **Compatible Handlebars**:
  1. **Answer ProTAPER 31.8mm 3" / 4" Moto Riser Handlebars**: 780mm wide (trimmable), 7050-T6 alloy. Raises posture ($65–$85).
  2. **Surly Sunrise Handlebar (31.8mm Clamp)**: 820mm wide, 83mm rise chromoly steel moto bar with crossbar ($75–$90).
  3. **Renthal Fatbar 31.8mm 40mm Riser Handlebar**: Downhill alloy riser ($85).

- **Compatible Stems & Grips**:
  1. **Wake / Fifty-Fifty 31.8mm Shorty MTB Stem**: 45mm reach, 1-1/8" steerer ($18–$24).
  2. **ODI Rogue Lock-On Grips (130mm)**: 22.2mm ID, dual aluminum locking rings ($28–$34).
  3. **Ergon GA2 / GA3 Ergonomic Locking Grips**: Relieves palm & wrist pressure ($32–$38).`;
    }

    // 4. TIRES, TUBES & FLAT PROTECTION
    if (hasTerm('tire', 'tires', 'tyre', 'tyres', 'tube', 'tubes', 'psi', 'pressure', 'flat', 'tannus', 'kenda', 'vee', 'cst', 'maxxis')) {
      return `**Tire, Tube & Flat Protection Options**:
- **Stock Rim Specs**: 20" x 4.0" Fat Bike Rims (80mm Wide, 36 Holes, AV33mm Schrader Valve).
- **Verified Replacement Tires (20" x 4.0")**:
  1. **Vee Tire Co. Speedster 20x4.0**: MPC E-50 rated street slick. Low rolling resistance, whisper quiet, **+2-4 miles range increase** ($65-$75).
  2. **Vee Tire Co. E-Huntsman 20x4.0**: Over-Ride puncture layer, moto tread pattern ($79-$89).
  3. **Vee Tire Co. Snowball 20x4.0**: Studdable tread for snow, ice & wet winter pavement ($85-$95).
  4. **CST BFT (Big Fat Tire) 20x4.0**: EPS Puncture Shield off-road knobby for sand & dirt ($45-$55).
  5. **Maxxis Minion FBR / FBF 20x4.0**: EXO Puncture downhill off-road fat tire ($95-$110).
- **Flat Protection**: Tannus Armour 20x4.0 15mm Foam Inserts ($99 pair) & FlatOut Kevlar Sealant ($18-$24).`;
    }

    // 5. BRAKES, PADS & ROTORS
    if (hasTerm('brake', 'brakes', 'pad', 'pads', 'caliper', 'calipers', 'rotor', 'rotors', 'stopping', 'tektro', 'shimano', 'magura')) {
      return `**Brake Hardware Specs & Recommended Replacements**:
- **Stock Calipers**: RAEV 4-Piston Hydraulic Disc Calipers with 180mm stainless steel 6-bolt ISO rotors & 2-pin Julet electric cut-off switches.
- **Top Replacement Brake Pads**:
  1. **Shimano D03S (Resin) / D02S (Sintered Metallic)**: 4-piston D-type shape (Zee/Saint/XT footprint). Metallic D02S recommended for 35 MPH stopping power ($18-$26).
  2. **Tektro E10.11 / P20.11 (Resin/Organic)**: Direct factory match footprint ($14-$18).
  3. **Miles Wide / Gorilla Ceramic Composite Pads**: High heat resistance, eliminates squealing ($25-$32).
  4. **Galfer FD426 Sintered G1375 Pads**: Severe duty downhill sintered pads ($29-$38).
- **Rotor Upgrades**: Shimano SM-RT66 180mm ISO 6-bolt rotors & Galfer Fixed Wave 180mm 2.0mm extra-thick rotors ($24-$44).`;
    }

    // 6. DRIVETRAIN, FREEWHEELS, CRANKS & PEDALS
    if (hasTerm('freewheel', 'pedal', 'pedals', 'crank', 'cranks', 'sprocket', 'derailleur', 'chain', 'chainring', 'dnp', 'shimano')) {
      return `**Drivetrain & Pedaling Hardware Options**:
- **Top Speed Pedaling Freewheel Upgrade**: **DNP Epoch 7-Speed Freewheel (11-28T)** ($32-$42). The 11T small sprocket replaces stock 14T and allows comfortable pedaling input at **32-35 MPH** without ghost pedaling!
- **Narrow-Wide Chainring**: **Deckas 52T 130 BCD Chainring** ($22-$28). CNC aluminum narrow-wide teeth eliminate chain drop at speed.
- **Pedals (9/16" Thread)**:
  1. **Race Face Chester Composite Pedals**: Chromoly spindle with 8 steel pins per side ($45-$55).
  2. **Redshift Arclight Smart LED Pedals**: Auto-sensored white/red LED pedal modules ($139-$149).
- **Crank Arms**: 170mm Forged Alloy Square Taper Crank Arms (JIS BB interface, M8x1.0 bolts).
- **E-Bike Chain**: KMC e8 / KMC e9 Heavy Duty Nickel-Plated Chain (124+ links, 450kgf tensile strength).
- **Derailleur**: Shimano Acera RD-M360 7/8-Speed Rear Derailleur ($28-$35).`;
    }

    // 7. BATTERIES & CHARGING (Strict word matching - "wh" requires exact word match, not "what")
    if (hasTerm('battery', 'batteries', 'bms', 'charging', 'charger', 'bms', 'datex2') || (words.includes('ah') || words.includes('wh'))) {
      return `**RAEV Bullet GT V2 Battery Architecture & Placement**:
- **Main Frame Battery**: **52V 20Ah** (1,040 Wh) mounted on the primary diagonal down tube (Samsung 21700-50E cells, 14S4P arrangement).
- **Secondary Battery**: **52V 8Ah** (416 Wh) mounted **BELOW the main battery** underneath the down-tube pack.
- **Combined System Capacity**: **52V 28Ah** (**1,456 Wh Total Capacity**).
- **Physical Layout Note**: Clean top tube frame line—there is **NO battery on top**. The secondary battery is slung directly underneath the primary down-tube battery.
- **Charging Protocol**: 52V 3A Fast Charger included (approx 7 hrs for 20Ah pack). 52V 4A/5A Smart Fast Chargers available for 4-hr fast charging ($55-$75).
- **BMS Protections**: Over-charge (58.8V), Over-discharge (41.5V), 70A overcurrent, and dual NTC thermal cutoff sensors (>65°C / 149°F).`;
    }

    // 8. SPEED UNLOCK & P-SETTINGS
    if (hasTerm('unlock', 'p08', 'speed limit', 'top speed', 'psetting', 'psettings', 'p05', 'p14', 'p15')) {
      return `**Off-Road Top Speed Unlock Protocol (P08 Parameter)**:
1. Turn on display by holding **POWER** for 2 seconds.
2. Press and hold **UP (+)** and **DOWN (-)** for 3 seconds to open P-Settings.
3. Tap **POWER** repeatedly until **P08** is displayed on screen.
4. Press **UP (+)** to increase the value from \`32\` to \`100\` (Off-Road Limitless Mode).
5. Hold **POWER** for 3 seconds to save and exit.

*Result*: Motor speed limit is removed, unlocking **32–35 MPH** top speed via 1500W peak current delivery!

📺 **Video Tutorial**: Watch the step-by-step video guide here:
https://www.youtube.com/watch?v=_i-d3wGp6AQ`;
    }

    // 9. THROTTLES
    if (hasTerm('throttle', 'twist', 'thumb', 'wuxing')) {
      return `**Throttle Specification & Twist Conversion**:
- **Stock Throttle**: Right-hand Thumb Throttle with 3-pin Julet yellow waterproof connector.
- **Twist Conversion Kits (3-Pin Julet Yellow Plug)**:
  1. **Wuxing 130X Half-Twist Throttle Kit**: Plug-and-play Julet yellow plug ($20-$28).
  2. **Wuxing 20X Full-Twist Throttle Kit**: Full length motorcycle twist grip ($22-$30).
  3. **P-51 Style Half-Twist Throttle with Kill Switch**: Integrated red kill switch button ($25-$35).
- **Wiring Pinout**: Red (+5V VCC), Black (GND), Green/White (0.8V-4.2V variable signal).`;
    }

    // 10. BOLT SIZES & FASTENERS
    if (hasTerm('bolt', 'bolts', 'nut', 'nuts', 'axle', 'fastener', 'torque', 'wrench', 'socket')) {
      return `**Master Hardware Fastener & Torque Specifications**:
- **Front Wheel Axle Nuts**: M14 Nut (1.5mm Fine Thread) | **19mm Socket** | Torque: 35–40 Nm.
- **Rear Hub Motor Axle Nuts**: M16 Flanged Nut (1.5mm Fine Thread) | **21mm Socket** with torque washers | Torque: 70–75 Nm.
- **Brake Rotors**: M5 x 10mm Torx T25 Bolts (6-bolt ISO pattern) | Torque: 6.2 Nm.
- **Brake Caliper Mounts**: M6 x 18mm / 20mm Allen Bolts | **5mm Hex Key** | Torque: 9–10 Nm.
- **Rear Shock Mounts**: M8 x 45mm / 50mm Cap Screws (8x24mm bushings) | **6mm Hex + 13mm Wrench** | Torque: 18–20 Nm.
- **Handlebar Stem Faceplate**: M6 x 18mm Bolts (4x) | **5mm Hex Key** | Torque: 6–7 Nm.
- **Bench Seat Mounts**: M8 Nuts (4x studs) | **13mm Socket Wrench** | Torque: 14–16 Nm.`;
    }

    // 11. WIRING & HARNESS MAP
    if (hasTerm('wire', 'wires', 'harness', 'voltage', 'pinout', 'connector', 'julet', 'xt60', 'xt90')) {
      return `**Electrical Voltage & Harness Map**:
- **Motor Main Cable**: 9-Pin Julet Z910 Waterproof (10 AWG Phase Wires 0-58.8V AC PWM + 22 AWG Hall/Speed 5V DC).
- **Main Battery Harness**: XT60 / XT90 Anti-Spark (10/12 AWG silicone wire, 41.5V depleted to 58.8V full charge DC).
- **Display Cable**: 5-Pin Julet Green (Red 52V VCC, Black GND, Blue Key Output, Yellow TX, Green RX).
- **Brake Cut-off Sensors**: 2-Pin Julet Red (+5V open / 0V grounded on lever pull).
- **Throttle**: 3-Pin Julet Yellow (+5V VCC, GND, 0.8V-4.2V signal).
- **Headlight & Horn**: 3-Pin/4-Pin Julet (52V input stepped down inside headlight to 12V DC for LED halo array).`;
    }

    // 12. ERROR CODES
    if (hasTerm('error', 'fault', 'code', 'e06', 'e07', 'e08', 'e09', 'e10', 'e11', 'e12')) {
      return `**Diagnostic Error Code Quick Reference**:
- **E06 (Undervoltage)**: Battery voltage dropped below 41.5V. Fully charge battery & check connector pins.
- **E07 (Motor Hall Sensor Fault)**: Signal loss between controller & motor. Check 9-pin Z910 connector on rear right chainstay for alignment arrows.
- **E08 (Throttle Error)**: Throttle signal out of 0.8V–4.2V range. Check 3-pin Julet yellow plug near stem.
- **E09 (Controller Thermal/Overcurrent)**: Controller overload. Allow 10 min cooling period.
- **E10/E11 (Communication Fault)**: Display RX/TX wire break. Inspect 5-pin Julet green display harness behind headlight.
- **E12 (Brake Cut-off Triggered)**: Microswitch stuck in brake lever. Check lever return spring clearance.`;
    }

    // Default Fallback
    return `Here are the matching technical details & verified options from your **RAEV Bullet GT V2 Knowledge Base**:

- **Motor & Controller**: 52V 1500W Peak / 750W Nominal Rear Hub Motor (85–90 Nm Torque), 52V 30A 12-MOSFET Controller.
- **Dual Battery Setup**: 52V 20Ah Main Down-Tube Battery + 52V 8Ah Secondary Battery mounted **BELOW the main battery** (1,456 Wh Total).
- **Popular Compatible Upgrades**:
  - *Front Forks*: KKE 20" Inverted Air Suspension Fork, Bucklos 20x4.0 Dual Crown Air Fork.
  - *Rear Shocks*: DNM AOY-36RC Air Rear Shock (200x55mm / 7.87").
  - *Handlebars*: Answer ProTAPER 31.8mm 3"/4" Moto Risers, Surly Sunrise BMX Bars.
  - *Grips & Stem*: ODI Rogue Lock-On Grips (22.2mm), Wake 31.8mm Shorty Stem.
  - *Freewheel*: DNP Epoch 11-28T 7-Speed Freewheel (for 35 MPH pedaling).

For full search across all 35+ items, click the **"Verified Parts Catalog"** tab in the top navigation bar!`;
  };

  if (!isUnlocked) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto 0 auto', animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(5, 14, 12, 0.95), rgba(6, 78, 59, 0.4))',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          textAlign: 'center',
          padding: '36px 28px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
          }}>
            <Lock size={32} color="#ffffff" />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '4px 12px', borderRadius: '9999px', marginBottom: '14px' }}>
            <ShieldAlert size={14} color="#34d399" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.05em' }}>
              OWNER ACCESS RESTRICTED
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f3f4f6', marginBottom: '8px' }}>
            Ross Owner Access Required
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px', maxWidth: '460px', margin: '0 auto 24px auto' }}>
            To protect dedicated AI tokens and API quota from public visitors, access to the Deep AI Researcher is locked. Enter your 4-digit PIN to proceed.
          </p>

          {pinError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              color: '#f87171',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              {pinError}
            </div>
          )}

          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
              <KeyRound size={18} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="password"
                maxLength={6}
                placeholder="Enter 4-Digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  background: 'rgba(3, 9, 8, 0.9)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                maxWidth: '280px',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Unlock size={18} /> Unlock AI Researcher
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner */}
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <Sparkles size={24} color="#34d399" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Deep AI Bike Research Assistant</h2>
                <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Unlock size={12} /> OWNER UNLOCKED
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px' }}>
                Pre-trained with complete RAEV Bullet GT V2 owner manual & 35+ verified parts dataset.
              </p>
            </div>
          </div>

          <button
            onClick={handleLockTool}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#9ca3af',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Lock size={14} /> Lock AI Tool
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleAskQuestion(q)}
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '9999px',
              padding: '6px 14px',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <HelpCircle size={14} /> {q}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '500px' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '6px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={18} color="#ffffff" />
                </div>
              )}

              <div style={{
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #10b981, #047857)' : 'rgba(255, 255, 255, 0.05)',
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(16, 185, 129, 0.25)',
                color: '#ffffff',
                padding: '14px 18px',
                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                fontSize: '0.88rem',
                whiteSpace: 'pre-line',
                lineHeight: 1.6
              }}>
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={18} color="#ffffff" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#9ca3af', fontSize: '0.8rem' }}>
              <Bot size={18} color="#34d399" /> AI Assistant searching RAEV Bullet GT V2 Parts & Knowledge Base...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          style={{ display: 'flex', gap: '10px', marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}
        >
          <input
            type="text"
            placeholder="Ask about forks, shocks, handlebars, grips, tires, brakes, freewheel..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 20px' }}>
            <Send size={18} /> Ask
          </button>
        </form>
      </div>
    </div>
  );
}
