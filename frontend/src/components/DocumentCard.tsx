import React from 'react';
import { FileText, Clock, Plus, Download, AlertCircle, CheckCircle2, Clock4, FileMinus } from 'lucide-react';
import { DocumentEntry } from '../types';

interface DocumentCardProps {
    doc?: DocumentEntry;
    isAddCard?: boolean;
    templateOnly?: boolean;
    hideDate?: boolean;
    onClick?: () => void;
}

export const DocumentCard = ({ doc, isAddCard, templateOnly, hideDate, onClick }: DocumentCardProps) => {

    if (isAddCard) {
        return (
            <button
                onClick={onClick}
                className="group border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer min-h-[220px] w-full"
            >
                <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                    <Plus size={28} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">
                    Novo Documento
                </span>
            </button>
        );
    }

    if (!doc) return null;

    if (templateOnly) {
        return (
            <div
                onClick={onClick}
                className={`group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden transition-all text-left min-h-[220px] hover:shadow-xl hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
            >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />

                <div className="flex items-start justify-between">
                    <div className="space-y-3 pr-4">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all w-fit">
                            <FileText size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight group-hover:text-blue-600 leading-tight pt-1">
                                {doc.title}
                            </h3>
                        </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (doc.templateUrl) window.open(doc.templateUrl);
                            }}
                            className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all z-10 cursor-pointer"
                            title="Baixar Modelo"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-1.5">
                        {!hideDate && doc.updatedAt ? (
                            <>
                                <Clock size={10} strokeWidth={3} />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                    Ultima atualização: {doc.updatedAt}
                                </span>
                            </>
                        ) : (
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-0">
                                Sem atualização
                            </span>
                        )}
                    </div>

                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onClick ? 'Visualizar' : 'Baixar Modelo'}
                    </span>
                </div>
            </div>
        );
    }

    const statusConfig: Record<string, { label: string, icon: React.ElementType }> = {
        not_sent: { label: 'Não Enviado', icon: FileMinus },
        sent: { label: 'Enviado', icon: CheckCircle2 },
        pending: { label: 'Em Análise', icon: Clock4 },
        approved: { label: 'Aprovado', icon: CheckCircle2 },
        action_required: { label: 'Ação Necessária', icon: AlertCircle },
    };
    const currentStatus = statusConfig[doc.status] || statusConfig.not_sent;
    const StatusIcon = currentStatus.icon;

    return (
        <div
            onClick={onClick}
            className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all text-left min-h-[220px] w-full"
        >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />

            <div className="flex items-start justify-between">
                <div className="space-y-3 pr-4">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all w-fit">
                        <FileText size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight group-hover:text-blue-600 leading-tight pt-1">
                            {doc.title}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 shrink-0">
                    <StatusIcon size={10} strokeWidth={3} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-center mt-0.5">
                        {currentStatus.label}
                    </span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-1.5">
                    {!hideDate && doc.updatedAt ? (
                        <>
                            <Clock size={10} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                Ultima atualização: {doc.updatedAt}
                            </span>
                        </>
                    ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-0">
                            Sem atualização
                        </span>
                    )}
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Visualizar
                </span>
            </div>
        </div>
    );
};