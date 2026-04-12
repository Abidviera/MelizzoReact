import type { Order, ShippingAddress, PaymentDetails, OrderItem } from '../types';
import apiClient, { getErrorMessage } from './apiClient';
import { CartService } from './cartService';

// ── Backend DTO types ──────────────────────────────────────────
interface CreateOrderRequest {
  userId: string;
  items: {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    imageUrl: string;
    variantName?: string;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  promoCode?: string;
}

interface OrderDto {
  id: string;
  orderNumber: string;
  items: {
    id: string;
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    imageUrl: string;
    variant?: string;
  }[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: string;
  shippingMethod: string;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

interface OrderListDto {
  id: string;
  orderNumber: string;
  itemCount: number;
  total: number;
  status: string;
  createdAt: string;
}

// ── Mapping ────────────────────────────────────────────────────
function mapOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    items: dto.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      price: i.unitPrice,
      quantity: i.quantity,
      image: i.imageUrl,
      variant: i.variant,
    })),
    shipping: {
      firstName: dto.shipping.firstName,
      lastName: dto.shipping.lastName,
      email: dto.shipping.email,
      phone: dto.shipping.phone,
      address: dto.shipping.address,
      apartment: dto.shipping.apartment,
      city: dto.shipping.city,
      province: dto.shipping.province,
      postalCode: dto.shipping.postalCode,
      country: dto.shipping.country,
    },
    payment: { last4: undefined },
    subtotal: dto.subtotal,
    tax: dto.tax,
    shippingCost: dto.shippingCost,
    discount: dto.discount,
    total: dto.total,
    status: dto.status.toLowerCase() as Order['status'],
    shippingMethod: dto.shippingMethod,
    createdAt: dto.createdAt,
    estimatedDelivery: dto.estimatedDelivery,
    trackingNumber: dto.trackingNumber,
  };
}

// ── Order Service ─────────────────────────────────────────────
export const OrderService = {
  async createOrder(
    items: OrderItem[],
    shipping: ShippingAddress,
    _payment: PaymentDetails,
    _subtotal: number,
    _tax: number,
    _shippingCost: number,
    _discount: number,
    _total: number,
    shippingMethod: string,
    promoCode?: string,
  ): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const request: CreateOrderRequest = {
        userId: '', // Backend gets userId from auth token
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          unitPrice: i.price,
          quantity: i.quantity,
          imageUrl: i.image,
          variantName: i.variant,
        })),
        shippingAddress: {
          firstName: shipping.firstName,
          lastName: shipping.lastName,
          email: shipping.email,
          phone: shipping.phone,
          address: shipping.address,
          apartment: shipping.apartment,
          city: shipping.city,
          province: shipping.province,
          postalCode: shipping.postalCode,
          country: shipping.country,
        },
        shippingMethod: shippingMethod.toLowerCase(),
        paymentMethod: 'card',
        promoCode,
      };

      const response = await apiClient.post<OrderDto>('/orders', request);
      const order = mapOrder(response.data);

      // Clear cart after successful order
      CartService.clearCart();

      return { success: true, order };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await apiClient.get<OrderDto>(`/orders/${id}`);
      return mapOrder(response.data);
    } catch {
      return null;
    }
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const response = await apiClient.get<OrderDto>(`/orders/number/${orderNumber}`);
      return mapOrder(response.data);
    } catch {
      return null;
    }
  },

  async getOrders(page = 1, pageSize = 10): Promise<{ orders: Order[]; total: number }> {
    try {
      const response = await apiClient.get<{ items: OrderListDto[]; totalCount: number }>('/orders', {
        params: { page, pageSize },
      });

      // For order details, we need to fetch each order
      const orders: Order[] = [];
      for (const dto of response.data.items) {
        const full = await this.getOrderById(dto.id);
        if (full) orders.push(full);
      }

      return { orders, total: response.data.totalCount };
    } catch {
      return { orders: [], total: 0 };
    }
  },

  async cancelOrder(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/orders/${id}`);
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  },

  // ── Local fallback helpers ───────────────────────────────────
  calculateEstimatedDelivery(method: string): string {
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
  },
};
