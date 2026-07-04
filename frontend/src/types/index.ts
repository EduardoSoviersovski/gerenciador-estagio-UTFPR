import React from 'react';
import { DepartmentValue } from '../constants/departments';

export type StepStatus = 'completed' | 'current' | 'pending' | 'error';
export type ActivityType = 'VISIT_REPORT' | 'STUDENT_PARTIAL_REPORT_1' | 'SUPERVISOR_PARTIAL_REPORT_1' | 'STUDENT_PARTIAL_REPORT_2' | 'FINAL_REPORT' | 'INTERNSHIP_AGREEMENT';

export const ACTIVITY_TEMPLATES: Record<string, string> = {
  RELATORIO_PARCIAL: '/templates/modelo_relatorio_parcial.docx',
  RELATORIO_VISITA: '/templates/modelo_relatorio_visita.docx',
  RELATORIO_FINAL: '/templates/modelo_relatorio_final.docx',
};

export interface TimelineStep {
  id: string;
  title: string;
  type?: ActivityType | string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES' | 'ERROR';
  isManual: boolean;
  startDate?: string;
  dueDate?: string;
  templateUrl?: string;
  isSkeleton?: boolean;
}

export type DocumentStatus = 'not_sent' | 'sent' | 'approved' | 'action_required';

export interface DocumentEntry {
  id: string;
  title: string;
  status: DocumentStatus;
  isManual: boolean;
  templateUrl?: string;
  fileUrl?: string;
  updatedAt?: string;
  feedback?: string;
}

export interface Column<T> {
  header: string;
  key: keyof T | "actions" | "edit";
  render?: (value: any, item: T) => React.ReactNode;
}

export interface FilterState {
  search: string;
  status: InternshipStatus | 'Todos';
  course: string;
  advisor: string;
}

export interface ManagedStudent {
  id: string;
  name: string;
  ra: string;
  email: string;
  course: string;
  status: InternshipStatus;
  lastUpdate: string;
}

export type InternshipStatus = 'ACTIVE' | 'PENDING' | 'FINISHED' | 'CANCELLED' | 'DELAYED';

export const STATUS_MAP: Record<InternshipStatus, string> = {
  ACTIVE: 'Em dia',
  PENDING: 'Pendente',
  DELAYED: 'Em atraso',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado'
};

export type InternshipCategory = 'mandatory' | 'non_mandatory';

export type AllowedCourses = 'EC' | 'BSI';
export type AllowedWeeklyHours = 20 | 30;
export type AllowedTargetHours = 200 | 400;

export interface ProcessFormData {
  id?: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  student_ra: string;
  student_course: AllowedCourses | '';
  student_period: number | '';
  advisor_name: string;
  advisor_email: string;
  advisor_phone: string;
  advisor_department: DepartmentValue | '';
  company_name: string;
  company_cnpj: string;
  supervisor_name: string;
  supervisor_email: string;
  supervisor_cpf: string;
  sei_number: string;
  internship_type: InternshipCategory | '';
  process_status: InternshipStatus;
  start_date: Date | string | null;
  weekly_hours: AllowedWeeklyHours | '';
  target_hours: AllowedTargetHours | '';
}