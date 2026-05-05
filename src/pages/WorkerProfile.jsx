import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, BadgeCheck, MapPin, Clock, Briefcase, Users,
  MessageSquare, Calendar, ChevronLeft, Check, Zap,
  ArrowRight, Share2, Heart, Shield, Camera,
} from 'lucide-react';
import { WORKERS } from '../data/workers';
import PortfolioGallery from '../components/PortfolioGallery';
import './WorkerProfile.css';

const TABS = ['Overview', 'Portfolio', 'Reviews', 'Catalogue'];

function StarRow({ rating, size = 16 }) {
  return (
    <div className="wp__stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
          className={i <= Math.round(rating) ? 'wp__star--filled' : 'wp__star--empty'}
        />
      ))}
    </div>
  );
}

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const worker = WORKERS.find(w => w.id === id);
  const [activeTab, setActiveTab] = useState('Overview');
  const [saved, setSaved] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatSent, setChatSent] = useState(false);

  if (!worker) {
    return (
      <div className="wp-not-found">
        <div className="wp-not-found__inner">
          <div style={{ fontSize: 48 }}>😕</div>
          <h2>Worker not found</h2>
          <p>This profile may no longer exist.</p>
          <Link to="/browse" className="btn btn-primary">Browse Workers</Link>
        </div>
      </div>
    );
  }

  const handleSendChat = () => {
    if (!chatMsg.trim()) return;
    setChatSent(true);
    setTimeout(() => { setChatOpen(false); setChatSent(false); setChatMsg(''); }, 2000);
  };

  return (
    <div className="wp-page">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="glow-orb glow-amber wp__glow-1" />
      <div className="glow-orb glow-blue wp__glow-2" />

      {/* ── Top nav bar ── */}
      <header className="wp__topbar">
        <button className="wp__back btn btn-secondary" id="wp-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back
        </button>
        <Link to="/" className="wp__logo">
          <div className="wp__logo-icon"><Zap size={14} fill="currentColor" /></div>
          <span>GetItDone</span>
        </Link>
        <div className="wp__topbar-actions">
          <button
            className={`wp__save-btn ${saved ? 'wp__save-btn--saved' : ''}`}
            id="wp-save-btn"
            onClick={() => setSaved(p => !p)}
            aria-label="Save worker"
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button className="wp__share-btn" id="wp-share-btn" aria-label="Share profile">
            <Share2 size={16} />
          </button>
        </div>
      </header>

      <div className="wp__layout container">
        {/* ══ LEFT: Main profile ══ */}
        <div className="wp__main">

          {/* Hero card */}
          <div className="wp__hero glass-card">
            <div className="wp__hero-inner">
              <div className="wp__avatar" style={{ background: worker.gradient }}>
                {worker.initials}
              </div>
              <div className="wp__hero-info">
                <div className="wp__hero-name">
                  {worker.name}
                  {worker.verified && (
                    <span className="wp__verified-badge">
                      <BadgeCheck size={16} /> Verified
                    </span>
                  )}
                </div>
                <div className="wp__hero-skill">{worker.skill}</div>
                <div className="wp__hero-location">
                  <MapPin size={13} /> {worker.location}
                </div>
                <div className="wp__hero-tags">
                  {worker.tags.slice(0, 4).map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="wp__stats-bar">
              <div className="wp__stat-item">
                <div className="wp__stat-val">
                  <Star size={14} fill="currentColor" className="wp__stat-star" />
                  {worker.rating}
                </div>
                <div className="wp__stat-lbl">{worker.reviews} reviews</div>
              </div>
              <div className="wp__stat-sep" />
              <div className="wp__stat-item">
                <div className="wp__stat-val">{worker.jobs}</div>
                <div className="wp__stat-lbl">Jobs done</div>
              </div>
              <div className="wp__stat-sep" />
              <div className="wp__stat-item">
                <div className="wp__stat-val">{worker.repeatClients}</div>
                <div className="wp__stat-lbl">Repeat clients</div>
              </div>
              <div className="wp__stat-sep" />
              <div className="wp__stat-item">
                <div className="wp__stat-val">{worker.responseTime}</div>
                <div className="wp__stat-lbl">Response time</div>
              </div>
              <div className="wp__stat-sep" />
              <div className="wp__stat-item">
                <div className="wp__stat-val">Since {worker.joinedYear}</div>
                <div className="wp__stat-lbl">Member</div>
              </div>
            </div>
          </div>

          {/* ── Tab Navigation ── */}
          <div className="wp__tabs" role="tablist" id="wp-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                role="tab"
                id={`wp-tab-${tab.toLowerCase()}`}
                className={`wp__tab ${activeTab === tab ? 'wp__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ── */}
          {activeTab === 'Overview' && (
            <div className="wp__tab-content" id="wp-overview">
              <div className="wp__section glass-card">
                <h3 className="wp__section-title">About {worker.name.split(' ')[0]}</h3>
                <p className="wp__bio">{worker.bio}</p>
              </div>
              <div className="wp__section glass-card">
                <h3 className="wp__section-title">Skills & Expertise</h3>
                <div className="wp__skills-grid">
                  {worker.tags.map(tag => (
                    <div key={tag} className="wp__skill-pill">
                      <Check size={13} /> {tag}
                    </div>
                  ))}
                </div>
              </div>
              <div className="wp__section glass-card">
                <h3 className="wp__section-title">Languages</h3>
                <div className="wp__langs">
                  {worker.languages.map(l => (
                    <span key={l} className="wp__lang">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Portfolio Tab ── */}
          {activeTab === 'Portfolio' && (
            <div className="wp__tab-content" id="wp-portfolio">
              <div className="wp__section glass-card">
                <PortfolioGallery
                  photos={worker.portfolio || []}
                  workerId={worker.id}
                  isOwner={false}
                />
              </div>
            </div>
          )}

          {/* ── Reviews Tab ── */}
          {activeTab === 'Reviews' && (
            <div className="wp__tab-content" id="wp-reviews">
              <div className="wp__section glass-card">
                <div className="wp__rating-summary">
                  <div className="wp__rating-big">{worker.rating}</div>
                  <div>
                    <StarRow rating={worker.rating} size={18} />
                    <div className="wp__rating-count">Based on {worker.reviews} reviews</div>
                  </div>
                </div>
              </div>
              <div className="wp__section glass-card">
                <h3 className="wp__section-title">Recent Reviews</h3>
                <div className="wp__reviews-list">
                  {worker.reviewsList.map((r, i) => (
                    <div key={i} className="wp__review" id={`review-${i}`}>
                      <div className="wp__review-header">
                        <div className="wp__review-avatar">{r.initials || r.author[0]}</div>
                        <div>
                          <div className="wp__review-author">{r.author}</div>
                          <div className="wp__review-date">{r.date}</div>
                        </div>
                        <StarRow rating={r.rating} size={13} />
                      </div>
                      <p className="wp__review-text">{r.text}</p>
                      {r.photos && r.photos.length > 0 && (
                        <div className="wp__review-photos">
                          {r.photos.map((url, pi) => (
                            <img key={pi} src={url} alt={`Review photo ${pi + 1}`}
                              className="wp__review-photo" loading="lazy" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Catalogue Tab ── */}
          {activeTab === 'Catalogue' && (
            <div className="wp__tab-content" id="wp-catalogue">
              <div className="wp__section glass-card">
                <h3 className="wp__section-title">Services & Pricing</h3>
                <p className="wp__section-sub">
                  These are standard rates. Chat with {worker.name.split(' ')[0]} to get a quote for your specific job.
                </p>
                <div className="wp__catalogue">
                  {worker.catalogue.map((item, i) => (
                    <div key={i} className="wp__catalogue-item" id={`catalogue-item-${i}`}>
                      <div className="wp__catalogue-left">
                        <div className="wp__catalogue-service">{item.service}</div>
                        <div className="wp__catalogue-time">
                          <Clock size={11} /> {item.time}
                        </div>
                      </div>
                      <div className="wp__catalogue-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT: Booking sidebar ══ */}
        <aside className="wp__sidebar">
          {/* Rate card */}
          <div className="wp__booking-card glass-card" id="wp-booking-card">
            <div className="wp__booking-rate">
              <span className="wp__booking-rate-val">₹{worker.rate}</span>
              <span className="wp__booking-rate-unit">/hr</span>
            </div>
            <div className={`wp__booking-avail ${worker.available ? 'wp__booking-avail--on' : 'wp__booking-avail--off'}`}>
              <span className="wp__avail-dot" />
              {worker.available ? 'Available for new bookings' : 'Currently booked out'}
            </div>

            <button
              className="btn btn-primary wp__hire-btn"
              id="wp-hire-btn"
              disabled={!worker.available}
              onClick={() => navigate('/escrow')}
            >
              <Calendar size={16} />
              {worker.available ? 'Book Now' : 'Join Waitlist'}
            </button>

            <button
              className="btn btn-secondary wp__chat-btn"
              id="wp-chat-btn"
              onClick={() => setChatOpen(true)}
            >
              <MessageSquare size={16} /> Send a Message
            </button>

            <div className="wp__booking-notes">
              <div className="wp__note"><Shield size={13} /> Escrow-protected payment</div>
              <div className="wp__note"><Check size={13} /> Free to message & negotiate</div>
              <div className="wp__note"><Users size={13} /> {worker.repeatClients} repeat client rate</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="wp__quick-stats glass-card">
            <div className="wp__quick-stat">
              <Clock size={14} />
              <span>Responds in <strong>{worker.responseTime}</strong></span>
            </div>
            <div className="wp__quick-stat">
              <Briefcase size={14} />
              <span><strong>{worker.jobs}</strong> jobs completed</span>
            </div>
            <div className="wp__quick-stat">
              <Users size={14} />
              <span><strong>{worker.repeatClients}</strong> repeat clients</span>
            </div>
          </div>

          {/* Browse more */}
          <Link
            to="/browse"
            className="btn btn-secondary wp__browse-more"
            id="wp-browse-more"
          >
            Browse More Workers <ArrowRight size={14} />
          </Link>
        </aside>
      </div>

      {/* ── Chat Modal ── */}
      {chatOpen && (
        <div className="wp__chat-overlay" id="wp-chat-overlay" onClick={e => { if (e.target === e.currentTarget) setChatOpen(false); }}>
          <div className="wp__chat-modal glass-card">
            {chatSent ? (
              <div className="wp__chat-sent">
                <div className="wp__chat-sent-icon">✅</div>
                <div className="wp__chat-sent-title">Message sent!</div>
                <div className="wp__chat-sent-sub">{worker.name.split(' ')[0]} will reply within {worker.responseTime}.</div>
              </div>
            ) : (
              <>
                <div className="wp__chat-modal-header">
                  <div className="wp__chat-avatar" style={{ background: worker.gradient }}>{worker.initials}</div>
                  <div>
                    <div className="wp__chat-name">{worker.name}</div>
                    <div className="wp__chat-skill">{worker.skill}</div>
                  </div>
                  <button className="wp__chat-close" id="wp-chat-close" onClick={() => setChatOpen(false)}>✕</button>
                </div>
                <textarea
                  className="wp__chat-input"
                  id="wp-chat-textarea"
                  placeholder={`Hi ${worker.name.split(' ')[0]}, I need help with…`}
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <button
                  className="btn btn-primary"
                  id="wp-chat-send"
                  onClick={handleSendChat}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Send Message <ArrowRight size={15} />
                </button>
                <p className="wp__chat-note">Free to message. You only pay after a job is agreed and booked.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
