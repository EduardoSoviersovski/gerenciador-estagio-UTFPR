import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { StudentRoutes } from '../pages/student/StudentRoutes';
import { AdvisorRoutes } from '../pages/supervisor/AdvisorRoutes';
import { PrivateRoute } from './PrivateRoute';
import { PATHS } from './paths';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { Unauthorized } from '../pages/auth/Unauthorized';

const RootRedirect = () => {
  const { user, signed, loading } = useAuth();

  if (loading) return null;

  if (!signed || !user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  const role = user.role.toLowerCase().trim();

  if (role === 'supervisor') {
    return <Navigate to={PATHS.ADVISOR.ROOT} replace />;
  }

  if (user.ra) {
    return <Navigate to={`${PATHS.ALUNO.ROOT}/${user.ra}`} replace />;
  }

  return <Navigate to={PATHS.ALUNO.ROOT} replace />;
};

export const AppRoutes = () => {
  const { signed, loading } = useAuth();

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.UNAUTHORIZED} element={<Unauthorized />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<RootRedirect />} />

          <Route
            path="/student/*"
            element={
              signed ? (
                <PrivateRoute roleRequired={['student', 'advisor']}>
                  <StudentRoutes />
                </PrivateRoute>
              ) : (
                <Navigate to={PATHS.LOGIN} replace />
              )
            }
          />

          <Route
            path="/advisor/*"
            element={
              signed ? (
                <PrivateRoute roleRequired="advisor">
                  <AdvisorRoutes />
                </PrivateRoute>
              ) : (
                <Navigate to={PATHS.LOGIN} replace />
              )
            }
          />
        </Route>

        <Route
          path="*"
          element={
            signed
              ? <Navigate to={PATHS.UNAUTHORIZED} replace />
              : <Navigate to={PATHS.LOGIN} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
