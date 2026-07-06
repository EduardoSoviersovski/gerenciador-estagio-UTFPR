import api from './api';
import { DocumentStatusResponse, DocumentStatusUpdate, ProcessDocument, ReportDetails } from '../types/api';

export const DocumentService = {
    getProcessDocuments: async (processId: number): Promise<ProcessDocument[]> => {
        const response = await api.get(`/document/${processId}/documents`);
        return response.data;
    },

    getReportDetails: async (processId: number, documentTypeId: number): Promise<ReportDetails> => {
        const response = await api.get(`/document/${processId}/reports/${documentTypeId}/details`);
        return response.data;
    },

    addComment: async (processId: number, documentTypeId: number, message: string): Promise<any> => {
        const response = await api.post(`/document/${processId}/reports/${documentTypeId}/comments`, {
            message
        });
        return response.data;
    },

    updateStatus: async (
        processId: number,
        documentTypeId: number,
        statusId: number
    ): Promise<DocumentStatusResponse> => {
        const payload: DocumentStatusUpdate = {
            status_id: statusId
        };

        const response = await api.patch(
            `/document/${processId}/reports/${documentTypeId}/status`,
            payload
        );
        return response.data;
    }
};