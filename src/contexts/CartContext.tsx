import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Cart, CartItem } from '../types';
import { CartService } from '../services/cartService';

interface CartContextType {
  cart: Cart;
  wishlist: CartItem[];
  itemCount: number;
  wishlistCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
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

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleStorage = () => {
      setCart(CartService.getCart());
      setWishlist(CartService.getWishlist());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(CartService.addToCart(item));
  }, []);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart(CartService.removeFromCart(productId, variantId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    setCart(CartService.updateQuantity(productId, quantity, variantId));
  }, []);

  const clearCart = useCallback(() => {
    setCart(CartService.clearCart());
  }, []);

  const applyPromoCode = useCallback((code: string) => {
    const result = CartService.applyPromoCode(code);
    setCart(result.cart);
    return { success: result.success, message: result.message };
  }, []);

  const removePromoCode = useCallback(() => {
    setCart(CartService.removePromoCode());
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
