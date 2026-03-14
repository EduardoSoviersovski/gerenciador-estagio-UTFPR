import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService'; 

const AuthContext = createContext({
  signed: false,
  user: { name: '', email: '', role: '' }, 
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = async () => {
      try {
        const res = await authService.getCurrentUser();
        const userData = res;

        if (userData && userData.role) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          handleLogout();
        }
      } catch (error) {
        const storagedUser = localStorage.getItem('user');
        if (storagedUser && storagedUser !== "undefined") {
          setUser(JSON.parse(storagedUser));
        } else {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    syncAuth();
  }, []);

  const login = (authData) => {
    setUser(authData.user);
    localStorage.setItem('user', JSON.stringify(authData.user));
    if (authData.access_token) {
      localStorage.setItem('token', authData.access_token);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const logout = async () => {
    try {
      const logoutUrl = authService.getLoggoutUrl();
      window.location.href = logoutUrl;
    } catch (e) {
      console.log("Erro ao deslogar no servidor");
    } finally {
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      signed: !!user, 
      user, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);