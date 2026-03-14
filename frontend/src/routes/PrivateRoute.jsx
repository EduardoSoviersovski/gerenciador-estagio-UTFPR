import { useAuth } from "../contexts/AuthContext";
import { Navigate } from 'react-router-dom'; // ESTA LINHA É A QUE FALTA

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

  const userRole = user.role?.toUpperCase();
  const required = roleRequired?.toUpperCase();

  if (required && userRole !== required) {
    console.warn(`Acesso negado. Usuário é ${userRole}, mas a rota exige ${required}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};