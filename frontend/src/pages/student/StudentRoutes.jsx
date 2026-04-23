import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentHomePage } from './StudentHomePage';
import { Reports } from '../common/Reports';
import { Documents } from './Documents';
import { Logs } from './Logs';
import { useAuth } from "../../contexts/AuthContext";

export const StudentRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user?.role === 'student' && user?.ra
            ? <Navigate to={`${user.ra}`} replace />
            : <Navigate to="/unauthorized" replace />
        }
      />

      <Route path=":ra">
        <Route index element={<StudentHomePage />} />
        <Route path="reports" element={<Reports />} />
        <Route path="documents" element={<Documents />} />
        <Route path="logs" element={<Logs />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};