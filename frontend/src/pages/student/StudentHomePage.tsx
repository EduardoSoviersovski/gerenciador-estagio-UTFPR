import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternshipData } from '../../hooks/useInternshipData';
import { ProcessInfoCard } from '../../components/ProcessInfoCard';
import { FileText, Clock, Briefcase } from 'lucide-react';
import { CircularProgress } from '@mui/material';

export const StudentHomePage = () => {
  const { ra } = useParams<{ ra: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error } = useInternshipData(ra);

  const isSupervisor = user?.role === 'supervisor';

  if (loading) return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <CircularProgress size={24} sx={{ color: '#000' }} />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] p-10 text-center">
      <div className="bg-red-50 p-8 rounded-3xl border border-red-100 max-w-md">
        <h1 className="text-red-600 font-black uppercase tracking-tighter text-xl mb-2">Acesso Negado</h1>
        <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
        <button
          onClick={() => navigate(isSupervisor ? '/supervisor' : '/student')}
          className="mt-8 px-8 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 cursor-pointer transition-all shadow-lg shadow-red-200"
        >
          Voltar ao Painel
        </button>
      </div>
    </div>
  );

  const menuItems = [
    { label: 'Relatórios de Atividades', icon: FileText, path: 'reports', color: 'bg-blue-500' },
    { label: 'Documentação do Estágio', icon: Briefcase, path: 'documents', color: 'bg-indigo-500' },
    // { label: 'Registro de Frequência', icon: Clock, path: 'logs', color: 'bg-slate-800' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ProcessInfoCard data={data} isSupervisor={isSupervisor} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 text-left overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${item.color}`} />
            <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <h3 className="text-slate-800 font-bold text-sm mb-1">{item.label}</h3>
            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Acessar módulo</p>
          </button>
        ))}
      </div>

      {/* <div className="mt-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Última atualização: Hoje, 14:20</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};