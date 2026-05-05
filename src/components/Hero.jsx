import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import AiEstimator from './AiEstimator';
import './Hero.css';

const CATEGORIES = ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Painting'];

const STAT_ITEMS = [
  { value: '12,400+', label: 'Skilled Workers' },
  { value: '48,000+', label: 'Jobs Completed' },
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '180+', label: 'Skill Categories' },
];

const FLOATING_CARD = {
  name: 'Rajan Mehta',
  skill: 'Master Plumber',
  rating: 4.9,
  jobs: 312,
  tag: '✅ Verified',
};

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const handleSearch = () => navigate(`/browse${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
  return (
    <section className="hero" id="hero">
      {/* Ambient glows */}
      <div className="glow-orb glow-amber hero__glow-1" />
      <div className="glow-orb glow-blue hero__glow-2" />

      <div className="container hero__inner">
        {/* LEFT: Text + Search */}
        <div className="hero__content">
          <div className="badge badge-amber hero__badge">
            <span className="hero__badge-dot" />
            Now live in 50+ cities
          </div>

          <h1 className="hero__title">
            Hire Skilled Workers<br />
            <span className="gradient-text">You Can Actually Trust</span>
          </h1>

          <p className="hero__subtitle">
            Stop relying on unreliable word-of-mouth. Browse verified local tradespeople,
            check real reviews, negotiate pricing — all in one place.
          </p>

          {/* Search Bar */}
          <div className="hero__search-wrap">
          <div className="hero__search" id="hero-search">
            <div className="hero__search-field">
              <Search size={18} className="hero__search-icon" />
              <input
                type="text"
                placeholder="What do you need done?"
                className="hero__search-input"
                id="search-job-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hero__search-divider" />
            <div className="hero__search-field">
              <MapPin size={18} className="hero__search-icon" />
              <input
                type="text"
                placeholder="Your location"
                className="hero__search-input"
                id="search-location-input"
              />
            </div>
            <button className="btn btn-primary hero__search-btn" id="search-submit-btn" onClick={handleSearch}>
              Find Workers
            </button>
          </div>
          <AiEstimator query={searchQuery} />
          </div>

          {/* Quick Category Chips */}
          <div className="hero__categories">
            <span className="hero__categories-label">Popular:</span>
            {CATEGORIES.map(cat => (
              <Link key={cat} to={`/browse`} className="hero__cat-chip" id={`cat-${cat.toLowerCase()}`}>
                {cat}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="hero__stats">
            {STAT_ITEMS.map(s => (
              <div key={s.label} className="hero__stat">
                <div className="hero__stat-value">{s.value}</div>
                <div className="hero__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Floating UI Cards */}
        <div className="hero__visual" aria-hidden="true">
          {/* Main worker card */}
          <div className="hero__worker-card glass-card">
            <div className="hero__worker-header">
              <div className="hero__worker-avatar">RM</div>
              <div>
                <div className="hero__worker-name">{FLOATING_CARD.name}</div>
                <div className="hero__worker-skill">{FLOATING_CARD.skill}</div>
              </div>
              <span className="tag">{FLOATING_CARD.tag}</span>
            </div>
            <div className="hero__worker-meta">
              <div className="hero__worker-stat">
                <span className="hero__worker-stat-val">⭐ {FLOATING_CARD.rating}</span>
                <span className="hero__worker-stat-lbl">Rating</span>
              </div>
              <div className="hero__worker-stat">
                <span className="hero__worker-stat-val">{FLOATING_CARD.jobs}</span>
                <span className="hero__worker-stat-lbl">Jobs Done</span>
              </div>
              <div className="hero__worker-stat">
                <span className="hero__worker-stat-val">₹450/hr</span>
                <span className="hero__worker-stat-lbl">Rate</span>
              </div>
            </div>
            <div className="hero__worker-skills">
              {['Pipe Fitting', 'Water Heaters', 'Leak Repair'].map(s => (
                <span key={s} className="tag" style={{ fontSize: '10px' }}>{s}</span>
              ))}
            </div>
            <div className="hero__worker-actions">
              <button className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>💬 Chat</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>Hire Now</button>
            </div>
          </div>

          {/* Floating notification chip */}
          <div className="hero__notif hero__notif--top">
            <span className="hero__notif-dot hero__notif-dot--green" />
            <span>Job completed · Priya rated 5★</span>
          </div>
          <div className="hero__notif hero__notif--bottom">
            <span className="hero__notif-dot hero__notif-dot--amber" />
            <span>New offer from Suresh — ₹380/hr</span>
          </div>

          {/* Chat bubble */}
          <div className="hero__chat glass-card">
            <div className="hero__chat-msg hero__chat-msg--them">
              Can you check the pipe tomorrow at 10 AM?
            </div>
            <div className="hero__chat-msg hero__chat-msg--me">
              Sure! My rate is ₹420/hr. I'll bring all tools 🔧
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a href="#how-it-works" className="hero__scroll-cue" aria-label="Scroll down">
        <ChevronDown size={22} />
      </a>
    </section>
  );
}
