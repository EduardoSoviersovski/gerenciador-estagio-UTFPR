import { TimelineStep } from '../types';
import { BACKEND_DOCUMENT_TYPES, DOCUMENT_TITLES } from '../constants/documentTypes';

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


    if (internshipType.toUpperCase() === 'MANDATORY') {
        return [
            {
                type: BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_1,
                title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_1],
                shortDate: getShortDate(start, 6),
                fullDate: getFullDate(start, 6)
            },
            {
                type: BACKEND_DOCUMENT_TYPES.SUPERVISOR_PARTIAL_REPORT_1,
                title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.SUPERVISOR_PARTIAL_REPORT_1],
                shortDate: getShortDate(start, 6),
                fullDate: getFullDate(start, 6)
            },
            {
                type: BACKEND_DOCUMENT_TYPES.VISIT_REPORT,
                title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.VISIT_REPORT],
                shortDate: getShortDate(start, 1),
                fullDate: getFullDate(start, 1)
            },
            {
                type: BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_2,
                title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_2],
                shortDate: getShortDate(start, 12),
                fullDate: getFullDate(start, 12)
            },
            {
                type: BACKEND_DOCUMENT_TYPES.FINAL_REPORT,
                title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.FINAL_REPORT],
                shortDate: getShortDate(start, 12),
                fullDate: getFullDate(start, 12)
            },
        ];
    }

    return [
        {
            type: BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_1,
            title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_1],
            shortDate: getShortDate(start, 6),
            fullDate: getFullDate(start, 6)
        },
        {
            type: BACKEND_DOCUMENT_TYPES.SUPERVISOR_PARTIAL_REPORT_1,
            title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.SUPERVISOR_PARTIAL_REPORT_1],
            shortDate: getShortDate(start, 6),
            fullDate: getFullDate(start, 6)
        },
        {
            type: BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_2,
            title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.STUDENT_PARTIAL_REPORT_2],
            shortDate: getShortDate(start, 12),
            fullDate: getFullDate(start, 12)
        },
        {
            type: BACKEND_DOCUMENT_TYPES.FINAL_REPORT,
            title: DOCUMENT_TITLES[BACKEND_DOCUMENT_TYPES.FINAL_REPORT],
            shortDate: getShortDate(start, 12),
            fullDate: getFullDate(start, 12)
        },
    ];
};

export const generateReportSkeletons = (internshipType: string, startDate: string): TimelineStep[] => {
    const datesMock = fetchReportDatesMock(internshipType, startDate);

    return datesMock.map((report) => ({
        id: `skeleton_${report.type}_${Math.random().toString(36).substring(2, 9)}`,
        title: report.title,
        type: report.type,
        date: report.shortDate,
        status: 'PENDING',
        isManual: false,
        isSkeleton: true,
        fileName: "Pendente_de_envio",
        dueDate: report.fullDate,
        startDate: new Date().toISOString()
    }));
};