import apiClient, { getErrorMessage } from './apiClient';
import type {
  DashboardStats,
  AdminOrder,
  AdminUser,
  AdminProduct,
  AdminPromoCode,
  SalesReport,
} from '../admin/adminTypes';
import type { Category } from '../types';

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard
export async function getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
  try {
    const response = await apiClient.get<DashboardStats>('/admin/dashboard');
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// Orders
export async function getAdminOrders(params: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}): Promise<{ success: boolean; data?: PaginatedResponse<AdminOrder>; error?: string }> {
  try {
    const response = await apiClient.get<PaginatedResponse<AdminOrder>>('/admin/orders', { params });
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateOrderStatus(orderId: string, status: string, trackingNumber?: string): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.patch(`/orders/${orderId}/status`, { status, trackingNumber });
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// Users
export async function getAdminUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}): Promise<{ success: boolean; data?: PaginatedResponse<AdminUser>; error?: string }> {
  try {
    const response = await apiClient.get<PaginatedResponse<AdminUser>>('/admin/users', { params });
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateUserRole(userId: string, role: string): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.put(`/admin/users/${userId}/role`, { role });
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// Products
export async function getAdminProducts(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  inStock?: boolean;
  includeDeleted?: boolean;
}): Promise<{ success: boolean; data?: PaginatedResponse<AdminProduct>; error?: string }> {
  try {
    const response = await apiClient.get<PaginatedResponse<AdminProduct>>('/admin/products', { params });
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function createProduct(data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.post('/products', data);
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateProduct(id: string, data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.put(`/products/${id}`, data);
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.delete(`/products/${id}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// Categories
export async function getCategories(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
  try {
    const response = await apiClient.get<Category[]>('/categories');
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function createCategory(data: Record<string, unknown>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await apiClient.post('/categories', data);
    return { success: true, id: response.data?.id };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateCategory(id: string, data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.put(`/categories/${id}`, data);
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.delete(`/categories/${id}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// Promo Codes
export async function getAdminPromoCodes(): Promise<{ success: boolean; data?: AdminPromoCode[]; error?: string }> {
  try {
    const response = await apiClient.get<AdminPromoCode[]>('/admin/promo-codes');
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function createPromoCode(data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.post('/admin/promo-codes', data);
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updatePromoCode(code: string, data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.put(`/admin/promo-codes/${code}`, data);
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deletePromoCode(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    await apiClient.delete(`/admin/promo-codes/${code}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// Reports
export async function getSalesReport(startDate?: string, endDate?: string): Promise<{ success: boolean; data?: SalesReport; error?: string }> {
  try {
    const response = await apiClient.get<SalesReport>('/admin/reports/sales', {
      params: { startDate, endDate },
    });
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}
