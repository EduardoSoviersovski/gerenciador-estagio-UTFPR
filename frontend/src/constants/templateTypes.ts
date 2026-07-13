export type TemplateCategory = 'REPORTS' | 'DOCUMENTS';

export interface TemplateMapItem {
    id: number;
    name: string;
    category: TemplateCategory;
}

export const ADMIN_TEMPLATES_MAP: TemplateMapItem[] = [
    { id: 1, name: 'Relatório Parcial do Aluno 1', category: 'REPORTS' },
    { id: 2, name: 'Relatório Parcial do Supervisor 1', category: 'REPORTS' },
    { id: 3, name: 'Relatório de Visita', category: 'REPORTS' },
    { id: 4, name: 'Relatório Parcial do Aluno 2', category: 'REPORTS' },
    { id: 5, name: 'Relatório Final', category: 'REPORTS' },

    { id: 14, name: 'Company Visit Report', category: 'REPORTS' },
    { id: 15, name: "Intern's Partial Report", category: 'REPORTS' },
    { id: 16, name: "Company Supervisor's Partial Internship Report", category: 'REPORTS' },
    { id: 17, name: 'Relatório Comprobatório de Atividades e Condições Gerais de Ambiente de Trabalho', category: 'REPORTS' },

    { id: 6, name: 'Outros (Genérico)', category: 'DOCUMENTS' },
    { id: 7, name: 'Termo de Compromisso', category: 'DOCUMENTS' },
    { id: 8, name: 'Plano de Estágio', category: 'DOCUMENTS' },
    { id: 9, name: 'Termo Aditivo', category: 'DOCUMENTS' },
    { id: 10, name: 'Termo de Rescisão', category: 'DOCUMENTS' },
    { id: 11, name: 'Ficha de Avaliação', category: 'DOCUMENTS' },
    { id: 12, name: 'Declaração de Horas', category: 'DOCUMENTS' },
    { id: 13, name: 'Requerimento de Matrícula', category: 'DOCUMENTS' },

    { id: 18, name: 'Simplified Agreement for Training Programs / Acordo Simplificado de Estágio', category: 'DOCUMENTS' },
    { id: 19, name: 'Training Activity / Programa de Atividades de Estágio', category: 'DOCUMENTS' },
    { id: 20, name: 'Declaração Comprobatória de Atividades e Condições Gerais de Ambiente de Trabalho', category: 'DOCUMENTS' },
    { id: 21, name: 'General Conditions of The Work Environment', category: 'DOCUMENTS' },
];