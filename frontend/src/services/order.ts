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
  create: (data: CreateOrderData) => api.post('/orders', data),
getAll: () => api.get('/orders'),
getById: (id: string) => api.get(`/orders/${id}`),
getMyOrders: () => api.get('/orders/my-orders'),
updateStatus: (id: string, status: string) =>
  api.put(`/orders/${id}/status`, { status }),
cancel: (id: string) =>
  api.put(`/orders/${id}/cancel`),
requestLiveVideo: (id: string) =>
  api.post(`/orders/${id}/live-video-request`),
};