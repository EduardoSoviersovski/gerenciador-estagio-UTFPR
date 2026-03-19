import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({
  signed: false,
  user: { name: '', email: '', role: '' },
  loading: true,
  logout: () => { },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = async () => {
      try {
        const res = await authService.getCurrentUser();
        const userData = res;

        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncAuth();
  }, []);

  const logout = async () => {
    setUser(null);

    try {
      const logoutUrl = authService.getLoggoutUrl();
      window.location.href = logoutUrl;
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      signed: !!user,
      user,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);