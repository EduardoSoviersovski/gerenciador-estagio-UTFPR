import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login} from '../pages/auth/Login';
import { StudentRoutes } from '../pages/student/StudentRoutes';
import { SupervisorRoutes } from '../pages/supervisor/SupervisorRoutes';
import { PrivateRoute } from './PrivateRoute';
import { PATHS } from './paths'; 
import { AppLayout } from '../components/AppLayout';

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path={PATHS.LOGIN} element={<Login/>} />

      <Route element={<AppLayout />}>
        <Route 
          path={`${PATHS.ALUNO.ROOT}/*`} 
          element={
            <PrivateRoute roleRequired="student">
              <StudentRoutes />
            </PrivateRoute>
          } 
        />

        <Route 
          path={`${PATHS.SUPERVISOR.ROOT}/*`} 
          element={
            <PrivateRoute roleRequired="supervisor">
              <SupervisorRoutes/>
            </PrivateRoute>
          } 
        />
      </Route>

      <Route path="*" element={<Navigate to={PATHS.LOGIN} />} />
    </Routes>
  </BrowserRouter>
);