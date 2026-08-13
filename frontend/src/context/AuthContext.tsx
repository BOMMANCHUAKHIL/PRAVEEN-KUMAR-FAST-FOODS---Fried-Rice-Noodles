import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  createdAt?: string;
}

interface AuthContextType {
  isAdmin: boolean;
  adminToken: string | null;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
  isAuthenticated: boolean;
  user: User | null;
  customerToken: string | null;
  customerLogin: (token: string, userData: User) => void;
  customerLogout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [customerToken, setCustomerToken] = useState<string | null>(localStorage.getItem('customerToken'));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const adminLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
  };

  const customerLogin = (token: string, userData: User) => {
    localStorage.setItem('customerToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setCustomerToken(token);
    setUser(userData);
  };

  const customerLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('userData');
    setCustomerToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('userData', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{
      isAdmin: !!adminToken,
      adminToken,
      adminLogin,
      adminLogout,
      isAuthenticated: !!customerToken && !!user,
      user,
      customerToken,
      customerLogin,
      customerLogout,
      updateUser,
      isLoading,
      setIsLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};