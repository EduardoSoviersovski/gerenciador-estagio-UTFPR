export type Role = 'STUDENT' | 'ADVISOR' | 'ADMIN';
export type InternshipStatus = 'ACTIVE' | 'PENDING' | 'FINISHED' | 'CANCELLED';
export type InternshipCategory = 'mandatory' | 'non_mandatory';

export interface User {
  id: number;
  google_id: string;
  name: string;
  email: string;
  role: Role;
  ra?: string; 
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export interface WorkloadStats {
  target_hours: number;
  hours_completed: number;
  hours_remaining: number;
  estimated_end_date: string;
  completion_percentage: number;
}

export interface CompanyData {
  name: string;
  supervisor: string;
  supervisor_email: string;
}

export interface StudentData {
  id: number;
  google_id: string | null;
  name: string;
  ra: string;
  email: string;
  course: string;
}

export interface ProcessData {
  id: number;
  advisor_id: number;
  advisor_name: string;
  advisor_email: string;
  advisor_google_id: string | null;
  company: CompanyData;
  status: InternshipStatus;
  type: string;
  start_date: string;
  weekly_hours: number;
  sei_number: string;
}

export interface StudentProcessResponse {
  process: {
    student: StudentData;
    process: ProcessData;
  };
  workload: WorkloadStats;
}

export type AllowedCourses = 'Engenharia de Computação' | 'Bacharelado em Sistemas de Informação';

export interface CreateProcessRequest {
  sei_number: string;
  student_name: string;
  student_ra: string;
  student_period: number;
  student_email: string;
  student_course: AllowedCourses;
  student_phone: string;
  advisor_name: string;
  advisor_email: string;
  advisor_phone: string;
  advisor_department: string;
  start_date: string; 
  category: InternshipCategory;
  company_name: string;
  company_cnpj: string;
  supervisor_name: string;
  supervisor_email: string;
  supervisor_cpf: string;
  weekly_hours: number;
  target_hours: number;
}

export interface AdminProcessSummary {
  sei_number: string;
  start_date: string;
  student_name: string;
  student_email: string;
  student_ra: string;
  advisor_name: string;
  advisor_email: string;
  company_name: string;
  company_supervisor_name: string;
  company_supervisor_email: string;
  process_status: InternshipStatus | string; 
  student_course: string;
  internship_type: string;
}

export interface AdminProcessesResponse {
  student_processes_list: AdminProcessSummary[];
}