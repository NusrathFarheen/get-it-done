import { Zap, ArrowRight, Smartphone } from 'lucide-react';
import './CTA.css';

export default function CTA() {
  return (
    <section className="cta" id="cta">
      <div className="glow-orb glow-amber cta__glow-1" />
      <div className="glow-orb glow-blue cta__glow-2" />

      <div className="container">
        <div className="cta__card glass-card">
          <div className="cta__icon">
            <Zap size={32} fill="currentColor" />
          </div>

          <h2 className="cta__title">
            Ready to <span className="gradient-text">GetItDone?</span>
          </h2>

          <p className="cta__sub">
            Join 12,000+ workers and 48,000+ satisfied clients. Find the right person for any job,
            or showcase your skills to those who need them most.
          </p>

          <div className="cta__actions">
            <a href="#" className="btn btn-primary btn-lg cta__btn" id="cta-hire-btn">
              Hire a Worker
              <ArrowRight size={18} />
            </a>
            <a href="#" className="btn btn-secondary btn-lg cta__btn" id="cta-join-btn">
              Join as a Worker
            </a>
          </div>

          {/* App download */}
          <div className="cta__app">
            <Smartphone size={16} />
            <span>Mobile app coming soon — Android & iOS</span>
          </div>

          {/* Trust markers */}
          <div className="cta__trust">
            <span className="cta__trust-item">✅ No hidden fees</span>
            <span className="cta__trust-item">🔒 Secure payments</span>
            <span className="cta__trust-item">⭐ 4.9/5 rated</span>
            <span className="cta__trust-item">🛡️ Verified workers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
