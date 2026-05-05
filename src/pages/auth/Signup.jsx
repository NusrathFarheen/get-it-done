import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, User, Briefcase, Mail, Lock, Phone, Eye, EyeOff,
  ArrowRight, ArrowLeft, Check, AlertCircle, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const SKILL_CATEGORIES = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
  'AC & Appliances', 'Masonry & Tiling', 'Gardening & Landscaping',
  'Roofing', 'Security Systems', 'Moving & Shifting',
  'Tutoring', 'Cooking & Catering', 'Photography', 'Beauty & Wellness',
  'IT & Tech Support', 'Vehicle Repair', 'Other',
];

// Step 1: Role selector
function StepRole({ onSelect }) {
  return (
    <div className="signup__step" id="signup-step-role">
      <div className="auth__header">
        <div className="auth__avatar-ring">
          <Zap size={22} fill="currentColor" />
        </div>
        <h1 className="auth__title">Join GetItDone</h1>
        <p className="auth__sub">I want to…</p>
      </div>

      <div className="signup__roles">
        <button
          className="signup__role-card"
          id="role-client"
          type="button"
          onClick={() => onSelect('client')}
        >
          <div className="signup__role-icon signup__role-icon--client">
            <User size={30} />
          </div>
          <div className="signup__role-text">
            <div className="signup__role-title">Hire Workers</div>
            <div className="signup__role-desc">
              Find skilled professionals near you for any job at home or work.
            </div>
          </div>
          <ArrowRight size={18} className="signup__role-arrow" />
        </button>

        <button
          className="signup__role-card"
          id="role-worker"
          type="button"
          onClick={() => onSelect('worker')}
        >
          <div className="signup__role-icon signup__role-icon--worker">
            <Briefcase size={30} />
          </div>
          <div className="signup__role-text">
            <div className="signup__role-title">Offer My Skills</div>
            <div className="signup__role-desc">
              Build a profile, get discovered by thousands of clients, and earn more.
            </div>
          </div>
          <ArrowRight size={18} className="signup__role-arrow" />
        </button>
      </div>

      <p className="auth__switch" style={{ marginTop: '28px' }}>
        Already have an account?{' '}
        <Link to="/login" id="switch-to-login">Log in →</Link>
      </p>
    </div>
  );
}

// Step 2: Basic details (shared by both roles)
function StepDetails({ role, onNext, onBack }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/\d/.test(form.password)) {
      setError('Password must include at least one number.');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(form.password)) {
      setError('Password must include at least one symbol (e.g. ! @ # $).');
      return;
    }
    onNext(form);
  };

  return (
    <div className="signup__step" id="signup-step-details">
      <button className="auth__back-step" onClick={onBack} type="button" id="back-to-role">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="auth__header">
        <div className={`auth__avatar-ring ${role === 'worker' ? 'auth__avatar-ring--amber' : ''}`}>
          {role === 'client' ? <User size={22} /> : <Briefcase size={22} />}
        </div>
        <h1 className="auth__title">
          {role === 'client' ? 'Create Client Account' : 'Create Worker Account'}
        </h1>
        <p className="auth__sub">Tell us a bit about yourself</p>
      </div>

      {error && (
        <div className="auth__error" role="alert" id="signup-error">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <div className="auth__field">
          <label className="auth__label" htmlFor="signup-name">Full Name</label>
          <div className="auth__input-wrap">
            <User size={16} className="auth__input-icon" />
            <input
              id="signup-name" name="name" type="text"
              className="auth__input" placeholder="Ananya Iyer"
              value={form.name} onChange={handleChange} required
            />
          </div>
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="signup-email">Email Address</label>
          <div className="auth__input-wrap">
            <Mail size={16} className="auth__input-icon" />
            <input
              id="signup-email" name="email" type="email"
              className="auth__input" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="signup-phone">Phone Number</label>
          <div className="auth__input-wrap">
            <Phone size={16} className="auth__input-icon" />
            <input
              id="signup-phone" name="phone" type="tel"
              className="auth__input" placeholder="+91 98765 43210"
              value={form.phone} onChange={handleChange} required
            />
          </div>
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="signup-password">Password</label>
          <div className="auth__input-wrap">
            <Lock size={16} className="auth__input-icon" />
            <input
              id="signup-password" name="password"
              type={showPass ? 'text' : 'password'}
              className="auth__input" placeholder="Min. 8 chars, 1 number, 1 symbol"
              value={form.password} onChange={handleChange} required
            />
            <button
              type="button" className="auth__eye"
              onClick={() => setShowPass(p => !p)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              id="toggle-signup-password"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Password strength */}
          {form.password.length > 0 && (
            <div className="auth__strength">
              <div
                className={`auth__strength-bar ${
                  form.password.length < 8 ? 'auth__strength-bar--weak' :
                  (!/\d/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password)) ? 'auth__strength-bar--ok' :
                  'auth__strength-bar--strong'
                }`}
              />
              <span className="auth__strength-label">
                {form.password.length < 8 ? 'Too short' :
                 (!/\d/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password))
                   ? 'Add a number & symbol'
                   : '✓ Meets policy'}
              </span>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary auth__submit" id="details-next-btn">
          Continue <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}

// Step 3: Worker-specific — skill & rate setup
function StepWorkerSkills({ onNext, onBack }) {
  const [skill, setSkill] = useState('');
  const [rate, setRate] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!skill || !rate) { setError('Please select your skill and hourly rate.'); return; }
    if (isNaN(rate) || Number(rate) < 100) { setError('Enter a valid hourly rate (min ₹100).'); return; }
    onNext({ skill, rate, bio });
  };

  return (
    <div className="signup__step" id="signup-step-skills">
      <button className="auth__back-step" onClick={onBack} type="button" id="back-to-details">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="auth__header">
        <div className="auth__avatar-ring auth__avatar-ring--amber">
          <Briefcase size={22} />
        </div>
        <h1 className="auth__title">Your Skills & Rate</h1>
        <p className="auth__sub">Help clients find and book you for the right jobs</p>
      </div>

      {error && (
        <div className="auth__error" role="alert" id="skills-error">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {/* Primary Skill */}
        <div className="auth__field">
          <label className="auth__label" htmlFor="signup-skill">Primary Skill Category</label>
          <div className="auth__input-wrap auth__input-wrap--select">
            <Briefcase size={16} className="auth__input-icon" />
            <select
              id="signup-skill"
              className="auth__input auth__select"
              value={skill}
              onChange={e => { setSkill(e.target.value); setError(''); }}
              required
            >
              <option value="">Select your main skill…</option>
              {SKILL_CATEGORIES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={15} className="auth__select-chevron" />
          </div>
        </div>

        {/* Hourly Rate */}
        <div className="auth__field">
          <label className="auth__label" htmlFor="signup-rate">
            Hourly Rate (₹)
            <span className="auth__label-hint"> — you can always change this later</span>
          </label>
          <div className="auth__input-wrap">
            <span className="auth__input-icon auth__currency">₹</span>
            <input
              id="signup-rate" type="number" min="100" step="50"
              className="auth__input" placeholder="350"
              value={rate} onChange={e => { setRate(e.target.value); setError(''); }}
              required
            />
            <span className="auth__rate-suffix">/hr</span>
          </div>
          {skill && rate >= 100 && (
            <div className="auth__rate-hint">
              💡 Similar {skill.toLowerCase()} workers in your area charge ₹{Math.max(100, Number(rate) - 50)}–₹{Number(rate) + 150}/hr
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="auth__field">
          <label className="auth__label" htmlFor="signup-bio">
            Short Bio <span className="auth__label-hint">(optional)</span>
          </label>
          <textarea
            id="signup-bio"
            className="auth__input auth__textarea"
            placeholder="e.g. 8+ years experience in residential plumbing. Quick, clean, reliable."
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            maxLength={200}
          />
          <div className="auth__char-count">{bio.length}/200</div>
        </div>

        <button type="submit" className="btn btn-primary auth__submit" id="skills-next-btn">
          Continue <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}

// Step 4: Success / confirmation
function StepSuccess({ role }) {
  return (
    <div className="signup__step signup__step--success" id="signup-step-success">
      <div className="signup__success-icon">
        <Check size={32} />
      </div>
      <h1 className="auth__title">You're in! 🎉</h1>
      <p className="auth__sub">
        {role === 'client'
          ? 'Your client account is ready. Start browsing skilled workers near you right now.'
          : 'Your worker profile is live! Complete your profile to start getting hired.'}
      </p>
      <div className="signup__success-actions">
        <Link
          to="/"
          className="btn btn-primary btn-lg"
          style={{ justifyContent: 'center' }}
          id="success-explore-btn"
        >
          {role === 'client' ? 'Browse Workers →' : 'Complete My Profile →'}
        </Link>
        <Link
          to="/"
          className="btn btn-secondary"
          style={{ justifyContent: 'center' }}
          id="success-home-btn"
        >
          Go to Home
        </Link>
      </div>
      <div className="signup__success-perks">
        {role === 'client' ? (
          <>
            <div className="signup__perk">✅ No upfront fees</div>
            <div className="signup__perk">🔒 Escrow-protected payments</div>
            <div className="signup__perk">⭐ Reviewed, verified workers</div>
          </>
        ) : (
          <>
            <div className="signup__perk">🎯 Your profile is now searchable</div>
            <div className="signup__perk">💬 Clients can now message you</div>
            <div className="signup__perk">💰 You only pay when you earn</div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Main Signup page orchestrator ---
export default function Signup() {
  const navigate = useNavigate();
  const { register, isMockMode } = useAuth();
  const [step, setStep] = useState(1);   // 1=role, 2=details, 3=skills(worker), 4=success
  const [role, setRole] = useState('');
  const [collectedDetails, setCollectedDetails] = useState(null); // holds step 2 form data
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleRoleSelect = selected => {
    setRole(selected);
    setStep(2);
  };

  // Called when Step 2 (details) is complete
  const handleDetailsNext = details => {
    setCollectedDetails(details);
    setSignupError('');
    if (role === 'client') {
      // Clients skip skills step — submit directly
      submitSignup(details, {});
    } else {
      setStep(3);
    }
  };

  // Called when Step 3 (worker skills) is complete
  const handleSkillsNext = skillData => {
    submitSignup(collectedDetails, skillData);
  };

  // Core submission — calls Cognito register()
  const submitSignup = async (details, skillData) => {
    setLoading(true);
    setSignupError('');
    try {
      if (isMockMode) {
        // Mock mode — simulate delay then go to success
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setStep(4);
        return;
      }
      const result = await register({
        name: details.name,
        email: details.email,
        phone: details.phone,
        password: details.password,
        role,
        skill: skillData.skill || '',
        rate: skillData.rate || '',
        bio: skillData.bio || '',
        location: '',
      });
      setLoading(false);
      // Cognito requires email verification
      if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        navigate('/verify-email', { state: { email: details.email } });
      } else {
        // Already confirmed (shouldn't happen but handle gracefully)
        setStep(4);
      }
    } catch (err) {
      setLoading(false);
      const msg = err.message || '';
      if (msg.includes('UsernameExistsException') || msg.includes('already exists')) {
        setSignupError('An account with this email already exists. Try logging in.');
      } else if (msg.includes('InvalidPasswordException') || msg.includes('password')) {
        setSignupError('Password must be at least 8 characters and include a number.');
      } else if (msg.includes('InvalidParameterException')) {
        setSignupError('Please check your details and try again.');
      } else {
        setSignupError(msg || 'Signup failed. Please try again.');
      }
      // Go back to step 2 to show error
      setStep(2);
    }
  };

  // Progress indicator (1-based steps shown to user)
  const totalSteps = role === 'worker' ? 3 : 2;
  const currentDisplayStep = step === 1 ? 1 : step === 2 ? 2 : step === 3 ? 3 : totalSteps;

  return (
    <div className="auth-page">
      <div className="glow-orb glow-amber auth__glow-1" />
      <div className="glow-orb glow-blue auth__glow-2" />
      <div className="noise-overlay" aria-hidden="true" />

      <Link to="/" className="auth__back" id="auth-back-home-signup">
        <Zap size={16} fill="currentColor" />
        <span>GetItDone</span>
      </Link>

      <div className="auth__card glass-card">
        {/* Progress dots */}
        {step > 1 && step < 4 && (
          <div className="signup__progress" id="signup-progress" aria-label={`Step ${currentDisplayStep} of ${totalSteps}`}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`signup__progress-dot ${i < currentDisplayStep ? 'signup__progress-dot--done' : ''} ${i === currentDisplayStep - 1 ? 'signup__progress-dot--active' : ''}`}
              />
            ))}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="auth__loading-overlay" aria-label="Creating your account…">
            <div className="auth__loading-spinner" />
            <span>Setting up your account…</span>
          </div>
        )}

        {/* Top-level signup error (from Cognito) */}
        {!loading && signupError && (
          <div className="auth__error" role="alert" id="signup-global-error" style={{ margin: '0 0 8px' }}>
            <AlertCircle size={15} /> {signupError}
          </div>
        )}

        {!loading && (
          <>
            {step === 1 && <StepRole onSelect={handleRoleSelect} />}
            {step === 2 && (
              <StepDetails
                role={role}
                onNext={handleDetailsNext}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && role === 'worker' && (
              <StepWorkerSkills
                onNext={handleSkillsNext}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && <StepSuccess role={role} />}
          </>
        )}
      </div>
    </div>
  );
}
