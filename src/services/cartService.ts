import type { Cart, CartItem, PromoCode } from '../types';

const CART_KEY = 'melizzo_cart';
const WISHLIST_KEY = 'melizzo_wishlist';
const TAX_RATE = 0.13;
const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING = 15;

const PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, description: '10% off your first order' },
  { code: 'MELIZZO20', discountType: 'percentage', discountValue: 20, minOrderValue: 50, description: '20% off orders over $50' },
  { code: 'SAVE25', discountType: 'percentage', discountValue: 25, minOrderValue: 100, description: '25% off orders over $100' },
  { code: 'FIRSTORDER', discountType: 'percentage', discountValue: 15, description: '15% off first order' },
];

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

export const CartService = {
  getCart(): Cart {
    return loadCart();
  },

  addToCart(item: CartItem): Cart {
    const cart = loadCart();
    const existingIdx = cart.items.findIndex(
      (i) => i.productId === item.productId && i.variantId === item.variantId
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

  removeFromCart(productId: string, variantId?: string): Cart {
    const cart = loadCart();
    cart.items = cart.items.filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    );
    const updated = recalculate(cart);
    saveCart(updated);
    return updated;
  },

  updateQuantity(productId: string, quantity: number, variantId?: string): Cart {
    const cart = loadCart();
    const item = cart.items.find(
      (i) => i.productId === productId && i.variantId === variantId
    );
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    const updated = recalculate(cart);
    saveCart(updated);
    return updated;
  },

  clearCart(): Cart {
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

  applyPromoCode(code: string): { cart: Cart; success: boolean; message: string } {
    const cart = loadCart();
    const promo = PROMO_CODES.find(
      (p) => p.code.toUpperCase() === code.toUpperCase()
    );

    if (!promo) {
      return { cart, success: false, message: 'Invalid promo code' };
    }

    if (promo.minOrderValue && cart.subtotal < promo.minOrderValue) {
      return {
        cart,
        success: false,
        message: `Minimum order of $${promo.minOrderValue} required`,
      };
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
  },

  removePromoCode(): Cart {
    const cart = loadCart();
    cart.discount = 0;
    cart.promoCode = undefined;
    const updated = recalculate(cart);
    saveCart(updated);
    return updated;
  },

  // Wishlist
  getWishlist(): CartItem[] {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addToWishlist(item: CartItem): CartItem[] {
    const wishlist = this.getWishlist();
    const exists = wishlist.some(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    );
    if (!exists) {
      wishlist.push(item);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
    return wishlist;
  },

  removeFromWishlist(productId: string, variantId?: string): CartItem[] {
    const wishlist = this.getWishlist().filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    );
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    return wishlist;
  },

  isInWishlist(productId: string, variantId?: string): boolean {
    return this.getWishlist().some(
      (i) => i.productId === productId && i.variantId === variantId
    );
  },

  getWishlistCount(): number {
    return this.getWishlist().length;
  },

  moveWishlistToCart(productId: string, variantId?: string): { cart: Cart; wishlist: CartItem[] } {
    const wishlist = this.getWishlist();
    const item = wishlist.find(
      (i) => i.productId === productId && i.variantId === variantId
    );
    if (item) {
      const cart = this.addToCart(item);
      const updatedWishlist = this.removeFromWishlist(productId, variantId);
      return { cart, wishlist: updatedWishlist };
    }
    return { cart: this.getCart(), wishlist };
  },

  getAvailablePromoCodes(): PromoCode[] {
    return PROMO_CODES;
  },
};
