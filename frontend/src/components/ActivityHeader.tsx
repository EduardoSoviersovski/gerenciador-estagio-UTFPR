import React from 'react';
import { Calendar } from 'lucide-react';
import { TimelineStep } from '../types';
import { StatusDocumentSelect } from './ui/StatusDocumentSelect';
import { DocumentService } from '../services/documentService';
import { AdditivePlanApprovalModal } from './modals/AdditivePlanApprovalModal';
import { BACKEND_DOCUMENT_TYPES, DOCUMENT_TYPE_IDS } from '../constants/documentTypes';

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
    documentId,
    currentStatus,
    userRole,
    onUpdate
}: ActivityHeaderProps) => {
    const APPROVED_STATUS_ID = 3;
    const additivePlanTypeId = DOCUMENT_TYPE_IDS[BACKEND_DOCUMENT_TYPES.ADDITIVE_PLAN];

    const isAuthorized = ['ADVISOR', 'ADMIN'].includes(userRole?.toUpperCase() || '');
    const isAdmin = userRole?.toUpperCase() === 'ADMIN';
    const [isAdditiveModalOpen, setIsAdditiveModalOpen] = React.useState(false);
    const [additiveDefaults, setAdditiveDefaults] = React.useState<{ newHourGoal: number; newWeeklyHours: number; additiveStartDate: string; maxAdditiveStartDate: string } | null>(null);

    const updateStatus = async (
        newStatusId: number,
        additiveFields?: { newHourGoal: number; newWeeklyHours: number; additiveStartDate?: string }
    ) => {
        if (!processId || !documentTypeId || !isAuthorized) return;

        await DocumentService.updateStatus(
            Number(processId),
            documentTypeId,
            newStatusId,
            additiveFields,
            documentId
        );

        if (onUpdate) onUpdate();
    };

    const handleStatusChange = async (newStatusId: number) => {
        if (!processId || !documentTypeId || !isAuthorized) return;

        try {
            const mustOpenAdditiveModal =
                documentTypeId === additivePlanTypeId &&
                newStatusId === APPROVED_STATUS_ID &&
                isAdmin;

            if (mustOpenAdditiveModal) {
                const defaults = await DocumentService.getAdditivePlanDefaults(Number(processId));
                setAdditiveDefaults({
                    newHourGoal: defaults.new_hour_goal,
                    newWeeklyHours: defaults.new_weekly_hours,
                    additiveStartDate: defaults.additive_start_date,
                    maxAdditiveStartDate: defaults.max_additive_start_date,
                });
                setIsAdditiveModalOpen(true);
                return;
            }

            await updateStatus(newStatusId);
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

            <AdditivePlanApprovalModal
                isOpen={isAdditiveModalOpen}
                initialValues={additiveDefaults}
                onClose={() => {
                    setIsAdditiveModalOpen(false);
                    setAdditiveDefaults(null);
                }}
                onConfirm={(values) => updateStatus(APPROVED_STATUS_ID, {
                    newHourGoal: values.newHourGoal,
                    newWeeklyHours: values.newWeeklyHours,
                    additiveStartDate: values.additiveStartDate,
                })}
            />
        </div>
    );
};