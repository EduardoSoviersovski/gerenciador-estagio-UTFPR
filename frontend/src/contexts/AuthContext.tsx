import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
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
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();

        if (userData) {
          const enhancedUser: User = { ...userData };

          if (userData.email === "pedper@alunos.utfpr.edu.br") {
            enhancedUser.ra = "1561464";
            enhancedUser.role = "student";
          }

          if (userData.email === "edusov@alunos.utfpr.edu.br") {
            enhancedUser.role = "supervisor";
            enhancedUser.ra = null;
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
    };

    syncAuth();
  }, []);

  const logout = async () => {
    setUser(null);
    try {
      const logoutUrl = authService.getLoggoutUrl();
      window.location.href = logoutUrl;
    } catch (e) {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);