import { api } from './api';
import { Address } from '../components/AddressForm';

export interface OrderItem {
  productId: string;
  variant: string;
  quantity: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  deliveryAddress: Address;
  paymentMethod: string;
  liveVideoRequested: boolean;
  totalAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentStatus: string;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  liveVideoRequested: boolean;
  liveVideoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  create: (data: CreateOrderData) =>
    api.post('/api/orders', data),

  getMyOrders: () =>
    api.get('/api/orders'),

  getAll: () =>
    api.get('/api/orders/all'),

  getById: (id: string) =>
    api.get(`/api/orders/${id}`),

  updateStatus: (
    id: string,
    status: string
  ) =>
    api.put(
      `/api/orders/${id}/status`,
      { status }
    ),
};