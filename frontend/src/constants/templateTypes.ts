export type TemplateCategory = 'REPORTS' | 'DOCUMENTS';

export interface TemplateMapItem {
    id: number;
    name: string;
    category: TemplateCategory;
}

export const ADMIN_TEMPLATES_MAP: TemplateMapItem[] = [
    { id: 1, name: 'Relatório Parcial do Aluno', category: 'REPORTS' },
    { id: 2, name: 'Relatório Parcial do Supervisor', category: 'REPORTS' },
    { id: 3, name: 'Relatório de Visita', category: 'REPORTS' },
    { id: 6, name: 'Relatório Final', category: 'REPORTS' }, // TODO: PEDIR PRO PROFESSOR< NAO TEM NO SITE

    { id: 7, name: 'Outros (Genérico)', category: 'DOCUMENTS' },
    { id: 8, name: 'Plano de Estágio', category: 'DOCUMENTS' },
];