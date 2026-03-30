import { useEffect, useState } from 'react';
import heroImg from '../assets/hero.png';
import './HeroSection.css';

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={`hero-section ${visible ? 'hero-section--visible' : ''}`}>
      <div className="hero-section__bg">
        <div className="hero-section__orb hero-section__orb--1" />
        <div className="hero-section__orb hero-section__orb--2" />
        <div className="hero-section__grid" />
      </div>

      <div className="hero-section__content">
        <div className="hero-section__badge">
          <span className="hero-section__badge-dot" />
          Welcome to MELiZZO
        </div>

        <h1 className="hero-section__title">
          <span className="hero-section__title-line" data-delay="0">Experience</span>
          <span className="hero-section__title-line hero-section__title-line--accent" data-delay="1">
            <span className="hero-section__title-3d">3D</span> Brilliance
          </span>
        </h1>

        <p className="hero-section__subtitle">
          Where creativity meets cutting-edge technology. Build the future with
          stunning visuals and seamless performance.
        </p>

        <div className="hero-section__hero-img-wrap">
          <div className="hero-section__hero-glow" />
          <img
            src={heroImg}
            className="hero-section__hero-img"
            alt="MELiZZO Hero"
          />
          <div className="hero-section__hero-reflection" />
        </div>

        <div className="hero-section__cta">
          <button className="hero-section__btn hero-section__btn--primary">
            <span>Explore Now</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className="hero-section__btn hero-section__btn--secondary">
            Learn More
          </button>
        </div>

        <div className="hero-section__features">
          {[
            { icon: '◈', label: '3D Visuals', value: 'Immersive' },
            { icon: '◉', label: 'Performance', value: 'Lightning Fast' },
            { icon: '◎', label: 'Design', value: 'Pixel Perfect' },
          ].map((f, i) => (
            <div
              key={f.label}
              className="hero-section__feature"
              style={{ animationDelay: `${0.8 + i * 0.15}s` }}
            >
              <span className="hero-section__feature-icon">{f.icon}</span>
              <div>
                <div className="hero-section__feature-label">{f.label}</div>
                <div className="hero-section__feature-value">{f.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
