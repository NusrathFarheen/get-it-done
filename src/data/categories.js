/**
 * GetItDone — Centralized Category Registry
 * Used by: PostJob, Browse, WorkerRegister, WorkerProfile
 *
 * types: 'trade' | 'technical' | 'creative' | 'service'
 */

export const CATEGORIES = [
  // ── Trades & Home ──────────────────────────────────────
  { id: 'plumbing',       label: 'Plumbing',             emoji: '🔧', type: 'trade',     color: '#3b82f6', description: 'Pipe leaks, fittings, drainage' },
  { id: 'electrical',     label: 'Electrical',           emoji: '⚡', type: 'trade',     color: '#f59e0b', description: 'Wiring, switches, panel repairs' },
  { id: 'carpentry',      label: 'Carpentry',            emoji: '🪚', type: 'trade',     color: '#92400e', description: 'Furniture, fittings, woodwork' },
  { id: 'painting',       label: 'Painting',             emoji: '🖌️', type: 'trade',     color: '#ec4899', description: 'Interior & exterior painting' },
  { id: 'masonry',        label: 'Masonry & Tiling',     emoji: '🧱', type: 'trade',     color: '#ef4444', description: 'Tiles, brickwork, flooring' },
  { id: 'roofing',        label: 'Roofing',              emoji: '🏚️', type: 'trade',     color: '#6366f1', description: 'Waterproofing, sheets, repair' },
  { id: 'interior_design',label: 'Interior Design',      emoji: '🛋️', type: 'trade',     color: '#8b5cf6', description: 'Space planning, décor, styling' },
  { id: 'waterproofing',  label: 'Waterproofing',        emoji: '💧', type: 'trade',     color: '#0ea5e9', description: 'Terrace, bathroom, basement sealing' },
  { id: 'false_ceiling',  label: 'False Ceiling & POP',  emoji: '🏗️', type: 'trade',     color: '#64748b', description: 'Gypsum, POP, modular ceilings' },

  // ── Technical & Repairs ────────────────────────────────
  { id: 'laptop_repair',  label: 'Laptop & PC Repair',   emoji: '💻', type: 'technical', color: '#06b6d4', description: 'Hardware, software, virus removal' },
  { id: 'phone_repair',   label: 'Mobile Phone Repair',  emoji: '📱', type: 'technical', color: '#3b82f6', description: 'Screen, battery, charging issues' },
  { id: 'ac_service',     label: 'AC Service & Repair',  emoji: '❄️', type: 'technical', color: '#0284c7', description: 'Gas refill, cleaning, installation' },
  { id: 'appliance_repair',label: 'Appliance Repair',    emoji: '🔩', type: 'technical', color: '#78716c', description: 'Washing machine, fridge, microwave' },
  { id: 'solar',          label: 'Solar Installation',   emoji: '☀️', type: 'technical', color: '#f59e0b', description: 'Solar panels, wiring, maintenance' },
  { id: 'cctv',           label: 'CCTV & Security',      emoji: '📷', type: 'technical', color: '#374151', description: 'Cameras, alarms, access control' },
  { id: 'inverter',       label: 'Inverter & Generator', emoji: '🔋', type: 'technical', color: '#16a34a', description: 'UPS, battery, generator service' },
  { id: 'water_purifier', label: 'Water Purifier / RO',  emoji: '💦', type: 'technical', color: '#22d3ee', description: 'Installation, filter change, repair' },
  { id: 'vehicle_repair', label: 'Vehicle Repair',       emoji: '🚗', type: 'technical', color: '#dc2626', description: 'Bikes, cars, tyres, servicing' },
  { id: 'car_detailing',  label: 'Car Washing & Detailing',emoji: '🧽', type: 'technical', color: '#0369a1', description: 'Full valet, foam wash, polish' },
  { id: 'networking',     label: 'Networking & Wi-Fi',   emoji: '📡', type: 'technical', color: '#7c3aed', description: 'Router setup, LAN, internet issues' },
  { id: 'pest_control',   label: 'Pest Control',         emoji: '🐛', type: 'technical', color: '#65a30d', description: 'Cockroach, termite, rodent control' },

  // ── Creative & Handcraft ───────────────────────────────
  { id: 'henna',          label: 'Henna & Mehndi',       emoji: '🌿', type: 'creative',  color: '#d97706', description: 'Bridal, festive & custom designs' },
  { id: 'baking',         label: 'Baking & Confectionery',emoji: '🎂', type: 'creative',  color: '#f472b6', description: 'Cakes, pastries, custom orders' },
  { id: 'weaving',        label: 'Weaving & Textiles',   emoji: '🧵', type: 'creative',  color: '#a78bfa', description: 'Handloom, fabric arts, weaving' },
  { id: 'crochet',        label: 'Crochet & Knitting',   emoji: '🧶', type: 'creative',  color: '#fb923c', description: 'Garments, home décor, accessories' },
  { id: 'embroidery',     label: 'Embroidery',           emoji: '🪡', type: 'creative',  color: '#e879f9', description: 'Hand & machine embroidery' },
  { id: 'tailoring',      label: 'Tailoring & Fashion',  emoji: '✂️', type: 'creative',  color: '#38bdf8', description: 'Custom clothes, alterations' },
  { id: 'silk_tailoring', label: 'Silk & Saree Tailoring',emoji: '🥻', type: 'creative',  color: '#be185d', description: 'Kanjivaram, blouses, ethnic wear' },
  { id: 'jewelry',        label: 'Jewelry Making',       emoji: '💍', type: 'creative',  color: '#fbbf24', description: 'Handcrafted, custom jewellery' },
  { id: 'pottery',        label: 'Pottery & Ceramics',   emoji: '🏺', type: 'creative',  color: '#b45309', description: 'Handmade pots, décor, art pieces' },
  { id: 'candles',        label: 'Candles & Soaps',      emoji: '🕯️', type: 'creative',  color: '#f9a8d4', description: 'Handcrafted candles, soaps, gifts' },
  { id: 'art',            label: 'Art & Illustration',   emoji: '🎨', type: 'creative',  color: '#34d399', description: 'Portraits, murals, digital art' },
  { id: 'flowers',        label: 'Floral Arrangements',  emoji: '🌸', type: 'creative',  color: '#f43f5e', description: 'Bouquets, décor, event florals' },
  { id: 'tanjore',        label: 'Tanjore Painting',     emoji: '🖼️', type: 'creative',  color: '#dc2626', description: 'Classical gold-leaf Tanjore art' },
  { id: 'kolam',          label: 'Kolam & Rangoli Art',  emoji: '🌀', type: 'creative',  color: '#7c3aed', description: 'Traditional floor art & events' },

  // ── Services ───────────────────────────────────────────
  { id: 'cleaning',       label: 'Cleaning',             emoji: '✨', type: 'service',   color: '#10b981', description: 'Home, office, deep cleaning' },
  { id: 'gardening',      label: 'Gardening',            emoji: '🌱', type: 'service',   color: '#22c55e', description: 'Lawn care, plants, landscaping' },
  { id: 'moving',         label: 'Moving & Shifting',    emoji: '📦', type: 'service',   color: '#f97316', description: 'Packers, movers, loading' },
  { id: 'tutoring',       label: 'Tutoring',             emoji: '📚', type: 'service',   color: '#6366f1', description: 'School subjects, skills, coaching' },
  { id: 'cooking',        label: 'Cooking & Catering',   emoji: '🍳', type: 'service',   color: '#ef4444', description: 'Home chef, events, tiffin, meal prep' },
  { id: 'photography',    label: 'Photography',          emoji: '📸', type: 'service',   color: '#8b5cf6', description: 'Events, portraits, products' },
  { id: 'beauty',         label: 'Beauty & Wellness',    emoji: '💅', type: 'service',   color: '#ec4899', description: 'Makeup, hair, spa at home' },
  { id: 'carnatic',       label: 'Carnatic Music',       emoji: '🎶', type: 'service',   color: '#b45309', description: 'Vocal & instrument lessons' },
  { id: 'bharatanatyam',  label: 'Bharatanatyam',        emoji: '💃', type: 'service',   color: '#9333ea', description: 'Classical dance classes & arangetram' },
  { id: 'music',          label: 'Music & Performance',  emoji: '🎵', type: 'service',   color: '#f59e0b', description: 'Lessons, live music, events' },
  { id: 'event_deco',     label: 'Event Decoration',     emoji: '🎉', type: 'service',   color: '#a21caf', description: 'Weddings, birthdays, parties' },
  { id: 'other',          label: 'Other',                emoji: '🛠️', type: 'service',   color: '#6b7280', description: 'Any other skilled service' },
];

export const CATEGORY_TYPES = [
  { key: 'all',       label: 'All',        emoji: '⚡' },
  { key: 'trade',     label: 'Trades',     emoji: '🔧' },
  { key: 'technical', label: 'Technical',  emoji: '💻' },
  { key: 'creative',  label: 'Creative',   emoji: '🎨' },
  { key: 'service',   label: 'Services',   emoji: '✨' },
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === 'other');
}

export function getCategoriesByType(type) {
  if (type === 'all') return CATEGORIES;
  return CATEGORIES.filter(c => c.type === type);
}
