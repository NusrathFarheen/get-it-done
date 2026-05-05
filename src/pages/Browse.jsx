import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, SlidersHorizontal, Star, BadgeCheck,
  Briefcase, MessageSquare, X, ChevronDown, ArrowUpDown,
  Zap,
} from 'lucide-react';
import { WORKERS } from '../data/workers';
import { CATEGORIES, CATEGORY_TYPES } from '../data/categories';
import './Browse.css';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'jobs', label: 'Most Jobs Done' },
  { value: 'rate_asc', label: 'Price: Low to High' },
  { value: 'rate_desc', label: 'Price: High to Low' },
];

function WorkerCard({ worker }) {
  return (
    <div className="bwc glass-card" id={`browse-card-${worker.id}`}>
      {/* Availability + multi-skill badge */}
      <div className="bwc__top-row">
        <div className={`bwc__availability ${worker.available ? 'bwc__availability--on' : 'bwc__availability--off'}`}>
          <span className="bwc__avail-dot" />
          {worker.available ? 'Available today' : 'Booked out'}
        </div>
        {worker.categories && worker.categories.length > 1 && (
          <div className="bwc__multiskill" title={worker.categories.join(', ')}>
            ✦ {worker.categories.length} skills
          </div>
        )}
      </div>
      {/* Header */}
      <div className="bwc__header">
        <div className="bwc__avatar" style={{ background: worker.gradient }}>
          {worker.initials}
        </div>
        <div className="bwc__info">
          <div className="bwc__name">
            {worker.name}
            {worker.verified && <BadgeCheck size={15} className="bwc__verified" />}
          </div>
          <div className="bwc__skill">{worker.skill}</div>
          <div className="bwc__location">
            <MapPin size={11} /> {worker.location}
          </div>
        </div>
        <div className="bwc__rate">
          <span className="bwc__rate-val">₹{worker.rate}</span>
          <span className="bwc__rate-unit">/hr</span>
        </div>
      </div>

      {/* Tags */}
      <div className="bwc__tags">
        {worker.tags.slice(0, 3).map(t => (
          <span key={t} className="tag">{t}</span>
        ))}
        {worker.tags.length > 3 && (
          <span className="tag tag--more">+{worker.tags.length - 3}</span>
        )}
      </div>

      {/* Stats */}
      <div className="bwc__stats">
        <div className="bwc__stat">
          <Star size={12} fill="currentColor" className="bwc__stat-star" />
          <strong>{worker.rating}</strong>
          <span>({worker.reviews})</span>
        </div>
        <div className="bwc__stat-divider" />
        <div className="bwc__stat">
          <Briefcase size={12} />
          <span>{worker.jobs} jobs</span>
        </div>
        <div className="bwc__stat-divider" />
        <div className="bwc__stat">
          <span>⚡ {worker.responseTime}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="bwc__actions">
        <button className="btn btn-secondary bwc__btn" id={`msg-${worker.id}`}>
          <MessageSquare size={14} /> Chat
        </button>
        <Link to={`/worker/${worker.id}`} className="btn btn-primary bwc__btn" id={`profile-${worker.id}`}>
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default function Browse() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('rating');
  const [priceMax, setPriceMax] = useState(1000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Categories visible for the selected type
  const visibleCategories = typeFilter === 'all'
    ? CATEGORIES
    : CATEGORIES.filter(c => c.type === typeFilter);

  const filtered = useMemo(() => {
    let list = [...WORKERS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.skill.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q)) ||
        w.category.toLowerCase().includes(q)
      );
    }
    // Filter by type — check both primary category and all categories
    if (typeFilter !== 'all') {
      const typeIds = new Set(CATEGORIES.filter(c => c.type === typeFilter).map(c => c.id));
      list = list.filter(w =>
        typeIds.has(w.category) ||
        w.categories?.some(cat => typeIds.has(cat))
      );
    }
    // Filter by specific category — check both primary and all categories
    if (category !== 'all') list = list.filter(w =>
      w.category === category ||
      w.categories?.includes(category)
    );
    if (verifiedOnly) list = list.filter(w => w.verified);
    if (availableOnly) list = list.filter(w => w.available);
    list = list.filter(w => w.rate <= priceMax);

    list.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'jobs') return b.jobs - a.jobs;
      if (sort === 'rate_asc') return a.rate - b.rate;
      if (sort === 'rate_desc') return b.rate - a.rate;
      return 0;
    });
    return list;
  }, [search, category, sort, priceMax, verifiedOnly, availableOnly]);

  const activeFilters = [
    verifiedOnly && 'Verified Only',
    availableOnly && 'Available Today',
    priceMax < 1000 && `Under ₹${priceMax}/hr`,
    typeFilter !== 'all' && `${CATEGORY_TYPES.find(t => t.key === typeFilter)?.emoji} ${CATEGORY_TYPES.find(t => t.key === typeFilter)?.label}`,
    category !== 'all' && (CATEGORIES.find(c => c.id === category)?.label || category),
  ].filter(Boolean);

  const clearFilter = f => {
    if (f === 'Verified Only') setVerifiedOnly(false);
    else if (f === 'Available Today') setAvailableOnly(false);
    else if (f.startsWith('Under')) setPriceMax(1000);
    else if (CATEGORY_TYPES.some(t => f.includes(t.label))) { setTypeFilter('all'); setCategory('all'); }
    else setCategory('all');
  };

  return (
    <div className="browse-page">
      {/* Background */}
      <div className="glow-orb glow-amber browse__glow-1" />
      <div className="glow-orb glow-blue browse__glow-2" />
      <div className="noise-overlay" aria-hidden="true" />

      {/* Top bar */}
      <header className="browse__topbar">
        <Link to="/" className="browse__logo" id="browse-home-link">
          <div className="browse__logo-icon"><Zap size={16} fill="currentColor" /></div>
          <span>GetItDone</span>
        </Link>
        <div className="browse__search-bar" id="browse-search-bar">
          <Search size={16} className="browse__search-icon" />
          <input
            type="text"
            placeholder="Search workers, skills, or jobs…"
            className="browse__search-input"
            id="browse-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="browse__search-clear"
              onClick={() => setSearch('')}
              id="browse-search-clear"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="browse__topbar-actions">
          <Link to="/login" className="btn btn-secondary browse__login-btn" id="browse-login">Log In</Link>
          <Link to="/signup" className="btn btn-primary" id="browse-signup">Get Started</Link>
        </div>
      </header>

      <div className="browse__body container">
        {/* ── Sidebar ── */}
        <aside className={`browse__sidebar glass-card ${filtersOpen ? 'browse__sidebar--open' : ''}`} id="browse-sidebar">
          <div className="browse__sidebar-head">
            <span><SlidersHorizontal size={15} /> Filters</span>
            {activeFilters.length > 0 && (
              <button
                className="browse__clear-all"
                onClick={() => { setTypeFilter('all'); setCategory('all'); setVerifiedOnly(false); setAvailableOnly(false); setPriceMax(1000); }}
                id="clear-all-filters"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Type tabs */}
          <div className="browse__filter-group">
            <div className="browse__filter-label">Type</div>
            <div className="browse__type-tabs">
              {CATEGORY_TYPES.map(t => (
                <button
                  key={t.key}
                  id={`filter-type-${t.key}`}
                  className={`browse__type-tab ${typeFilter === t.key ? 'browse__type-tab--active' : ''}`}
                  onClick={() => { setTypeFilter(t.key); setCategory('all'); }}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category — filtered by type */}
          <div className="browse__filter-group">
            <div className="browse__filter-label">Category</div>
            <div className="browse__cats">
              <button
                id="filter-cat-all"
                className={`browse__cat-btn ${category === 'all' ? 'browse__cat-btn--active' : ''}`}
                onClick={() => setCategory('all')}
              >
                All {typeFilter !== 'all' ? CATEGORY_TYPES.find(t => t.key === typeFilter)?.label : ''}
              </button>
              {visibleCategories.map(cat => (
                <button
                  key={cat.id}
                  id={`filter-cat-${cat.id}`}
                  className={`browse__cat-btn ${category === cat.id ? 'browse__cat-btn--active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="browse__filter-group">
            <div className="browse__filter-label">
              Max Hourly Rate
              <span className="browse__filter-val">₹{priceMax}/hr</span>
            </div>
            <input
              type="range" min="100" max="1000" step="50"
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="browse__range"
              id="filter-price-range"
            />
            <div className="browse__range-labels">
              <span>₹100</span><span>₹1,000</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="browse__filter-group">
            <div className="browse__filter-label">Worker Status</div>
            <label className="browse__toggle-label" htmlFor="filter-verified">
              <span>Verified workers only</span>
              <div className={`browse__toggle ${verifiedOnly ? 'browse__toggle--on' : ''}`}>
                <input
                  type="checkbox" id="filter-verified"
                  checked={verifiedOnly}
                  onChange={e => setVerifiedOnly(e.target.checked)}
                />
                <span className="browse__toggle-knob" />
              </div>
            </label>
            <label className="browse__toggle-label" htmlFor="filter-available">
              <span>Available today</span>
              <div className={`browse__toggle ${availableOnly ? 'browse__toggle--on' : ''}`}>
                <input
                  type="checkbox" id="filter-available"
                  checked={availableOnly}
                  onChange={e => setAvailableOnly(e.target.checked)}
                />
                <span className="browse__toggle-knob" />
              </div>
            </label>
          </div>

          {/* Min Rating */}
          <div className="browse__filter-group">
            <div className="browse__filter-label">Minimum Rating</div>
            <div className="browse__stars-filter">
              {[4, 4.5, 4.8].map(r => (
                <button key={r} className="browse__star-btn" id={`filter-rating-${r}`}>
                  ⭐ {r}+
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="browse__main">
          {/* Toolbar */}
          <div className="browse__toolbar">
            <div className="browse__result-count">
              <strong>{filtered.length}</strong> worker{filtered.length !== 1 ? 's' : ''} found
              {category !== 'all' && <span> in <em>{CATEGORIES.find(c => c.id === category)?.label}</em></span>}
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="browse__chips">
                {activeFilters.map(f => (
                  <span key={f} className="browse__chip" id={`chip-${f}`}>
                    {f}
                    <button onClick={() => clearFilter(f)} aria-label={`Remove ${f} filter`}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Sort */}
            <div className="browse__sort">
              <button
                className="browse__sort-btn"
                id="sort-dropdown-toggle"
                onClick={() => setSortOpen(p => !p)}
              >
                <ArrowUpDown size={14} />
                {SORT_OPTIONS.find(s => s.value === sort)?.label}
                <ChevronDown size={13} />
              </button>
              {sortOpen && (
                <div className="browse__sort-menu">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      id={`sort-${opt.value}`}
                      className={`browse__sort-item ${sort === opt.value ? 'browse__sort-item--active' : ''}`}
                      onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              className="browse__filter-toggle btn btn-secondary"
              id="mobile-filter-toggle"
              onClick={() => setFiltersOpen(p => !p)}
            >
              <SlidersHorizontal size={14} /> Filters
              {activeFilters.length > 0 && (
                <span className="browse__filter-badge">{activeFilters.length}</span>
              )}
            </button>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="browse__grid" id="browse-results-grid">
              {filtered.map(w => <WorkerCard key={w.id} worker={w} />)}
            </div>
          ) : (
            <div className="browse__empty" id="browse-empty-state">
              <div className="browse__empty-icon">🔍</div>
              <div className="browse__empty-title">No workers found</div>
              <div className="browse__empty-sub">
                Try adjusting your filters or search for a different skill.
              </div>
              <button
                className="btn btn-secondary"
                id="reset-filters-btn"
                onClick={() => { setSearch(''); setCategory('all'); setVerifiedOnly(false); setAvailableOnly(false); setPriceMax(1000); }}
              >
                Reset all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
