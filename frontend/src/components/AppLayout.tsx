import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MainHeader } from './MainHeader';
import { PATHS } from '../routes/paths';
import { useAuth } from '../contexts/AuthContext';

export const AppLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <MainHeader onLogout={handleLogout} />

      <main className="flex-1 pt-16 w-full">
        <div className="max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>

      <footer className="py-8 text-center text-gray-300 text-[10px] font-medium uppercase tracking-[0.2em]">
        UTFPR • Sisprae • {new Date().getFullYear()}
      </footer>
    </div>
  );
};