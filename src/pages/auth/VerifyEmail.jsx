import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, MailCheck, RefreshCw, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../auth/Auth.css';
import './VerifyEmail.css';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendCode, isMockMode } = useAuth();

  const email = location.state?.email || '';
  const pendingUser = location.state?.pendingUser || null;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputs = useRef([]);

  // Focus first box on mount
  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) return setError('Please enter the full 6-digit code.');
    setError('');
    setLoading(true);
    try {
      if (isMockMode) {
        // Mock mode — simulate success
        await new Promise(r => setTimeout(r, 1000));
      } else {
        await verifyEmail(email, fullCode);
      }
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      if (!isMockMode) await resendCode(email);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      setError(err.message || 'Could not resend code.');
    } finally {
      setResending(false);
    }
  };

  const isComplete = code.every(d => d !== '');

  return (
    <div className="auth-page">
      <div className="glow-orb glow-amber auth__glow-1" />
      <div className="glow-orb glow-blue auth__glow-2" />
      <div className="noise-overlay" aria-hidden="true" />

      <Link to="/" className="auth__logo" id="verify-logo">
        <div className="auth__logo-icon"><Zap size={15} fill="currentColor" /></div>
        GetItDone
      </Link>

      <div className="auth-card verify-card glass-card">
        {success ? (
          <div className="verify__success">
            <div className="verify__success-icon">
              <Check size={28} />
            </div>
            <h2 className="verify__title">Email verified! 🎉</h2>
            <p className="verify__sub">Taking you to your dashboard…</p>
          </div>
        ) : (
          <>
            <div className="verify__header">
              <div className="verify__mail-icon">
                <MailCheck size={28} />
              </div>
              <h1 className="verify__title">Check your email</h1>
              <p className="verify__sub">
                We sent a 6-digit code to{' '}
                <strong>{email || 'your email address'}</strong>.
                {isMockMode && (
                  <span className="verify__mock-note"> (Mock mode — any 6 digits work)</span>
                )}
              </p>
            </div>

            {error && <div className="auth__error">{error}</div>}

            {/* OTP input */}
            <div className="verify__otp-wrap" id="otp-input-group" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputs.current[i] = el}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`verify__otp-box ${digit ? 'verify__otp-box--filled' : ''}`}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)}
                  autoComplete="off"
                />
              ))}
            </div>

            <button
              className="btn btn-primary verify__submit"
              id="verify-submit-btn"
              onClick={handleVerify}
              disabled={loading || !isComplete}
            >
              {loading ? <span className="auth__spinner" /> : 'Verify & Continue'}
            </button>

            <div className="verify__footer">
              <span>Didn't get it?</span>
              <button
                className="verify__resend"
                id="verify-resend-btn"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? <RefreshCw size={13} className="verify__spin" /> : null}
                {resent ? '✅ Sent!' : 'Resend code'}
              </button>
            </div>

            <div className="verify__footer">
              <Link to="/signup" className="verify__back">
                <ArrowLeft size={13} /> Wrong email? Go back
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
