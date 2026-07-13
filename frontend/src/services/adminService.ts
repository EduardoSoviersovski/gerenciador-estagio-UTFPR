import api from './api';
import { AdminProcessSummary, AdminProcessesResponse, CreateProcessRequest, DocumentTemplate, EditProcessRequest, TemplateListResponse } from '../types/api';

export const adminService = {
    getAllProcesses: async (): Promise<AdminProcessSummary[]> => {
        const response = await api.get<AdminProcessesResponse>('/admin/processes');
        return response.data.student_processes_list;
    },

    createProcess: async (payload: CreateProcessRequest): Promise<void> => {
        try {
            await api.post('/admin/create_process', payload);
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const serverData = error.response.data;

                if (status === 422) {
                    const details = serverData.detail;
                    if (Array.isArray(details)) {
                        const formatted = details.map((err: any) => {
                            const field = err.loc[err.loc.length - 1];
                            const msg = err.msg === 'field required' ? 'campo obrigatório' : err.msg;
                            return `<li><b>${field}</b>: ${msg}</li>`;
                        }).join('');

                        error.validationDetails = `<ul style="margin-top: 10px; padding-left: 15px;">${formatted}</ul>`;
                    }
                }
                else if (status === 500) {
                    const serverMessage = serverData?.detail || serverData?.message || 'Erro interno no servidor.';
                    error.validationDetails = `
                    <div style="text-align: left; font-size: 13px; color: #ef4444; margin-top: 10px;">
                        <b>Erro 500 no Backend (Criação):</b><br/>
                        <code style="background: #fef2f2; padding: 6px; display: block; margin-top: 5px; border-radius: 6px; border: 1px solid #fee2e2; font-family: monospace; font-size: 11px; overflow-x: auto;">
                            ${typeof serverMessage === 'object' ? JSON.stringify(serverMessage) : serverMessage}
                        </code>
                        <p style="margin-top: 8px; color: #64748b; font-size: 11px;">Verifique o terminal do Uvicorn/FastAPI para o Traceback completo do Python.</p>
                    </div>
                `;
                }
                else {
                    const genericMessage = serverData?.detail || 'Erro inesperado na requisição.';
                    error.validationDetails = `
                    <div style="text-align: left; font-size: 13px; color: #eab308; margin-top: 10px;">
                        <b>Erro ${status}:</b> ${typeof genericMessage === 'object' ? JSON.stringify(genericMessage) : genericMessage}
                    </div>
                `;
                }
            }
            throw error;
        }
    },

    updateProcess: async (processId: string, payload: Partial<EditProcessRequest>): Promise<void> => {
        try {
            await api.put(`/admin/process/${processId}`, payload);
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const serverData = error.response.data;

                if (status === 422) {
                    const details = serverData.detail;
                    if (Array.isArray(details)) {
                        const formatted = details.map((err: any) => {
                            const field = err.loc[err.loc.length - 1];
                            const msg = err.msg === 'field required' ? 'campo obrigatório' : err.msg;
                            return `<li><b>${field}</b>: ${msg}</li>`;
                        }).join('');

                        error.validationDetails = `<ul style="margin-top: 10px; padding-left: 15px;">${formatted}</ul>`;
                    }
                }
                else if (status === 500) {
                    const serverMessage = serverData?.detail || serverData?.message || 'Erro interno no servidor.';
                    error.validationDetails = `
                    <div style="text-align: left; font-size: 13px; color: #ef4444; margin-top: 10px;">
                        <b>Erro 500 no Backend:</b><br/>
                        <code style="background: #fef2f2; padding: 4px; display: block; margin-top: 5px; border-radius: 6px; border: 1px solid #fee2e2;">
                            ${typeof serverMessage === 'object' ? JSON.stringify(serverMessage) : serverMessage}
                        </code>
                    </div>
                `;
                }
            }
            throw error;
        }
    },

    getProcessById: async (processId: number): Promise<any> => {
        try {
            const response = await api.get(`/admin/process/${processId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAdvisorEmails: async (): Promise<string[]> => {
        const response = await api.get('/admin/advisors/emails');
        return response.data;
    },

    deleteProcesses: async (processIds: number[]): Promise<void> => {
        try {
            await api.delete('/admin/processes', { data: { process_ids: processIds } });
        } catch (error: any) {
            if (error.response && error.response.status === 500) {
                const serverMessage = error.response.data?.detail || 'Erro interno ao deletar processos.';
                error.validationDetails = `<div>${serverMessage}</div>`;
            }
            throw error;
        }
    },

    getAllTemplates: async (isReport?: boolean): Promise<DocumentTemplate[]> => {
        try {
            const params = isReport !== undefined ? { is_report: isReport } : {};
            const response = await api.get<TemplateListResponse>('/document/templates/list', { params });
            return response.data.templates;
        } catch (error) {
            throw error;
        }
    },

    uploadTemplate: async (documentTypeId: number, file: File, fileFormat: 'pdf' | 'docx'): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            await api.post(`/admin/templates/${documentTypeId}/upload`, formData, {
                params: { file_format: fileFormat },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const serverData = error.response.data;

                if (status === 422 || status === 500) {
                    const serverMessage = serverData?.detail || 'Erro interno ao salvar template.';
                    error.validationDetails = `
                <div style="text-align: left; font-size: 13px; color: #ef4444; margin-top: 10px;">
                    <b>Erro ${status} no Backend:</b><br/>
                    <code style="background: #fef2f2; padding: 4px; display: block; margin-top: 5px; border-radius: 6px; border: 1px solid #fee2e2;">
                        ${typeof serverMessage === 'object' ? JSON.stringify(serverMessage) : serverMessage}
                    </code>
                </div>
            `;
                }
            }
            throw error;
        }
    },

    getUserByEmail: async (email: string): Promise<any> => {
        try {
            const response = await api.get(`/admin/users/${email}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};