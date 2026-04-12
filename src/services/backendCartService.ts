/**
 * backendCartService — wraps the backend cart API (requires authentication).
 * All operations are server-authoritative for logged-in users.
 */
import type { Cart, CartItem } from '../types';
import apiClient, { getStoredAuth, getErrorMessage } from './apiClient';

// ── Backend DTO shapes ──────────────────────────────────────────
interface BackendCartItemDto {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variantName?: string | null;
  variantId?: string | null;
}

interface BackendCartDto {
  userId: string;
  items: BackendCartItemDto[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string | null;
}

interface ApplyPromoResponse {
  discount: number;
  code: string;
  message: string;
}

function isAuthenticated(): boolean {
  return !!getStoredAuth();
}

// Map backend CartDto to frontend Cart type
function mapCart(dto: BackendCartDto): Cart {
  return {
    items: dto.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.imageUrl,
      variant: i.variantName ?? undefined,
      variantId: i.variantId ?? undefined,
    })),
    subtotal: dto.subtotal,
    tax: dto.tax,
    shipping: dto.shipping,
    discount: dto.discount,
    total: dto.total,
    promoCode: dto.promoCode ?? undefined,
  };
}

// ── Cart Service ────────────────────────────────────────────────
export const BackendCartService = {
  async getCart(): Promise<Cart | null> {
    if (!isAuthenticated()) return null;
    try {
      const response = await apiClient.get<BackendCartDto>('/cart');
      return mapCart(response.data);
    } catch {
      return null;
    }
  },

  async addToCart(item: CartItem): Promise<Cart | null> {
    if (!isAuthenticated()) return null;
    try {
      const request = {
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.image,
        variantName: item.variant ?? null,
        variantId: item.variantId ?? null,
      };
      const response = await apiClient.post<BackendCartDto>('/cart/items', request);
      return mapCart(response.data);
    } catch {
      return null;
    }
  },

  async updateQuantity(productId: string, quantity: number, variantId?: string): Promise<boolean> {
    if (!isAuthenticated()) return false;
    try {
      await apiClient.put('/cart/items', {
        productId,
        quantity,
        variantId: variantId ?? null,
      });
      return true;
    } catch {
      return false;
    }
  },

  async removeFromCart(productId: string, variantId?: string): Promise<boolean> {
    if (!isAuthenticated()) return false;
    try {
      const params: Record<string, string> = { productId };
      if (variantId) params.variantId = variantId;
      await apiClient.delete('/cart/items', { params });
      return true;
    } catch {
      return false;
    }
  },

  async clearCart(): Promise<boolean> {
    if (!isAuthenticated()) return false;
    try {
      await apiClient.delete('/cart');
      return true;
    } catch {
      return false;
    }
  },

  async applyPromoCode(code: string): Promise<{ success: boolean; discount: number; message: string; cart: Cart | null }> {
    if (!isAuthenticated()) return { success: false, discount: 0, message: 'Not authenticated', cart: null };
    try {
      const response = await apiClient.post<ApplyPromoResponse>('/cart/promo', { code });
      const cart = await this.getCart(); // Reload cart with updated totals
      return {
        success: true,
        discount: response.data.discount,
        message: response.data.message,
        cart,
      };
    } catch (err) {
      return { success: false, discount: 0, message: getErrorMessage(err), cart: null };
    }
  },

  async removePromoCode(): Promise<Cart | null> {
    if (!isAuthenticated()) return null;
    try {
      await apiClient.delete('/cart/promo');
      return this.getCart();
    } catch {
      return null;
    }
  },

  /** Returns the raw backend CartItem for direct use (e.g. syncing localStorage → server) */
  mapBackendItem(dto: BackendCartItemDto): CartItem {
    return {
      id: dto.id,
      productId: dto.productId,
      name: dto.name,
      price: dto.price,
      quantity: dto.quantity,
      image: dto.imageUrl,
      variant: dto.variantName ?? undefined,
      variantId: dto.variantId ?? undefined,
    };
  },
};
