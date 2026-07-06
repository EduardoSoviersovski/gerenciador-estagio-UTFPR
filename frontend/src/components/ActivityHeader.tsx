import React from 'react';
import { Calendar } from 'lucide-react';
import { TimelineStep } from '../types';
import { StatusDocumentSelect } from './ui/StatusDocumentSelect';
import { DocumentService } from '../services/documentService';

interface ActivityHeaderProps {
    step: TimelineStep & { isDueDateLate?: boolean };
    processId?: string;
    documentTypeId?: number | null;
    currentStatus?: number;
    onUpdate?: () => void;
}

export const ActivityHeader = ({
    step,
    processId,
    documentTypeId,
    currentStatus,
    onUpdate
}: ActivityHeaderProps) => {

    const handleStatusChange = async (newStatusId: number) => {
        if (!processId || !documentTypeId) return;

        try {
            await DocumentService.updateStatus(Number(processId), documentTypeId, newStatusId);

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };


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

                <div>
                    {currentStatus !== undefined && documentTypeId && (
                        <div className="w-fit">
                            <StatusDocumentSelect
                                value={currentStatus}
                                onChange={handleStatusChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};