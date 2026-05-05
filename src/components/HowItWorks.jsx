import { Search, Shield, Star, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import './HowItWorks.css';

const STEPS = [
  {
    id: 1,
    icon: <Search size={28} />,
    title: 'Search & Browse',
    desc: 'Search by skill type and location. Filter by rating, price, and availability. See verified worker profiles with real portfolios.',
    color: '#f59e0b',
  },
  {
    id: 2,
    icon: <MessageCircle size={28} />,
    title: 'Chat & Negotiate',
    desc: 'Message workers directly before committing. Discuss job scope, negotiate rates, and schedule — all within the app.',
    color: '#3b82f6',
  },
  {
    id: 3,
    icon: <CheckCircle size={28} />,
    title: 'Hire with Confidence',
    desc: 'Book with confidence knowing exactly who you\'re hiring. Track job progress, and pay securely once you\'re satisfied.',
    color: '#10b981',
  },
  {
    id: 4,
    icon: <Star size={28} />,
    title: 'Rate & Build Trust',
    desc: 'Leave an honest review after each job. Workers build their reputation over time — great work earns more visibility.',
    color: '#8b5cf6',
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="how-it-works">
      <div className="glow-orb glow-blue how__glow" />

      <div className="container">
        <div className="how__header">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">
            From search to <span className="gradient-text">job done</span> in minutes
          </h2>
          <p className="section-subtitle">
            No more calling strangers from a neighbour's reference. GetItDone gives you
            complete visibility before you ever commit.
          </p>
        </div>

        <div className="how__steps">
          {STEPS.map((step, i) => (
            <div key={step.id} className="how__step glass-card" id={`step-${step.id}`}>
              <div className="how__step-num">{String(step.id).padStart(2, '0')}</div>
              <div
                className="how__step-icon"
                style={{
                  background: `${step.color}18`,
                  color: step.color,
                  boxShadow: `0 0 20px ${step.color}22`,
                }}
              >
                {step.icon}
              </div>
              <h3 className="how__step-title">{step.title}</h3>
              <p className="how__step-desc">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="how__step-arrow">
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="how__trust glass-card">
          <Shield size={22} className="how__trust-icon" />
          <div>
            <div className="how__trust-title">Built on Trust, Backed by Verification</div>
            <div className="how__trust-sub">
              Every worker goes through skill-badge verification and ID checks. You always know who's coming to your door.
            </div>
          </div>
          <a href="#" className="btn btn-primary" id="learn-trust-btn">Learn More</a>
        </div>
      </div>
    </section>
  );
}
