import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { authService } from '../services/authService';

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  ra?: string | null;
  google_id?: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  syncAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAuth = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();

      if (userData) {
        const enhancedUser: User = { ...userData };
        const email = userData.email.toLowerCase().trim();

        if (email === "pedper@alunos.utfpr.edu.br") {
          enhancedUser.ra = "1561464";
          // enhancedUser.ra = null;
        }


        setUser(enhancedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncAuth();
  }, [syncAuth]);

  const logout = useCallback(async () => {
    try {
      const logoutUrl = authService.getLoggoutUrl();
      setUser(null);
      const destination = logoutUrl || '/login';
      window.location.replace(destination);
    } catch (e) {
      setUser(null);
      window.location.replace('/login');
    }
  }, []);

  const contextValue = useMemo(() => ({
    signed: !!user,
    user,
    loading,
    logout,
    syncAuth
  }), [user, loading, logout, syncAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);