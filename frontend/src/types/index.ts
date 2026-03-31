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