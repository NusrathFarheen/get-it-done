import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Categories', href: '#categories' },
  { label: 'Workers', href: '#workers' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#testimonials' },
];

const ROUTE_LINKS = [
  { label: 'Browse Workers', to: '/browse' },
  { label: 'Post a Job', to: '/post-job' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <nav className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="nav-logo">
          <div className="navbar__logo-icon">
            <Zap size={18} fill="currentColor" />
          </div>
          <span>GetItDone</span>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links" id="nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href} className="navbar__link">{link.label}</a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="navbar__actions">
          <Link to="/login" className="btn btn-secondary navbar__login" id="nav-login">Log In</Link>
          <Link to="/post-job" className="btn btn-secondary" id="nav-post-job" style={{ color: 'var(--amber)', borderColor: 'rgba(245,158,11,0.4)' }}>Post a Job</Link>
          <Link to="/dashboard" className="btn btn-primary" id="nav-get-started">Dashboard</Link>
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul>
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="navbar__mobile-actions">
          <Link to="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Log In</Link>
          <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get Started Free</Link>
        </div>
      </div>
    </header>
  );
}
