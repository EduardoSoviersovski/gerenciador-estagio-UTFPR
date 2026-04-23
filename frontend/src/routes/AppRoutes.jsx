import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { StudentRoutes } from '../pages/student/StudentRoutes';
import { SupervisorRoutes } from '../pages/supervisor/SupervisorRoutes';
import { PrivateRoute } from './PrivateRoute';
import { PATHS } from './paths';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../contexts/AuthContext';


const RootRedirect = () => {
  const { user, signed } = useAuth();

  if (!signed || !user) return <Navigate to={PATHS.LOGIN} replace />;

  const role = user.role.toLowerCase();

  if (role === 'supervisor') {
    return <Navigate to="/supervisor" replace />;
  }

  return <Navigate to="/student" replace />;
};

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path={PATHS.LOGIN} element={<Login />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<RootRedirect />} />

        <Route
          path="/student/*"
          element={
            <PrivateRoute roleRequired={['student', 'supervisor']}>
              <StudentRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/supervisor/*"
          element={
            <PrivateRoute roleRequired="supervisor">
              <SupervisorRoutes />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  </BrowserRouter>
);