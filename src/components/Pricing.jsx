import { useState } from 'react';
import { Check, Zap, Star, Crown, ArrowRight, Info } from 'lucide-react';
import './Pricing.css';

const TIERS = [
  {
    id: 'free',
    icon: <Zap size={20} />,
    name: 'Free',
    price: '₹0',
    period: '/month',
    tagline: 'Start earning with zero upfront cost',
    commission: '10%',
    highlight: false,
    badge: null,
    features: [
      'Full worker profile listing',
      'Up to 3 portfolio photos',
      'In-app chat & negotiation',
      'Basic search placement',
      'Standard analytics',
      '10% commission per job',
    ],
    cta: 'Join Free',
    ctaId: 'pricing-join-free',
  },
  {
    id: 'pro',
    icon: <Star size={20} />,
    name: 'Pro',
    price: '₹499',
    period: '/month',
    tagline: 'For workers getting serious about growth',
    commission: '7%',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Everything in Free',
      'Up to 15 portfolio photos',
      'Boosted search ranking',
      'Full earnings analytics',
      'Custom profile URL',
      '⭐ Pro badge on profile',
      'Reduced 7% commission',
      'Priority job alerts',
    ],
    cta: 'Go Pro',
    ctaId: 'pricing-go-pro',
  },
  {
    id: 'elite',
    icon: <Crown size={20} />,
    name: 'Elite',
    price: '₹1,499',
    period: '/month',
    tagline: 'For top professionals who want maximum visibility',
    commission: '5%',
    highlight: false,
    badge: 'Best Value',
    features: [
      'Everything in Pro',
      'Unlimited portfolio photos',
      'Top search placement',
      'Advanced business analytics',
      '💎 Elite badge on profile',
      'Lowest 5% commission',
      'Featured worker eligibility',
      'Dedicated support',
    ],
    cta: 'Go Elite',
    ctaId: 'pricing-go-elite',
  },
];

const COMMISSION_EXAMPLE = [
  { label: 'Agreed job price', value: '₹1,000', highlight: false },
  { label: 'Client service fee (+5%)', value: '₹50', highlight: false },
  { label: 'Client total paid', value: '₹1,050', highlight: false },
  { label: 'Platform commission (−10%)', value: '−₹100', highlight: false },
  { label: 'Worker receives', value: '₹900', highlight: true },
  { label: 'GetItDone earns', value: '₹150', highlight: false },
];

const FAQS = [
  {
    q: 'When does GetItDone take its commission?',
    a: 'Only when a job is completed and payment is released. We never charge upfront — you only pay when you earn.',
  },
  {
    q: 'Can clients negotiate the price?',
    a: 'Yes, always. Clients and workers negotiate via in-app chat before any booking is confirmed. The agreed price is then locked in.',
  },
  {
    q: 'Is there a minimum job price?',
    a: 'Yes, we enforce category-level floor prices (e.g. ₹250/hr for plumbers) to protect worker dignity and client quality expectations.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'UPI, net banking, debit/credit cards, and wallets — all via Razorpay. Payments are held in escrow until job completion.',
  },
];

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('workers');
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="pricing" id="pricing">
      <div className="glow-orb glow-amber pricing__glow-1" />
      <div className="glow-orb glow-blue pricing__glow-2" />

      <div className="container">
        {/* Header */}
        <div className="pricing__header">
          <div className="section-label">Transparent Pricing</div>
          <h2 className="section-title">
            Simple, honest <span className="gradient-text">pricing for everyone</span>
          </h2>
          <p className="section-subtitle">
            No hidden fees. No upfront costs. Workers only pay when they earn.
            Clients only pay when they hire.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="pricing__tabs" role="tablist">
          <button
            id="tab-workers"
            role="tab"
            className={`pricing__tab ${activeTab === 'workers' ? 'pricing__tab--active' : ''}`}
            onClick={() => setActiveTab('workers')}
            aria-selected={activeTab === 'workers'}
          >
            For Workers
          </button>
          <button
            id="tab-clients"
            role="tab"
            className={`pricing__tab ${activeTab === 'clients' ? 'pricing__tab--active' : ''}`}
            onClick={() => setActiveTab('clients')}
            aria-selected={activeTab === 'clients'}
          >
            For Clients
          </button>
        </div>

        {/* Workers View */}
        {activeTab === 'workers' && (
          <div className="pricing__workers" id="pricing-workers-panel">
            {/* Tier Cards */}
            <div className="pricing__tiers">
              {TIERS.map(tier => (
                <div
                  key={tier.id}
                  id={`tier-${tier.id}`}
                  className={`pricing__tier glass-card ${tier.highlight ? 'pricing__tier--highlight' : ''}`}
                >
                  {tier.badge && (
                    <div className="pricing__tier-badge">{tier.badge}</div>
                  )}
                  <div className="pricing__tier-icon" data-tier={tier.id}>
                    {tier.icon}
                  </div>
                  <div className="pricing__tier-name">{tier.name}</div>
                  <div className="pricing__tier-price">
                    {tier.price}
                    <span className="pricing__tier-period">{tier.period}</span>
                  </div>
                  <div className="pricing__tier-commission">
                    <span className="pricing__commission-val">{tier.commission}</span>
                    <span className="pricing__commission-lbl"> commission per job</span>
                  </div>
                  <div className="pricing__tier-tagline">{tier.tagline}</div>

                  <ul className="pricing__tier-features">
                    {tier.features.map(f => (
                      <li key={f} className="pricing__feature">
                        <Check size={14} className="pricing__feature-check" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#"
                    id={tier.ctaId}
                    className={`btn ${tier.highlight ? 'btn-primary' : 'btn-secondary'} pricing__tier-cta`}
                  >
                    {tier.cta}
                    <ArrowRight size={15} />
                  </a>
                </div>
              ))}
            </div>

            {/* Pro Savings Calculator */}
            <div className="pricing__calculator glass-card">
              <div className="pricing__calc-label">
                <Star size={16} className="pricing__calc-icon" />
                Pro Plan Pays for Itself
              </div>
              <p className="pricing__calc-desc">
                Earning <strong>₹30,000/month</strong> in jobs?
              </p>
              <div className="pricing__calc-compare">
                <div className="pricing__calc-row">
                  <span>Free plan commission (10%)</span>
                  <span className="pricing__calc-bad">−₹3,000</span>
                </div>
                <div className="pricing__calc-row">
                  <span>Pro commission (7%) + ₹499 sub</span>
                  <span className="pricing__calc-neutral">−₹2,599</span>
                </div>
                <div className="pricing__calc-row pricing__calc-row--save">
                  <span>You save with Pro every month</span>
                  <span className="pricing__calc-good">+₹401 🎉</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients View */}
        {activeTab === 'clients' && (
          <div className="pricing__clients" id="pricing-clients-panel">
            <div className="pricing__client-hero glass-card">
              <div className="pricing__client-main">
                <div className="pricing__client-price">
                  <span className="pricing__client-big">5%</span>
                  <span className="pricing__client-sub">service fee on each job</span>
                </div>
                <p className="pricing__client-desc">
                  That's all clients ever pay. No subscription, no account fee, no hidden charges.
                  The fee is added transparently at checkout.
                </p>
                <a href="#" className="btn btn-primary" id="client-start-hiring">
                  Start Hiring Free
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* Commission Breakdown */}
              <div className="pricing__breakdown">
                <div className="pricing__breakdown-title">
                  <Info size={14} />
                  How a ₹1,000 job works
                </div>
                {COMMISSION_EXAMPLE.map(row => (
                  <div
                    key={row.label}
                    className={`pricing__breakdown-row ${row.highlight ? 'pricing__breakdown-row--highlight' : ''}`}
                  >
                    <span>{row.label}</span>
                    <span className={row.highlight ? 'pricing__breakdown-green' : ''}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client guarantees */}
            <div className="pricing__guarantees">
              {[
                { emoji: '🔒', title: 'Escrow Protection', desc: 'Your payment is held safely until the job is completed to your satisfaction.' },
                { emoji: '⭐', title: 'Quality Guarantee', desc: 'Every worker has verified ratings. Not happy? Our dispute team steps in.' },
                { emoji: '💬', title: 'Negotiate First', desc: 'Chat and agree on price before committing. No surprises.' },
                { emoji: '🔄', title: 'Easy Refunds', desc: 'Job not done? Get your money back. No questions asked within policy.' },
              ].map(g => (
                <div key={g.title} className="pricing__guarantee glass-card">
                  <span className="pricing__guarantee-emoji">{g.emoji}</span>
                  <div>
                    <div className="pricing__guarantee-title">{g.title}</div>
                    <div className="pricing__guarantee-desc">{g.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="pricing__faq">
          <h3 className="pricing__faq-title">Common Questions</h3>
          <div className="pricing__faq-list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                id={`faq-${i}`}
                className={`pricing__faq-item glass-card ${openFaq === i ? 'pricing__faq-item--open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="pricing__faq-q">
                  {faq.q}
                  <span className="pricing__faq-toggle">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <div className="pricing__faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
