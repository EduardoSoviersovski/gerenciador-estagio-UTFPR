import api from './api';

export interface StudentProcessResponse {
  process: {
    student: {
      id: number;
      google_id: string | null;
      name: string;
      ra: string;
      email: string;
      course: string;
    };
    process: {
      id: number;
      advisor_id: number;
      advisor_name: string;
      advisor_email: string;
      advisor_google_id: string | null;
      advisor_department: string;
      company: {
        name: string;
        supervisor: string;
        supervisor_email: string;
      };
      status: string;
      type: string;
      start_date: string;
      weekly_hours: number;
      sei_number: string;
    };
  };
  workload: {
    target_hours: number;
    hours_completed: number;
    hours_remaining: number;
    estimated_end_date: string;
    completion_percentage: number;
  };
}

export const studentService = {
  getMyProcesses: async (): Promise<any[]> => {
    const response = await api.get('/student/processes');
    return response.data.processes || [];
  },

  getProcessById: async (processId: string): Promise<StudentProcessResponse> => {
    const response = await api.get(`/student/process/${processId}`);
    return response.data;
  }
};