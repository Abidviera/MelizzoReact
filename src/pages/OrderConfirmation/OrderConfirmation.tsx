import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OrderService } from '../../services/orderService';
import { WhatsAppService } from '../../services/whatsAppService';
import type { Order } from '../../types';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      const found = OrderService.getOrderByNumber(orderNumber);
      setOrder(found || null);
    }
    setTimeout(() => setShowCheck(true), 300);
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="oc">
        <div className="oc__container">
          <h2 className="oc__title">Order Not Found</h2>
          <Link to="/shop" className="oc__cta">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="oc">
      <div className="oc__container">
        {/* Success Header */}
        <div className={`oc__success ${showCheck ? 'oc__success--visible' : ''}`}>
          <div className="oc__checkmark">
            <svg viewBox="0 0 52 52" className="oc__checkmark-svg">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#3A6E5F" strokeWidth="2" className="oc__checkmark-circle" />
              <path fill="none" stroke="#3A6E5F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="oc__checkmark-check" />
            </svg>
          </div>
          <h1 className="oc__headline">Order Confirmed!</h1>
          <p className="oc__subline">Thank you for choosing MELiZZO</p>
        </div>

        {/* Order Info */}
        <div className="oc__info-grid">
          <div className="oc__info-card">
            <span className="oc__info-label">Order Number</span>
            <span className="oc__info-value">{order.orderNumber}</span>
          </div>
          <div className="oc__info-card">
            <span className="oc__info-label">Estimated Delivery</span>
            <span className="oc__info-value">{order.estimatedDelivery}</span>
          </div>
          <div className="oc__info-card">
            <span className="oc__info-label">Order Total</span>
            <span className="oc__info-value">${order.total.toFixed(2)} CAD</span>
          </div>
          <div className="oc__info-card">
            <span className="oc__info-label">Status</span>
            <span className={`oc__status oc__status--${order.status}`}>{order.status}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="oc__section">
          <h2 className="oc__section-title">Items Ordered</h2>
          <div className="oc__items">
            {order.items.map((item) => (
              <div key={item.id} className="oc__item">
                <img src={item.image} alt={item.name} className="oc__item-img" />
                <div className="oc__item-info">
                  <p className="oc__item-name">{item.name}</p>
                  {item.variant && <p className="oc__item-variant">{item.variant}</p>}
                  <p className="oc__item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="oc__item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="oc__section oc__section--half">
          <h2 className="oc__section-title">Shipping Address</h2>
          <p className="oc__address-text">
            {order.shipping.firstName} {order.shipping.lastName}<br />
            {order.shipping.address}{order.shipping.apartment ? `, ${order.shipping.apartment}` : ''}<br />
            {order.shipping.city}, {order.shipping.province}, {order.shipping.postalCode}<br />
            {order.shipping.country}
          </p>
          <p className="oc__address-contact">{order.shipping.email} | {order.shipping.phone}</p>
        </div>

        {/* Order Totals */}
        <div className="oc__section oc__section--half">
          <h2 className="oc__section-title">Order Summary</h2>
          <div className="oc__totals">
            <div className="oc__total-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="oc__total-row">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="oc__total-row">
              <span>Tax (13% HST)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="oc__total-row oc__total-row--discount">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="oc__total-row oc__total-row--total">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="oc__actions">
          <button onClick={handlePrint} className="oc__btn oc__btn--secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print Order
          </button>
          <button onClick={() => WhatsAppService.sendOrderConfirmation(order.orderNumber)} className="oc__btn oc__btn--whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us
          </button>
          <Link to="/shop" className="oc__btn oc__btn--primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
