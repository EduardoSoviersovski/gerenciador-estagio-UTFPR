import React from 'react';
import { LogOut, User, Bell, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BackButton } from './ui/BackButton';

interface MainHeaderProps {
  onLogout: () => void;
}

export const MainHeader = ({ onLogout }: MainHeaderProps) => {
  const { user } = useAuth();

  const roleLabels: Record<string, string> = {
    student: 'Estudante',
    supervisor: 'Orientador',
    admin: 'Administrador'
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[80] flex flex-col shadow-sm">
      <div className="h-16 bg-white border-b border-gray-100 px-8 flex items-center z-20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

          <div className="flex items-center left-0 gap-6 h-full">
            <BackButton />

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <span className="text-white font-black text-sm uppercase">S</span>
              </div>
              <div className="flex flex-col shrink-0">
                <h1 className="text-sm font-black text-gray-800 uppercase tracking-tighter leading-none">
                  Sisprae
                </h1>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">
                  UTFPR
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 h-full">
            <button className="text-gray-400 hover:text-blue-600 transition-colors relative p-2 rounded-full hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-100 shrink-0" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-800 leading-none">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider italic">
                  {user?.role ? roleLabels[user.role] : 'Acessando...'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 overflow-hidden shrink-0">
                  <User size={18} />
                </div>
                <button
                  onClick={onLogout}
                  className="ml-2 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group flex items-center gap-2"
                >
                  <span className="text-xs font-bold hidden md:block uppercase">Sair</span>
                  <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50/80 backdrop-blur-sm border-b border-red-100 py-1.5 px-8 flex justify-center items-center">
        <div className="flex items-center gap-2 max-w-7xl">
          <Info size={12} className="text-red-500" />
          <p className="text-[9px] font-bold text-red-800/70 uppercase tracking-widest text-center leading-none">
            Mantenha cópias locais dos seus arquivos para segurança em caso de indisponibilidade do sistema.
          </p>
        </div>
      </div>
    </header>
  );
};