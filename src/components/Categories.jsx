import { useState } from 'react';
import './Categories.css';

const CATEGORIES = [
  { id: 'plumbing', emoji: '🔧', label: 'Plumbing', count: 1240, desc: 'Pipe repairs, fittings, drainage' },
  { id: 'electrical', emoji: '⚡', label: 'Electrical', count: 890, desc: 'Wiring, panels, installations' },
  { id: 'carpentry', emoji: '🪚', label: 'Carpentry', count: 720, desc: 'Furniture, woodwork, framing' },
  { id: 'painting', emoji: '🎨', label: 'Painting', count: 1100, desc: 'Interior, exterior, textures' },
  { id: 'cleaning', emoji: '🧹', label: 'Cleaning', count: 2300, desc: 'Deep clean, regular, commercial' },
  { id: 'ac-repair', emoji: '❄️', label: 'AC & Appliances', count: 650, desc: 'Service, repair, installation' },
  { id: 'masonry', emoji: '🧱', label: 'Masonry', count: 420, desc: 'Brickwork, tiling, flooring' },
  { id: 'gardening', emoji: '🌿', label: 'Gardening', count: 380, desc: 'Landscaping, pruning, upkeep' },
  { id: 'roofing', emoji: '🏠', label: 'Roofing', count: 290, desc: 'Leak repair, waterproofing' },
  { id: 'security', emoji: '🔐', label: 'Security Systems', count: 310, desc: 'CCTV, locks, alarms' },
  { id: 'moving', emoji: '📦', label: 'Moving & Shifting', count: 560, desc: 'Packing, transport, setup' },
  { id: 'tutoring', emoji: '📚', label: 'Tutoring', count: 1890, desc: 'All subjects, all ages' },
];

export default function Categories() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="categories" id="categories">
      <div className="container">
        <div className="categories__header">
          <div className="section-label">Browse Categories</div>
          <h2 className="section-title">
            Whatever you need, <span className="gradient-text">we've got someone</span>
          </h2>
          <p className="section-subtitle">
            From fixing a leaky tap to complete home renovations — find verified professionals across 180+ skill categories.
          </p>
        </div>

        <div className="categories__grid">
          {CATEGORIES.map(cat => (
            <a
              href="#"
              key={cat.id}
              id={`category-${cat.id}`}
              className={`categories__card glass-card ${hovered === cat.id ? 'categories__card--hovered' : ''}`}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="categories__emoji">{cat.emoji}</div>
              <div className="categories__label">{cat.label}</div>
              <div className="categories__desc">{cat.desc}</div>
              <div className="categories__count">{cat.count.toLocaleString()} workers</div>
            </a>
          ))}
        </div>

        <div className="categories__footer">
          <a href="#" className="btn btn-secondary" id="view-all-categories-btn">
            View All 180+ Categories →
          </a>
        </div>
      </div>
    </section>
  );
}
