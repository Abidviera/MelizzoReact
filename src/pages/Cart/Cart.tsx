import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext';
import { WhatsAppService } from '../../services/whatsAppService';
import './Cart.css';

const FREE_SHIPPING_THRESHOLD = 100;

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 4H14M5.333 4V2.667C5.333 2.313 5.474 1.973 5.724 1.724C5.973 1.474 6.313 1.333 6.667 1.333H9.333C9.687 1.333 10.027 1.474 10.276 1.724C10.526 1.973 10.667 2.313 10.667 2.667V4M12.667 4V13.333C12.667 13.687 12.526 14.027 12.276 14.276C12.027 14.526 11.687 14.667 11.333 14.667H4.667C4.313 14.667 3.973 14.526 3.724 14.276C3.474 14.027 3.333 13.687 3.333 13.333V4H12.667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CartEmpty() {
  return (
    <div className="cart__empty">
      <div className="cart__empty-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 8H12L16 40H48L52 16H20" stroke="rgba(200, 160, 100, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="48" r="4" stroke="rgba(200, 160, 100, 0.3)" strokeWidth="2" />
          <circle cx="40" cy="48" r="4" stroke="rgba(200, 160, 100, 0.3)" strokeWidth="2" />
        </svg>
      </div>
      <h2 className="cart__empty-title">Your cart is empty</h2>
      <p className="cart__empty-text">Looks like you haven't added anything yet.</p>
      <Link to="/shop" className="cart__empty-cta">
        Start Shopping
      </Link>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="cart__trust-badges">
      <div className="cart__trust-badge">
        <span className="cart__trust-icon"><CheckIcon /></span>
        <span className="cart__trust-label">Secure Checkout</span>
      </div>
      <div className="cart__trust-badge">
        <span className="cart__trust-icon"><CheckIcon /></span>
        <span className="cart__trust-label">Fast Shipping</span>
      </div>
      <div className="cart__trust-badge">
        <span className="cart__trust-icon"><CheckIcon /></span>
        <span className="cart__trust-label">Quality Guarantee</span>
      </div>
    </div>
  );
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, applyPromoCode, removePromoCode } = useCart();
  const { success, error: notifyError } = useNotification();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoRemoving, setPromoRemoving] = useState(false);
  const promoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEmpty = cart.items.length === 0;
  const shippingProgress = Math.min((cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - cart.subtotal, 0);

  function handleQuantityChange(productId: string, quantity: number, variantId?: string) {
    updateQuantity(productId, quantity, variantId);
  }

  function handleRemove(productId: string, variantId?: string, name?: string) {
    removeFromCart(productId, variantId);
    success(`${name || 'Item'} removed from cart`);
  }

  function handleApplyPromo() {
    if (!promoInput.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    setPromoLoading(true);
    setPromoError('');

    // Simulate slight async delay for UX
    setTimeout(() => {
      const result = applyPromoCode(promoInput.trim());
      setPromoLoading(false);

      if (result.success) {
        success(result.message);
        setPromoInput('');
      } else {
        setPromoError(result.message);
      }
    }, 400);
  }

  function handleRemovePromo() {
    setPromoRemoving(true);
    if (promoTimeoutRef.current) clearTimeout(promoTimeoutRef.current);
    promoTimeoutRef.current = setTimeout(() => {
      removePromoCode();
      setPromoRemoving(false);
      success('Promo code removed');
    }, 300);
  }

  function handlePromoKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyPromo();
    }
    setPromoError('');
  }

  function handleWhatsAppOrder() {
    const items = cart.items.map((item) => ({
      name: item.name,
      description: item.variant ? `Variant: ${item.variant}` : undefined,
      image: item.image,
      price: formatPrice(item.price),
      quantity: item.quantity,
    }));
    WhatsAppService.sendCartOrder(items, cart.total);
  }

  return (
    <div className="cart">
      <div className="cart__container">
        <header className="cart__header">
          <h1 className="cart__title">Shopping Cart</h1>
          {!isEmpty && (
            <Link to="/shop" className="cart__continue-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Continue Shopping
            </Link>
          )}
        </header>

        {isEmpty ? (
          <>
            <CartEmpty />
            <TrustBadges />
          </>
        ) : (
          <div className="cart__layout">
            {/* Items Column */}
            <div className="cart__items-col">
              <div className="cart__items-list">
                <div className="cart__items-table-header">
                  <span className="cart__col-product">Product</span>
                  <span className="cart__col-price">Price</span>
                  <span className="cart__col-qty">Quantity</span>
                  <span className="cart__col-total">Total</span>
                </div>

                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.variantId || ''}`} className="cart__item">
                    <div className="cart__item-product">
                      <div className="cart__item-image-wrapper">
                        <img
                          src={item.image || 'https://picsum.photos/seed/product/120/160'}
                          alt={item.name}
                          className="cart__item-image"
                          loading="lazy"
                        />
                      </div>
                      <div className="cart__item-details">
                        <h3 className="cart__item-name">{item.name}</h3>
                        {item.variant && (
                          <span className="cart__item-variant">{item.variant}</span>
                        )}
                        {item.size && (
                          <span className="cart__item-size">Size: {item.size}</span>
                        )}
                        <button
                          className="cart__item-remove"
                          onClick={() => handleRemove(item.productId, item.variantId, item.name)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <TrashIcon />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart__item-price">
                      <span className="cart__item-price-value">{formatPrice(item.price)}</span>
                    </div>

                    <div className="cart__item-qty">
                      <div className="cart__qty-controls">
                        <button
                          className="cart__qty-btn cart__qty-btn--minus"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.variantId)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon />
                        </button>
                        <span className="cart__qty-value" aria-label={`Quantity: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          className="cart__qty-btn cart__qty-btn--plus"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.variantId)}
                          disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </div>

                    <div className="cart__item-total">
                      <span className="cart__item-total-value">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <TrustBadges />

              <Link to="/shop" className="cart__continue-link-mobile">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Continue Shopping
              </Link>
            </div>

            {/* Summary Column */}
            <aside className="cart__summary-col">
              <div className="cart__summary">
                <h2 className="cart__summary-title">Order Summary</h2>

                {/* Free Shipping Progress */}
                <div className="cart__shipping-progress">
                  {cart.subtotal < FREE_SHIPPING_THRESHOLD ? (
                    <p className="cart__shipping-hint">
                      Add <strong>{formatPrice(amountToFreeShipping)}</strong> more for free shipping
                    </p>
                  ) : (
                    <p className="cart__shipping-hint cart__shipping-hint--free">
                      <CheckIcon />
                      You've unlocked free shipping
                    </p>
                  )}
                  <div className="cart__shipping-bar-track">
                    <div
                      className="cart__shipping-bar-fill"
                      style={{ width: `${shippingProgress}%` }}
                      role="progressbar"
                      aria-valuenow={shippingProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>

                {/* Line Items */}
                <div className="cart__summary-lines">
                  <div className="cart__summary-line">
                    <span className="cart__summary-label">Subtotal</span>
                    <span className="cart__summary-value">{formatPrice(cart.subtotal)}</span>
                  </div>

                  {cart.discount > 0 && (
                    <div className="cart__summary-line cart__summary-line--discount">
                      <span className="cart__summary-label">
                        Discount
                        <span className="cart__promo-tag">
                          {cart.promoCode}
                          <button
                            className="cart__promo-remove"
                            onClick={handleRemovePromo}
                            aria-label="Remove promo code"
                          >
                            &times;
                          </button>
                        </span>
                      </span>
                      <span className="cart__summary-value cart__summary-value--discount">
                        -{formatPrice(cart.discount)}
                      </span>
                    </div>
                  )}

                  <div className="cart__summary-line">
                    <span className="cart__summary-label">Shipping</span>
                    <span className="cart__summary-value">
                      {cart.shipping === 0 ? (
                        <span className="cart__free-tag">Free</span>
                      ) : (
                        formatPrice(cart.shipping)
                      )}
                    </span>
                  </div>

                  <div className="cart__summary-line">
                    <span className="cart__summary-label">Tax (13% HST)</span>
                    <span className="cart__summary-value">{formatPrice(cart.tax)}</span>
                  </div>
                </div>

                <div className="cart__summary-divider" />

                <div className="cart__summary-total">
                  <span className="cart__summary-total-label">Total</span>
                  <span className="cart__summary-total-value">{formatPrice(cart.total)}</span>
                </div>

                {/* Promo Code */}
                {!cart.promoCode && (
                  <div className="cart__promo">
                    <div className="cart__promo-row">
                      <input
                        type="text"
                        className={`cart__promo-input${promoError ? ' cart__promo-input--error' : ''}`}
                        placeholder="Promo code"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        onKeyDown={handlePromoKeyDown}
                        aria-label="Enter promo code"
                      />
                      <button
                        className="cart__promo-btn"
                        onClick={handleApplyPromo}
                        disabled={promoLoading}
                      >
                        {promoLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {promoError && (
                      <p className="cart__promo-error" role="alert">{promoError}</p>
                    )}
                  </div>
                )}

                {cart.promoCode && (
                  <div className={`cart__promo-applied ${promoRemoving ? 'cart__promo-applied--removing' : ''}`}>
                    <span className="cart__promo-applied-check">
                      <CheckIcon />
                    </span>
                    <span className="cart__promo-applied-text">
                      Code <strong>{cart.promoCode}</strong> applied
                    </span>
                    <button
                      className="cart__promo-applied-remove"
                      onClick={handleRemovePromo}
                      aria-label="Remove promo code"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Checkout Buttons */}
                <div className="cart__summary-actions">
                  <Link to="/checkout" className="cart__checkout-btn">
                    Proceed to Checkout
                  </Link>
                  <button
                    className="cart__whatsapp-btn"
                    onClick={handleWhatsAppOrder}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M9 0C4.037 0 0 4.037 0 9C0 12.15 1.687 14.925 4.087 16.612L2.925 20.25L6.75 18.862C8.325 19.463 10.125 19.8 12 19.8C16.963 19.8 21 15.763 21 10.8C21 5.837 16.963 1.8 12 1.8C11.287 1.8 10.587 1.875 9.9 2.025L11.287 3.412C11.887 3.412 12.487 3.412 13.087 3.412C14.925 3.412 16.612 3.975 18 4.95C17.25 4.95 16.5 4.95 15.75 4.95C14.4 4.95 13.162 4.5 12.037 3.6C10.912 2.7 10.237 1.35 10.237 0C10.237 0 9.9 0.225 9 0Z" fill="currentColor" />
                    </svg>
                    Order via WhatsApp
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
