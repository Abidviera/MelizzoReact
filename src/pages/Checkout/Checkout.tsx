import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext';
import { OrderService } from '../../services/orderService';
import { PaymentService } from '../../services/paymentService';
import type { ShippingAddress, ShippingMethod } from '../../types';
import './Checkout.css';

const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', name: 'Standard Shipping', description: 'Regular delivery', price: 15, estimatedDays: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', description: 'Priority handling', price: 25, estimatedDays: '3-4 business days' },
  { id: 'overnight', name: 'Overnight Shipping', description: 'Next day delivery', price: 45, estimatedDays: '1 business day' },
];

const PROVINCES = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'];

type Step = 'shipping' | 'payment' | 'review';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { success, error: notifyError } = useNotification();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('shipping');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(SHIPPING_METHODS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardType, setCardType] = useState('visa');

  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apartment: '', city: '', province: 'Ontario',
    postalCode: '', country: 'Canada',
  });

  const [payment, setPayment] = useState({
    cardNumber: '', cardName: '', expiryDate: '', cvv: '',
  });

  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const validateShipping = (): boolean => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!shipping.firstName.trim()) errors.firstName = 'First name is required';
    if (!shipping.lastName.trim()) errors.lastName = 'Last name is required';
    if (!shipping.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) errors.email = 'Valid email is required';
    if (!shipping.phone.trim() || !/^[\d\s\-\+]{10,}$/.test(shipping.phone)) errors.phone = 'Valid phone is required';
    if (!shipping.address.trim()) errors.address = 'Address is required';
    if (!shipping.city.trim()) errors.city = 'City is required';
    if (!shipping.province) errors.province = 'Province is required';
    if (!shipping.postalCode.trim() || !/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(shipping.postalCode)) errors.postalCode = 'Valid postal code is required';
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = (): boolean => {
    const { cardNumber, cardName, expiryDate, cvv } = payment;
    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length !== 16) { notifyError('Card number must be 16 digits'); return false; }
    if (!cardName.trim()) { notifyError('Cardholder name is required'); return false; }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) { notifyError('Invalid expiry date'); return false; }
    if (!/^\d{3,4}$/.test(cvv)) { notifyError('Invalid CVV'); return false; }
    return true;
  };

  const handleShippingSubmit = () => {
    if (validateShipping()) setStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (validatePayment()) setStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const cardTypeDetected = PaymentService.getCardType(payment.cardNumber);
      setCardType(cardTypeDetected);

      const paymentResult = await PaymentService.processPayment({
        amount: cart.total,
        currency: 'CAD',
        cardNumber: payment.cardNumber,
        cardName: payment.cardName,
        expiryDate: payment.expiryDate,
        cvv: payment.cvv,
        email: shipping.email,
      });

      if (paymentResult.success) {
        const orderResult = await OrderService.createOrder(
          cart.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            variant: item.variant,
          })),
          shipping,
          {
            cardNumber: payment.cardNumber,
            cardName: payment.cardName,
            expiryDate: payment.expiryDate,
            cvv: payment.cvv,
            last4: payment.cardNumber.replace(/\s/g, '').slice(-4),
            method: 'card',
          },
          cart.subtotal,
          cart.tax,
          shippingMethod.price,
          cart.discount,
          cart.subtotal + cart.tax + shippingMethod.price - cart.discount,
          shippingMethod.name,
          cart.promoCode,
        );

        if (!orderResult.success) {
          notifyError(orderResult.error || 'Failed to create order');
          setIsProcessing(false);
          return;
        }

        clearCart();
        success('Order placed successfully!');
        navigate(`/order-confirmation/${orderResult.order!.orderNumber}`);
      } else {
        notifyError(paymentResult.message);
      }
    } catch {
      notifyError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = PaymentService.formatCardNumber(e.target.value);
    setPayment((p) => ({ ...p, cardNumber: formatted }));
    setCardType(PaymentService.getCardType(formatted));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = PaymentService.formatExpiryDate(e.target.value);
    setPayment((p) => ({ ...p, expiryDate: formatted }));
  };

  if (cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="checkout-empty__cta">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__main">
        {/* Step indicator */}
        <div className="checkout__steps">
          {(['shipping', 'payment', 'review'] as Step[]).map((s, i) => (
            <div key={s} className={`checkout__step ${step === s ? 'checkout__step--active' : ''} ${(['shipping', 'payment', 'review'].indexOf(step) > i ? 'checkout__step--done' : '')}`}>
              <span className="checkout__step-num">{i + 1}</span>
              <span className="checkout__step-label">{s === 'shipping' ? 'Shipping' : s === 'payment' ? 'Payment' : 'Review'}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: SHIPPING */}
        {step === 'shipping' && (
          <div className="checkout__section">
            <h2 className="checkout__title">Shipping Information</h2>
            <div className="checkout__form checkout__form--two-col">
              <div className="checkout__field">
                <label className="checkout__label">First Name *</label>
                <input className={`checkout__input ${shippingErrors.firstName ? 'checkout__input--error' : ''}`} value={shipping.firstName} onChange={(e) => setShipping((s) => ({ ...s, firstName: e.target.value }))} placeholder="John" />
                {shippingErrors.firstName && <span className="checkout__error">{shippingErrors.firstName}</span>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">Last Name *</label>
                <input className={`checkout__input ${shippingErrors.lastName ? 'checkout__input--error' : ''}`} value={shipping.lastName} onChange={(e) => setShipping((s) => ({ ...s, lastName: e.target.value }))} placeholder="Doe" />
                {shippingErrors.lastName && <span className="checkout__error">{shippingErrors.lastName}</span>}
              </div>
            </div>
            <div className="checkout__form checkout__form--two-col">
              <div className="checkout__field">
                <label className="checkout__label">Email *</label>
                <input className={`checkout__input ${shippingErrors.email ? 'checkout__input--error' : ''}`} type="email" value={shipping.email} onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))} placeholder="john@example.com" />
                {shippingErrors.email && <span className="checkout__error">{shippingErrors.email}</span>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">Phone *</label>
                <input className={`checkout__input ${shippingErrors.phone ? 'checkout__input--error' : ''}`} value={shipping.phone} onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))} placeholder="+1 705 927-0127" />
                {shippingErrors.phone && <span className="checkout__error">{shippingErrors.phone}</span>}
              </div>
            </div>
            <div className="checkout__form">
              <div className="checkout__field">
                <label className="checkout__label">Street Address *</label>
                <input className={`checkout__input ${shippingErrors.address ? 'checkout__input--error' : ''}`} value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} placeholder="123 Main Street" />
                {shippingErrors.address && <span className="checkout__error">{shippingErrors.address}</span>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">Apartment, suite, etc. (optional)</label>
                <input className="checkout__input" value={shipping.apartment} onChange={(e) => setShipping((s) => ({ ...s, apartment: e.target.value }))} placeholder="Apt 4B" />
              </div>
            </div>
            <div className="checkout__form checkout__form--three-col">
              <div className="checkout__field">
                <label className="checkout__label">City *</label>
                <input className={`checkout__input ${shippingErrors.city ? 'checkout__input--error' : ''}`} value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} placeholder="Toronto" />
                {shippingErrors.city && <span className="checkout__error">{shippingErrors.city}</span>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">Province *</label>
                <select className={`checkout__input checkout__select ${shippingErrors.province ? 'checkout__input--error' : ''}`} value={shipping.province} onChange={(e) => setShipping((s) => ({ ...s, province: e.target.value }))}>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {shippingErrors.province && <span className="checkout__error">{shippingErrors.province}</span>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">Postal Code *</label>
                <input className={`checkout__input ${shippingErrors.postalCode ? 'checkout__input--error' : ''}`} value={shipping.postalCode} onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))} placeholder="M5V 2H1" />
                {shippingErrors.postalCode && <span className="checkout__error">{shippingErrors.postalCode}</span>}
              </div>
            </div>

            <h3 className="checkout__subtitle">Shipping Method</h3>
            <div className="checkout__shipping-methods">
              {SHIPPING_METHODS.map((method) => (
                <label key={method.id} className={`checkout__shipping-method ${shippingMethod.id === method.id ? 'checkout__shipping-method--selected' : ''}`}>
                  <input type="radio" name="shipping" value={method.id} checked={shippingMethod.id === method.id} onChange={() => setShippingMethod(method)} />
                  <div className="checkout__shipping-method-info">
                    <span className="checkout__shipping-method-name">{method.name}</span>
                    <span className="checkout__shipping-method-desc">{method.estimatedDays}</span>
                  </div>
                  <span className="checkout__shipping-method-price">
                    {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>

            <button className="checkout__btn checkout__btn--primary" onClick={handleShippingSubmit}>
              Continue to Payment
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 'payment' && (
          <div className="checkout__section">
            <h2 className="checkout__title">Payment Details</h2>
            <div className="checkout__security-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Your payment information is encrypted and secure</span>
            </div>

            <div className="checkout__card-icons">
              {['visa', 'mastercard', 'amex', 'discover'].map((type) => (
                <span key={type} className={`checkout__card-icon ${cardType === type ? 'checkout__card-icon--active' : ''}`}>{type}</span>
              ))}
            </div>

            <div className="checkout__form">
              <div className="checkout__field">
                <label className="checkout__label">Card Number *</label>
                <input className="checkout__input" value={payment.cardNumber} onChange={handleCardNumberChange} placeholder="4242 4242 4242 4242" maxLength={19} />
              </div>
              <div className="checkout__field">
                <label className="checkout__label">Cardholder Name *</label>
                <input className="checkout__input" value={payment.cardName} onChange={(e) => setPayment((p) => ({ ...p, cardName: e.target.value }))} placeholder="John Doe" />
              </div>
            </div>
            <div className="checkout__form checkout__form--two-col">
              <div className="checkout__field">
                <label className="checkout__label">Expiry Date *</label>
                <input className="checkout__input" value={payment.expiryDate} onChange={handleExpiryChange} placeholder="MM/YY" maxLength={5} />
              </div>
              <div className="checkout__field">
                <label className="checkout__label">CVV *</label>
                <input className="checkout__input" value={payment.cvv} onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="123" maxLength={4} type="password" />
              </div>
            </div>

            <div className="checkout__btn-row">
              <button className="checkout__btn checkout__btn--secondary" onClick={() => setStep('shipping')}>
                Back
              </button>
              <button className="checkout__btn checkout__btn--primary" onClick={handlePaymentSubmit}>
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 'review' && (
          <div className="checkout__section">
            <h2 className="checkout__title">Order Review</h2>

            <div className="checkout__review-block">
              <div className="checkout__review-header">
                <h3 className="checkout__subtitle">Shipping To</h3>
                <button className="checkout__edit-btn" onClick={() => setStep('shipping')}>Edit</button>
              </div>
              <p className="checkout__review-text">
                {shipping.firstName} {shipping.lastName}<br />
                {shipping.address}{shipping.apartment ? `, ${shipping.apartment}` : ''}<br />
                {shipping.city}, {shipping.province} {shipping.postalCode}<br />
                {shipping.email} | {shipping.phone}
              </p>
              <p className="checkout__review-text"><strong>Shipping:</strong> {shippingMethod.name} ({shippingMethod.estimatedDays})</p>
            </div>

            <div className="checkout__review-block">
              <div className="checkout__review-header">
                <h3 className="checkout__subtitle">Payment</h3>
                <button className="checkout__edit-btn" onClick={() => setStep('payment')}>Edit</button>
              </div>
              <p className="checkout__review-text">
                Card ending in {payment.cardNumber.replace(/\s/g, '').slice(-4)}
              </p>
            </div>

            <div className="checkout__review-block">
              <h3 className="checkout__subtitle">Items ({cart.items.length})</h3>
              {cart.items.map((item) => (
                <div key={item.id} className="checkout__review-item">
                  <img src={item.image} alt={item.name} className="checkout__review-item-img" />
                  <div>
                    <p className="checkout__review-item-name">{item.name}</p>
                    {item.variant && <p className="checkout__review-item-variant">{item.variant}</p>}
                    <p className="checkout__review-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="checkout__review-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="checkout__btn-row">
              <button className="checkout__btn checkout__btn--secondary" onClick={() => setStep('payment')}>
                Back
              </button>
              <button className="checkout__btn checkout__btn--primary" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? (
                  <span className="checkout__spinner" />
                ) : (
                  `Place Order — $${(cart.subtotal + cart.tax + shippingMethod.price - cart.discount).toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <aside className="checkout__sidebar">
        <h3 className="checkout__sidebar-title">Order Summary</h3>
        <div className="checkout__sidebar-items">
          {cart.items.map((item) => (
            <div key={item.id} className="checkout__sidebar-item">
              <img src={item.image} alt={item.name} className="checkout__sidebar-item-img" />
              <div className="checkout__sidebar-item-info">
                <p className="checkout__sidebar-item-name">{item.name}</p>
                <p className="checkout__sidebar-item-qty">x{item.quantity}</p>
              </div>
              <span className="checkout__sidebar-item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="checkout__sidebar-totals">
          <div className="checkout__sidebar-row">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout__sidebar-row">
            <span>Shipping</span>
            <span>{shippingMethod.price === 0 ? 'Free' : `$${shippingMethod.price.toFixed(2)}`}</span>
          </div>
          <div className="checkout__sidebar-row">
            <span>Tax (13% HST)</span>
            <span>${cart.tax.toFixed(2)}</span>
          </div>
          {cart.discount > 0 && (
            <div className="checkout__sidebar-row checkout__sidebar-row--discount">
              <span>Discount ({cart.promoCode})</span>
              <span>-${cart.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="checkout__sidebar-row checkout__sidebar-row--total">
            <span>Total</span>
            <span>${(cart.subtotal + cart.tax + shippingMethod.price - cart.discount).toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
