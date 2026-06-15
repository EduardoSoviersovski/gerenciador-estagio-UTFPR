import api from './api';
import { AdminProcessSummary } from '../types/api';

interface AdvisorProcessesResponse {
  student_processes_list: AdminProcessSummary[];
}

export const advisorService = {
  getStudentProcesses: async (): Promise<AdminProcessSummary[]> => {
    try {
      const response = await api.get<AdvisorProcessesResponse>('/advisor/processes');
      return response.data?.student_processes_list || [];
    } catch (error) {
      console.error("Erro ao buscar processos do orientador:", error);
      throw error;
    }
  }
};