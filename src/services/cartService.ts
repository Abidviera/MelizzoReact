import type { Cart, CartItem, PromoCode } from '../types';
import apiClient, { getStoredAuth } from './apiClient';
import { BackendCartService } from './backendCartService';

const CART_KEY = 'melizzo_cart';
const WISHLIST_KEY = 'melizzo_wishlist';
const PROMO_CACHE_KEY = 'melizzo_promo_codes';
const TAX_RATE = 0.13;
const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING = 15;

interface PublicPromoCodeDto {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number | null;
}

// ── Helpers ─────────────────────────────────────────────────────
function isAuthenticated(): boolean {
  return !!getStoredAuth();
}

function loadCachedPromoCodes(): PromoCode[] {
  try {
    const stored = localStorage.getItem(PROMO_CACHE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function cachePromoCodes(codes: PromoCode[]) {
  localStorage.setItem(PROMO_CACHE_KEY, JSON.stringify(codes));
}

async function fetchPromoCodesFromApi(): Promise<PromoCode[]> {
  try {
    const response = await apiClient.get<PublicPromoCodeDto[]>('/promo-codes');
    const codes: PromoCode[] = response.data.map((d) => ({
      code: d.code,
      description: d.description,
      discountType: d.discountType as 'percentage' | 'fixed',
      discountValue: d.discountValue,
      minOrderValue: d.minOrderValue ?? undefined,
    }));
    cachePromoCodes(codes);
    return codes;
  } catch {
    return loadCachedPromoCodes();
  }
}

// ── LocalStorage cart (guest / fallback) ────────────────────────
function loadCart(): Cart {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { items: [], subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 };
}

function saveCart(cart: Cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function recalculate(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const taxable = subtotal - cart.discount;
  const tax = Math.max(0, taxable * TAX_RATE);
  const total = taxable + shipping + tax;
  return { ...cart, subtotal, shipping, tax, total };
}

function applyPromoLocally(cart: Cart, promo: PromoCode): { cart: Cart; success: boolean; message: string } {
  if (cart.subtotal < (promo.minOrderValue ?? 0)) {
    return { cart, success: false, message: `Minimum order of $${promo.minOrderValue} required` };
  }
  const discount =
    promo.discountType === 'percentage'
      ? (cart.subtotal * promo.discountValue) / 100
      : promo.discountValue;
  cart.discount = Math.min(discount, cart.subtotal);
  cart.promoCode = promo.code;
  const updated = recalculate(cart);
  saveCart(updated);
  return { cart: updated, success: true, message: promo.description };
}

// ── Cart Service ────────────────────────────────────────────────
export const CartService = {
  // ── Read ──────────────────────────────────────────────────────
  getCart(): Cart {
    return loadCart();
  },

  /**
   * Loads the cart from the backend API. Used by CartContext on mount
   * when the user is authenticated. Falls back to localStorage.
   */
  async loadFromBackend(): Promise<Cart> {
    const backendCart = await BackendCartService.getCart();
    if (backendCart) {
      // Persist to localStorage so cross-tab sync still works
      saveCart(backendCart);
      return backendCart;
    }
    return loadCart();
  },

  // ── Mutations ─────────────────────────────────────────────────
  async addToCart(item: CartItem): Promise<Cart> {
    if (isAuthenticated()) {
      const cart = await BackendCartService.addToCart(item);
      if (cart) {
        saveCart(cart);
        return cart;
      }
    }
    // Guest: localStorage
    const cart = loadCart();
    const existingIdx = cart.items.findIndex(
      (i) => i.productId === item.productId && i.variantId === item.variantId,
    );
    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    const updated = recalculate(cart);
    saveCart(updated);
    return updated;
  },

  async removeFromCart(productId: string, variantId?: string): Promise<Cart> {
    if (isAuthenticated()) {
      await BackendCartService.removeFromCart(productId, variantId);
      const cart = await BackendCartService.getCart();
      if (cart) {
        saveCart(cart);
        return cart;
      }
    }
    // Guest: localStorage
    const cart = loadCart();
    cart.items = cart.items.filter(
      (i) => !(i.productId === productId && i.variantId === variantId),
    );
    const updated = recalculate(cart);
    saveCart(updated);
    return updated;
  },

  async updateQuantity(productId: string, quantity: number, variantId?: string): Promise<Cart> {
    if (isAuthenticated()) {
      const ok = await BackendCartService.updateQuantity(productId, quantity, variantId);
      if (ok) {
        const cart = await BackendCartService.getCart();
        if (cart) {
          saveCart(cart);
          return cart;
        }
      }
    }
    // Guest: localStorage
    const cart = loadCart();
    const item = cart.items.find(
      (i) => i.productId === productId && i.variantId === variantId,
    );
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    const updated = recalculate(cart);
    saveCart(updated);
    return updated;
  },

  async clearCart(): Promise<Cart> {
    if (isAuthenticated()) {
      await BackendCartService.clearCart();
    }
    const empty: Cart = { items: [], subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 };
    saveCart(empty);
    return empty;
  },

  getItemCount(): number {
    return loadCart().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartTotal(): number {
    return loadCart().total;
  },

  // ── Promo codes ───────────────────────────────────────────────
  applyPromoCode(code: string): { cart: Cart; success: boolean; message: string } {
    if (isAuthenticated()) {
      // For authenticated users, promo is applied server-side via async method
      // This sync version is only for guests
      const cart = loadCart();
      const promoCodes = loadCachedPromoCodes();
      const promo = promoCodes.find(
        (p) => p.code.toUpperCase() === code.toUpperCase(),
      );
      if (!promo) return { cart, success: false, message: 'Invalid promo code' };
      return applyPromoLocally(cart, promo);
    }
    const cart = loadCart();
    const promoCodes = loadCachedPromoCodes();
    const promo = promoCodes.find(
      (p) => p.code.toUpperCase() === code.toUpperCase(),
    );
    if (!promo) return { cart, success: false, message: 'Invalid promo code' };
    return applyPromoLocally(cart, promo);
  },

  async applyPromoCodeAsync(code: string): Promise<{ cart: Cart; success: boolean; message: string }> {
    const cart = loadCart();
    if (isAuthenticated()) {
      const result = await BackendCartService.applyPromoCode(code);
      if (result.cart) {
        saveCart(result.cart);
        return { cart: result.cart, success: true, message: result.message };
      }
      return { cart, success: false, message: result.message };
    }
    // Guest: apply locally
    const promoCodes = loadCachedPromoCodes();
    const promo = promoCodes.find(
      (p) => p.code.toUpperCase() === code.toUpperCase(),
    );
    if (!promo) return { cart, success: false, message: 'Invalid promo code' };
    return applyPromoLocally(cart, promo);
  },

  async removePromoCode(): Promise<Cart> {
    if (isAuthenticated()) {
      const cart = await BackendCartService.removePromoCode();
      if (cart) {
        saveCart(cart);
        return cart;
      }
    }
    const cart = loadCart();
    cart.discount = 0;
    cart.promoCode = undefined;
    const updated = recalculate(cart);
    saveCart(updated);
    return updated;
  },

  // ── Wishlist ─────────────────────────────────────────────────
  getWishlist(): CartItem[] {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async syncWishlistFromServer(): Promise<CartItem[]> {
    if (!getStoredAuth()) return this.getWishlist();
    try {
      const response = await apiClient.get<WishlistProductDto[]>('/wishlist');
      const items: CartItem[] = response.data.map((p) => ({
        id: p.productId,
        productId: p.productId,
        name: p.name,
        price: p.price,
        quantity: 1,
        image: p.imageUrl,
      }));
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
      return items;
    } catch {
      return this.getWishlist();
    }
  },

  addToWishlist(item: CartItem): CartItem[] {
    const wishlist = this.getWishlist();
    const exists = wishlist.some(
      (i) => i.productId === item.productId && i.variantId === item.variantId,
    );
    if (!exists) {
      wishlist.push(item);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
    if (getStoredAuth()) {
      apiClient.post(`/wishlist/${item.productId}`).catch(() => {/* ignore */});
    }
    return wishlist;
  },

  removeFromWishlist(productId: string, variantId?: string): CartItem[] {
    const wishlist = this.getWishlist().filter(
      (i) => !(i.productId === productId && i.variantId === variantId),
    );
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    if (getStoredAuth()) {
      apiClient.delete(`/wishlist/${productId}`).catch(() => {/* ignore */});
    }
    return wishlist;
  },

  isInWishlist(productId: string, variantId?: string): boolean {
    return this.getWishlist().some(
      (i) => i.productId === productId && i.variantId === variantId,
    );
  },

  getWishlistCount(): number {
    return this.getWishlist().length;
  },

  moveWishlistToCart(productId: string, variantId?: string): { cart: Cart; wishlist: CartItem[] } {
    const wishlist = this.getWishlist();
    const item = wishlist.find(
      (i) => i.productId === productId && i.variantId === variantId,
    );
    if (item) {
      this.addToCart(item); // async but fire-and-forget for this flow
      const updatedWishlist = this.removeFromWishlist(productId, variantId);
      return { cart: loadCart(), wishlist: updatedWishlist };
    }
    return { cart: this.getCart(), wishlist };
  },

  getAvailablePromoCodes(): PromoCode[] {
    return loadCachedPromoCodes();
  },

  async refreshPromoCodes(): Promise<PromoCode[]> {
    return fetchPromoCodesFromApi();
  },
};

interface WishlistProductDto {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}
