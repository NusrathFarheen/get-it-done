import { Zap, AtSign, Send, Rss, Code2 } from 'lucide-react';
import './Footer.css';

const LINKS = {
  Platform: ['Browse Workers', 'Post a Job', 'Become a Worker', 'Pricing'],
  Company: ['About Us', 'Blog', 'Careers', 'Press Kit'],
  Support: ['Help Centre', 'Safety', 'Dispute Resolution', 'Contact Us'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="divider" />
      <div className="container">
        <div className="footer__inner">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <Zap size={16} fill="currentColor" />
              </div>
              <span>GetItDone</span>
            </div>
            <p className="footer__tagline">
              The trusted marketplace for skilled work. Find the right hands for the right job.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social" id="footer-twitter" aria-label="Twitter / X"><AtSign size={17} /></a>
              <a href="#" className="footer__social" id="footer-instagram" aria-label="Instagram"><Send size={17} /></a>
              <a href="#" className="footer__social" id="footer-linkedin" aria-label="LinkedIn"><Rss size={17} /></a>
              <a href="#" className="footer__social" id="footer-github" aria-label="GitHub"><Code2 size={17} /></a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="footer__col">
              <h4 className="footer__col-title">{section}</h4>
              <ul className="footer__col-links">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" id={`footer-${link.toLowerCase().replace(/\s+/g, '-')}`}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} GetItDone. All rights reserved.</p>
          <p>Built with ❤️ — Applying AWS cloud skills to real-world impact.</p>
        </div>
      </div>
    </footer>
  );
}
