import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import type { Product } from '../../types';
import './ProductCard.css';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { success } = useNotification();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal(() => {
        addToCart({
          id: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0]?.url || '',
          maxQuantity: product.stockQuantity || 10,
          description: product.shortDescription,
        });
        success(`${product.name} added to cart`);
      });
      return;
    }
    addToCart({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || '',
      maxQuantity: product.stockQuantity || 10,
      description: product.shortDescription,
    });
    success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) return;
    addToWishlist({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || '',
      maxQuantity: product.stockQuantity || 10,
    });
    success(`${product.name} added to wishlist`);
  };

  return (
    <Link to={`/product/${product.slug}`} className={`product-card ${!product.inStock ? 'product-card--out-of-stock' : ''}`}>
      <div className="product-card__image-wrapper">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt || product.name}
          className="product-card__image"
          loading="lazy"
        />
        <div className="product-card__overlay">
          <button
            className={`product-card__wishlist-btn ${inWishlist ? 'product-card__wishlist-btn--active' : ''}`}
            onClick={handleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        <div className="product-card__badges">
          {product.isBestseller && <span className="product-card__badge product-card__badge--bestseller">Bestseller</span>}
          {product.isNew && <span className="product-card__badge product-card__badge--new">New</span>}
          {product.originalPrice && <span className="product-card__badge product-card__badge--sale">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </span>}
          {!product.inStock && <span className="product-card__badge product-card__badge--soldout">Sold Out</span>}
        </div>

        <button
          className="product-card__quick-add"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        {product.rating && (
          <div className="product-card__rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`product-card__star ${i < Math.round(product.rating || 0) ? 'product-card__star--filled' : ''}`}>★</span>
            ))}
            <span className="product-card__review-count">({product.reviewCount})</span>
          </div>
        )}
        <div className="product-card__pricing">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="product-card__original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
