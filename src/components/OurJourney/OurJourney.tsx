import { useEffect, useRef } from 'react';
import './OurJourney.css';

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Premium Quality',
    description: 'Every product is crafted with the finest ingredients, sourced from reputable suppliers who share our commitment to excellence.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Timely Delivery',
    description: 'We respect your time. Every order is prepared with care and dispatched promptly to ensure it arrives fresh.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Built on Excellence',
    description: 'We set the bar high. From packaging to product, every detail reflects our dedication to creating something extraordinary.',
  },
];

const INSTAGRAM_POSTS = [
  { id: 1, alt: 'Melizzo Dubai Chocolate Collection' },
  { id: 2, alt: 'Behind the Scenes at Melizzo' },
  { id: 3, alt: 'Melizzo Kunafa Pistachio Bar' },
  { id: 4, alt: 'Melizzo Angel Hair Chocolate' },
];

export default function OurJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('oj--visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="oj">
      {/* Background */}
      <div className="oj__bg">
        <div className="oj__bg-gradient" />
        <div className="oj__bg-grid" />
      </div>

      <div className="oj__inner">
        {/* ---- OUR VALUES ---- */}
        <div className="oj__values-section">
          <div className="oj__header">
            <div className="oj__label">
              <div className="oj__label-line" />
              <span>Our Values</span>
              <div className="oj__label-line" />
            </div>
            <h2 className="oj__heading">Built on Excellence</h2>
            <p className="oj__subheading">
              Every decision we make is guided by our commitment to quality, authenticity, and customer delight.
            </p>
          </div>

          <div className="oj__values-grid">
            {VALUES.map((value, i) => (
              <div
                key={i}
                className="oj__value-card"
                style={{ '--value-delay': `${i * 0.15}s` } as React.CSSProperties}
              >
                <div className="oj__value-icon">{value.icon}</div>
                <h3 className="oj__value-title">{value.title}</h3>
                <p className="oj__value-desc">{value.description}</p>
                <div className="oj__value-accent" />
              </div>
            ))}
          </div>
        </div>

        {/* ---- DIVIDER ---- */}
        <div className="oj__divider">
          <div className="oj__divider-line" />
          <div className="oj__divider-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
          <div className="oj__divider-line" />
        </div>

        {/* ---- FOLLOW OUR JOURNEY ---- */}
        <div className="oj__follow-section">
          <div className="oj__follow-header">
            <h2 className="oj__follow-heading">Follow Our Journey</h2>
            <p className="oj__follow-subheading">
              Join us as we launch and grow — witness the artistry behind every creation
            </p>
          </div>

          {/* Instagram Grid */}
          <div className="oj__insta-grid">
            {INSTAGRAM_POSTS.map((post, i) => (
              <div
                key={post.id}
                className="oj__insta-item"
                style={{ '--insta-delay': `${i * 0.1}s` } as React.CSSProperties}
              >
                <img
                  src={`/instafeed/insta-${post.id}.jpg`}
                  alt={post.alt}
                  className="oj__insta-image"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to a gradient placeholder
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = `linear-gradient(135deg, rgba(58,110,95,0.2), rgba(200,160,100,0.15))`;
                    }
                  }}
                />
                <div className="oj__insta-overlay">
                  <div className="oj__insta-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instagram CTA */}
          <div className="oj__insta-cta">
            <a
              href="https://instagram.com/melizzo"
              target="_blank"
              rel="noopener noreferrer"
              className="oj__insta-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span>Follow Us on Instagram</span>
              <span className="oj__insta-handle">@Melizzo</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
