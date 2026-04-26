import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { ActionMenu } from '../../components/ActionMenu';
import { useInternshipData } from '../../hooks/useInternshipData';
import { CircularProgress } from '@mui/material';
import { FileText, Building2, Calendar } from 'lucide-react';

export const StudentHomePage = () => {
  const { ra } = useParams<{ ra: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error } = useInternshipData(ra);

  const handleAction = (path: string) => {
    navigate(`/student/${ra}/${path}`);
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <CircularProgress />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen p-10 text-center">
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
        <h1 className="text-red-600 font-black uppercase tracking-tighter text-xl mb-2">Acesso Negado</h1>
        <p className="text-red-400 text-xs font-bold uppercase">{error}</p>

        <button
          onClick={() => {
            if (user?.role === 'supervisor') {
              navigate('/supervisor');
            } else {
              navigate('/student');
            }
          }}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
        >
          Voltar ao Painel Correto
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 space-y-6">

      {user?.role !== 'student' && (
        <div className="w-full bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Supervisor em Sessão</p>
            <h1 className="text-2xl font-black tracking-tight">{data.student.name}</h1>
            <p className="text-xs font-medium opacity-90">RA: {data.student.ra} • {data.process.company.name}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <p className="text-[10px] font-black uppercase tracking-widest">Status: {data.process.status}</p>
          </div>
        </div>
      )}

      {/* Cards de Info Rápida (Baseado no PlantUML) */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Empresa / Supervisor</p>
            <p className="text-sm font-bold text-slate-700">{data.process.company.name} • {data.process.company.supervisor}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Início / Horas Semanais</p>
            <p className="text-sm font-bold text-slate-700">{new Date(data.process.startDate).toLocaleDateString()} • {data.process.weeklyHours}h/semanais</p>
          </div>
        </div>
      </div>

      <ActionMenu actions={{
        onReports: () => handleAction('reports'),
        onDocuments: () => handleAction('documents'),
        onLog: () => { }
      }} />

      <div className="pt-4">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          SEI: {data.process.sei_number}
        </p>
      </div>
    </div>
  );
};