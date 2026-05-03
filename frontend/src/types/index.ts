export type StepStatus = 'completed' | 'current' | 'pending' | 'error';

export interface TimelineStep {
    id: string;
    title: string;
    date: string; 
    status: StepStatus;
    isManual: boolean;
    startDate?: string;
    dueDate?: string;
    templateUrl?: string; 
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

export type InternshipStatus = 'Em dia' | 'Pendente' | 'Em atraso' | 'Finalizado';

export interface ProcessFormData {
    id?: string;
    student_name: string;
    student_email: string;
    student_phone: string;
    student_ra: string;
    advisor_name: string;
    advisor_email: string;
    advisor_phone: string;
    company_name: string;
    company_cnpj: string;
    supervisor_name: string;
    supervisor_email: string;
    supervisor_cpf: string;
    sei_number: string;
    category: string;
    status: InternshipStatus;
}