import api from './api';
import { AdminProcessSummary, AdminProcessesResponse, CreateProcessRequest } from '../types/api';

export const adminService = {
  getAllProcesses: async (): Promise<AdminProcessSummary[]> => {
    const response = await api.get<AdminProcessesResponse>('/admin/processes');
    return response.data.student_processes_list;
  },

  createProcess: async (payload: CreateProcessRequest): Promise<void> => {
    try {
      await api.post('/admin/create_process', payload);
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        const details = error.response.data.detail;
        
        if (Array.isArray(details)) {
          const formatted = details.map((err: any) => {
            const field = err.loc[err.loc.length - 1];
            const msg = err.msg === 'field required' ? 'campo obrigatório' : err.msg;
            return `<li><b>${field}</b>: ${msg}</li>`;
          }).join('');
          
          error.validationDetails = `<ul style="margin-top: 10px; padding-left: 15px;">${formatted}</ul>`;
        }
      }
      throw error; 
    }
  }
};