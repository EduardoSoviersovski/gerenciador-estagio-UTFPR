import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminHomePage } from './AdminHomePage';
import { AdminManagementPage } from './AdminManagementPage';
import { AdminTemplatesPage } from './AdminTemplatesPage';
import { useAuth } from '../../contexts/AuthContext';
import { PATHS } from '../../routes/paths';

export const AdminRoutes = () => {
    const { user, loading } = useAuth();

    return (
        <Routes>
            <Route index element={<AdminHomePage />} />
            <Route path="management">
                <Route index element={<AdminManagementPage />} />
                <Route path="templates" element={<AdminTemplatesPage />} />
            </Route>
            <Route
                path="*"
                element={user ? <Navigate to={PATHS.UNAUTHORIZED} replace /> : <Navigate to={PATHS.LOGIN} replace />}
            />
        </Routes>
    );
};
