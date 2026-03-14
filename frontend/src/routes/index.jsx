import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login} from '../pages/auth/Login';
import { StudentRoutes } from '../pages/student/StudentRoutes';
import { SupervisorRoutes } from '../pages/supervisor/SupervisorRoutes';
import { PrivateRoute } from './PrivateRoute';
import { PATHS } from './paths'; 

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path={PATHS.LOGIN} element={<Login/>} />

      <Route 
        path={`${PATHS.ALUNO.ROOT}/*`} 
        element={
          <PrivateRoute roleRequired="STUDENT">
            <StudentRoutes />
          </PrivateRoute>
        } 
      />

      <Route 
        path={`${PATHS.SUPERVISOR.ROOT}/*`} 
        element={
          <PrivateRoute roleRequired="SUPERVISOR">
            <SupervisorRoutes/>
          </PrivateRoute>
        } 
      />

      {/* Fallback: Se não encontrar a rota, volta para o Login */}
      <Route path="*" element={<Navigate to={PATHS.LOGIN} />} />
    </Routes>
  </BrowserRouter>
);