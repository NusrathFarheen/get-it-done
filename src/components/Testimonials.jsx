import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Ananya Iyer',
    role: 'Homeowner, Pune',
    initials: 'AI',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    rating: 5,
    text: 'We had a terrible experience with a "recommended" plumber who overcharged and left the work half done. With GetItDone, I found Rajan — checked his reviews, negotiated the price, and he fixed everything perfectly. Finally, a platform I can trust.',
  },
  {
    id: 't2',
    name: 'Karthik Reddy',
    role: 'Worker — Electrician, Hyderabad',
    initials: 'KR',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    rating: 5,
    text: 'As a freelance electrician, I had no professional presence. GetItDone gave me a profile, helped me showcase my certifications, and now I get 3–4 new clients weekly. My monthly income doubled in 4 months.',
  },
  {
    id: 't3',
    name: 'Sujatha Venkat',
    role: 'Homeowner, Chennai',
    initials: 'SV',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    rating: 5,
    text: 'The in-app chat changed everything. I could explain exactly what I needed, see their responses, and decide before committing. No more strangers showing up without knowing what to expect. Absolutely love it.',
  },
  {
    id: 't4',
    name: 'Deepak Malhotra',
    role: 'Property Manager, Delhi',
    initials: 'DM',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    rating: 5,
    text: 'I manage 6 properties and used to spend hours finding reliable contractors. Now I have a saved list of verified workers for every trade. It has saved me 10+ hours every month and I\'m never worried about quality.',
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="glow-orb glow-blue testimonials__glow" />

      <div className="container">
        <div className="testimonials__header">
          <div className="section-label">Real Stories</div>
          <h2 className="section-title">
            Trusted by thousands of <span className="gradient-text">clients & workers</span>
          </h2>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="testimonial glass-card" id={t.id}>
              <Quote size={24} className="testimonial__quote-icon" />
              <p className="testimonial__text">{t.text}</p>
              <div className="testimonial__stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <div className="testimonial__author">
                <div
                  className="testimonial__avatar"
                  style={{ background: t.gradient }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="testimonial__name">{t.name}</div>
                  <div className="testimonial__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
