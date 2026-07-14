// frontend/src/utils/mappers.ts
import { ProcessDocument } from '../types/api';

export const mapApiToDocument = (apiData: any): ProcessDocument => ({
    id: apiData.id,
    processId: apiData.process_id,
    documentTypeId: apiData.document_type_id,
    documentType: apiData.document_type,
    statusId: apiData.status_id,
    status: apiData.status,
    fileName: apiData.file_name,
    customName: apiData.custom_name,
    createdAt: apiData.upload_at,
});