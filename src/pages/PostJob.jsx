import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, ChevronLeft, ChevronRight, MapPin, DollarSign,
  Clock, FileText, Check, AlertCircle, ArrowRight, Sparkles,
} from 'lucide-react';
import { JOB_CATEGORIES, URGENCY_OPTIONS } from '../data/jobs';
import './PostJob.css';

const STEPS = ['Job Details', 'Budget & Time', 'Location', 'Review & Post'];

/* ─── Step 1: Job details ─── */
function StepDetails({ data, onChange, onNext }) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!data.category) return setError('Please select a category.');
    if (!data.title.trim() || data.title.trim().length < 10) return setError('Please write a clear job title (min 10 characters).');
    if (!data.description.trim() || data.description.trim().length < 20) return setError('Add more detail to your description (min 20 characters).');
    setError('');
    onNext();
  };

  return (
    <div className="pj__step" id="pj-step-details">
      <h2 className="pj__step-title">What do you need done?</h2>
      <p className="pj__step-sub">Be specific — workers give better quotes when they understand the job clearly.</p>

      {error && <div className="pj__error"><AlertCircle size={14} />{error}</div>}

      {/* Category grid */}
      <div className="pj__field">
        <label className="pj__label">Job Category</label>
        <div className="pj__cat-grid">
          {JOB_CATEGORIES.map(cat => (
            <button
              key={cat.label}
              type="button"
              id={`cat-${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`pj__cat-btn ${data.category === cat.label ? 'pj__cat-btn--active' : ''}`}
              onClick={() => onChange('category', cat.label)}
            >
              <span className="pj__cat-emoji">{cat.emoji}</span>
              <span className="pj__cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="pj__field">
        <label className="pj__label" htmlFor="job-title">Job Title</label>
        <input
          id="job-title"
          type="text"
          className="pj__input"
          placeholder="e.g. Fix bathroom pipe leak under the sink"
          value={data.title}
          onChange={e => onChange('title', e.target.value)}
          maxLength={100}
        />
        <div className="pj__input-count">{data.title.length}/100</div>
      </div>

      {/* Description */}
      <div className="pj__field">
        <label className="pj__label" htmlFor="job-desc">
          Description
          <span className="pj__label-hint"> — what, where, any special requirements?</span>
        </label>
        <textarea
          id="job-desc"
          className="pj__input pj__textarea"
          placeholder="Describe the job in detail. Include dimensions, materials, access notes, or anything the worker needs to know..."
          value={data.description}
          onChange={e => onChange('description', e.target.value)}
          rows={5}
          maxLength={600}
        />
        <div className="pj__input-count">{data.description.length}/600</div>
      </div>

      {/* AI tip */}
      {data.category && (
        <div className="pj__ai-tip">
          <Sparkles size={13} />
          <span>💡 Tip for <strong>{data.category}</strong>: Include photos of the area, material type, and whether parts are needed — workers can give more accurate quotes.</span>
        </div>
      )}

      <button className="btn btn-primary pj__next-btn" id="details-next" onClick={handleNext}>
        Continue <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ─── Step 2: Budget & Urgency ─── */
function StepBudget({ data, onChange, onNext, onBack }) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!data.budgetType) return setError('Please select a budget type.');
    if (!data.budgetMin || data.budgetMin < 100) return setError('Enter a valid minimum budget (min ₹100).');
    if (!data.urgency) return setError('Please select when you need the job done.');
    setError('');
    onNext();
  };

  return (
    <div className="pj__step" id="pj-step-budget">
      <h2 className="pj__step-title">Budget & Timeline</h2>
      <p className="pj__step-sub">Set a fair budget and tell workers when you need the job done.</p>

      {error && <div className="pj__error"><AlertCircle size={14} />{error}</div>}

      {/* Budget type toggle */}
      <div className="pj__field">
        <label className="pj__label">Budget Type</label>
        <div className="pj__toggle-group">
          {[
            { value: 'fixed', label: '💰 Fixed Price', desc: 'You agree a total price upfront' },
            { value: 'hourly', label: '⏱️ Hourly Rate', desc: 'Pay by the hour as work progresses' },
            { value: 'range', label: '↔️ Price Range', desc: 'Set a min–max you\'re comfortable with' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              id={`budget-type-${opt.value}`}
              className={`pj__budget-type-btn ${data.budgetType === opt.value ? 'pj__budget-type-btn--active' : ''}`}
              onClick={() => onChange('budgetType', opt.value)}
            >
              <span className="pj__budget-type-label">{opt.label}</span>
              <span className="pj__budget-type-desc">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount inputs */}
      {data.budgetType && (
        <div className="pj__field">
          <label className="pj__label">
            {data.budgetType === 'range' ? 'Budget Range (₹)' : data.budgetType === 'hourly' ? 'Hourly Rate Range (₹/hr)' : 'Your Budget (₹)'}
          </label>
          <div className="pj__amount-row">
            <div className="pj__amount-wrap">
              <span className="pj__currency">₹</span>
              <input
                id="budget-min"
                type="number"
                className="pj__input pj__amount-input"
                placeholder={data.budgetType === 'range' ? 'Min' : 'Amount'}
                value={data.budgetMin}
                onChange={e => onChange('budgetMin', e.target.value)}
                min="100"
              />
            </div>
            {(data.budgetType === 'range' || data.budgetType === 'hourly') && (
              <>
                <span className="pj__amount-sep">to</span>
                <div className="pj__amount-wrap">
                  <span className="pj__currency">₹</span>
                  <input
                    id="budget-max"
                    type="number"
                    className="pj__input pj__amount-input"
                    placeholder="Max"
                    value={data.budgetMax}
                    onChange={e => onChange('budgetMax', e.target.value)}
                    min="100"
                  />
                </div>
              </>
            )}
            {data.budgetType === 'hourly' && <span className="pj__amount-unit">/hr</span>}
          </div>
        </div>
      )}

      {/* Urgency */}
      <div className="pj__field">
        <label className="pj__label">When do you need this done?</label>
        <div className="pj__urgency-grid">
          {URGENCY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              id={`urgency-${opt.value}`}
              className={`pj__urgency-btn ${data.urgency === opt.value ? 'pj__urgency-btn--active' : ''}`}
              onClick={() => onChange('urgency', opt.value)}
            >
              <span className="pj__urgency-label">{opt.label}</span>
              <span className="pj__urgency-desc">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pj__nav-row">
        <button className="btn btn-secondary" id="budget-back" onClick={onBack}><ChevronLeft size={16} />Back</button>
        <button className="btn btn-primary pj__next-btn" id="budget-next" onClick={handleNext}>Continue <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

/* ─── Step 3: Location ─── */
function StepLocation({ data, onChange, onNext, onBack }) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!data.location.trim()) return setError('Please enter your location.');
    setError('');
    onNext();
  };

  return (
    <div className="pj__step" id="pj-step-location">
      <h2 className="pj__step-title">Where is the job?</h2>
      <p className="pj__step-sub">Workers near you will be notified. Your exact address is only shared after you accept a bid.</p>

      {error && <div className="pj__error"><AlertCircle size={14} />{error}</div>}

      <div className="pj__field">
        <label className="pj__label" htmlFor="job-location">Area / Neighbourhood</label>
        <div className="pj__input-icon-wrap">
          <MapPin size={16} className="pj__input-icon" />
          <input
            id="job-location"
            type="text"
            className="pj__input pj__input-with-icon"
            placeholder="e.g. Bandra West, Mumbai"
            value={data.location}
            onChange={e => onChange('location', e.target.value)}
          />
        </div>
      </div>

      {/* Radius */}
      <div className="pj__field">
        <label className="pj__label">
          Notify workers within
          <span className="pj__label-val"> {data.radius} km</span>
        </label>
        <input
          type="range" min={2} max={50} step={2}
          value={data.radius}
          onChange={e => onChange('radius', Number(e.target.value))}
          className="pj__range"
          id="job-radius"
        />
        <div className="pj__range-labels"><span>2 km</span><span>50 km</span></div>
      </div>

      {/* Additional notes */}
      <div className="pj__field">
        <label className="pj__label" htmlFor="job-notes">
          Additional Notes <span className="pj__label-hint">(optional)</span>
        </label>
        <textarea
          id="job-notes"
          className="pj__input pj__textarea"
          placeholder="Parking available? Gate code? Preferred time of visit?"
          value={data.notes}
          onChange={e => onChange('notes', e.target.value)}
          rows={3}
          maxLength={300}
        />
      </div>

      <div className="pj__nav-row">
        <button className="btn btn-secondary" id="location-back" onClick={onBack}><ChevronLeft size={16} />Back</button>
        <button className="btn btn-primary pj__next-btn" id="location-next" onClick={handleNext}>Review Post <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

/* ─── Step 4: Review & Post ─── */
function StepReview({ data, onSubmit, onBack, loading }) {
  const urgencyLabel = URGENCY_OPTIONS.find(o => o.value === data.urgency)?.label || '';

  return (
    <div className="pj__step" id="pj-step-review">
      <h2 className="pj__step-title">Review your job post</h2>
      <p className="pj__step-sub">This is exactly how workers will see your listing.</p>

      <div className="pj__preview glass-card">
        {/* Preview header */}
        <div className="pj__preview-head">
          <div className="pj__preview-cat">
            {JOB_CATEGORIES.find(c => c.label === data.category)?.emoji} {data.category}
          </div>
          <div className={`pj__preview-urgency pj__preview-urgency--${data.urgency}`}>
            <Clock size={12} /> {urgencyLabel}
          </div>
        </div>
        <h3 className="pj__preview-title">{data.title}</h3>
        <p className="pj__preview-desc">{data.description}</p>

        <div className="pj__preview-meta">
          <div className="pj__preview-meta-item">
            <MapPin size={13} /> {data.location}
          </div>
          <div className="pj__preview-meta-item">
            <DollarSign size={13} />
            {data.budgetType === 'fixed' && `₹${data.budgetMin} fixed`}
            {data.budgetType === 'hourly' && `₹${data.budgetMin}${data.budgetMax ? `–₹${data.budgetMax}` : ''}/hr`}
            {data.budgetType === 'range' && `₹${data.budgetMin}${data.budgetMax ? ` – ₹${data.budgetMax}` : ''}`}
          </div>
          <div className="pj__preview-meta-item">
            <FileText size={13} /> Within {data.radius} km
          </div>
        </div>

        {data.notes && (
          <div className="pj__preview-notes">📝 {data.notes}</div>
        )}

        <div className="pj__preview-footer">
          <span>Workers in your area will be notified instantly</span>
          <span className="pj__preview-badge">🔒 Address shared only after accepting a bid</span>
        </div>
      </div>

      <div className="pj__review-terms">
        <Check size={13} />
        <span>By posting, you agree to GetItDone's <a href="#">Terms of Service</a>. Posting is free — you only pay when you hire.</span>
      </div>

      <div className="pj__nav-row">
        <button className="btn btn-secondary" id="review-back" onClick={onBack} disabled={loading}><ChevronLeft size={16} />Back</button>
        <button className="btn btn-primary pj__next-btn" id="post-job-submit" onClick={onSubmit} disabled={loading}>
          {loading ? <span className="pj__spinner" /> : <><Zap size={15} fill="currentColor" /> Post Job Now</>}
        </button>
      </div>
    </div>
  );
}

/* ─── Success ─── */
function StepSuccess({ data }) {
  return (
    <div className="pj__step pj__step--success" id="pj-step-success">
      <div className="pj__success-icon">🎉</div>
      <h2 className="pj__step-title">Your job is live!</h2>
      <p className="pj__step-sub">
        Workers near <strong>{data.location}</strong> are being notified right now.
        You'll hear back within {data.urgency === 'today' ? 'minutes' : 'a few hours'}.
      </p>

      <div className="pj__success-job glass-card">
        <div className="pj__success-job-cat">{JOB_CATEGORIES.find(c => c.label === data.category)?.emoji} {data.category}</div>
        <div className="pj__success-job-title">{data.title}</div>
        <div className="pj__success-job-loc"><MapPin size={12} /> {data.location}</div>
      </div>

      <div className="pj__success-actions">
        <Link to="/dashboard" className="btn btn-primary btn-lg" id="go-to-dashboard" style={{ justifyContent: 'center' }}>
          <ArrowRight size={15} /> Go to Dashboard
        </Link>
        <Link to="/browse" className="btn btn-secondary" id="browse-workers-from-success" style={{ justifyContent: 'center' }}>
          Browse Workers Directly
        </Link>
      </div>

      <div className="pj__success-perks">
        <div className="pj__success-perk">📬 We'll notify you the moment a worker bids</div>
        <div className="pj__success-perk">💬 Chat & negotiate before committing</div>
        <div className="pj__success-perk">🔒 Pay only after the job is done</div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
const INITIAL_DATA = {
  category: '', title: '', description: '',
  budgetType: '', budgetMin: '', budgetMax: '',
  urgency: '', location: '', radius: 10, notes: '',
};

export default function PostJob() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setData(p => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep(5);
  };

  const totalSteps = 4;
  const progress = ((step - 1) / totalSteps) * 100;

  return (
    <div className="pj-page">
      <div className="glow-orb glow-amber pj__glow-1" />
      <div className="glow-orb glow-blue pj__glow-2" />
      <div className="noise-overlay" aria-hidden="true" />

      {/* Top bar */}
      <header className="pj__topbar">
        <Link to="/" className="pj__logo" id="pj-logo">
          <div className="pj__logo-icon"><Zap size={14} fill="currentColor" /></div>
          <span>GetItDone</span>
        </Link>
        {step < 5 && (
          <div className="pj__topbar-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={`pj__topbar-step ${i + 1 === step ? 'pj__topbar-step--active' : ''} ${i + 1 < step ? 'pj__topbar-step--done' : ''}`}>
                <div className="pj__topbar-step-dot">
                  {i + 1 < step ? <Check size={10} /> : i + 1}
                </div>
                <span className="pj__topbar-step-label">{s}</span>
              </div>
            ))}
          </div>
        )}
        <Link to="/dashboard" className="btn btn-secondary pj__topbar-dash" id="pj-dashboard-link">Dashboard</Link>
      </header>

      {/* Progress bar */}
      {step < 5 && (
        <div className="pj__progress-bar">
          <div className="pj__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Card */}
      <div className="pj__card glass-card">
        {step === 1 && <StepDetails data={data} onChange={update} onNext={() => setStep(2)} />}
        {step === 2 && <StepBudget data={data} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <StepLocation data={data} onChange={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <StepReview data={data} onSubmit={handleSubmit} onBack={() => setStep(3)} loading={loading} />}
        {step === 5 && <StepSuccess data={data} />}
      </div>
    </div>
  );
}
