import { Link } from 'react-router-dom';
import { Star, BadgeCheck, MessageSquare, Briefcase } from 'lucide-react';
import { WORKERS } from '../data/workers';
import './WorkerShowcase.css';

function StarRating({ rating }) {
  return (
    <div className="worker-rating">
      <Star size={13} fill="currentColor" className="worker-rating__star" />
      <span className="worker-rating__val">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function WorkerShowcase() {
  return (
    <section className="workers" id="workers">
      <div className="glow-orb glow-amber workers__glow" />

      <div className="container">
        <div className="workers__header">
          <div className="section-label">Top Rated Workers</div>
          <h2 className="section-title">
            Real people, <span className="gradient-text">real skills</span>
          </h2>
          <p className="section-subtitle">
            Every worker is rated by real customers. Browse profiles with verified reviews,
            portfolios, and transparent pricing.
          </p>
        </div>

        <div className="workers__grid">
          {WORKERS.map(w => (
            <div key={w.id} className="worker-card glass-card" id={`worker-${w.id}`}>
              {/* Header */}
              <div className="worker-card__header">
                <div
                  className="worker-card__avatar"
                  style={{ background: w.gradient }}
                >
                  {w.initials}
                </div>
                <div className="worker-card__info">
                  <div className="worker-card__name">
                    {w.name}
                    {w.verified && (
                      <BadgeCheck size={15} className="worker-card__verified" />
                    )}
                  </div>
                  <div className="worker-card__skill">{w.skill}</div>
                  <div className="worker-card__location">📍 {w.location}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="worker-card__tags">
                {w.tags.slice(0, 3).map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>

              {/* Meta */}
              <div className="worker-card__meta">
                <div className="worker-card__meta-item">
                  <StarRating rating={w.rating} />
                  <span className="worker-card__meta-sub">({w.reviews} reviews)</span>
                </div>
                <div className="worker-card__meta-item">
                  <Briefcase size={13} className="worker-card__meta-icon" />
                  <span>{w.jobs} jobs</span>
                </div>
                <div className="worker-card__rate">₹{w.rate}/hr</div>
              </div>

              {/* Actions — now linked to real routes */}
              <div className="worker-card__actions">
                <Link
                  to={`/worker/${w.id}`}
                  className="btn btn-secondary worker-card__btn"
                  id={`chat-${w.id}`}
                >
                  <MessageSquare size={15} />
                  Chat
                </Link>
                <Link
                  to={`/worker/${w.id}`}
                  className="btn btn-primary worker-card__btn"
                  id={`hire-${w.id}`}
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="workers__footer">
          <Link to="/browse" className="btn btn-secondary btn-lg" id="browse-all-workers-btn">
            Browse All Workers →
          </Link>
        </div>
      </div>
    </section>
  );
}
