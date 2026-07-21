import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, ShieldCheck } from 'lucide-react';
import { AdvisorManagementModal } from '../../components/modals/AdvisorManagementModal';

export const AdminManagementPage: React.FC = () => {
    const navigate = useNavigate();

    const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);

    const menuItems = [
        {
            label: 'Templates de Documentos',
            description: 'Gerencie os modelos de arquivos usados para gerar termos e relatórios.',
            icon: FileText,
            color: 'bg-blue-500',
            action: () => navigate('/admin/management/templates')
        },
        {
            label: 'Gestão de Orientadores',
            description: 'Edite informações de contato e departamento dos orientadores cadastrados.',
            icon: Users,
            color: 'bg-emerald-500',
            action: () => setIsAdvisorModalOpen(true)
        }
    ];

    return (
        <div className="p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                        Configurações do Sistema
                    </span>
                </div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                    Gestão Global
                </h1>
                <p className="text-slate-500 text-sm font-medium max-w-2xl">
                    Gerencie os parâmetros que regem os documentos e usuários de toda a universidade.
                </p>
            </div>

            <div className="flex w-full gap-6 flex-col md:flex-row">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.action}
                        className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 text-left overflow-hidden flex-1"
                    >
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${item.color}`} />

                        <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon size={24} />
                        </div>

                        <div className="pr-4">
                            <h3 className="text-slate-800 font-black text-sm mb-2 uppercase tracking-tight leading-none">
                                {item.label}
                            </h3>
                            <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <AdvisorManagementModal
                isOpen={isAdvisorModalOpen}
                onClose={() => setIsAdvisorModalOpen(false)}
            />
        </div>
    );
};