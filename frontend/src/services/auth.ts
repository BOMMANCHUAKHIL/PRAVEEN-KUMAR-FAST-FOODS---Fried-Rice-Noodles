import { api } from './api';

export interface UserResponse {
  id: string;
  phone: string;
  name: string;
  email: string;
  loyaltyPoints: number;
  referralCode: string;
  referredBy: string | null;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export const authService = {
  sendOTP: (phone: string) => api.post('/api/auth/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => api.post<AuthResponse>('/api/auth/verify-otp', { phone, otp }),
  register: (data: any) => api.post<AuthResponse>('/api/auth/register', data),
  getProfile: () => api.get<UserResponse>('/api/auth/me'),
  updateProfile: (data: any) => api.put<UserResponse>('/api/auth/me', data),
};