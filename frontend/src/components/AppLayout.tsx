import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MainHeader } from './MainHeader';
import { PATHS } from '../routes/paths';
import { useAuth } from "../contexts/AuthContext";

export const AppLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MainHeader onLogout={handleLogout} />

      <main className="flex-1 pt-24 pb-12 w-full flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-8">
          <Outlet />
        </div>
      </main>

      <footer className="py-8 text-center text-slate-300 text-[10px] font-medium uppercase tracking-[0.2em] shrink-0">
        UTFPR • Sisprae • {new Date().getFullYear()}
      </footer>
    </div>
  );
};