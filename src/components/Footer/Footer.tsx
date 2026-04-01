import { Link } from 'react-router-dom';
import { WhatsAppService } from '../../services/whatsAppService';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-script">melizzo</span>
            </Link>
            <p className="footer__tagline">Melt The Moment</p>
            <p className="footer__desc">
              Premium Dubai chocolate crafted with passion. Authentic recipes, luxurious ingredients, delivered to your door.
            </p>
            <div className="footer__social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="mailto:info@melizzo.com" className="footer__social-link" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
              <button onClick={() => WhatsAppService.sendGeneralInquiry()} className="footer__social-link" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4 className="footer__col-title">Shop</h4>
              <nav>
                <Link to="/shop" className="footer__link">All Products</Link>
                <Link to="/shop?category=dubai-chocolate" className="footer__link">Dubai Chocolate</Link>
                <Link to="/shop?category=gift-sets" className="footer__link">Gift Sets</Link>
                <Link to="/shop?category=collections" className="footer__link">Collections</Link>
                <Link to="/shop?category=bundles" className="footer__link">Bundles</Link>
              </nav>
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">About</h4>
              <nav>
                <Link to="/about" className="footer__link">Our Story</Link>
                <Link to="/about#certifications" className="footer__link">Certifications</Link>
                <Link to="/about#values" className="footer__link">Our Values</Link>
                <Link to="/about#timeline" className="footer__link">Timeline</Link>
              </nav>
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Support</h4>
              <nav>
                <Link to="/contact" className="footer__link">Contact Us</Link>
                <Link to="/contact#faq" className="footer__link">FAQ</Link>
                <Link to="/shipping" className="footer__link">Shipping Info</Link>
                <Link to="/returns" className="footer__link">Returns</Link>
              </nav>
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Contact</h4>
              <div className="footer__contact">
                <a href="mailto:info@melizzo.com" className="footer__contact-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  info@melizzo.com
                </a>
                <a href="tel:+17059270127" className="footer__contact-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 5.92 5.92l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
                  </svg>
                  +1 705 927-0127
                </a>
                <p className="footer__contact-text">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Mon-Fri: 9am-6pm EST<br />Sat: 10am-4pm EST
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">&copy; {new Date().getFullYear()} MELiZZO. All rights reserved. Crafted with passion in Canada.</p>
          <div className="footer__bottom-links">
            <Link to="/privacy" className="footer__bottom-link">Privacy Policy</Link>
            <Link to="/terms" className="footer__bottom-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
