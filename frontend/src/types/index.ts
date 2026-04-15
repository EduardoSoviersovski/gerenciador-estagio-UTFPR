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
  key: keyof T | 'actions'; 
  render?: (value: any, item: T) => React.ReactNode; 
}