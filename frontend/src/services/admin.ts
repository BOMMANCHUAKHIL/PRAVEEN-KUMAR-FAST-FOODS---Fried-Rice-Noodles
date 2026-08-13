import { api } from './api';

export interface ProductVariant {
  weight: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  variants: ProductVariant[];
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  items: any[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  email: string;
  loyaltyPoints: number;
  referralCode: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  todayOrders: number;
  revenueChange: number;
  ordersChange: number;
}

export interface ProductCreate {
  name: string;
  description: string;
  category: string;
  image_url?: string;
  variants: ProductVariant[];
  is_available: boolean;
  is_featured?: boolean;
  tags?: string[];
}

export const adminService = {
  // =========================
  // Dashboard
  // =========================

  getStats: () =>
    api.get<DashboardStats>('/api/admin/stats'),

  getRecentOrders: () =>
    api.get<Order[]>('/api/admin/orders/recent'),

  // =========================
  // Products
  // =========================

  getProducts: () =>
    api.get<Product[]>('/api/products'),

  getProduct: (id: string) =>
    api.get<Product>(`/api/products/${id}`),

  createProduct: (data: ProductCreate) =>
    api.post('/api/products', data),

  updateProduct: (id: string, data: Partial<ProductCreate>) =>
    api.put(`/api/products/${id}`, data),

  deleteProduct: (id: string) =>
    api.delete(`/api/products/${id}`),

  // =========================
  // Orders
  // =========================

  getOrders: (params?: any) =>
    api.get<Order[]>('/api/admin/orders', { params }),

  getOrder: (id: string) =>
    api.get<Order>(`/api/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/api/admin/orders/${id}/status`, { status }),

  updateOrderPayment: (id: string, status: string) =>
    api.put(`/api/admin/orders/${id}/payment`, { status }),

  // =========================
  // Customers
  // =========================

  getCustomers: () =>
    api.get<Customer[]>('/api/admin/customers'),

  getCustomer: (id: string) =>
    api.get<Customer>(`/api/admin/customers/${id}`),

  // =========================
  // Categories
  // =========================

  getCategories: () =>
    api.get<Category[]>('/api/admin/categories'),

  createCategory: (data: Partial<Category>) =>
    api.post<Category>('/api/admin/categories', data),

  updateCategory: (id: string, data: Partial<Category>) =>
    api.put<Category>(`/api/admin/categories/${id}`, data),

  deleteCategory: (id: string) =>
    api.delete(`/api/admin/categories/${id}`),

  // =========================
  // Coupons
  // =========================

  getCoupons: () =>
    api.get<Coupon[]>('/api/admin/coupons'),

  createCoupon: (data: Partial<Coupon>) =>
    api.post<Coupon>('/api/admin/coupons', data),

  updateCoupon: (id: string, data: Partial<Coupon>) =>
    api.put<Coupon>(`/api/admin/coupons/${id}`, data),

  deleteCoupon: (id: string) =>
    api.delete(`/api/admin/coupons/${id}`),

  // =========================
  // Settings
  // =========================

  getSettings: () =>
    api.get('/api/admin/settings'),

  updateSettings: (data: any) =>
    api.put('/api/admin/settings', data),
};