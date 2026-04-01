import type { Order, ShippingAddress, PaymentDetails, OrderItem } from '../types';

const ORDERS_KEY = 'melizzo_orders';

function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MEL-${timestamp}-${random}`;
}

function calculateEstimatedDelivery(method: string): string {
  const today = new Date();
  let days = 7;
  if (method === 'express') days = 3;
  else if (method === 'overnight') days = 1;
  today.setDate(today.getDate() + days);
  return today.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function maskPayment(payment: PaymentDetails): PaymentDetails {
  if (payment.cardNumber && payment.cardNumber.length >= 4) {
    return {
      ...payment,
      cardNumber: undefined,
      cvv: undefined,
      last4: payment.cardNumber.replace(/\s/g, '').slice(-4),
    };
  }
  return payment;
}

export const OrderService = {
  createOrder(
    items: OrderItem[],
    shipping: ShippingAddress,
    payment: PaymentDetails,
    subtotal: number,
    tax: number,
    shippingCost: number,
    discount: number,
    total: number,
    shippingMethod: string
  ): Order {
    const orders = loadOrders();
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      items,
      shipping,
      payment: maskPayment(payment),
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      status: 'pending',
      shippingMethod,
      createdAt: new Date().toISOString(),
      estimatedDelivery: calculateEstimatedDelivery(shippingMethod.toLowerCase()),
    };
    orders.unshift(order);
    saveOrders(orders);
    return order;
  },

  getOrderById(id: string): Order | undefined {
    return loadOrders().find((o) => o.id === id);
  },

  getOrderByNumber(orderNumber: string): Order | undefined {
    return loadOrders().find((o) => o.orderNumber === orderNumber);
  },

  getAllOrders(): Order[] {
    return loadOrders();
  },

  getRecentOrders(limit = 5): Order[] {
    return loadOrders().slice(0, limit);
  },

  getOrderCount(): number {
    return loadOrders().length;
  },

  getTotalOrderValue(): number {
    return loadOrders().reduce((sum, o) => sum + o.total, 0);
  },

  getOrdersByStatus(status: Order['status']): Order[] {
    return loadOrders().filter((o) => o.status === status);
  },

  updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const orders = loadOrders();
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      saveOrders(orders);
    }
    return order;
  },

  addTrackingNumber(id: string, tracking: string): Order | undefined {
    const orders = loadOrders();
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.trackingNumber = tracking;
      order.status = 'shipped';
      saveOrders(orders);
    }
    return order;
  },

  cancelOrder(id: string): Order | undefined {
    const orders = loadOrders();
    const order = orders.find((o) => o.id === id);
    if (order && (order.status === 'pending' || order.status === 'processing')) {
      order.status = 'cancelled';
      saveOrders(orders);
    }
    return order;
  },

  calculateEstimatedDelivery,
  generateOrderNumber,
};
