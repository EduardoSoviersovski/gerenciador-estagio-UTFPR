import api from './api';
import { DocumentStatusResponse, DocumentStatusUpdate, ProcessDocument, ReportDetails, UploadDocumentResponse } from '../types/api';
import { mapApiToDocument } from '../utils/mappers';

export const DocumentService = {
    getProcessDocuments: async (processId: number): Promise<ProcessDocument[]> => {
        const response = await api.get(`/document/${processId}/documents`);
        return response.data.map((item: any) => mapApiToDocument(item));
    },

    getDocumentMessageList: async (documentId?: number): Promise<ReportDetails> => {
        const response = await api.get(`/document/reports/${documentId}/message_list`);
        return response.data;
    },

    addComment: async (
        processId: number,
        documentTypeId: number,
        message: string,
        documentId?: number
    ): Promise<any> => {
        const response = await api.post(
            `/document/${processId}/reports/${documentTypeId}/comments`,
            { message },
            { params: { document_id: documentId } }
        );
        return response.data;
    },

    updateStatus: async (
        processId: number,
        documentTypeId: number,
        statusId: number,
        documentId?: number
    ): Promise<DocumentStatusResponse> => {
        const payload: DocumentStatusUpdate = {
            status_id: statusId
        };

        const response = await api.patch(
            `/document/${processId}/reports/${documentTypeId}/status`,
            payload,
            { params: { document_id: documentId } }
        );
        return response.data;
    },

    uploadDocument: async (
        processId: number,
        documentTypeId: number,
        file: File,
        documentId?: number
    ): Promise<UploadDocumentResponse> => {
        const formData = new FormData();
        formData.append('document_type_id', documentTypeId.toString());
        formData.append('file', file);
        console.log("Uploading document with data:", {
            processId,
            documentTypeId,
            fileName: file.name,
            documentId
        });

        const response = await api.post(
            `/document/${processId}/upload`,
            formData,
            {
                params: { document_id: documentId },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    downloadDocument: async (
        processId: number,
        documentId: number,
        fileFormat: 'pdf' | 'jpg' = 'pdf'
    ): Promise<Blob> => {
        const response = await api.get(
            `/document/${processId}/${documentId}/download`,
            {
                params: { file_format: fileFormat },
                responseType: 'blob',
            }
        );
        return response.data;
    },

    downloadTemplate: async (
        documentTypeId: string | number,
        fileFormat: 'pdf' | 'docx' = 'pdf'
    ): Promise<Blob> => {
        try {
            const response = await api.get(`/document/templates/${documentTypeId}/download`, {
                params: { file_format: fileFormat },
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};