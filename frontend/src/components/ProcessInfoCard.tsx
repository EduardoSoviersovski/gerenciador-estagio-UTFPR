import React, { useState } from 'react';
import {
    FileText,
    CheckCheck,
    CheckCircle,
    Building2,
    UserCircle,
    Hash,
    Calendar,
    Briefcase,
    GraduationCap,
    ChevronDown,
    ChevronUp,
    Mail,
    CalendarCheck,
    Clock,
    FileWarning,
    FileSignature,
    AlertCircle,
    Activity,
    UserCog
} from 'lucide-react';
import { InfoField } from './ui/InfoField';
import { SmartTooltipCell } from './ui/SmartTooltipCell';
import { StudentProcessResponse } from '../services/studentService';
import { StatusBadge } from './ui/StatusBadge'; import { InternshipStatus } from '../types';

interface ProcessInfoCardProps {
    data: StudentProcessResponse;
    isAdvisor: boolean;
    isAdmin?: boolean;
}

export const ProcessInfoCard = ({ data, isAdvisor, isAdmin }: ProcessInfoCardProps) => {
    const [isOpen, setIsOpen] = useState(true);

    const { student, process: internshipProcess } = data.process;
    const { workload } = data;

    const renderValue = (value: string | undefined | null) => (
        <SmartTooltipCell>{value || 'Não informado'}</SmartTooltipCell>
    );

    const formatDate = (dateStr: string | undefined | null) => {
        if (!dateStr) return 'Não definida';
        const parts = dateStr.split('T')[0].split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const getStatusConfig = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PENDING_DOCS':
                return { label: 'Documentação Pendente', icon: FileWarning, color: 'text-amber-500' };
            case 'PENDING_DIEEM':
                return { label: 'Aguardando Assinatura', icon: FileSignature, color: 'text-purple-500' };
            case 'PENDING_CORRECTIONS':
                return { label: 'Correções Pendentes', icon: AlertCircle, color: 'text-red-500' };
            case 'ACTIVE':
                return { label: 'Em Andamento', icon: CheckCheck, color: 'text-emerald-500' };
            case 'COMPLETED':
                return { label: 'Processo Concluído', icon: CheckCircle, color: 'text-blue-500' };
            case 'PENDING_ADVISOR':
                return { label: 'Ação Orientador', icon: UserCog, color: 'text-orange-500' };
            default:
                return { label: status || 'Desconhecido', icon: Clock, color: 'text-slate-500' };
        }
    };

    const statusConfig = getStatusConfig(internshipProcess.status || '');

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6 w-full transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between hover:bg-slate-100 cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-left">
                        Informações do Processo: {internshipProcess.sei_number}
                    </h2>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div
                    className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10"
                    style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
                >
                    <InfoField label="Protocolo (SEI)" value={renderValue(internshipProcess.sei_number)} icon={FileText} />

                    <InfoField
                        label="Status"
                        value={<StatusBadge status={internshipProcess.status as InternshipStatus} />}
                        icon={statusConfig.icon}
                        iconColor={statusConfig.color}
                    />

                    {(isAdmin || isAdvisor) && (
                        <>
                            <InfoField label="Aluno" value={renderValue(student.name)} icon={UserCircle} />
                            <InfoField label="E-mail do Aluno" value={renderValue(student.email)} icon={Mail} iconColor="text-indigo-500" />
                            <InfoField label="RA do Aluno" value={renderValue(student.ra)} icon={Hash} iconColor="text-slate-500" />
                            <InfoField label="Curso" value={renderValue(student.course)} icon={GraduationCap} />
                        </>
                    )}

                    <InfoField
                        label="Início do Estágio"
                        value={formatDate(internshipProcess.start_date)}
                        icon={Calendar}
                    />

                    <InfoField
                        label="Previsão de Fim"
                        value={formatDate(workload?.estimated_end_date)}
                        icon={CalendarCheck}
                        iconColor="text-orange-500"
                    />

                    <InfoField
                        label="Tipo de Estágio"
                        value={internshipProcess.type === 'NON_MANDATORY' ? 'Não Obrigatório' : 'Obrigatório'}
                        icon={Briefcase}
                    />

                    {(isAdmin || !isAdvisor) && (
                        <>
                            <InfoField label="Professor Orientador" value={renderValue(internshipProcess.advisor_name)} icon={UserCircle} iconColor="text-indigo-500" />
                            <InfoField label="E-mail do Orientador" value={renderValue(internshipProcess.advisor_email)} icon={Mail} iconColor="text-indigo-500" />
                        </>
                    )}

                    <InfoField label="Empresa" value={renderValue(internshipProcess.company.name)} icon={Building2} />
                    <InfoField label="Supervisor (Empresa)" value={renderValue(internshipProcess.company.supervisor)} icon={UserCircle} iconColor="text-blue-600" />
                    <InfoField label="E-mail do Supervisor" value={renderValue(internshipProcess.company.supervisor_email)} icon={Mail} iconColor="text-blue-600" />

                    {(!isAdmin && !isAdvisor) && (
                        <InfoField label="Curso" value={renderValue(student.course)} icon={GraduationCap} />
                    )}
                </div>
            </div>
        </div>
    );
};