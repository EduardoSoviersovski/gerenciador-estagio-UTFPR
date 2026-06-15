import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { FormControl, Select, MenuItem } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useInternshipData } from '../../hooks/useInternshipData';
import { UnregisteredStudentView } from '../../components/UnregisteredStudentView';
import { ProcessInfoCard } from '../../components/ProcessInfoCard';
import { studentService } from '../../services/studentService';
import { FileText, Briefcase } from 'lucide-react';
import { PATHS } from '../../routes/paths';

const StudentHomeSkeleton = () => (
  <div className="p-6 space-y-4 max-w-5xl mx-auto w-full animate-pulse">
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-slate-50 pb-6">
        <div className="h-16 w-16 bg-slate-200 rounded-2xl shrink-0" />
        <div className="space-y-3 w-full">
          <div className="h-6 w-3/4 md:w-1/2 bg-slate-200 rounded-lg" />
          <div className="h-4 w-1/2 md:w-1/3 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-5 w-full bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col sm:flex-row w-full gap-4">
      {[1, 2].map(i => (
        <div key={i} className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-[132px] flex flex-col justify-start">
          <div className="h-10 w-10 bg-slate-200 rounded-2xl mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
            <div className="h-2 w-1/2 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const StudentHomePage = () => {
  const { processId } = useParams<{ processId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myProcesses, setMyProcesses] = useState<any[]>([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(!processId);
  const [hasCheckedDiscovery, setHasCheckedDiscovery] = useState(false);

  const safeRole = user?.role?.toUpperCase() || '';
  const isAdvisor = safeRole === 'ADVISOR';
  const isAdmin = safeRole === 'ADMIN';
  const isStudent = safeRole === 'STUDENT';
  console.log(processId);


  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const cleanDate = dateString.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  useEffect(() => {
    const handleDiscovery = async () => {
      if (processId || hasCheckedDiscovery || !user) return;

      if (isStudent) {
        try {
          setDiscoveryLoading(true);
          const processes = await studentService.getMyProcesses();
          setMyProcesses(processes);

          if (processes && processes.length > 0) {
            const firstProcessId = processes[0].id;
            navigate(`/student/process/${firstProcessId}`, { replace: true });
          } else {
            setDiscoveryLoading(false);
            setHasCheckedDiscovery(true);
          }
        } catch (err) {
          setDiscoveryLoading(false);
          setHasCheckedDiscovery(true);
        }
      } else {
        navigate(PATHS.UNAUTHORIZED, { replace: true });
      }
    };

    handleDiscovery();
  }, [processId, isStudent, user, navigate, hasCheckedDiscovery]);

  useEffect(() => {
    const fetchListForDropdown = async () => {
      if (processId && isStudent && myProcesses.length === 0) {
        try {
          const processes = await studentService.getMyProcesses();
          setMyProcesses(processes);
        } catch (err) {
          console.error("Erro ao carregar lista de processos para o seletor", err);
        }
      }
    };
    fetchListForDropdown();
  }, [processId, isStudent, myProcesses.length]);

  const { data, loading: dataLoading, error } = useInternshipData(processId);

  if (error === "UNAUTHORIZED") {
    return <Navigate to={PATHS.UNAUTHORIZED} replace />;
  }

  const isInitialLoading = discoveryLoading || (processId && dataLoading && !data);

  if (isInitialLoading) {
    return <StudentHomeSkeleton />;
  }

  const hasNoProcess = !processId || error === "NOT_FOUND" || !data;

  if (isAdvisor && data) {
    const isOwnerOfProcess = data?.process?.process?.advisor_google_id === user?.google_id;
    if ((hasNoProcess || !isOwnerOfProcess) && !isAdmin) {
      return <Navigate to={PATHS.UNAUTHORIZED} replace />;
    }
  }

  const menuItems = [
    ...(processId && data ? [{
      label: 'Relatórios de Atividades',
      icon: FileText,
      path: `/student/process/${processId}/reports`,
      color: 'bg-blue-500'
    }] : []),
    ...(!(hasNoProcess && isAdmin) ? [{
      label: 'Documentação do Estágio',
      icon: Briefcase,
      path: processId ? `/student/process/${processId}/documents` : '/student/documents',
      color: 'bg-indigo-500'
    }] : []),
  ];

  const shouldShowMenu = menuItems.length > 0;

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* O Dropdown fica FORA do bloco de animação de loading, garantindo que ele NUNCA pisque */}
      {isStudent && myProcesses.length > 1 && processId && (
        <div className="flex justify-start w-full mb-6">
          <div className="flex flex-col w-full max-w-[260px] text-left space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 text-slate-400">
              Processo Selecionado
            </label>

            <div className="flex items-center gap-2.5 w-full px-3.5 bg-slate-50 border-[2px] border-slate-200 rounded-xl transition-all group hover:border-blue-500 focus-within:border-blue-500 focus-within:bg-white cursor-pointer">
              <Briefcase size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors duration-300 shrink-0" />

              <FormControl fullWidth>
                <Select
                  id="process-select"
                  value={processId || ''}
                  onChange={(e) => navigate(`/student/process/${e.target.value}`)}
                  displayEmpty
                  MenuProps={{ disableScrollLock: true }}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': {
                      padding: '10px 0',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#334155',
                    }
                  }}
                >
                  {myProcesses.map((p) => (
                    <MenuItem
                      key={p.id}
                      value={p.id}
                      sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}
                    >
                      {p.company_name || `Processo #${p.id}`} - {p.process_status} - {formatDate(p.start_date)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-4 transition-all duration-500 ${dataLoading && data ? 'opacity-40 blur-[1px] pointer-events-none scale-[0.99]' : 'opacity-100 blur-0 scale-100'}`}>

        {hasNoProcess && !isAdvisor && (
          <div className="scale-95 origin-top -mb-4">
            <UnregisteredStudentView
              userName={user?.name || 'Estudante'}
              ra={data?.process?.student?.ra || null}
            />
          </div>
        )}

        {data && (
          <ProcessInfoCard
            data={data}
            isAdvisor={isAdvisor}
            isAdmin={isAdmin}
          />
        )}

        {shouldShowMenu && (
          <div className={`flex flex-col sm:flex-row w-full gap-4 ${hasNoProcess ? 'justify-center -mt-6' : ''}`}>
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
        )}
      </div>
    </div>
  );
};