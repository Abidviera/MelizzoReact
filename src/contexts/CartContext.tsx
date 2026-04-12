import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Cart, CartItem } from '../types';
import { CartService } from '../services/cartService';

interface CartContextType {
  cart: Cart;
  wishlist: CartItem[];
  itemCount: number;
  wishlistCount: number;
  loadingCart: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  addToWishlist: (item: CartItem) => void;
  removeFromWishlist: (productId: string, variantId?: string) => void;
  isInWishlist: (productId: string, variantId?: string) => boolean;
  moveWishlistToCart: (productId: string, variantId?: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(CartService.getCart);
  const [wishlist, setWishlist] = useState<CartItem[]>(CartService.getWishlist);
  const [loadingCart, setLoadingCart] = useState(false);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Sync cart from backend on mount for authenticated users
  useEffect(() => {
    CartService.loadFromBackend().then((serverCart) => {
      setCart(serverCart);
    });
  }, []);

  // Keep localStorage in sync across tabs for guests
  useEffect(() => {
    const handleStorage = () => {
      setCart(CartService.getCart());
      setWishlist(CartService.getWishlist());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync wishlist from server on mount for authenticated users
  useEffect(() => {
    CartService.syncWishlistFromServer().then((items) => {
      setWishlist(items);
    });
  }, []);

  // Refresh promo codes from API on mount
  useEffect(() => {
    CartService.refreshPromoCodes();
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    CartService.addToCart(item).then((updatedCart) => {
      setCart(updatedCart);
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    CartService.removeFromCart(productId, variantId).then((updatedCart) => {
      setCart(updatedCart);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    CartService.updateQuantity(productId, quantity, variantId).then((updatedCart) => {
      setCart(updatedCart);
    });
  }, []);

  const clearCart = useCallback(() => {
    CartService.clearCart().then((empty) => {
      setCart(empty);
    });
  }, []);

  const applyPromoCode = useCallback(async (code: string): Promise<{ success: boolean; message: string }> => {
    const result = await CartService.applyPromoCodeAsync(code);
    setCart(result.cart);
    return { success: result.success, message: result.message };
  }, []);

  const removePromoCode = useCallback(() => {
    CartService.removePromoCode().then((updatedCart) => {
      setCart(updatedCart);
    });
  }, []);

  const addToWishlist = useCallback((item: CartItem) => {
    setWishlist(CartService.addToWishlist(item));
  }, []);

  const removeFromWishlist = useCallback((productId: string, variantId?: string) => {
    setWishlist(CartService.removeFromWishlist(productId, variantId));
  }, []);

  const isInWishlist = useCallback((productId: string, variantId?: string) => {
    return CartService.isInWishlist(productId, variantId);
  }, []);

  const moveWishlistToCart = useCallback((productId: string, variantId?: string) => {
    const { cart: newCart, wishlist: newWishlist } = CartService.moveWishlistToCart(productId, variantId);
    setCart(newCart);
    setWishlist(newWishlist);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        itemCount,
        wishlistCount,
        loadingCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        moveWishlistToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
