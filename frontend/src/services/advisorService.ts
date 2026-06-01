import api from './api';
import { AdminProcessSummary } from '../types/api';

interface AdvisorProcessesResponse {
    student_processes_list: AdminProcessSummary[];
}

export const advisorService = {
  getStudentProcesses: async (advisorEmail: string): Promise<AdminProcessSummary[]> => {
    try {
      const response = await api.get<AdvisorProcessesResponse>(`/advisor/${advisorEmail}/student_processes`);
      return response.data.student_processes_list;
    } catch (error) {
      console.error(`Erro ao buscar processos do orientador ${advisorEmail}:`, error);
      throw error;
    }
  }
};