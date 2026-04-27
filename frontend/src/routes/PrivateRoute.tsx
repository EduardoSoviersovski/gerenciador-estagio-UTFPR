import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PATHS } from './paths';
import { CircularProgress } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
  roleRequired?: string | string[];
}

export const PrivateRoute = ({ children, roleRequired }: PrivateRouteProps) => {
  const { user, signed, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <CircularProgress />
    </div>
  );

  if (!signed || !user) {
    return null;
  }

  if (roleRequired) {
    const roles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];

    const userRole = user.role.toLowerCase().trim();
    const hasPermission = roles.some(r => r.toLowerCase().trim() === userRole);

    if (!hasPermission) {
      console.warn('[PrivateRoute] Acesso negado: Permissão insuficiente');
      return <Navigate to={PATHS.UNAUTHORIZED} replace />;
    }
  }

  return <>{children}</>;
};