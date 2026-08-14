export const RAEV_BIKE_DATA = {
  model: "RAEV Bullet GT V2",
  edition: "Dual Battery 52V 28Ah Series (Metallic Green)",
  colorway: "Metallic Green",
  manufacturer: "RAEV Bikes",
  website: "https://raevbikes.com",
  supportEmail: "support@raevbikes.com",
  supportPhone: "+1 (840) 206-7884",

  heroStats: {
    peakPower: "1500W (750W Nominal)",
    nominalPower: "750W Nominal",
    totalBattery: "52V 28Ah (1,456 Wh Total)",
    topSpeedUnlocked: "32 - 35 MPH",
    maxRange: "100+ Miles (PAS 1)",
    payloadCapacity: "330 LBS",
    weight: "89.3 LBS (Dual Batteries)",
    wheelbase: "44.7 IN"
  },

  batteries: {
    primary: {
      name: "Main Down-Tube Battery",
      voltage: "52V Nominal (58.8V Full Charge)",
      capacity: "20Ah",
      energyWh: 1040,
      cells: "Samsung 21700-50E (14S4P - 56 Total Cells)",
      chargeTimeHours: 7.0,
      weight: "11.2 lbs",
      bms: "52V 14S 35A Continuous / 70A Peak Smart BMS with dual NTC temperature sensors (>65°C cutoff)",
      interconnects: "0.2mm pure nickel spot-welded strips"
    },
    secondary: {
      name: "Secondary Battery (Mounted Below Main Battery)",
      voltage: "52V Nominal (58.8V Full Charge)",
      capacity: "8Ah",
      energyWh: 416,
      cells: "Samsung 21700 High-Discharge Cells (14S2P - 28 Total Cells)",
      chargeTimeHours: 2.5,
      weight: "5.4 lbs",
      placement: "Mounted directly underneath the primary down-tube battery pack",
      bms: "52V 14S 20A Continuous BMS"
    },
    systemTotalWh: 1456,
    systemTotalAh: 28,
    frameDescription: "Dual Battery setup: 52V 20Ah Main Down-Tube Pack + 52V 8Ah Secondary Pack mounted BELOW the main battery. Clean top tube frame line (NO top tank battery)."
  },

  upgradedDisplay: {
    model: "Official RAEV Upgraded Full Color IPS LCD Display",
    screenSize: "3.5 inch Full Color IPS Matrix Screen",
    connector: "5-Pin Female Julet Green Waterproof Connector",
    operatingVoltage: "52V DC Input (24V - 60V compatible)",
    features: [
      "Real-time voltage readout down to 0.1V precision (58.8V full / 41.5V cutoff)",
      "Real-time wattmeter power consumption bar (0W to 1560W peak output)",
      "Dual 52V 28Ah (20Ah + 8Ah) battery telemetry status",
      "Custom display themes (Sport / Eco / Racing telemetry mode)",
      "Speedometer (MPH/KMH), Trip Odometer, Total Odometer & Ride Time",
      "Automatic night backlight sensor & error code diagnostic popup"
    ]
  },

  wireMap: [
    { harness: "Motor Main Cable", connector: "9-Pin Julet Z910 / L1019 Waterproof", gauge: "10 AWG (Phase) / 22 AWG (Signal)", colors: "Phase: Yellow, Green, Blue | Hall: Red (+5V), Black (GND), Yellow, Green, Blue | Speed: White", voltage: "0V - 58.8V AC PWM (Phases) | +5V DC (Hall/Speed Sensors)", function: "3-Phase AC motor power transmission & Hall rotor position feedback." },
    { harness: "Main Battery Harness", connector: "XT60 / XT90 Anti-Spark", gauge: "10 AWG / 12 AWG Flexible Silicone", colors: "Red (+), Black (-)", voltage: "41.5V DC (Depleted) to 58.8V DC (Full Charge)", function: "Primary DC power feed from dual battery parallel discharge converter into 30A controller." },
    { harness: "Display Panel Cable", connector: "5-Pin Julet Green Waterproof", gauge: "22 AWG Shielded", colors: "Red (VCC), Black (GND), Blue (Key Output), Yellow (TX), Green (RX)", voltage: "52V DC (Main VCC) | 0V - 5V DC (Serial Data Lines)", function: "Telemetry data, power switch circuit & PAS command signal." },
    { harness: "Brake Cut-off Sensors", connector: "2-Pin Julet Red Waterproof", gauge: "22 AWG", colors: "Blue/Yellow (Signal), Black (GND)", voltage: "+5V DC (Open) | 0V DC (Pulled to GND on lever pull)", function: "Instantly cuts motor power when brake levers are squeezed." },
    { harness: "Throttle Harness", connector: "3-Pin Julet Yellow Waterproof", gauge: "22 AWG", colors: "Red (+5V VCC), Black (GND), Green/White (Signal)", voltage: "+5V DC Input | 0.8V to 4.2V DC Output Signal", function: "Hall throttle speed demand signal to controller." },
    { harness: "Headlight & Horn Harness", connector: "3-Pin / 4-Pin Julet Waterproof", gauge: "20 AWG / 22 AWG", colors: "Brown (52V Power), Black (GND), Yellow (Horn)", voltage: "52V DC (Stepped down inside LED headlamp driver to 12V)", function: "Powers 6\" retro halo LED headlight & internal electric horn." },
    { harness: "Rear Brake Light Cable", connector: "3-Pin Julet Red/Yellow", gauge: "22 AWG", colors: "Black (GND), Blue (12V Tail), Red (12V Brake)", voltage: "12V DC (Stepped down from 52V bus)", function: "Tail running lamp & active 100% brake light brightening." }
  ],

  boltSizes: [
    { component: "Front Wheel Axle Nuts", size: "M14 Nut", thread: "1.5mm Fine Thread", tool: "19mm Socket / Wrench", torque: "35 - 40 Nm" },
    { component: "Rear Hub Motor Axle Nuts", size: "M16 Flanged Nut", thread: "1.5mm Fine Thread", tool: "21mm Socket / Wrench", torque: "70 - 75 Nm" },
    { component: "Brake Rotors (Front & Rear)", size: "M5 x 10mm Bolts (6x)", thread: "Standard Metric Torx T25", tool: "Torx T25 Wrench", torque: "6.2 Nm" },
    { component: "Brake Caliper Mount Bolts", size: "M6 x 18mm / 20mm", thread: "Standard Metric", tool: "5mm Allen Hex Key", torque: "9 - 10 Nm" },
    { component: "Handlebar Stem Faceplate Bolts", size: "M6 x 18mm Bolts (4x)", thread: "Standard Metric", tool: "5mm Allen Hex Key", torque: "6 - 7 Nm" },
    { component: "Stem Pinch Clamp Bolts", size: "M6 x 20mm Bolts (2x)", thread: "Standard Metric", tool: "5mm Allen Hex Key", torque: "9 - 10 Nm" },
    { component: "Rear Shock Mounting Bolts", size: "M8 x 45mm / 50mm", thread: "Standard Metric (8x24mm Bushings)", tool: "6mm Allen Hex + 13mm Wrench", torque: "18 - 20 Nm" },
    { component: "Crank Arm Retaining Bolts", size: "M8 x 1.0mm Bolts", thread: "Metric Fine Thread", tool: "8mm Allen Hex Key", torque: "35 - 40 Nm" },
    { component: "Bench Seat Mounting Studs", size: "M8 Nuts (4x)", thread: "Standard Metric", tool: "13mm Socket Wrench", torque: "14 - 16 Nm" },
    { component: "Fender & Rack Bolts", size: "M5 x 12mm / 16mm", thread: "Standard Metric", tool: "4mm Allen Hex Key", torque: "4 - 5 Nm" }
  ],

  motorInternalArchitecture: {
    type: "52V Brushless DC Rear Hub Motor (BLDC - 100% Brushless, No Brushes to wear out)",
    statorCore: "100mm Stator stack of 0.35mm high-permeability Silicon Steel Laminations",
    windings: "180°C High-Temperature Enamel-Coated Pure Copper Wire",
    magnets: "46 to 52 Neodymium N45H Rare-Earth Permanent Magnets bonded with high-temp epoxy",
    hallSensors: "3x Honeywell SS41F Bipolar Hall Effect Sensors mounted at 120° phase spacing",
    bearings: "Dual Sealed Deep-Groove Ball Bearings (6202-2RS / 6004-2RS)",
    gearing: "High-Torque Planetary Reduction Gear Cluster with 1-way sprag clutch",
    axle: "16mm Solid Forged Chromoly Steel Axle with dual flat keyway cutouts"
  },

  specs: [
    {
      category: "Motor & Power System",
      items: [
        { label: "Motor Type", value: "52V Brushless Rear Hub Motor (BLDC)", details: "100% Brushless (No wear brushes). 46-52 N45H Neodymium magnets." },
        { label: "Nominal Power Rating", value: "750 Watts", details: "Legal street rating in North America (Class 2/3)" },
        { label: "Peak Power Output", value: "1500 Watts", details: "Calculated peak burst at 52V x 30A = 1560W" },
        { label: "Peak Torque", value: "85 - 90 Nm", details: "High torque curve for 25° incline climbing" },
        { label: "Controller Specification", value: "52V 30A (12 Enhanced MOSFETs)", details: "Potted thermal dissipation controller" }
      ]
    },
    {
      category: "Battery & Electrical",
      items: [
        { label: "System Nominal Voltage", value: "52V Nominal (58.8V Full Charge)", details: "Higher efficiency & lower heat draw than 48V" },
        { label: "Main Frame Battery", value: "52V 20Ah (1,040 Wh)", details: "Samsung 21700-50E cells (14S4P - 56 cells, 35A BMS)" },
        { label: "Secondary Lower Battery", value: "52V 8Ah (416 Wh)", details: "Mounted directly below the main down-tube battery (14S2P - 28 cells)" },
        { label: "Total Battery Capacity", value: "52V 28Ah (1,456 Wh Total)", details: "Dual battery system (20Ah Main + 8Ah Secondary below)" },
        { label: "Battery Charger", value: "52V 3A Smart Fast Charger", details: "Auto cutoff & thermal regulation protection" }
      ]
    },
    {
      category: "Speed & Range Performance",
      items: [
        { label: "Class 2 Factory Default", value: "20 MPH", details: "Throttle-only max speed out of the box" },
        { label: "Class 3 Factory Mode", value: "28 MPH", details: "Pedal assist (PAS) legal upper threshold" },
        { label: "Off-Road Unlocked Speed", value: "32 - 35 MPH", details: "Configurable via display parameter P08 set to 100" },
        { label: "Class 2 Throttle Range", value: "50+ Miles", details: "Throttle-only on dual 52V 28Ah batteries" },
        { label: "Class 1 PAS Range", value: "100+ Miles", details: "Pedal assist level 1 under optimal conditions" }
      ]
    },
    {
      category: "Cockpit, Grips & Stem",
      items: [
        { label: "Handlebar Dimensions", value: "22.2mm Grips / 31.8mm Stem Clamp", details: "660mm width with 100mm rise & crossbar" },
        { label: "Handlebar Grips", value: "Custom Stitched Synthetic Leather", details: "Dual locking alloy end collars (130mm length)" },
        { label: "Handlebar Stem", value: "1-1/8\" Threadless BMX/MTB Shorty", details: "45mm reach, M6 hex hardware" },
        { label: "Upgraded Color Display", value: "3.5\" Full Color IPS Matrix", details: "Real-time voltage (0.1V precision), wattmeter, dual 28Ah battery telemetry" }
      ]
    },
    {
      category: "Drivetrain, Pedals & Seat",
      items: [
        { label: "Chainring / Front Sprocket", value: "52T Alloy with Dual Bash Guard", details: "Prevents chain derailment at 35+ MPH" },
        { label: "Rear Freewheel Sprocket", value: "Shimano MF-TZ500-7 (14-28T)", details: "7-Speed screw-on freewheel steps" },
        { label: "Rear Derailleur", value: "Shimano Altus RD-M310 7-Speed", details: "Index shifting with high-density pulleys" },
        { label: "Chain", value: "KMC Z7 / KMC e7 Heavy-Duty", details: "1/2\" x 3/32\", 124 links with MissingLink connector" },
        { label: "Pedals", value: "Alloy Platform (9/16\" M12x1.25)", details: "Sealed bearings with traction pins & reflectors" },
        { label: "Crank Arms", value: "170mm Forged Alloy (Square Taper)", details: "M8x1.0 retaining bolts with dust caps" },
        { label: "Saddle / Bench Seat", value: "Custom Memory Foam Bench Seat", details: "600mm length, synthetic leather, 4x M8 mounting studs" }
      ]
    },
    {
      category: "Wheels, Tires & Brakes",
      items: [
        { label: "Rims", value: "20\" Alloy Double-Wall (80mm Wide)", details: "36-hole drilling with black powder coat" },
        { label: "Spokes", value: "12G Rear Motor / 13G Front Hub", details: "Heavy-gauge stainless steel with brass nipples" },
        { label: "Tires & Tubes", value: "Kenda Kraze 20\" x 4.0\" Fat Tires", details: "AV33mm Schrader valve 20x4.0 butyl inner tubes" },
        { label: "Brakes", value: "RAEV 4-Piston Hydraulic Disc", details: "180mm rotors & 2-pin Julet motor cut-off sensors" }
      ]
    }
  ],

  communityMods: [
    {
      component: "Replacement Brake Pads",
      stockSpec: "RAEV 4-Piston Hydraulic Disc Calipers",
      topPicks: [
        { name: "Tektro E10.11 / P20.11", type: "Resin/Organic", compatibility: "Direct Match for Tektro 4-Piston Calipers", notes: "Quiet, smooth stopping power for city riding." },
        { name: "Shimano D03S (Resin) / D02S (Sintered Metallic)", type: "Resin / Sintered", compatibility: "4-Piston Footprint (Zee/Saint/XT)", notes: "Metallic pads recommended for 35+ MPH high-speed stops & wet conditions." },
        { name: "Gorilla Brakes / Miles Wide Ceramic Pads", type: "Ceramic Compound", compatibility: "4-Piston Heavy Duty", notes: "Eliminates squealing and offers high thermal resistance for 90+ lb bikes." }
      ]
    },
    {
      component: "Rear Suspension Shocks",
      stockSpec: "Stock 200mm Coil Spring Shock",
      topPicks: [
        { name: "DNM AOY-36RC Air Shock (200mm x 55mm)", type: "Air Suspension Shock", compatibility: "200mm Eye-to-Eye, 8x24mm Bushings", notes: "#1 Community Upgrade. Adjustable air pressure, rebound dial, and lockout lever." },
        { name: "DNM DV-22AR Coil Shock (200mm)", type: "Hydraulic Rebound Coil", compatibility: "200mm Eye-to-Eye, 750/1000 lb Spring", notes: "Hydraulic rebound adjustment dial for heavy payload riders." },
        { name: "Fastace BDA53RC (200mm)", type: "Air/Coil Piggyback Shock", compatibility: "200mm Eye-to-Eye Downhill", notes: "Heavy-duty dual chamber shock for aggressive trail riding." }
      ]
    },
    {
      component: "Front Suspension Fork",
      stockSpec: "Stock 60mm Hydraulic Dual Crown Fork",
      topPicks: [
        { name: "KKE 20\" Fat Tire Inverted Air Fork", type: "Inverted Dual Crown Air Fork", compatibility: "1-1/8\" Straight Steerer, 135mm Dropout", notes: "120mm travel, motorcycle-style inverted air fork with rebound control." },
        { name: "Bucklos 20x4.0 Dual Crown Air Fork", type: "Dual Crown Air Fork", compatibility: "1-1/8\" Straight Steerer, 135mm QR", notes: "Lightweight air fork with lockout and preload adjustment." }
      ]
    },
    {
      component: "Twist Throttle Conversion",
      stockSpec: "Right-hand Thumb Throttle",
      topPicks: [
        { name: "Wuxing 130X / P-51 Half-Twist Throttle", type: "Half-Twist Throttle Kit", compatibility: "3-Pin Female Julet Waterproof Connector", notes: "Red (+5V), Black (GND), Green/White (Signal). Prevents thumb fatigue on long rides." }
      ]
    },
    {
      component: "Tires & Flat Protection",
      stockSpec: "Kenda Kraze 20\" x 4.0\" Street Fat Tires",
      topPicks: [
        { name: "Vee Tire Co. Speedster 20x4.0", type: "Street Slick Compound", compatibility: "20x4.0 Fat Tire Rims", notes: "Whisper-quiet riding, low rolling resistance, +2-3 miles range increase." },
        { name: "Vee Tire Co. E-Huntsman 20x4.0", type: "Heavy Duty Moto Tread", compatibility: "20x4.0 Fat Tire Rims", notes: "Aggressive street/moto tread for sharp cornering and long tread life." },
        { name: "Tannus Armour 20x4.0 Inserts + FlatOut", type: "Puncture Armor System", compatibility: "20x4.0 Fat Tubes", notes: "15mm thick foam shield prevents thorn, glass, and pinch flat punctures." }
      ]
    }
  ],

  pSettings: [
    { code: "P01", name: "Display Backlight Brightness", default: "3", range: "1 (Dim) to 3 (Max)", description: "Controls the LCD screen backlight brightness intensity." },
    { code: "P02", name: "Speed / Distance Unit", default: "1", range: "0 (KM) / 1 (Miles)", description: "Selects imperial (MPH/Miles) or metric (KMH/KM) units." },
    { code: "P03", name: "System Voltage Rating", default: "52V", range: "24V - 60V", description: "CRITICAL: Must remain at 52V for accurate battery indicator readouts." },
    { code: "P04", name: "Auto Sleep Timeout", default: "10 min", range: "0 - 60 min", description: "Minutes of inactivity before display automatically powers off." },
    { code: "P05", name: "Pedal Assist (PAS) Levels", default: "3", range: "3 Levels (PAS 1-3)", description: "Controls pedal assist output granularity (Factory default is 3 PAS levels: PAS 1 Low, PAS 2 Med, PAS 3 High)." },
    { code: "P06", name: "Wheel Diameter Size", default: "20.0", range: "Inches", description: "CRITICAL: Must remain set to 20.0 for accurate speedometer calculation." },
    { code: "P07", name: "Speed Sensor Magnets", default: "1", range: "1 - 100", description: "Number of magnetic pulses per wheel revolution for speed sensing." },
    { code: "P08", name: "Speed Limit Threshold (Unlock)", default: "32 km/h", range: "0 - 100 km/h", description: "SPEED UNLOCK: Set value to 100 to enable Off-Road Mode up to 32 - 35 MPH." },
    { code: "P09", name: "Zero Start / Kick Start", default: "0", range: "0 (Zero Start) / 1 (Kick)", description: "0 = Throttle works from 0 MPH; 1 = Requires pedaling before throttle activates." },
    { code: "P10", name: "Drive Mode Selection", default: "2", range: "0, 1, 2", description: "0 = Pedal Assist only; 1 = Throttle only; 2 = PAS + Throttle both active." },
    { code: "P11", name: "PAS Pickup Sensitivity", default: "3", range: "1 - 24", description: "1 = Instant motor engagement upon crank rotation; 24 = Gradual pickup." },
    { code: "P12", name: "PAS Acceleration Strength", default: "3", range: "1 - 5", description: "Torque surge setting (1 = Gentle start; 5 = Maximum 1500W launch." },
    { code: "P13", name: "Cadence Magnet Count", default: "12", range: "5, 8, 12", description: "Number of magnets on bottom bracket cadence disc." },
    { code: "P14", name: "Controller Current Limit", default: "30A", range: "1 - 30A", description: "Maximum amperage allowed to hub motor. Set to 30A for 1500W peak." },
    { code: "P15", name: "Low-Voltage Cutoff", default: "41.5V", range: "Volts", description: "Protects 52V lithium cells from over-discharging damage." }
  ],

  errorCodes: [
    { code: "E06", title: "Battery Undervoltage Warning", cause: "Total voltage dropped below 41.5V low-voltage limit.", solution: "Charge 52V batteries fully. Check frame & lower battery connector pins." },
    { code: "E07", title: "Motor Hall Sensor Fault", cause: "Hub motor position sensor signal lost or shorted.", solution: "Inspect 9-pin quick-disconnect plug on rear right frame chainstay. Ensure alignment arrows match and plug is fully seated." },
    { code: "E08", title: "Throttle Signal Error", cause: "Twist throttle signal voltage out of range or stuck.", solution: "Check twist throttle spring mechanism. Ensure plug connector near handlebar stem is dry and tightly connected." },
    { code: "E09", title: "Controller Internal Failure", cause: "Controller overcurrent detection or thermal overload.", solution: "Turn bike off for 10 minutes to cool down. Inspect main wiring harness under frame for pinches." },
    { code: "E10", title: "Communication RX Receive Fault", cause: "Display screen is not receiving telemetry data from controller.", solution: "Check main wire harness plug behind retro headlight. Inspect male/female pins for corrosion or bending." },
    { code: "E11", title: "Communication TX Transmit Fault", cause: "Display screen transmit wire signal path broken.", solution: "Inspect display cable leading down from stem to main harness junction box." },
    { code: "E12", title: "Brake Cut-off Switch Triggered", cause: "Hydraulic brake lever microswitch stuck in braking state.", solution: "Verify left and right brake levers snap back fully. Lubricate pivot pin or adjust sensor clearance." }
  ],

  presetMods: [
    { id: "mod-1", title: "DNM AOY-36RC 200mm Air Shock", category: "Suspension", cost: 145, weight: "0.6 lbs", date: "Installed", status: "Active", notes: "Replaced stock coil shock. Adjusted to 120 PSI with rebound damping." },
    { id: "mod-2", title: "Wuxing 130X 3-Pin Half-Twist Throttle", category: "Electrical", cost: 25, weight: "0.3 lbs", date: "Installed", status: "Active", notes: "Plug-and-play Julet 3-pin connector replacement for stock thumb throttle." },
    { id: "mod-3", title: "Tektro E10.11 / Shimano D02S Metallic Pads", category: "Tires & Brakes", cost: 22, weight: "0.1 lbs", date: "Installed", status: "Active", notes: "Sintered metallic 4-piston pads for high-speed 32-35 MPH stopping power." },
    { id: "mod-4", title: "Official RAEV Upgraded Full Color IPS LCD Display", category: "Electrical", cost: 80, weight: "0.4 lbs", date: "Installed", status: "Active", notes: "Plug-and-play 5-pin Julet green connector swap. Displays 0.1V precision voltage & wattmeter." },
    { id: "mod-5", title: "Off-Road Speed Unlock (P08)", category: "Software Tuning", cost: 0, weight: "0 lbs", date: "Programmed", status: "Active", notes: "P08 set to 100 for 32-35 MPH top speed capability." },
    { id: "mod-6", title: "Vee Tire Co. Speedster 20x4.0", category: "Tires & Brakes", cost: 110, weight: "3.2 lbs", date: "Installed", status: "Active", notes: "Whisper quiet street slicks with low rolling resistance." }
  ]
};
