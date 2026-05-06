import React from 'react';
import { X, CheckCircle2, ArrowRight, User, GraduationCap, Building2, FileText } from 'lucide-react';

interface Change {
    fieldLabel: string;
    from: any;
    to: any;
}

interface GroupedChanges {
    aluno: Change[];
    orientador: Change[];
    empresa: Change[];
    processo: Change[];
}

interface ProcessReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    groupedChanges: GroupedChanges;
    isEdit: boolean;
}

const formatValue = (value: any) => {
    if (value === 'MANDATORY') return 'Obrigatório';
    if (value === 'NON_MANDATORY') return 'Não Obrigatório';
    if (value === null || value === undefined || value === '') return 'Vazio';

    if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR');
    }

    return String(value);
};

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
        <Icon size={16} className="text-blue-500" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
    </div>
);

export const ProcessReviewModal = ({ isOpen, onClose, onConfirm, groupedChanges, isEdit }: ProcessReviewModalProps) => {
    if (!isOpen) return null;

    const sections = [
        { id: 'aluno', title: 'Dados do Aluno', icon: User, data: groupedChanges.aluno },
        { id: 'orientador', title: 'Dados do Orientador', icon: GraduationCap, data: groupedChanges.orientador },
        { id: 'empresa', title: 'Dados da Empresa', icon: Building2, data: groupedChanges.empresa },
        { id: 'processo', title: 'Dados do Processo', icon: FileText, data: groupedChanges.processo },
    ];

    return (
        <div className="fixed inset-0 z-[1100] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 text-left">
            <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">

                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl text-blue-600 shadow-sm shadow-blue-100">
                            <CheckCircle2 size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">
                            {isEdit ? 'Revisar Alterações' : 'Conferir Novo Processo'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-blue-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
                    {sections.map(section => section.data.length > 0 && (
                        <div key={section.id} className="animate-in slide-in-from-bottom-2 duration-500">
                            <SectionHeader icon={section.icon} title={section.title} />
                            <div className="grid grid-cols-1 gap-3">
                                {section.data.map((change, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-blue-200 transition-all">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                            {change.fieldLabel}
                                        </p>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {isEdit && change.from !== undefined && (
                                                <>
                                                    <span className="text-sm text-slate-400 line-through opacity-60 italic">
                                                        {formatValue(change.from)}
                                                    </span>
                                                    <ArrowRight size={14} className="text-blue-400" />
                                                </>
                                            )}
                                            <span className="text-sm font-bold text-slate-800">
                                                {formatValue(change.to)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                    <button onClick={onClose} className="cursor-pointer px-6 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                        Voltar
                    </button>
                    <button onClick={onConfirm} className="cursor-pointer px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                        {isEdit ? 'Salvar Alterações' : 'Confirmar e Criar'}
                    </button>
                </div>
            </div>
        </div>
    );
};