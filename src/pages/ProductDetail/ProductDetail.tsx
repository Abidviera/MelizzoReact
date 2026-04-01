import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ProductService } from '../../services/productService';
import { WhatsAppService } from '../../services/whatsAppService';
import type { Product } from '../../types';
import './ProductDetail.css';

type TabKey = 'description' | 'ingredients' | 'shipping';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'description', label: 'Description' },
  { key: 'ingredients', label: 'Ingredients' },
  { key: 'shipping', label: 'Shipping' },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { success } = useNotification();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('description');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const found = ProductService.getBySlug(slug);
    setProduct(found || null);
    setLoading(false);
    setActiveImageIdx(0);
    setQuantity(1);
    setGiftWrap(false);
    setActiveTab('description');

    if (found) {
      const related = ProductService.getRelated(found.id, 4);
      setRelatedProducts(related);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pdp__loading">
        <div className="pdp__loading-spinner" />
        <p className="pdp__loading-text">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp__not-found">
        <div className="pdp__not-found-inner">
          <div className="pdp__not-found-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h1 className="pdp__not-found-title">Product Not Found</h1>
          <p className="pdp__not-found-text">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link to="/shop" className="pdp__not-found-btn">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const hasMultipleImages = product.images.length > 1;
  const salePercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleQuantityDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleQuantityIncrease = () => {
    const max = product.stockQuantity || 99;
    setQuantity((q) => Math.min(max, q + 1));
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: giftWrap ? product.price + 4.99 : product.price,
      quantity,
      image: product.images[0]?.url || '',
      maxQuantity: product.stockQuantity || 99,
      description: product.shortDescription,
    });
    success(
      `${quantity > 1 ? `${quantity}x ` : ''}${product.name}${giftWrap ? ' (Gift Wrapped)' : ''} added to cart`
    );
  };

  const handleAddToWishlist = () => {
    if (inWishlist) return;
    addToWishlist({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || '',
      maxQuantity: product.stockQuantity || 99,
    });
    success(`${product.name} added to wishlist`);
  };

  const handleWhatsApp = () => {
    WhatsAppService.sendProductInquiry({
      name: product.name,
      description: product.shortDescription,
      image: product.images[0]?.url,
      price: `$${product.price.toFixed(2)}`,
      quantity,
    });
  };

  const stockLabel = () => {
    if (!product.inStock) return 'Out of Stock';
    if (product.stockQuantity !== undefined && product.stockQuantity <= 5) {
      return `Only ${product.stockQuantity} left`;
    }
    return 'In Stock';
  };

  return (
    <div className="pdp">
      {/* Breadcrumb */}
      <div className="pdp__breadcrumb-wrapper">
        <nav className="pdp__breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="pdp__breadcrumb-link">Home</Link>
          <span className="pdp__breadcrumb-sep">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </span>
          <Link to="/shop" className="pdp__breadcrumb-link">Shop</Link>
          <span className="pdp__breadcrumb-sep">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </span>
          <Link
            to={`/category/${product.categorySlug}`}
            className="pdp__breadcrumb-link"
          >
            {product.category}
          </Link>
          <span className="pdp__breadcrumb-sep">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </span>
          <span className="pdp__breadcrumb-current">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="pdp__container">
        {/* Back Link */}
        <button className="pdp__back-link" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
          Back to Shop
        </button>

        <div className="pdp__layout">
          {/* Image Gallery */}
          <div className="pdp__gallery">
            {/* Main Image */}
            <div className="pdp__gallery-main">
              {product.isBestseller && (
                <div className="pdp__gallery-badge pdp__gallery-badge--bestseller">Bestseller</div>
              )}
              {product.isNew && (
                <div className="pdp__gallery-badge pdp__gallery-badge--new">New</div>
              )}
              {product.originalPrice && (
                <div className="pdp__gallery-badge pdp__gallery-badge--sale">-{salePercent}%</div>
              )}
              <img
                src={product.images[activeImageIdx]?.url}
                alt={product.images[activeImageIdx]?.alt || product.name}
                className="pdp__gallery-main-img"
              />
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
              <div className="pdp__gallery-thumbs">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pdp__gallery-thumb ${idx === activeImageIdx ? 'pdp__gallery-thumb--active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || `${product.name} view ${idx + 1}`}
                      className="pdp__gallery-thumb-img"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pdp__info">
            {/* Category */}
            <div className="pdp__category">{product.category}</div>

            {/* Name */}
            <h1 className="pdp__name">{product.name}</h1>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="pdp__short-desc">{product.shortDescription}</p>
            )}

            {/* Rating */}
            {product.rating && (
              <div className="pdp__rating">
                <div className="pdp__stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`pdp__star ${i < Math.round(product.rating || 0) ? 'pdp__star--filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="pdp__rating-value">{product.rating.toFixed(1)}</span>
                {product.reviewCount !== undefined && product.reviewCount > 0 && (
                  <span className="pdp__review-count">({product.reviewCount} reviews)</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="pdp__price-row">
              <span className="pdp__price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="pdp__original-price">${product.originalPrice.toFixed(2)}</span>
                  <span className="pdp__savings">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                </>
              )}
            </div>

            {/* Stock Indicator */}
            <div className={`pdp__stock ${!product.inStock ? 'pdp__stock--out' : product.stockQuantity !== undefined && product.stockQuantity <= 5 ? 'pdp__stock--low' : ''}`}>
              <span className="pdp__stock-dot" />
              <span className="pdp__stock-label">{stockLabel()}</span>
              {product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                <span className="pdp__stock-count">{product.stockQuantity} remaining</span>
              )}
            </div>

            {/* Divider */}
            <div className="pdp__divider" />

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <ul className="pdp__features">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="pdp__feature">
                    {feature.icon && (
                      <span className="pdp__feature-icon" aria-hidden="true">
                        {feature.icon}
                      </span>
                    )}
                    <span className="pdp__feature-label">{feature.label}:</span>
                    <span className="pdp__feature-value">{feature.value}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Quantity Selector */}
            <div className="pdp__quantity-row">
              <label className="pdp__quantity-label">Quantity</label>
              <div className="pdp__quantity-control">
                <button
                  className="pdp__qty-btn"
                  onClick={handleQuantityDecrease}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span className="pdp__qty-value">{quantity}</span>
                <button
                  className="pdp__qty-btn"
                  onClick={handleQuantityIncrease}
                  disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
                  aria-label="Increase quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Gift Wrapping Option */}
            <div className="pdp__gift-wrap">
              <label className="pdp__gift-wrap-toggle">
                <input
                  type="checkbox"
                  className="pdp__gift-wrap-checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                />
                <span className="pdp__gift-wrap-track">
                  <span className="pdp__gift-wrap-thumb" />
                </span>
                <span className="pdp__gift-wrap-text">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,12 20,22 4,22 4,12"/>
                    <rect x="2" y="7" width="20" height="5"/>
                    <line x1="12" y1="22" x2="12" y2="7"/>
                    <path d="M12,7 L12,4"/>
                  </svg>
                  Gift wrapping (+$4.99)
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pdp__actions">
              <button
                className="pdp__add-to-cart"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>

              <button
                className={`pdp__wishlist-btn ${inWishlist ? 'pdp__wishlist-btn--active' : ''}`}
                onClick={handleAddToWishlist}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={inWishlist ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* WhatsApp Order */}
            <button className="pdp__whatsapp-btn" onClick={handleWhatsApp}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </button>
          </div>
        </div>

        {/* Description Tabs */}
        <div className="pdp__tabs-section">
          <div className="pdp__tabs-nav">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`pdp__tab-btn ${activeTab === tab.key ? 'pdp__tab-btn--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="pdp__tabs-content">
            {activeTab === 'description' && (
              <div className="pdp__tab-panel">
                <p className="pdp__description">{product.description}</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="pdp__tags">
                    {product.tags.map((tag) => (
                      <span key={tag} className="pdp__tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="pdp__tab-panel">
                <p className="pdp__ingredients">
                  Premium ingredients sourced from the finest producers. Each bar features
                  high-quality cocoa and carefully selected natural flavorings.
                  Contains: Cocoa mass, cocoa butter, sugar, pistachios, vanilla extract.
                  May contain traces of nuts, milk, and soy.
                </p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="pdp__tab-panel">
                <div className="pdp__shipping-info">
                  <div className="pdp__shipping-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"/>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    <div>
                      <strong>Standard Shipping</strong>
                      <span>3-5 business days - $7.99</span>
                    </div>
                  </div>
                  <div className="pdp__shipping-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    <div>
                      <strong>Express Shipping</strong>
                      <span>1-2 business days - $14.99</span>
                    </div>
                  </div>
                  <div className="pdp__shipping-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <div>
                      <strong>Free Shipping</strong>
                      <span>On orders over $100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pdp__related">
            <div className="pdp__related-header">
              <h2 className="pdp__related-title">You May Also Like</h2>
              <Link to={`/category/${product.categorySlug}`} className="pdp__related-link">
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </Link>
            </div>
            <div className="pdp__related-grid">
              {relatedProducts.map((related) => (
                <div key={related.id} className="pdp__related-card">
                  <Link to={`/product/${related.slug}`} className="pdp__related-card-link">
                    <div className="pdp__related-card-image">
                      <img
                        src={related.images[0]?.url}
                        alt={related.images[0]?.alt || related.name}
                        className="pdp__related-card-img"
                        loading="lazy"
                      />
                      {related.isBestseller && (
                        <span className="pdp__related-badge pdp__related-badge--bestseller">Bestseller</span>
                      )}
                      {related.isNew && (
                        <span className="pdp__related-badge pdp__related-badge--new">New</span>
                      )}
                    </div>
                    <div className="pdp__related-card-info">
                      <p className="pdp__related-card-category">{related.category}</p>
                      <h3 className="pdp__related-card-name">{related.name}</h3>
                      {related.rating && (
                        <div className="pdp__related-card-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`pdp__related-star ${i < Math.round(related.rating || 0) ? 'pdp__related-star--filled' : ''}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="pdp__related-card-price">
                        <span className="pdp__related-price">${related.price.toFixed(2)}</span>
                        {related.originalPrice && (
                          <span className="pdp__related-original">${related.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
