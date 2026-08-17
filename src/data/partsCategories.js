export const PART_CATEGORIES = [
  'Tires & Tubes',
  'Brakes & Rotors',
  'Suspension',
  'Drivetrain',
  'Cockpit & Throttles',
  'Handlebars & Stem',
  'Electrical & Batteries',
  'Storage & Accessories'
];

const CATEGORY_KEYWORDS = [
  ['Handlebars & Stem', /handlebar|handle bar|stem|grip|crossbar|cockpit bar/i],
  ['Brakes & Rotors', /brake|rotor|caliper|brake pad/i],
  ['Tires & Tubes', /tire|tyre|tube|puncture|sealant/i],
  ['Suspension', /suspension|fork|shock|damper/i],
  ['Drivetrain', /drivetrain|freewheel|cassette|chain|chainring|pedal|crank/i],
  ['Electrical & Batteries', /battery|charger|controller|display|electrical|voltage|wiring/i],
  ['Cockpit & Throttles', /throttle|switch|lever|control/i],
  ['Storage & Accessories', /bag|storage|rack|phone|mount|accessor/i]
];

export function suggestPartCategory(value = '') {
  return CATEGORY_KEYWORDS.find(([, pattern]) => pattern.test(value))?.[0] || 'Storage & Accessories';
}
