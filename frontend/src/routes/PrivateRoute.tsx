import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
  roleRequired?: string | string[];
}

export const PrivateRoute = ({ children, roleRequired }: PrivateRouteProps) => {
  const { user, signed, loading } = useAuth();
  const location = useLocation();
  console.log(user);

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <CircularProgress />
    </div>
  );


  if (!signed || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired) {
    const roles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
    const hasPermission = roles.some(role =>
      role.toLowerCase() === user.role.toLowerCase()
    );

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};