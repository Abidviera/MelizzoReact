import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { WhatsAppService } from '../../services/whatsAppService';
import './FeaturedProducts.css';

const PRODUCTS = [
  {
    id: 'kunafa',
    name: 'Kunafa Pistachio Dubai Chocolate',
    tagline: 'Indulge in a taste of authentic Middle Eastern luxury.',
    description: 'This exquisite chocolate bar combines rich milk chocolate with a creamy pistachio filling and the unique, crispy texture of roasted kunafa pastry.',
    features: [
      'Premium Milk Chocolate',
      'Creamy Pistachio Filling',
      'Crunchy Roasted Kunafa',
      'Visually Appealing',
    ],
    image: '/KUNAFAPISTACHIO/ezgif-frame-001.png',
    slug: 'pistachio-kunafa-dubai-chocolate',
    price: '$24.99',
    accentColor: '#3A6E5F',
    accentLight: '#619887',
    tagColor: '#C8A064',
    reverse: false,
  },
  {
    id: 'angelhair',
    name: 'Angel Hair Dubai Chocolate',
    tagline: 'Indulge in a delightful fusion of textures.',
    description: 'Rich white chocolate is perfectly blended with sweet, fluffy cotton candy and crisp, golden pastry strands.',
    features: [
      'Cotton Candy Infused White Chocolate',
      'Crisp Angel Hair Pastry',
      'Vibrant Pink & Blue Colors',
      'A Perfect Balance of Creamy & Airy Textures',
    ],
    image: '/ANGLE HAIR/ezgif-frame-001.png',
    slug: 'angel-hair-white-dubai-chocolate',
    price: '$22.99',
    accentColor: '#C34E7C',
    accentLight: '#e07aa0',
    tagColor: '#C8A064',
    reverse: true,
  },
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('fp--visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleOrder = (productName: string, price: string) => {
    WhatsAppService.sendProductInquiry({
      name: productName,
      price,
    });
  };

  return (
    <section ref={sectionRef} className="fp">
      {/* Background */}
      <div className="fp__bg">
        <div className="fp__bg-gradient" />
        <div className="fp__bg-grid" />
      </div>

      <div className="fp__inner">
        {/* Section Header */}
        <div className="fp__header">
          <div className="fp__label">
            <div className="fp__label-line" />
            <span>Featured Products</span>
            <div className="fp__label-line" />
          </div>
          <h2 className="fp__heading">Signature Collection</h2>
        </div>

        {/* Products */}
        {PRODUCTS.map((product, index) => (
          <div
            key={product.id}
            className={`fp__product ${product.reverse ? 'fp__product--reverse' : ''}`}
          >
            {/* Image Side */}
            <div
              className="fp__image-side"
              style={{ '--product-accent': product.accentColor } as React.CSSProperties}
            >
              <div className="fp__image-frame">
                <img
                  src={product.image}
                  alt={product.name}
                  className="fp__product-image"
                  loading="lazy"
                />
                <div className="fp__image-accent" />
              </div>
              <div className="fp__image-tag">
                <span
                  className="fp__image-tag-text"
                  style={{ background: product.tagColor }}
                >
                  {product.price}
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="fp__content-side">
              <div className="fp__product-eyebrow">
                <span className="fp__eyebrow-dot" style={{ background: product.accentLight }} />
                <span style={{ color: product.accentColor }}>Dubai Chocolate</span>
                <span className="fp__eyebrow-dot" style={{ background: product.accentLight }} />
              </div>

              <h3 className="fp__product-name">{product.name}</h3>

              <p className="fp__product-tagline">{product.tagline}</p>

              <p className="fp__product-description">{product.description}</p>

              <ul className="fp__features">
                {product.features.map((feature, i) => (
                  <li key={i} className="fp__feature">
                    <span className="fp__feature-icon" style={{ color: product.accentLight }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </span>
                    <span className="fp__feature-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="fp__product-actions">
                <Link
                  to={`/product/${product.slug}`}
                  className="fp__btn fp__btn--primary"
                  style={{
                    background: product.accentColor,
                  }}
                >
                  View Full Details
                </Link>
                <button
                  className="fp__btn fp__btn--order"
                  style={{
                    borderColor: product.accentColor,
                    color: product.accentLight,
                  }}
                  onClick={() => handleOrder(product.name, product.price)}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
