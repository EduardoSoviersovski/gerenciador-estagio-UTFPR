import React from 'react';
import { Calendar } from 'lucide-react';
import { TimelineStep } from '../types';
import { StatusDocumentSelect } from './ui/StatusDocumentSelect';
import { DocumentService } from '../services/documentService';

interface ActivityHeaderProps {
    step: TimelineStep & { isDueDateLate?: boolean };
    processId?: string;
    documentTypeId?: number | null;
    documentId?: number;
    currentStatus: number;
    userRole: string | undefined;
    onUpdate?: () => void;
}

export const ActivityHeader = ({
    step,
    processId,
    documentTypeId,
    documentId, // Recebido
    currentStatus,
    userRole,
    onUpdate
}: ActivityHeaderProps) => {

    const isAuthorized = ['ADVISOR', 'ADMIN'].includes(userRole?.toUpperCase() || '');

    const handleStatusChange = async (newStatusId: number) => {
        // Agora você pode utilizar o documentId aqui caso mude a assinatura do seu DocumentService
        if (!processId || !documentTypeId || !isAuthorized) return;

        try {
            await DocumentService.updateStatus(Number(processId), documentTypeId, newStatusId);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };

    console.log("Status atual:", currentStatus, "Document ID:", documentId);

    return (
        <div className="w-full">
            <div className="mb-4 flex justify-start">
                <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col gap-2">
                    {step.startDate && (
                        <div className="flex items-center gap-2">
                            <div className="w-[150px]">
                                <span className="text-sm text-gray-500">Início: {step.startDate}</span>
                            </div>
                            <Calendar size={14} className="text-gray-500" />
                        </div>
                    )}
                    {step.dueDate && (
                        <div className="flex items-center gap-2">
                            <div className="w-[150px]">
                                <span className={`text-sm ${step.isDueDateLate ? 'text-red-600' : 'text-orange-500'} font-medium`}>
                                    Prazo: {step.dueDate}
                                </span>
                            </div>
                            <Calendar size={14} className={step.isDueDateLate ? 'text-red-500' : 'text-orange-400'} />
                        </div>
                    )}
                </div>

                <div className={`w-fit ${!isAuthorized ? 'cursor-not-allowed' : ''}`}>
                    {documentTypeId && (
                        <div className={`w-full ${!isAuthorized ? 'cursor-not-allowed pointer-events-none' : ''}`}>
                            <StatusDocumentSelect
                                value={currentStatus}
                                onChange={handleStatusChange}
                                disabled={!isAuthorized}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};