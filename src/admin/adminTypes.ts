// Admin-specific types

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  revenueThisMonth: number;
  topProducts: TopProduct[];
  lowStockProducts: LowStockProduct[];
}

export interface TopProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stockQuantity: number;
  inStock: boolean;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  orderCount: number;
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  categoryName: string;
  brand?: string;
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  rating?: number;
  reviewCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminPromoCode {
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderValue?: number;
  maxUsageCount: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  dailySales: DailySale[];
  topProducts: ProductSales[];
}

export interface DailySale {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface ProductSales {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}
