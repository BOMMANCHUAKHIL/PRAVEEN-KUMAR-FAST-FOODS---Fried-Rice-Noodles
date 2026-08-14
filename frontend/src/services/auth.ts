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
  // ✅ NEW: Login with phone + password
  loginWithPassword: (phone: string, password: string) => {
    return api.post<AuthResponse>('/api/auth/login', { phone, password });
  },

  // ✅ NEW: Register with phone + password
  register: (phone: string, password: string, name: string, email: string) => {
    return api.post<AuthResponse>('/api/auth/register', { phone, password, name, email });
  },

  // OTP methods (keep as is)
  sendOTP: (phone: string) => api.post('/api/auth/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => api.post<AuthResponse>('/api/auth/verify-otp', { phone, otp }),
  getProfile: () => api.get<UserResponse>('/api/auth/me'),
  updateProfile: (data: any) => api.put<UserResponse>('/api/auth/me', data),
};