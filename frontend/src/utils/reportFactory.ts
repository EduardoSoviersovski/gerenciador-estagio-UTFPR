import { TimelineStep } from '../types';

export const fetchReportDatesMock = (internshipType: string, startDate: string) => {
    const start = new Date(startDate);
    
    const getShortDate = (date: Date, months: number) => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d.toLocaleDateString('pt-BR').substring(0, 5); 
    };

    const getFullDate = (date: Date, months: number) => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d.toISOString();
    };

    if (internshipType === 'mandatory') {
        return [
            { type: 'RELATORIO_VISITA', title: 'Relatório de Visita (Orientador)', shortDate: getShortDate(start, 1), fullDate: getFullDate(start, 1) },
            { type: 'RELATORIO_PARCIAL', title: 'Relatório Parcial 1 (Estagiário)', shortDate: getShortDate(start, 6), fullDate: getFullDate(start, 6) },
            { type: 'RELATORIO_PARCIAL', title: 'Relatório Parcial 1 (Supervisor)', shortDate: getShortDate(start, 6), fullDate: getFullDate(start, 6) },
            { type: 'RELATORIO_PARCIAL', title: 'Relatório Parcial 2 (Estagiário)', shortDate: getShortDate(start, 12), fullDate: getFullDate(start, 12) },
            { type: 'RELATORIO_FINAL', title: 'Relatório Final', shortDate: getShortDate(start, 12), fullDate: getFullDate(start, 12) },
        ];
    } 
    
    return [
        { type: 'RELATORIO_PARCIAL', title: 'Relatório Parcial 1 (Estagiário)', shortDate: getShortDate(start, 6), fullDate: getFullDate(start, 6) },
        { type: 'RELATORIO_PARCIAL', title: 'Relatório Parcial 1 (Supervisor)', shortDate: getShortDate(start, 6), fullDate: getFullDate(start, 6) },
        { type: 'RELATORIO_PARCIAL', title: 'Relatório Parcial 2 (Estagiário)', shortDate: getShortDate(start, 12), fullDate: getFullDate(start, 12) },
        { type: 'RELATORIO_FINAL', title: 'Relatório Final', shortDate: getShortDate(start, 12), fullDate: getFullDate(start, 12) },
    ];
};

export const generateReportSkeletons = (internshipType: string, startDate: string): TimelineStep[] => {
    const datesMock = fetchReportDatesMock(internshipType, startDate);

    return datesMock.map((report, index) => ({
        id: `skeleton-${report.type}-${index}`, 
        title: report.title,
        type: report.type,
        date: report.shortDate,
        status: 'pending',
        isManual: false, 
        isSkeleton: true, 
        dueDate: report.fullDate,
        startDate: new Date().toISOString()
    }));
};