import React, { useState } from 'react';
import {
    FileText,
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
    CalendarCheck
} from 'lucide-react';
import { InfoField } from './ui/InfoField';

interface ProcessInfoCardProps {
    data: {
        student: {
            name: string;
            ra: string;
            email: string;
            course: string;
        };
        process: {
            sei_number: string;
            status: string;
            startDate: string;
            type: string;
            advisor_name: string;
            advisor_email: string;
            company: {
                name: string;
                supervisor: string;
                supervisor_email: string;
            };
        };
    };
    isAdvisor: boolean;
}

export const ProcessInfoCard = ({ data, isAdvisor }: ProcessInfoCardProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const { student, process } = data;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6 w-full transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between hover:bg-slate-100 cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Informações do Processo: {process.sei_number}
                    </h2>
                </div>
                {isOpen ? (
                    <ChevronUp size={18} className="text-slate-400 animate-in fade-in duration-300" />
                ) : (
                    <ChevronDown size={18} className="text-slate-400 animate-in fade-in duration-300" />
                )}
            </button>

            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">

                    <InfoField label="Protocolo (SEI)" value={process.sei_number} icon={FileText} />

                    {isAdvisor && (
                        <>
                            <InfoField label="Aluno" value={student.name} icon={UserCircle} />
                            <InfoField label="E-mail do Aluno" value={student.email} icon={Mail} iconColor="text-indigo-500" />
                            <InfoField label="RA do Aluno" value={student.ra} icon={Hash} iconColor="text-slate-500" />
                        </>
                    )}

                    <InfoField
                        label="Status"
                        value={process.status === 'ACTIVE' ? 'Ativo' : process.status}
                        icon={CheckCircle}
                        iconColor="text-emerald-500"
                        badge={true}
                    />

                    <InfoField
                        label="Início do Estágio"
                        value={new Date(process.startDate).toLocaleDateString('pt-BR')}
                        icon={Calendar}
                    />

                    <InfoField
                        label="Previsão de Fim"
                        value="20/12/2026"
                        icon={CalendarCheck}
                        iconColor="text-orange-500"
                    />

                    {!isAdvisor && (
                        <>
                            <InfoField label="Professor Orientador" value={process.advisor_name} icon={UserCircle} iconColor="text-indigo-500" />
                            <InfoField label="E-mail do Orientador" value={process.advisor_email} icon={Mail} iconColor="text-indigo-500" />
                        </>
                    )}

                    <InfoField label="Supervisor (Empresa)" value={process.company.supervisor} icon={UserCircle} iconColor="text-blue-600" />
                    <InfoField label="E-mail do Supervisor" value={process.company.supervisor_email} icon={Mail} iconColor="text-blue-600" />
                    <InfoField label="Empresa" value={process.company.name} icon={Building2} />

                    <InfoField
                        label="Tipo de Estágio"
                        value={process.type === 'NON_MANDATORY' ? 'Não Obrigatório' : 'Obrigatório'}
                        icon={Briefcase}
                    />
                    <InfoField label="Curso" value={student.course} icon={GraduationCap} />

                </div>
            </div>
        </div>
    );
};