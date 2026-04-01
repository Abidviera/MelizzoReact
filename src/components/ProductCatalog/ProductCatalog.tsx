import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../../services/productService';
import { WhatsAppService } from '../../services/whatsAppService';
import './ProductCatalog.css';

export default function ProductCatalog() {
  const sectionRef = useRef<HTMLElement>(null);
  const products = ProductService.getAll().filter((p) => p.inStock);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('pc--visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleOrder = (e: React.MouseEvent, productName: string, price: number) => {
    e.preventDefault();
    WhatsAppService.sendProductInquiry({
      name: productName,
      price: `$${price.toFixed(2)}`,
    });
  };

  return (
    <section ref={sectionRef} className="pc">
      {/* Background */}
      <div className="pc__bg">
        <div className="pc__bg-gradient" />
        <div className="pc__bg-grid" />
      </div>

      <div className="pc__inner">
        {/* Header */}
        <div className="pc__header">
          <div className="pc__label">
            <div className="pc__label-line" />
            <span>Our Collection</span>
            <div className="pc__label-line" />
          </div>
          <h2 className="pc__heading">Shop Melizzo</h2>
          <p className="pc__subheading">
            Discover our signature Dubai chocolates, handcrafted with passion and premium ingredients.
          </p>
        </div>

        {/* Product Grid */}
        <div className="pc__grid">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="pc__card"
              style={{ '--card-delay': `${i * 0.1}s` } as React.CSSProperties}
            >
              <div className="pc__card-image-wrapper">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="pc__card-image"
                  loading="lazy"
                />
                <div className="pc__card-overlay">
                  {product.isBestseller && (
                    <span className="pc__card-badge pc__card-badge--bestseller">Bestseller</span>
                  )}
                  {product.isNew && (
                    <span className="pc__card-badge pc__card-badge--new">New</span>
                  )}
                </div>
              </div>

              <div className="pc__card-info">
                <p className="pc__card-category">{product.category}</p>
                <h3 className="pc__card-name">{product.name}</h3>
                {product.shortDescription && (
                  <p className="pc__card-tagline">{product.shortDescription}</p>
                )}

                <div className="pc__card-footer">
                  <div className="pc__card-price">
                    <span className="pc__card-price-value">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="pc__card-price-original">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="pc__card-actions">
                    <Link
                      to={`/product/${product.slug}`}
                      className="pc__card-btn pc__card-btn--details"
                    >
                      View Details
                    </Link>
                    <button
                      className="pc__card-btn pc__card-btn--order"
                      onClick={(e) => handleOrder(e, product.name, product.price)}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="pc__cta">
          <Link to="/shop" className="pc__view-all">
            <span>View All Products</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
