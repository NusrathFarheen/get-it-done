import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Zap, Shield, Lock, CheckCircle, ArrowLeft, CreditCard,
  Smartphone, Building2, ChevronRight, Clock, Star,
  AlertCircle, BadgeCheck, Info,
} from 'lucide-react';
import './Escrow.css';

// Mock job/bid data (replace with API call using jobId + bidderId from URL)
const MOCK_ORDER = {
  job: {
    id: 'j1',
    title: 'Fix bathroom pipe leakage under sink',
    category: '🔧 Plumbing',
    location: 'Andheri West, Mumbai',
    urgency: 'Today',
  },
  worker: {
    id: 'w1',
    name: 'Rajan Mehta',
    initials: 'RM',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    skill: 'Master Plumber',
    rating: 4.9,
    jobs: 312,
    verified: true,
  },
  bid: {
    amount: 520,
    note: 'Flat rate. I\'ll bring all tools and materials. Clean up included.',
    eta: '3 PM today',
  },
  fees: {
    platformFee: 26,    // 5% platform fee
    gst: 9.36,          // 18% GST on fee
  },
};

const PAYMENT_METHODS = [
  { id: 'upi',  label: 'UPI', icon: <Smartphone size={18} />, hint: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} />, hint: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={18} />, hint: 'All major banks' },
];

function EscrowExplainer() {
  return (
    <div className="escrow__explainer glass-card">
      <div className="escrow__explainer-head">
        <Shield size={18} className="escrow__shield" />
        <span>How Escrow Protection Works</span>
      </div>
      <div className="escrow__steps">
        {[
          { icon: '🔒', title: 'You Pay', desc: 'Your payment is held securely — not released yet.' },
          { icon: '🔨', title: 'Work Happens', desc: 'Worker sees confirmation and arrives to do the job.' },
          { icon: '✅', title: 'You Approve', desc: 'Once done, you mark it complete to release payment.' },
          { icon: '💰', title: 'Worker Gets Paid', desc: 'Payment releases to the worker. Zero risk for both.' },
        ].map((s, i) => (
          <div key={i} className="escrow__step">
            <div className="escrow__step-icon">{s.icon}</div>
            <div>
              <div className="escrow__step-title">{s.title}</div>
              <div className="escrow__step-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuccessScreen({ order }) {
  const navigate = useNavigate();
  return (
    <div className="escrow__success">
      <div className="escrow__success-icon">
        <CheckCircle size={44} />
      </div>
      <h2 className="escrow__success-title">Payment Held in Escrow! 🎉</h2>
      <p className="escrow__success-sub">
        ₹{order.bid.amount} is safely locked. {order.worker.name} has been notified and will arrive{' '}
        <strong>{order.bid.eta}</strong>.
      </p>
      <div className="escrow__success-card glass-card">
        <div className="escrow__success-row">
          <span>Order ID</span>
          <span>#GID-{Math.random().toString(36).slice(2, 9).toUpperCase()}</span>
        </div>
        <div className="escrow__success-row">
          <span>Amount held</span>
          <span className="escrow__success-amount">₹{order.bid.amount}</span>
        </div>
        <div className="escrow__success-row">
          <span>Worker</span>
          <span>{order.worker.name}</span>
        </div>
        <div className="escrow__success-row">
          <span>Status</span>
          <span className="escrow__status-badge">🔒 Escrow Active</span>
        </div>
      </div>
      <div className="escrow__success-actions">
        <Link to="/dashboard" className="btn btn-primary" id="escrow-go-dashboard">
          Go to Dashboard
        </Link>
        <Link to={`/chat/c1`} className="btn btn-secondary" id="escrow-message-worker">
          Message {order.worker.name.split(' ')[0]}
        </Link>
      </div>
      <p className="escrow__success-note">
        <Info size={12} /> You'll get a notification when the worker is on their way.
      </p>
    </div>
  );
}

export default function Escrow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');

  const order = MOCK_ORDER;
  const total = order.bid.amount + order.fees.platformFee + order.fees.gst;

  const handlePay = async () => {
    if (paymentMethod === 'upi' && !upiId.trim()) {
      setError('Please enter your UPI ID.');
      return;
    }
    setError('');
    setProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2200));
    setProcessing(false);
    setPaid(true);
  };

  return (
    <div className="escrow-page">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="glow-orb glow-amber escrow__glow-1" />
      <div className="glow-orb glow-blue escrow__glow-2" />

      {/* Top bar */}
      <header className="escrow__topbar">
        <button className="escrow__back" onClick={() => navigate(-1)} id="escrow-back">
          <ArrowLeft size={16} /> Back
        </button>
        <Link to="/" className="escrow__logo">
          <div className="escrow__logo-icon"><Zap size={14} fill="currentColor" /></div>
          <span>GetItDone</span>
        </Link>
        <div className="escrow__secure-badge">
          <Lock size={12} /> Secure Payment
        </div>
      </header>

      <div className="escrow__layout">
        {paid ? (
          <SuccessScreen order={order} />
        ) : (
          <>
            {/* LEFT: Payment form */}
            <div className="escrow__left">
              <h1 className="escrow__title">Complete Your Booking</h1>
              <p className="escrow__subtitle">
                Payment is held in escrow — only released when you approve the work.
              </p>

              {error && (
                <div className="escrow__error" id="escrow-error">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {/* Payment method picker */}
              <div className="escrow__section">
                <div className="escrow__section-label">Choose Payment Method</div>
                <div className="escrow__methods" id="payment-methods">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m.id}
                      className={`escrow__method ${paymentMethod === m.id ? 'escrow__method--active' : ''}`}
                      id={`pay-method-${m.id}`}
                      onClick={() => { setPaymentMethod(m.id); setError(''); }}
                    >
                      <div className="escrow__method-icon">{m.icon}</div>
                      <div className="escrow__method-info">
                        <div className="escrow__method-label">{m.label}</div>
                        <div className="escrow__method-hint">{m.hint}</div>
                      </div>
                      {paymentMethod === m.id && <CheckCircle size={16} className="escrow__method-check" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID input */}
              {paymentMethod === 'upi' && (
                <div className="escrow__section" id="upi-input-section">
                  <div className="escrow__section-label">Your UPI ID</div>
                  <div className="escrow__input-wrap">
                    <Smartphone size={15} className="escrow__input-icon" />
                    <input
                      id="upi-id-input"
                      type="text"
                      className="escrow__input"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={e => { setUpiId(e.target.value); setError(''); }}
                    />
                  </div>
                  <div className="escrow__upi-apps">
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <span key={app} className="escrow__upi-chip">{app}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card placeholder */}
              {paymentMethod === 'card' && (
                <div className="escrow__section escrow__card-placeholder" id="card-input-section">
                  <div className="escrow__section-label">Card Details</div>
                  <div className="escrow__card-mock">
                    <CreditCard size={18} className="escrow__card-icon" />
                    <span>Card entry powered by Razorpay (coming soon)</span>
                  </div>
                </div>
              )}

              {/* Net banking placeholder */}
              {paymentMethod === 'netbanking' && (
                <div className="escrow__section" id="netbanking-section">
                  <div className="escrow__section-label">Select Your Bank</div>
                  <div className="escrow__banks">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Others'].map(bank => (
                      <button key={bank} className="escrow__bank-chip" id={`bank-${bank.toLowerCase()}`}>
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay button */}
              <button
                className="btn btn-primary escrow__pay-btn"
                id="escrow-pay-btn"
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="escrow__spinner" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Pay ₹{total.toFixed(0)} & Hold in Escrow
                  </>
                )}
              </button>

              <div className="escrow__trust-row">
                <Shield size={12} /> 256-bit encryption &nbsp;·&nbsp;
                <Lock size={12} /> Zero fraud liability &nbsp;·&nbsp;
                <BadgeCheck size={12} /> Verified workers
              </div>
            </div>

            {/* RIGHT: Order summary */}
            <div className="escrow__right">
              {/* Worker card */}
              <div className="escrow__worker-card glass-card">
                <div className="escrow__worker-avatar" style={{ background: order.worker.gradient }}>
                  {order.worker.initials}
                </div>
                <div className="escrow__worker-info">
                  <div className="escrow__worker-name">
                    {order.worker.name}
                    {order.worker.verified && <BadgeCheck size={14} className="escrow__verified" />}
                  </div>
                  <div className="escrow__worker-skill">{order.worker.skill}</div>
                  <div className="escrow__worker-meta">
                    <Star size={12} fill="currentColor" className="escrow__star" />
                    {order.worker.rating} · {order.worker.jobs} jobs
                  </div>
                </div>
                <div className="escrow__eta">
                  <Clock size={12} /> {order.bid.eta}
                </div>
              </div>

              {/* Job summary */}
              <div className="escrow__job-card glass-card">
                <div className="escrow__job-cat">{order.job.category}</div>
                <div className="escrow__job-title">{order.job.title}</div>
                <div className="escrow__job-location">📍 {order.job.location}</div>
                {order.bid.note && (
                  <div className="escrow__worker-note">
                    "{order.bid.note}"
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="escrow__price-card glass-card">
                <div className="escrow__price-title">Price Breakdown</div>
                <div className="escrow__price-row">
                  <span>Worker's bid</span>
                  <span>₹{order.bid.amount}</span>
                </div>
                <div className="escrow__price-row">
                  <span>Platform fee (5%)</span>
                  <span>₹{order.fees.platformFee}</span>
                </div>
                <div className="escrow__price-row">
                  <span>GST (18% on fee)</span>
                  <span>₹{order.fees.gst.toFixed(2)}</span>
                </div>
                <div className="escrow__price-divider" />
                <div className="escrow__price-row escrow__price-total">
                  <span>Total</span>
                  <span className="escrow__total-val">₹{total.toFixed(0)}</span>
                </div>
                <div className="escrow__price-note">
                  <Shield size={11} /> Held in escrow until you approve the work
                </div>
              </div>

              <EscrowExplainer />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
