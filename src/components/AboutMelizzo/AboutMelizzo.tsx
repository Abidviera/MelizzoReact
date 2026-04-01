import { useEffect, useRef } from 'react';
import './AboutMelizzo.css';

const STATS = [
  { value: '2025', label: 'Year Founded' },
  { value: '2', label: 'Launch Products' },
  { value: '100%', label: 'Handcrafted' },
];

export default function AboutMelizzo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('am--visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="am">
      {/* Background */}
      <div className="am__bg">
        <div className="am__bg-glow" />
        <div className="am__bg-grid" />
      </div>

      <div className="am__inner">
        {/* Section Label */}
        <div className="am__label">
          <div className="am__label-line" />
          <span>Our Story</span>
          <div className="am__label-line" />
        </div>

        {/* Main Heading */}
        <h2 className="am__heading">
          About Melizzo
        </h2>

        {/* Story Paragraphs */}
        <div className="am__story">
          <p className="am__story-lead">
            Melizzo brings innovative, high-quality packaged food products to customers who love discovering new flavors.
          </p>
          <p className="am__story-body">
            From premium chocolates to unique specialty foods, we curate distinctive creations that offer a fresh and exciting taste experience. Our commitment is simple: to introduce exceptional products that inspire curiosity, delight the senses, and elevate everyday snacking.
          </p>
          <p className="am__story-body">
            We're launching with our signature Dubai chocolates — Kunafa Pistachio and Angel Hair — two products that blend traditional Middle Eastern flavors with modern craftsmanship. This is just the beginning. Our vision extends beyond chocolate to a full range of artisan packed foods including brownies, pancakes, and more delights to come.
          </p>
        </div>

        {/* Stats */}
        <div className="am__stats">
          {STATS.map((stat, i) => (
            <div key={i} className="am__stat">
              <div className="am__stat-line" />
              <span className="am__stat-value">{stat.value}</span>
              <span className="am__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Decorative Element */}
        <div className="am__deco" aria-hidden="true">
          <div className="am__deco-ring" />
          <div className="am__deco-ring am__deco-ring--2" />
        </div>
      </div>
    </section>
  );
}
