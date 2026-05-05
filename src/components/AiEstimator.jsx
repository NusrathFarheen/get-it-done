import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, TrendingUp, Clock, Users } from 'lucide-react';
import './AiEstimator.css';

// Simulated AI estimates per job type keyword
const ESTIMATES = {
  plumb: { label: 'Plumbing', range: '₹300 – ₹800', common: '₹450 – ₹600', time: '1–2 hrs', workers: 12, tip: 'Ask for fixed-price on standard repairs.' },
  pipe: { label: 'Pipe Work', range: '₹200 – ₹700', common: '₹350 – ₹500', time: '1–3 hrs', workers: 9, tip: 'Share pipe diameter and material for accurate quote.' },
  electri: { label: 'Electrical', range: '₹400 – ₹1,200', common: '₹600 – ₹900', time: '2–4 hrs', workers: 8, tip: 'Always verify electrician holds a valid license.' },
  wiring: { label: 'Wiring', range: '₹500 – ₹2,000', common: '₹800 – ₹1,400', time: '3–6 hrs', workers: 7, tip: 'Get quotes from 3 workers and compare.' },
  paint: { label: 'Painting', range: '₹12 – ₹25/sq.ft', common: '₹16 – ₹22/sq.ft', time: '1–3 days', workers: 18, tip: 'Always agree on number of coats upfront.' },
  clean: { label: 'Cleaning', range: '₹500 – ₹2,500', common: '₹800 – ₹1,500', time: '2–5 hrs', workers: 24, tip: 'Deep clean vs regular clean — specify clearly.' },
  carpen: { label: 'Carpentry', range: '₹500 – ₹3,000', common: '₹800 – ₹2,000', time: '2–8 hrs', workers: 11, tip: 'Share photos of the work needed for best quotes.' },
  tile: { label: 'Tiling', range: '₹25 – ₹60/sq.ft', common: '₹35 – ₹50/sq.ft', time: '1–4 days', workers: 6, tip: 'Confirm if grout and adhesive are included.' },
  ac: { label: 'AC Service', range: '₹400 – ₹1,500', common: '₹600 – ₹900', time: '1–2 hrs', workers: 15, tip: 'Annual service contracts save 30% year-on-year.' },
  tutor: { label: 'Tutoring', range: '₹200 – ₹800/hr', common: '₹300 – ₹500/hr', time: 'Per session', workers: 31, tip: 'Trial sessions help you find the right fit.' },
  default: { label: 'This Job', range: '₹300 – ₹2,000', common: '₹500 – ₹1,200', time: '1–4 hrs', workers: 10, tip: 'Describe your job in detail to get accurate quotes.' },
};

function getEstimate(query) {
  if (!query || query.length < 3) return null;
  const q = query.toLowerCase();
  for (const [key, val] of Object.entries(ESTIMATES)) {
    if (key !== 'default' && q.includes(key)) return val;
  }
  if (q.length > 4) return ESTIMATES.default;
  return null;
}

export default function AiEstimator({ query }) {
  const [estimate, setEstimate] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query || query.length < 3) {
      setVisible(false);
      return;
    }
    setLoading(true);
    setVisible(false);
    timerRef.current = setTimeout(() => {
      const result = getEstimate(query);
      setEstimate(result);
      setLoading(false);
      if (result) setVisible(true);
    }, 700);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  if (!visible && !loading) return null;

  return (
    <div className={`ai-estimator ${visible ? 'ai-estimator--visible' : ''}`} id="ai-estimator-panel" role="status" aria-live="polite">
      {loading ? (
        <div className="ai-estimator__loading">
          <Sparkles size={14} className="ai-estimator__spin" />
          <span>AI estimating price…</span>
        </div>
      ) : estimate ? (
        <>
          <button
            className="ai-estimator__close"
            onClick={() => setVisible(false)}
            aria-label="Close estimator"
            id="ai-estimator-close"
          >
            <X size={14} />
          </button>

          <div className="ai-estimator__header">
            <Sparkles size={14} />
            <span>AI Price Estimate for {estimate.label}</span>
          </div>

          <div className="ai-estimator__range">
            <span className="ai-estimator__range-val">{estimate.range}</span>
            <span className="ai-estimator__range-lbl">typical range</span>
          </div>

          <div className="ai-estimator__meta">
            <div className="ai-estimator__meta-item">
              <TrendingUp size={12} />
              <span>Most pay <strong>{estimate.common}</strong></span>
            </div>
            <div className="ai-estimator__meta-item">
              <Clock size={12} />
              <span>{estimate.time}</span>
            </div>
            <div className="ai-estimator__meta-item">
              <Users size={12} />
              <span>{estimate.workers} workers nearby</span>
            </div>
          </div>

          {estimate.tip && (
            <div className="ai-estimator__tip">
              💡 {estimate.tip}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
