import { createContext, useContext } from 'react';

interface ReportContextType {
    refetchReports: () => Promise<void>;
}

export const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReportUpdate = () => {
    const context = useContext(ReportContext);
    if (!context) throw new Error("useReportUpdate deve ser usado dentro de ReportProvider");
    return context;
};