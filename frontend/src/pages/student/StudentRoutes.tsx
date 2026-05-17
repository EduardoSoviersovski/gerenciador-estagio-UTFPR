import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentHomePage } from './StudentHomePage';
import { Documents } from './Documents';
import { Reports } from './Reports';
import { useAuth } from "../../contexts/AuthContext";
import { PATHS } from '../../routes/paths';

export const StudentRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  const role = String(user?.role).toLowerCase();

  return (
    <Routes>
      <Route
        path="/"
        element={
          role === 'advisor'
            ? <Navigate to="/advisor" replace />
            : role === 'admin'
              ? <Navigate to="/admin" replace />
              : user?.ra
                ? <Navigate to={`${user.ra}`} replace />
                : <StudentHomePage />
        }
      />

      <Route path="documents" element={<Documents readOnly={true} />} />

      <Route path=":ra">
        <Route index element={<StudentHomePage />} />
        <Route path="documents" element={<Documents />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route
        path="*"
        element={user ? <Navigate to={PATHS.UNAUTHORIZED} replace /> : <Navigate to={PATHS.LOGIN} replace />}
      />
    </Routes>
  );
};
