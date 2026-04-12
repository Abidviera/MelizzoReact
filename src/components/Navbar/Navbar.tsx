import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { itemCount, wishlistCount } = useCart();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar only after scrolling past the hero (100vh)
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header className={`navbar ${scrolled || !isLanding ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-script">melizzo</span>
          </Link>

          <nav className="navbar__nav">
            <Link to="/shop" className="navbar__nav-link">Shop</Link>
            <Link to="/about" className="navbar__nav-link">Our Story</Link>
            <Link to="/coming-soon" className="navbar__nav-link">Coming Soon</Link>
            <Link to="/contact" className="navbar__nav-link">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="navbar__nav-link" style={{ color: '#3A6E5F' }}>Admin</Link>
            )}
          </nav>

          <div className="navbar__actions">
            <Link to="/account" className="navbar__icon-btn" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {isAuthenticated && <span className="navbar__badge navbar__badge--dot" />}
            </Link>

            <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="navbar__badge">{wishlistCount}</span>
              )}
            </Link>

            <Link to="/cart" className="navbar__icon-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && (
                <span className="navbar__badge">{itemCount}</span>
              )}
            </Link>

            <button
              className="navbar__hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`navbar__hamburger-line ${mobileOpen ? 'navbar__hamburger-line--open-1' : ''}`} />
              <span className={`navbar__hamburger-line ${mobileOpen ? 'navbar__hamburger-line--open-2' : ''}`} />
              <span className={`navbar__hamburger-line ${mobileOpen ? 'navbar__hamburger-line--open-3' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`navbar__mobile-overlay ${mobileOpen ? 'navbar__mobile-overlay--open' : ''}`}>
        <div className="navbar__mobile-menu">
          <nav className="navbar__mobile-nav">
            <Link to="/shop" className="navbar__mobile-link">Shop</Link>
            <Link to="/about" className="navbar__mobile-link">Our Story</Link>
            <Link to="/coming-soon" className="navbar__mobile-link">Coming Soon</Link>
            <Link to="/contact" className="navbar__mobile-link">Contact</Link>
            <Link to="/cart" className="navbar__mobile-link">
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            <Link to="/wishlist" className="navbar__mobile-link">
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <Link to="/account" className="navbar__mobile-link">
              {isAuthenticated ? `Hi, ${user?.firstName}` : 'Account'}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="navbar__mobile-link" style={{ color: '#3A6E5F' }}>Admin Dashboard</Link>
            )}
          </nav>

          <div className="navbar__mobile-contact">
            <p>info@melizzo.com</p>
            <p>+1 705 927-0127</p>
          </div>
        </div>
      </div>
    </>
  );
}
