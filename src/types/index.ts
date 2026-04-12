// ============================================================
// Product Types
// ============================================================
export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface ProductFeature {
  icon?: string;
  label: string;
  value?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  category: string;
  categorySlug: string;
  brand?: string;
  tags?: string[];
  variants?: ProductVariant[];
  features?: ProductFeature[];
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  stockQuantity?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt?: string;
}

// ============================================================
// Cart Types
// ============================================================
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  variantId?: string;
  size?: string;
  maxQuantity?: number;
  description?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode?: string;
}

// ============================================================
// Order Types
// ============================================================
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
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
}

export interface PaymentDetails {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  last4?: string;
  method?: 'card' | 'whatsapp';
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  shipping: ShippingAddress;
  payment: PaymentDetails;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingMethod: string;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// ============================================================
// User / Auth Types
// ============================================================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt?: string;
  role: 'admin' | 'customer';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================================
// Notification Types
// ============================================================
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// ============================================================
// WhatsApp Types
// ============================================================
export interface WhatsAppProduct {
  name: string;
  description?: string;
  image?: string;
  price?: string;
  quantity?: number;
}

// ============================================================
// API Response Types
// ============================================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================
// Promo / Coupon Types
// ============================================================
export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  description: string;
}

// ============================================================
// Filter / Sort Types
// ============================================================
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'rating';
  search?: string;
}

// ============================================================
// Review Types
// ============================================================
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  verified?: boolean;
}

// ============================================================
// Category Types
// ============================================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  children?: Category[];
}
