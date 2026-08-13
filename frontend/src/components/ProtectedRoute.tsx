import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAdmin, isAuthenticated } = useAuth();

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}