import { useEffect, useRef, useState } from 'react';
import './Newsletter.css';

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('nl--visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      return;
    }
    // Simulate subscription success
    setStatus('success');
    setEmail('');
  };

  return (
    <section ref={sectionRef} className="nl">
      {/* Background */}
      <div className="nl__bg">
        <div className="nl__bg-glow" />
        <div className="nl__bg-grid" />
        <div className="nl__bg-blob" />
      </div>

      {/* Decorative Ring */}
      <div className="nl__deco" aria-hidden="true">
        <div className="nl__deco-ring" />
        <div className="nl__deco-ring nl__deco-ring--2" />
      </div>

      <div className="nl__inner">
        {/* Icon */}
        <div className="nl__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        {/* Heading */}
        <div className="nl__header">
          <div className="nl__label">
            <div className="nl__label-line" />
            <span>Stay Updated</span>
            <div className="nl__label-line" />
          </div>
          <h2 className="nl__heading">Join the Melizzo Family</h2>
          <p className="nl__subheading">
            Subscribe to receive launch updates, exclusive offers, and be the first to try our new products.
          </p>
        </div>

        {/* Form */}
        <form
          className={`nl__form ${status === 'error' ? 'nl__form--error' : ''}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="nl__input-group">
            <input
              type="email"
              className="nl__input"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              aria-label="Email address"
            />
            <button type="submit" className="nl__btn">
              Subscribe
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {status === 'error' && (
            <p className="nl__error-msg">Please enter a valid email address.</p>
          )}
        </form>

        {/* Success Message */}
        {status === 'success' && (
          <div className="nl__success">
            <div className="nl__success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <p className="nl__success-text">Welcome to the Melizzo family! Check your inbox for a special treat.</p>
          </div>
        )}

        {/* Promise */}
        <p className="nl__promise">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          No spam, only delicious updates
        </p>
      </div>
    </section>
  );
}
