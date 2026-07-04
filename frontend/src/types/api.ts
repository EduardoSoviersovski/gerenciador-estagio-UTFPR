import { DepartmentValue } from '../constants/departments';

export type Role = 'STUDENT' | 'ADVISOR' | 'ADMIN';
export type InternshipStatus = 'ACTIVE' | 'PENDING' | 'FINISHED' | 'CANCELLED' | 'DELAYED';
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

export type AllowedCourses = 'BSI' | 'EC';

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
  advisor_department: DepartmentValue;
  start_date: string;
  internship_type: InternshipCategory;
  company_name: string;
  company_cnpj: string;
  supervisor_name: string;
  supervisor_email: string;
  supervisor_cpf: string;
  weekly_hours: number;
  target_hours: number;
}

export interface EditProcessRequest {
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
  advisor_department: DepartmentValue;
  start_date: string;
  internship_type: InternshipCategory;
  company_name: string;
  company_cnpj: string;
  supervisor_name: string;
  supervisor_email: string;
  supervisor_cpf: string;
  weekly_hours: number;
  target_hours: number;
  process_status: InternshipStatus;
}

export interface AdminProcessSummary {
  process_id: number;
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

export interface DocumentTemplate {
  id?: number;
  document_type_id: number;
  document_type_name: string;
  name?: string;
  file_name?: string;
  mime_type?: string;
  is_report?: boolean;
}

export interface TemplateListResponse {
  templates: DocumentTemplate[];
}


export interface ProcessDocument {
  id: number;
  process_id: number;
  document_type_id: number;
  document_type_name?: string;
  status_id: number;
  status_name?: string;
  file_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportMessage {
  id: number;
  document_id: number;
  user_id: number;
  message: string;
  send_at: string;
  name: string;
  email: string;
  role: string;
}

export interface ReportDetails {
  document: ProcessDocument | null;
  messages: ReportMessage[];
}