import { useAuth } from "../contexts/AuthContext";
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children, roleRequired }) => {
  const { user, signed, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verificando credenciais...</p>
      </div>
    );
  }

  if (!signed || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role;
  const required = roleRequired;
  debugger;

  if (required && userRole !== required) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};