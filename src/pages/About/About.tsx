import { WhatsAppService } from '../../services/whatsAppService';
import './About.css';

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: 'Made in UAE', label: 'Authentic Origin' },
  { value: 'CFIA', label: 'Certified' },
  { value: '100%', label: 'Authentic' },
];

const values = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M8 12l2 2 4-4"/>
        <path d="M12 6v2M12 16v2M6 12H4M20 12h-2"/>
      </svg>
    ),
    title: 'Passion for Craft',
    desc: 'Every chocolate is handcrafted using time-honored techniques passed down through generations of UAE confectioners. We obsess over every detail.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Innovation',
    desc: 'We reinvent luxury chocolate with bold fusion flavors that bridge Middle Eastern tradition and modern palates.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Customer First',
    desc: 'From hand-packed boxes to white-glove delivery, every touchpoint is designed to delight our community of chocolate connoisseurs.',
  },
];

const timeline = [
  { date: 'Jan 2025', event: 'MELiZZO Founded', detail: 'Established in Ontario, Canada with a mission to bring authentic Dubai chocolate to the world.' },
  { date: 'Feb 2025', event: 'First Product Launch', detail: 'Released our signature Kunafa and Angel Hair chocolate collections to overwhelming demand.' },
  { date: 'Jun 2025', event: 'Online Store Launch', detail: 'Launched our e-commerce platform, shipping premium chocolate nationwide across Canada.' },
  { date: 'Q4 2025', event: 'Expansion Plans', detail: 'International shipping, new seasonal collections, and wholesale partnerships on the horizon.' },
];

const instagramColors = [
  ['#C8A064', '#C34E7C'],
  ['#3A6E5F', '#C8A064'],
  ['#C34E7C', '#3A6E5F'],
  ['#C8A064', '#3A6E5F'],
  ['#3A6E5F', '#C34E7C'],
  ['#C34E7C', '#C8A064'],
];

export default function About() {
  return (
    <div className="about">
      {/* Hero */}
      <section className="about__hero">
        <div className="about__hero-bg" />
        <div className="about__hero-content">
          <span className="about__hero-eyebrow">The MELiZZO Story</span>
          <h1 className="about__hero-title">Our Story</h1>
          <p className="about__hero-subtitle">
            Born in the golden heart of Dubai, perfected in Canada. We bring the world's most coveted chocolate to your doorstep.
          </p>
          <div className="about__hero-divider" />
          <div className="about__hero-scroll-hint">
            <span>Scroll to explore</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="about__story">
        <div className="about__container">
          <div className="about__story-grid">
            <div className="about__story-label">
              <span className="about__section-tag">Est. 2025</span>
            </div>
            <div className="about__story-content">
              <h2 className="about__section-title">Where It All Began</h2>
              <p className="about__story-text">
                MELiZZO was founded in 2025 by a team of passionate food artisans and entrepreneurs who fell in love with the rich, bold flavors of Dubai's legendary chocolate tradition. What started as a quest to share the impossible perfection of kunafa-infused chocolate bars with Canada grew into a full-fledged mission to democratize luxury confectionery.
              </p>
              <p className="about__story-text">
                Every MELiZZO creation is a tribute to the craft of UAE confectioners — combining premium Belgian cocoa with pistachios, saffron, dates, and rose water in ways that have made Dubai chocolate a global sensation. We source only the finest ingredients, work with CFIA-certified facilities, and deliver our products with the same care we put into making them.
              </p>
              <div className="about__story-accent">
                <span className="about__story-quote">"Chocolate is not just a treat — it's a memory waiting to be made."</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about__stats" id="stats">
        <div className="about__container">
          <div className="about__stats-grid">
            {stats.map((stat, i) => (
              <div className="about__stat-card" key={i}>
                <span className="about__stat-value">{stat.value}</span>
                <span className="about__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about__values" id="values">
        <div className="about__container">
          <div className="about__values-header">
            <span className="about__section-tag">What Drives Us</span>
            <h2 className="about__section-title">Our Core Values</h2>
            <p className="about__values-intro">
              Three pillars guide every decision we make at MELiZZO.
            </p>
          </div>
          <div className="about__values-grid">
            {values.map((v, i) => (
              <div className="about__value-card" key={i}>
                <div className="about__value-icon">{v.icon}</div>
                <h3 className="about__value-title">{v.title}</h3>
                <p className="about__value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="about__certs" id="certifications">
        <div className="about__container">
          <div className="about__certs-inner">
            <div className="about__certs-header">
              <span className="about__section-tag">Trust & Quality</span>
              <h2 className="about__section-title">Certifications</h2>
            </div>
            <div className="about__certs-grid">
              {[
                {
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ),
                  label: 'CFIA Certified',
                  sub: 'Canadian Food Inspection Agency',
                },
                {
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  ),
                  label: 'Licensed Importer',
                  sub: 'Authorized UAE chocolate importer',
                },
                {
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  ),
                  label: 'Quality Assured',
                  sub: 'Multi-point quality inspection',
                },
              ].map((cert, i) => (
                <div className="about__cert-card" key={i}>
                  <div className="about__cert-icon">{cert.icon}</div>
                  <h4 className="about__cert-label">{cert.label}</h4>
                  <p className="about__cert-sub">{cert.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about__timeline" id="timeline">
        <div className="about__container">
          <div className="about__timeline-header">
            <span className="about__section-tag">Our Journey</span>
            <h2 className="about__section-title">Company Timeline</h2>
          </div>
          <div className="about__timeline-list">
            {timeline.map((item, i) => (
              <div className="about__timeline-item" key={i}>
                <div className="about__timeline-marker">
                  <div className="about__timeline-dot" />
                  {i < timeline.length - 1 && <div className="about__timeline-line" />}
                </div>
                <div className="about__timeline-content">
                  <span className="about__timeline-date">{item.date}</span>
                  <h3 className="about__timeline-event">{item.event}</h3>
                  <p className="about__timeline-detail">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="about__insta">
        <div className="about__container">
          <div className="about__insta-header">
            <span className="about__section-tag">Follow Us</span>
            <h2 className="about__section-title">@melizzo on Instagram</h2>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="about__insta-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Follow @melizzo
            </a>
          </div>
          <div className="about__insta-grid">
            {instagramColors.map((colors, i) => (
              <div
                className="about__insta-cell"
                key={i}
                style={{
                  background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
                }}
              >
                <div className="about__insta-overlay">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about__cta">
        <div className="about__container">
          <div className="about__cta-inner">
            <h2 className="about__cta-title">Ready to Experience the Difference?</h2>
            <p className="about__cta-text">
              Join thousands of chocolate lovers who have discovered the MELiZZO difference. Premium Dubai chocolate, delivered to your door.
            </p>
            <div className="about__cta-actions">
              <a href="/shop" className="about__cta-btn about__cta-btn--primary">
                Shop Now
              </a>
              <button
                onClick={() => WhatsAppService.sendGeneralInquiry()}
                className="about__cta-btn about__cta-btn--whatsapp"
              >
                <svg width="18" height="18" viewBox="0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with Us
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
