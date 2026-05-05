import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, isMockMode } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      if (isMockMode) {
        // Mock mode — any credentials work
        await new Promise(r => setTimeout(r, 1000));
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('UserNotConfirmedException') || msg.includes('not confirmed')) {
        navigate('/verify-email', { state: { email: form.email } });
      } else if (msg.includes('NotAuthorizedException') || msg.includes('Incorrect username or password')) {
        setError('Incorrect email or password. Please try again.');
      } else if (msg.includes('UserNotFoundException')) {
        setError('No account found with this email. Sign up first.');
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background glows */}
      <div className="glow-orb glow-amber auth__glow-1" />
      <div className="glow-orb glow-blue auth__glow-2" />
      <div className="noise-overlay" aria-hidden="true" />

      {/* Back to home */}
      <Link to="/" className="auth__back" id="auth-back-home">
        <Zap size={16} fill="currentColor" />
        <span>GetItDone</span>
      </Link>

      <div className="auth__card glass-card">
        {/* Header */}
        <div className="auth__header">
          <div className="auth__avatar-ring">
            <Lock size={22} />
          </div>
          <h1 className="auth__title">Welcome back</h1>
          <p className="auth__sub">
            Log in to your account to hire workers or manage your jobs.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth__error" role="alert" id="login-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* Form */}
        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth__field">
            <label className="auth__label" htmlFor="login-email">Email address</label>
            <div className="auth__input-wrap">
              <Mail size={16} className="auth__input-icon" />
              <input
                id="login-email"
                name="email"
                type="email"
                className="auth__input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth__field">
            <div className="auth__label-row">
              <label className="auth__label" htmlFor="login-password">Password</label>
              <a href="#" className="auth__forgot" id="forgot-password-link">Forgot password?</a>
            </div>
            <div className="auth__input-wrap">
              <Lock size={16} className="auth__input-icon" />
              <input
                id="login-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="auth__input"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth__eye"
                onClick={() => setShowPass(p => !p)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                id="toggle-password-visibility"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="auth__remember">
            <label className="auth__checkbox-label" htmlFor="remember-me">
              <input type="checkbox" id="remember-me" className="auth__checkbox" />
              <span className="auth__checkmark" />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary auth__submit"
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="auth__spinner" />
            ) : (
              <>Log In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth__divider">
          <span>or continue with</span>
        </div>

        {/* Social auth */}
        <div className="auth__socials">
          <button className="auth__social-btn" id="google-login" type="button">
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.000 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.308 0-9.815-3.326-11.48-7.98l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer link */}
        <p className="auth__switch">
          Don't have an account?{' '}
          <Link to="/signup" id="switch-to-signup">Create one free →</Link>
        </p>
      </div>
    </div>
  );
}
