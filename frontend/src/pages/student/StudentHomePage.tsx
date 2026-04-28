import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternshipData } from '../../hooks/useInternshipData';
import { UnregisteredStudentView } from '../../components/UnregisteredStudentView';
import { ProcessInfoCard } from '../../components/ProccessInfoCard';
import { FileText, Briefcase } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { PATHS } from '../../routes/paths';

export const StudentHomePage = () => {
  const { ra: raParams } = useParams<{ ra: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const effectiveRA = raParams || null;
  const { data, loading, error } = useInternshipData(effectiveRA);

  if (error === "UNAUTHORIZED") {
    return <Navigate to={PATHS.UNAUTHORIZED} replace />;
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <CircularProgress size={24} sx={{ color: '#000' }} />
      </div>
    );
  }

  const isSupervisor = user?.role === 'supervisor';
  const hasNoProcess = !effectiveRA || error === "NOT_FOUND" || !data;

  if (isSupervisor) {
    const isOwnerOfProcess = data?.process?.advisor_id === user?.google_id;

    if (hasNoProcess || !isOwnerOfProcess) {
      console.warn(`[Security] Supervisor ${user?.name} tentou acessar RA não vinculado: ${effectiveRA}`);
      return <Navigate to={PATHS.UNAUTHORIZED} replace />;
    }
  }

  const menuItems = [
    ...(effectiveRA && data ? [{
      label: 'Relatórios de Atividades',
      icon: FileText,
      path: 'reports',
      color: 'bg-blue-500'
    }] : []),
    {
      label: 'Documentação do Estágio',
      icon: Briefcase,
      path: effectiveRA ? 'documents' : '/student/documents',
      color: 'bg-indigo-500'
    },
  ];

  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

      {hasNoProcess && !isSupervisor && (
        <div className="scale-95 origin-top -mb-4">
          <UnregisteredStudentView
            userName={user?.name || 'Estudante'}
            ra={effectiveRA}
          />
        </div>
      )}

      {data && <ProcessInfoCard data={data} isSupervisor={isSupervisor} />}

      <div className={`flex w-full gap-4 ${hasNoProcess ? 'justify-center -mt-6' : ''}`}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 text-left overflow-hidden 
              ${hasNoProcess ? 'w-full max-w-sm' : 'flex-1'}
            `}
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${item.color}`} />
            <div className={`${item.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon size={20} />
            </div>
            <div className="pr-4">
              <h3 className="text-slate-800 font-bold text-sm mb-0.5 uppercase tracking-tight">
                {item.label}
              </h3>
              <p className="text-slate-400 text-[9px] font-medium uppercase tracking-widest leading-none">
                {hasNoProcess && item.path.includes('documents')
                  ? 'Apenas Download de Modelos'
                  : 'Acessar módulo completo'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};