import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, Check, Zap, Upload,
  User, Briefcase, Tag, IndianRupee, Camera, Loader,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useS3Upload } from '../hooks/useS3Upload';
import './WorkerRegister.css';

const CHENNAI_AREAS = [
  'Adyar', 'Anna Nagar', 'T. Nagar', 'Mylapore', 'Velachery',
  'Nungambakkam', 'Egmore', 'Tambaram', 'Porur', 'Sholinganallur',
  'OMR / Perungudi', 'Perambur', 'Royapettah', 'Kodambakkam',
  'Vadapalani', 'Chromepet', 'Pallavaram', 'Guindy', 'Kilpauk',
  'Mogappair', 'Ambattur', 'Avadi', 'Other area in Chennai',
];

const STEPS = [
  { id: 1, label: 'About You',   icon: User },
  { id: 2, label: 'Your Craft',  icon: Briefcase },
  { id: 3, label: 'Skills',      icon: Tag },
  { id: 4, label: 'Pricing',     icon: IndianRupee },
  { id: 5, label: 'Portfolio',   icon: Camera },
];

const INITIAL = {
  name: '', phone: '', email: '', area: '',
  categories: [],            // ← array now, up to 6
  bio: '', tags: [],
  rate: '', rateType: 'hourly', languages: [],
  catalogue: [{ service: '', price: '', time: '' }],
  photos: [],
};

const LANGS = ['Tamil', 'English', 'Telugu', 'Hindi', 'Malayalam', 'Kannada'];

export default function WorkerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [previews, setPreviews] = useState([]);
  const { uploadFiles, uploading } = useS3Upload();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleTag = tag => {
    set('tags', form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : form.tags.length < 8 ? [...form.tags, tag] : form.tags);
  };

  const toggleCategory = catId => {
    const cats = form.categories;
    if (cats.includes(catId)) {
      set('categories', cats.filter(c => c !== catId));
    } else if (cats.length < 6) {
      set('categories', [...cats, catId]);
    }
  };

  const toggleLang = l => {
    set('languages', form.languages.includes(l)
      ? form.languages.filter(x => x !== l)
      : [...form.languages, l]);
  };

  const handlePhotos = files => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 6 - previews.length);
    const newPrev = valid.map(f => ({ id: `${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), file: f }));
    setPreviews(p => [...p, ...newPrev].slice(0, 6));
  };

  const addCatalogueRow = () =>
    set('catalogue', [...form.catalogue, { service: '', price: '', time: '' }]);

  const updateCatalogue = (i, key, val) => {
    const updated = form.catalogue.map((row, idx) => idx === i ? { ...row, [key]: val } : row);
    set('catalogue', updated);
  };

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.phone.match(/^\d{10}$/)) e.phone = 'Enter a valid 10-digit number';
      if (!form.email.includes('@')) e.email = 'Enter a valid email';
      if (!form.area) e.area = 'Select your area';
    }
    if (step === 2 && form.categories.length === 0) e.categories = 'Select at least one skill';
    if (step === 3 && !form.bio.trim()) e.bio = 'Write a short bio';
    if (step === 4 && !form.rate) e.rate = 'Enter your rate';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!validate()) return;
    // In production: upload photos to S3, then POST to API
    if (previews.length > 0) {
      await uploadFiles(previews.map(p => p.file), 'portfolio', form.name);
    }
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
  };

  const selectedCategories = CATEGORIES.filter(c => form.categories.includes(c.id));
  const primaryCategory = selectedCategories[0];
  const SUGGESTED_TAGS = primaryCategory
    ? ['Custom orders', 'Home visits', 'Express delivery', 'Online booking',
       'Bulk orders', 'Events', 'Beginners welcome', 'Certified']
    : [];

  if (submitted) {
    return (
      <div className="wr-page">
        <div className="wr-success">
          <div className="wr-success__icon"><Check size={36} /></div>
          <h2 className="wr-success__title">Application Submitted! 🎉</h2>
          <p className="wr-success__sub">
            Welcome to GetItDone, <strong>{form.name.split(' ')[0]}</strong>!<br />
            We'll verify your profile within 24 hours and notify you at <strong>{form.email}</strong>.
          </p>
          <div className="wr-success__detail">
            <div className="wr-success__row"><span>Skills</span><strong>{selectedCategories.map(c => `${c.emoji} ${c.label}`).join(', ')}</strong></div>
            <div className="wr-success__row"><span>Area</span><strong>{form.area}</strong></div>
            <div className="wr-success__row"><span>Rate</span><strong>₹{form.rate}/{form.rateType === 'hourly' ? 'hr' : 'job'}</strong></div>
          </div>
          <div className="wr-success__actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
            <Link to="/browse" className="btn btn-secondary">Browse Workers</Link>
          </div>
          <p className="wr-success__note">📱 We'll WhatsApp you on {form.phone} once approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wr-page">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="glow-orb glow-amber wr__glow-1" />
      <div className="glow-orb glow-blue wr__glow-2" />

      {/* Top bar */}
      <header className="wr__topbar">
        <Link to="/" className="wr__logo">
          <div className="wr__logo-icon"><Zap size={14} fill="currentColor" /></div>
          <span>GetItDone</span>
        </Link>
        <span className="wr__topbar-tag">🌟 Earn from your craft in Chennai</span>
      </header>

      <div className="wr__body container">
        {/* Progress */}
        <div className="wr__progress" role="list">
          {STEPS.map(s => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className={`wr__step ${active ? 'wr__step--active' : ''} ${done ? 'wr__step--done' : ''}`} role="listitem">
                <div className="wr__step-circle">
                  {done ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className="wr__step-label">{s.label}</span>
                {s.id < STEPS.length && <div className={`wr__step-line ${done ? 'wr__step-line--done' : ''}`} />}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="wr__card glass-card">

          {/* ── Step 1: About You ── */}
          {step === 1 && (
            <div className="wr__section" id="wr-step-1">
              <h2 className="wr__title">Tell us about yourself</h2>
              <p className="wr__subtitle">We use this to create your verified profile.</p>

              <div className="wr__fields">
                <div className="wr__field">
                  <label className="wr__label" htmlFor="wr-name">Full Name</label>
                  <input id="wr-name" className={`wr__input ${errors.name ? 'wr__input--err' : ''}`}
                    placeholder="e.g. Kavitha Rajan" value={form.name}
                    onChange={e => set('name', e.target.value)} />
                  {errors.name && <span className="wr__error">{errors.name}</span>}
                </div>

                <div className="wr__field">
                  <label className="wr__label" htmlFor="wr-phone">WhatsApp Number</label>
                  <div className="wr__phone-wrap">
                    <span className="wr__phone-pre">🇮🇳 +91</span>
                    <input id="wr-phone" className={`wr__input wr__input--phone ${errors.phone ? 'wr__input--err' : ''}`}
                      placeholder="9876543210" value={form.phone} maxLength={10}
                      onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
                  </div>
                  {errors.phone && <span className="wr__error">{errors.phone}</span>}
                </div>

                <div className="wr__field">
                  <label className="wr__label" htmlFor="wr-email">Email Address</label>
                  <input id="wr-email" type="email" className={`wr__input ${errors.email ? 'wr__input--err' : ''}`}
                    placeholder="you@gmail.com" value={form.email}
                    onChange={e => set('email', e.target.value)} />
                  {errors.email && <span className="wr__error">{errors.email}</span>}
                </div>

                <div className="wr__field">
                  <label className="wr__label" htmlFor="wr-area">Your Area in Chennai</label>
                  <select id="wr-area" className={`wr__select ${errors.area ? 'wr__input--err' : ''}`}
                    value={form.area} onChange={e => set('area', e.target.value)}>
                    <option value="">Select your neighbourhood…</option>
                    {CHENNAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.area && <span className="wr__error">{errors.area}</span>}
                </div>

                <div className="wr__field">
                  <label className="wr__label">Languages you speak</label>
                  <div className="wr__chips">
                    {LANGS.map(l => (
                      <button key={l} type="button" id={`lang-${l}`}
                        className={`wr__chip ${form.languages.includes(l) ? 'wr__chip--on' : ''}`}
                        onClick={() => toggleLang(l)}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Category ── */}
          {step === 2 && (
            <div className="wr__section" id="wr-step-2">
              <h2 className="wr__title">What are your skills?</h2>
              <p className="wr__subtitle">Select all that apply — up to 6 skills. You can excel at multiple things! 🌟</p>
              {errors.categories && <div className="wr__error-box">{errors.categories}</div>}
              {form.categories.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Selected:</span>
                  {selectedCategories.map(cat => (
                    <span key={cat.id} style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: `${cat.color}18`, border: `1px solid ${cat.color}40`, color: cat.color
                    }}>{cat.emoji} {cat.label} ✕</span>
                  ))}
                </div>
              )}

              {['trade', 'technical', 'creative', 'service'].map(type => (
                <div key={type} className="wr__cat-group">
                  <div className="wr__cat-group-label">
                    {type === 'trade' ? '🔧 Trades & Home' : type === 'technical' ? '💻 Technical & Repairs' : type === 'creative' ? '🎨 Creative & Handcraft' : '✨ Services'}
                  </div>
                  <div className="wr__cat-grid">
                    {CATEGORIES.filter(c => c.type === type).map(cat => (
                      <button
                        key={cat.id} type="button" id={`cat-${cat.id}`}
                        className={`wr__cat-card ${form.categories.includes(cat.id) ? 'wr__cat-card--active' : ''} ${
                          !form.categories.includes(cat.id) && form.categories.length >= 6 ? 'wr__cat-card--disabled' : ''
                        }`}
                        style={form.categories.includes(cat.id) ? { '--cat-color': cat.color } : {}}
                        onClick={() => { toggleCategory(cat.id); setErrors({}); }}
                        disabled={!form.categories.includes(cat.id) && form.categories.length >= 6}
                      >
                        <span className="wr__cat-emoji">{cat.emoji}</span>
                        <span className="wr__cat-name">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 3: Skills & Bio ── */}
          {step === 3 && (
            <div className="wr__section" id="wr-step-3">
              <h2 className="wr__title">Skills & your story</h2>
              <p className="wr__subtitle">This is what clients read before booking you.</p>

              <div className="wr__fields">
                <div className="wr__field">
                  <label className="wr__label" htmlFor="wr-bio">
                    Your Bio <span className="wr__label-hint">— {form.bio.length}/300</span>
                  </label>
                  <textarea id="wr-bio" className={`wr__textarea ${errors.bio ? 'wr__input--err' : ''}`}
                    placeholder={`e.g. I'm a Mylapore-based Tanjore painting artist with 8 years of experience. I take custom orders for gifting, home décor, and temple art…`}
                    value={form.bio} rows={5}
                    onChange={e => set('bio', e.target.value.slice(0, 300))} />
                  {errors.bio && <span className="wr__error">{errors.bio}</span>}
                </div>

                <div className="wr__field">
                  <label className="wr__label">Tags <span className="wr__label-hint">— select up to 8 that describe your work</span></label>
                  <div className="wr__chips">
                    {[...SUGGESTED_TAGS, 'Weekend available', 'Doorstep service', 'Quick turnaround', 'Premium quality'].map(tag => (
                      <button key={tag} type="button"
                        className={`wr__chip ${form.tags.includes(tag) ? 'wr__chip--on' : ''}`}
                        onClick={() => toggleTag(tag)}>{tag}</button>
                    ))}
                  </div>
                  <input className="wr__input" style={{ marginTop: 10 }}
                    placeholder="Add a custom tag and press Enter…"
                    onKeyDown={e => { if (e.key === 'Enter' && e.target.value.trim()) { toggleTag(e.target.value.trim()); e.target.value = ''; } }} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Pricing ── */}
          {step === 4 && (
            <div className="wr__section" id="wr-step-4">
              <h2 className="wr__title">Set your pricing</h2>
              <p className="wr__subtitle">Be honest — you can update this anytime. Clients can also negotiate.</p>

              <div className="wr__fields">
                <div className="wr__field">
                  <label className="wr__label">How do you charge?</label>
                  <div className="wr__rate-type">
                    {['hourly', 'per_job'].map(rt => (
                      <button key={rt} type="button"
                        className={`wr__rate-btn ${form.rateType === rt ? 'wr__rate-btn--active' : ''}`}
                        id={`rate-type-${rt}`}
                        onClick={() => set('rateType', rt)}>
                        {rt === 'hourly' ? '⏱ Per Hour' : '📋 Per Job / Fixed'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="wr__field">
                  <label className="wr__label" htmlFor="wr-rate">
                    Your base rate (₹ / {form.rateType === 'hourly' ? 'hour' : 'job'})
                  </label>
                  <div className="wr__rate-input-wrap">
                    <span className="wr__rate-pre">₹</span>
                    <input id="wr-rate" type="number" min="50" max="10000"
                      className={`wr__input wr__input--rate ${errors.rate ? 'wr__input--err' : ''}`}
                      placeholder="e.g. 350" value={form.rate}
                      onChange={e => set('rate', e.target.value)} />
                    <span className="wr__rate-suf">/{form.rateType === 'hourly' ? 'hr' : 'job'}</span>
                  </div>
                  {errors.rate && <span className="wr__error">{errors.rate}</span>}
                </div>

                <div className="wr__field">
                  <div className="wr__label" style={{ marginBottom: 10 }}>
                    Service Catalogue <span className="wr__label-hint">— add specific services with prices</span>
                  </div>
                  {form.catalogue.map((row, i) => (
                    <div key={i} className="wr__catalogue-row" id={`catalogue-row-${i}`}>
                      <input className="wr__input wr__catalogue-service"
                        placeholder="Service name (e.g. Bridal full-hand henna)" value={row.service}
                        onChange={e => updateCatalogue(i, 'service', e.target.value)} />
                      <input className="wr__input wr__catalogue-price"
                        placeholder="Price (₹999)" value={row.price}
                        onChange={e => updateCatalogue(i, 'price', e.target.value)} />
                      <input className="wr__input wr__catalogue-time"
                        placeholder="Time (2-3 hrs)" value={row.time}
                        onChange={e => updateCatalogue(i, 'time', e.target.value)} />
                    </div>
                  ))}
                  {form.catalogue.length < 6 && (
                    <button type="button" className="wr__add-row" id="add-catalogue-row" onClick={addCatalogueRow}>
                      + Add another service
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Portfolio ── */}
          {step === 5 && (
            <div className="wr__section" id="wr-step-5">
              <h2 className="wr__title">Show your work</h2>
              <p className="wr__subtitle">Upload photos of your best work. Workers with portfolios get 3× more bookings.</p>

              <div className="wr__portfolio-grid">
                {previews.map((p, i) => (
                  <div key={p.id} className="wr__photo-thumb">
                    <img src={p.url} alt={`Portfolio ${i + 1}`} />
                    <button className="wr__photo-remove"
                      onClick={() => setPreviews(prev => prev.filter(x => x.id !== p.id))}>✕</button>
                  </div>
                ))}
                {previews.length < 6 && (
                  <label className="wr__photo-add" id="wr-photo-add" htmlFor="wr-photo-input">
                    {uploading ? <Loader size={24} className="wr__spin" /> : <Upload size={24} />}
                    <span>{uploading ? 'Uploading…' : 'Add Photos'}</span>
                    <span className="wr__photo-hint">{previews.length}/6</span>
                    <input id="wr-photo-input" type="file" accept="image/*" multiple
                      style={{ display: 'none' }}
                      onChange={e => handlePhotos(e.target.files)} />
                  </label>
                )}
              </div>

              <div className="wr__portfolio-tips">
                <div className="wr__tip">📸 Show clear, well-lit photos of your finished work</div>
                <div className="wr__tip">🎯 Before & after shots work great for home services</div>
                <div className="wr__tip">✨ For creative work — show variety: different styles, sizes, occasions</div>
              </div>

              <div className="wr__review-box glass-card">
                <div className="wr__review-title">📋 Profile Summary</div>
                <div className="wr__review-row"><span>Name</span><strong>{form.name}</strong></div>
                <div className="wr__review-row"><span>Area</span><strong>{form.area}</strong></div>
                <div className="wr__review-row"><span>Skills</span><strong>{selectedCategories.map(c => `${c.emoji} ${c.label}`).join(', ')}</strong></div>
                <div className="wr__review-row"><span>Rate</span><strong>₹{form.rate}/{form.rateType === 'hourly' ? 'hr' : 'job'}</strong></div>
                <div className="wr__review-row"><span>Photos</span><strong>{previews.length} uploaded</strong></div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="wr__nav">
            {step > 1 && (
              <button className="btn btn-secondary wr__back-btn" id="wr-back" onClick={back}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < 5 ? (
              <button className="btn btn-primary wr__next-btn" id="wr-next" onClick={next}>
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary wr__next-btn" id="wr-submit" onClick={handleSubmit} disabled={uploading}>
                {uploading ? <><span className="wr__spinner" /> Submitting…</> : '🚀 Submit Application'}
              </button>
            )}
          </div>
        </div>

        <p className="wr__footer-note">
          Already registered? <Link to="/login">Log in here</Link> &nbsp;·&nbsp;
          Looking to hire? <Link to="/browse">Browse workers</Link>
        </p>
      </div>
    </div>
  );
}
