import { TimelineStep } from '../types';
import { ProcessDocument } from '../types/api';
import {BACKEND_DOCUMENT_TYPES, DOCUMENT_TITLES} from '../constants/documentTypes';

export const generateReportTimeline = (documents: ProcessDocument[]): TimelineStep[] => {
    const reportTypes = [
        BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_1,
        BACKEND_DOCUMENT_TYPES.SUPERVISOR_PARTIAL_REPORT_1,
        BACKEND_DOCUMENT_TYPES.VISIT_REPORT,
        BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_2,
        BACKEND_DOCUMENT_TYPES.FINAL_REPORT
    ];

    const reportDocuments = documents.filter(doc => reportTypes.includes(doc.documentType.toLowerCase()));
    return reportDocuments.map(doc => {
        const normalizedType = String(doc.documentType).toLowerCase();
        let shortDate = 'Pendente';
        if (doc.expectedDate) {
            const [year, month, day] = doc.expectedDate.split('-');
            if (year && month && day) {
                shortDate = `${day}/${month}`;
            }
        }

        const getValidStatus = (val?: string): TimelineStep['status'] => {
            if (!val) return 'PENDING';
            const upper = val.toUpperCase();
            if (upper === 'APPROVED') return 'APPROVED';
            if (upper === 'REJECTED') return 'REJECTED';
            if (upper === 'REQUEST_CHANGES') return 'REQUEST_CHANGES';
            if (upper === 'ERROR') return 'ERROR';
            return 'PENDING';
        };

        return {
            id: doc.id ? String(doc.id) : `skeleton_${doc.documentType}`,
            title: DOCUMENT_TITLES[doc.documentType] || doc.documentType,
            type: doc.documentType,
            date: shortDate,
            status: getValidStatus(doc.status),
            statusId: doc.statusId || 0,
            isManual: false,
            isSkeleton: doc.id === null,
            fileName: doc.fileName || "Pendente_de_envio",
            dueDate: doc.expectedDate || undefined,
            startDate: doc.createdAt
        };
    });
};