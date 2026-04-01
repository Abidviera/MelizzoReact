import { Link } from 'react-router-dom';
import './ComingSoon.css';

export default function ComingSoon() {
  return (
    <div className="cs-page">
      <div className="cs-page__container">
        <div className="cs-page__hero">
          <div className="cs-page__eyebrow">
            <span className="cs-page__eyebrow-dot" />
            <span>Coming Soon</span>
            <span className="cs-page__eyebrow-dot" />
          </div>
          <h1 className="cs-page__title">Something<br />Extraordinary<br />is Baking...</h1>
          <p className="cs-page__subtitle">A sweet surprise is on its way. Join our journey.</p>
        </div>

        <div className="cs-page__preview">
          <div className="cs-page__preview-card">
            <div className="cs-page__preview-image">
              <img src="/ComminSoon/ezgif-frame-001.png" alt="Coming Soon" />
            </div>
            <div className="cs-page__preview-overlay">
              <div className="cs-page__lock-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <p className="cs-page__preview-label">Secret Recipe</p>
            </div>
          </div>
        </div>

        <div className="cs-page__notify">
          <p className="cs-page__notify-text">Be the first to know when we launch</p>
          <form className="cs-page__notify-form" onSubmit={(e) => { e.preventDefault(); }}>
            <input className="cs-page__notify-input" type="email" placeholder="Enter your email" />
            <button type="submit" className="cs-page__notify-btn">Notify Me</button>
          </form>
        </div>

        <div className="cs-page__features">
          <div className="cs-page__feature">
            <div className="cs-page__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="cs-page__feature-title">Premium Quality</h3>
            <p className="cs-page__feature-text">The same MELiZZO standard you trust, in an entirely new form.</p>
          </div>
          <div className="cs-page__feature">
            <div className="cs-page__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className="cs-page__feature-title">Launching Soon</h3>
            <p className="cs-page__feature-text">Expected to arrive in your MELiZZO box before the holidays.</p>
          </div>
          <div className="cs-page__feature">
            <div className="cs-page__feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="cs-page__feature-title">Limited Edition</h3>
            <p className="cs-page__feature-text">First batch will be limited. Early access for newsletter subscribers.</p>
          </div>
        </div>

        <div className="cs-page__cta">
          <Link to="/shop" className="cs-page__cta-link">
            Shop Current Collection
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
