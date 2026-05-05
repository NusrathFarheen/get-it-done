/**
 * GetItDone — Centralized Category Registry
 * Used by: PostJob, Browse, Signup (worker skills), WorkerProfile
 *
 * Each category has:
 *  - id: unique slug
 *  - label: display name
 *  - emoji: icon shown in UI
 *  - type: 'trade' | 'creative' | 'service'
 *  - color: for badge / chip styling
 *  - description: short tagline shown on browse page
 */

export const CATEGORIES = [
  // ── Trades & Home ──────────────────────────────────────
  { id: 'plumbing',       label: 'Plumbing',            emoji: '🔧', type: 'trade',    color: '#3b82f6', description: 'Pipe leaks, fittings, drainage' },
  { id: 'electrical',     label: 'Electrical',          emoji: '⚡', type: 'trade',    color: '#f59e0b', description: 'Wiring, switches, repairs' },
  { id: 'carpentry',      label: 'Carpentry',           emoji: '🪚', type: 'trade',    color: '#92400e', description: 'Furniture, fittings, woodwork' },
  { id: 'painting',       label: 'Painting',            emoji: '🖌️', type: 'trade',    color: '#ec4899', description: 'Interior & exterior painting' },
  { id: 'masonry',        label: 'Masonry & Tiling',    emoji: '🧱', type: 'trade',    color: '#ef4444', description: 'Tiles, brickwork, flooring' },
  { id: 'ac_appliances',  label: 'AC & Appliances',     emoji: '❄️', type: 'trade',    color: '#06b6d4', description: 'Installation, service, repair' },
  { id: 'roofing',        label: 'Roofing',             emoji: '🏚️', type: 'trade',    color: '#6366f1', description: 'Waterproofing, sheets, repair' },
  { id: 'interior_design',label: 'Interior Design',     emoji: '🛋️', type: 'trade',    color: '#8b5cf6', description: 'Space planning, décor, styling' },

  // ── Creative & Handcraft ───────────────────────────────
  { id: 'henna',          label: 'Henna & Mehndi',      emoji: '🌿', type: 'creative', color: '#d97706', description: 'Bridal, festive & custom designs' },
  { id: 'baking',         label: 'Baking & Confectionery',emoji: '🎂', type: 'creative', color: '#f472b6', description: 'Cakes, pastries, custom orders' },
  { id: 'weaving',        label: 'Weaving & Textiles',  emoji: '🧵', type: 'creative', color: '#a78bfa', description: 'Handloom, fabric arts, weaving' },
  { id: 'crochet',        label: 'Crochet & Knitting',  emoji: '🧶', type: 'creative', color: '#fb923c', description: 'Garments, home décor, accessories' },
  { id: 'embroidery',     label: 'Embroidery',          emoji: '🪡', type: 'creative', color: '#e879f9', description: 'Hand & machine embroidery' },
  { id: 'tailoring',      label: 'Tailoring & Fashion', emoji: '✂️', type: 'creative', color: '#38bdf8', description: 'Custom clothes, alterations' },
  { id: 'jewelry',        label: 'Jewelry Making',      emoji: '💍', type: 'creative', color: '#fbbf24', description: 'Handcrafted, custom jewellery' },
  { id: 'pottery',        label: 'Pottery & Ceramics',  emoji: '🏺', type: 'creative', color: '#b45309', description: 'Handmade pots, décor, art pieces' },
  { id: 'candles',        label: 'Candles & Soaps',     emoji: '🕯️', type: 'creative', color: '#f9a8d4', description: 'Handcrafted candles, soaps, gifts' },
  { id: 'art',            label: 'Art & Illustration',  emoji: '🎨', type: 'creative', color: '#34d399', description: 'Portraits, murals, digital art' },
  { id: 'flowers',        label: 'Floral Arrangements', emoji: '🌸', type: 'creative', color: '#f43f5e', description: 'Bouquets, décor, event florals' },

  // ── Services ───────────────────────────────────────────
  { id: 'cleaning',       label: 'Cleaning',            emoji: '✨', type: 'service',  color: '#10b981', description: 'Home, office, deep cleaning' },
  { id: 'gardening',      label: 'Gardening',           emoji: '🌱', type: 'service',  color: '#22c55e', description: 'Lawn care, plants, landscaping' },
  { id: 'moving',         label: 'Moving & Shifting',   emoji: '📦', type: 'service',  color: '#f97316', description: 'Packers, movers, loading' },
  { id: 'tutoring',       label: 'Tutoring',            emoji: '📚', type: 'service',  color: '#6366f1', description: 'School subjects, skills, coaching' },
  { id: 'cooking',        label: 'Cooking & Catering',  emoji: '🍳', type: 'service',  color: '#ef4444', description: 'Home chef, events, meal prep' },
  { id: 'photography',    label: 'Photography',         emoji: '📸', type: 'service',  color: '#8b5cf6', description: 'Events, portraits, products' },
  { id: 'beauty',         label: 'Beauty & Wellness',   emoji: '💅', type: 'service',  color: '#ec4899', description: 'Makeup, hair, spa at home' },
  { id: 'music',          label: 'Music & Performance', emoji: '🎵', type: 'service',  color: '#f59e0b', description: 'Lessons, live music, events' },
  { id: 'security',       label: 'Security Systems',    emoji: '🔒', type: 'service',  color: '#64748b', description: 'CCTV, locks, alarm setup' },
  { id: 'it_support',     label: 'IT & Tech Support',   emoji: '💻', type: 'service',  color: '#06b6d4', description: 'Repairs, networks, software' },
  { id: 'vehicle_repair', label: 'Vehicle Repair',      emoji: '🔩', type: 'service',  color: '#78716c', description: 'Bikes, cars, servicing' },
  { id: 'event_deco',     label: 'Event Decoration',    emoji: '🎉', type: 'service',  color: '#a21caf', description: 'Weddings, birthdays, parties' },
  { id: 'other',          label: 'Other',               emoji: '🛠️', type: 'service',  color: '#6b7280', description: 'Any other skilled service' },
];

export const CATEGORY_TYPES = [
  { key: 'all',      label: 'All Categories' },
  { key: 'trade',    label: '🔧 Trades & Home' },
  { key: 'creative', label: '🎨 Creative & Handcraft' },
  { key: 'service',  label: '✨ Services' },
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === 'other');
}

export function getCategoriesByType(type) {
  if (type === 'all') return CATEGORIES;
  return CATEGORIES.filter(c => c.type === type);
}
