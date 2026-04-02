import React from 'react';
import { DocumentStatus } from '../types';

interface DocumentHeaderDetailsProps {
    title: string;
    isManual: boolean;
    status: DocumentStatus;
}

export const DocumentHeaderDetails = ({ title, isManual, status }: DocumentHeaderDetailsProps) => {
    const statusLabels: Record<DocumentStatus, string> = {
        not_sent: 'Não Enviado',
        sent: 'Enviado para Análise',
        approved: 'Aprovado',
        action_required: 'Ajuste Necessário'
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        {title}
                    </h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-sm ${isManual ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {isManual ? 'Manual' : 'Sistema'}
                    </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Status Atual:
                    </span>
                    <span className={`text-xs font-bold ${status === 'approved' ? 'text-green-600' :
                        status === 'action_required' ? 'text-red-500' :
                            status === 'sent' ? 'text-blue-500' : 'text-gray-500'
                        }`}>
                        {statusLabels[status]}
                    </span>
                </div>
            </div>

            <div className="w-full h-px bg-gray-100 mb-8" />
        </div>
    );
};