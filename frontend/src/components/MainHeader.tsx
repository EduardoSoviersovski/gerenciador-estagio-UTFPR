import React from 'react';
import { LogOut, Info } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import { BackButton } from './ui/BackButton';

interface MainHeaderProps {
  onLogout: () => void;
}

export const MainHeader = ({ onLogout }: MainHeaderProps) => {
  const { user } = useAuth();

  const roleLabels: Record<string, string> = {
    student: 'Estudante',
    advisor: 'Orientador',
    admin: 'Administrador'
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[80] flex flex-col shadow-sm">
      <div className="h-16 bg-white border-b border-gray-100 px-8 flex items-center z-20">
        {/* Adicionado 'relative' no container principal para segurar o logo no centro */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">

          {/* === LADO ESQUERDO === */}
          <div className="flex items-center left-0 gap-6 h-full z-10">
            <BackButton />

            <div className="flex flex-col shrink-0">
              <h1 className="text-lg font-black text-gray-800 uppercase tracking-tighter leading-none">
                Sisprae
              </h1>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">
                Gestão de Estágios
              </p>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <img
              src="/UtfprLogo.svg"
              alt="Logo UTFPR"
              className="w-30 h-30 object-contain"
            />
          </div>

          {/* === LADO DIREITO === */}
          <div className="flex items-center gap-6 h-full z-10">
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
                <button
                  onClick={onLogout}
                  className="ml-2 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group flex items-center cursor-pointer gap-2"
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