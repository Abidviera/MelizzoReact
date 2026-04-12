import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../../services/productService';
import { WhatsAppService } from '../../services/whatsAppService';
import type { Product } from '../../types';
import './FeaturedProducts.css';

const CATEGORY_ACCENTS: Record<string, { accent: string; accentLight: string; tag: string }> = {
  'kunafa': { accent: '#3A6E5F', accentLight: '#619887', tag: '#C8A064' },
  'angel-hair': { accent: '#C34E7C', accentLight: '#e07aa0', tag: '#C8A064' },
  'dubi-chocolate': { accent: '#3A6E5F', accentLight: '#619887', tag: '#C8A064' },
  'dubi': { accent: '#3A6E5F', accentLight: '#619887', tag: '#C8A064' },
};

function getAccentForCategory(slug: string): { accent: string; accentLight: string; tag: string } {
  const key = Object.keys(CATEGORY_ACCENTS).find((k) =>
    slug.toLowerCase().includes(k)
  );
  return key ? CATEGORY_ACCENTS[key] : { accent: '#3A6E5F', accentLight: '#619887', tag: '#C8A064' };
}

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const featured = await ProductService.getFeatured(2);
        setProducts(featured);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  const handleOrder = (productName: string, price: number) => {
    WhatsAppService.sendProductInquiry({
      name: productName,
      price: `$${price.toFixed(2)}`,
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
        {!loading && products.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(250,254,249,0.4)', fontFamily: 'Syne, sans-serif', padding: '40px 0' }}>
            No featured products found. Mark products as featured in the admin panel to display them here.
          </p>
        )}

        {products.map((product, index) => {
          const accent = getAccentForCategory(product.categorySlug);
          const isReverse = index % 2 === 1;
          const features = product.tags && product.tags.length > 0
            ? product.tags.filter((t) => t !== 'featured' && t !== 'bestseller' && t !== 'new')
            : [];

          return (
            <div
              key={product.id}
              className={`fp__product ${isReverse ? 'fp__product--reverse' : ''}`}
            >
              {/* Image Side */}
              <div
                className="fp__image-side"
                style={{ '--product-accent': accent.accent } as React.CSSProperties}
              >
                <div className="fp__image-frame">
                  <img
                    src={product.images[0]?.url || '/placeholder.png'}
                    alt={product.name}
                    className="fp__product-image"
                    loading="lazy"
                  />
                  <div className="fp__image-accent" />
                </div>
                <div className="fp__image-tag">
                  <span
                    className="fp__image-tag-text"
                    style={{ background: accent.tag }}
                  >
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="fp__content-side">
                <div className="fp__product-eyebrow">
                  <span className="fp__eyebrow-dot" style={{ background: accent.accentLight }} />
                  <span style={{ color: accent.accent }}>{product.category}</span>
                  <span className="fp__eyebrow-dot" style={{ background: accent.accentLight }} />
                </div>

                <h3 className="fp__product-name">{product.name}</h3>

                {product.shortDescription ? (
                  <p className="fp__product-tagline">{product.shortDescription}</p>
                ) : (
                  <p className="fp__product-tagline">
                    Handcrafted with premium ingredients and authentic Middle Eastern flavors.
                  </p>
                )}

                <p className="fp__product-description">{product.description || product.shortDescription || ''}</p>

                {features.length > 0 && (
                  <ul className="fp__features">
                    {features.map((feature, i) => (
                      <li key={i} className="fp__feature">
                        <span className="fp__feature-icon" style={{ color: accent.accentLight }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        </span>
                        <span className="fp__feature-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="fp__product-actions">
                  <Link
                    to={`/product/${product.slug}`}
                    className="fp__btn fp__btn--primary"
                    style={{
                      background: accent.accent,
                    }}
                  >
                    View Full Details
                  </Link>
                  <button
                    className="fp__btn fp__btn--order"
                    style={{
                      borderColor: accent.accent,
                      color: accent.accentLight,
                    }}
                    onClick={() => handleOrder(product.name, product.price)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
