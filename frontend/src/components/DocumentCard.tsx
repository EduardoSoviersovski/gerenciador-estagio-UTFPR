import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle, Plus, XCircle } from 'lucide-react';
import { DocumentEntry, DocumentStatus } from '../types';

interface DocumentCardProps {
    doc?: DocumentEntry;
    isAddCard?: boolean;
    onClick: () => void;
}

export const DocumentCard = ({ doc, isAddCard, onClick }: DocumentCardProps) => {

    // 1. Card de "Adicionar Novo"
    if (isAddCard) {
        return (
            <button
                onClick={onClick}
                className="flex flex-col items-center justify-center h-44 p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all group w-full bg-white/40"
            >
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-gray-400">
                    <Plus size={24} />
                </div>
                <span className="mt-3 text-xs font-bold text-gray-500 group-hover:text-blue-600 uppercase tracking-wider">
                    Novo Documento
                </span>
            </button>
        );
    }

    if (!doc) return null;

    // 2. Configuração dos Status Atualizados
    const statusConfig: Record<DocumentStatus, { icon: React.ReactNode, color: string, bg: string, label: string, border: string }> = {
        not_sent: {
            icon: <Clock size={14} />,
            color: 'text-gray-400',
            bg: 'bg-gray-50',
            label: 'Não Enviado',
            border: 'border-gray-100'
        },
        sent: {
            icon: <CheckCircle2 size={14} />,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            label: 'Enviado',
            border: 'border-blue-200'
        },
        approved: {
            icon: <CheckCircle2 size={14} />,
            color: 'text-green-600',
            bg: 'bg-green-50',
            label: 'Aprovado',
            border: 'border-green-100'
        },
        action_required: {
            icon: <XCircle size={14} />,
            color: 'text-red-500',
            bg: 'bg-red-50',
            label: 'Ajuste Necessário',
            border: 'border-red-100'
        },
    };

    const currentStatus = statusConfig[doc.status];

    return (
        <div
            onClick={onClick}
            className={`flex flex-col justify-between h-44 p-5 bg-white border ${currentStatus.border} rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all relative group w-full`}
        >
            <div className="flex flex-col gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentStatus.bg} ${currentStatus.color}`}>
                    <FileText size={20} />
                </div>

                <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
                    {doc.title}
                </h3>
            </div>

            <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-gray-50">
                <div className={`flex items-center gap-1.5 ${currentStatus.color}`}>
                    {currentStatus.icon}
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                        {currentStatus.label}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-300 font-medium uppercase">
                        Última atualização
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold">
                        {doc.updatedAt || '--/--'}
                    </span>
                </div>
            </div>
        </div>
    );
};