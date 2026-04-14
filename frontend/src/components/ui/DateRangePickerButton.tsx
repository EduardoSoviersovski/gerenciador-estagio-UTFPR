import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateRangePickerButtonProps {
    range: DateRange | undefined;
    onClick: () => void;
}

export const DateRangePickerButton = ({ range, onClick }: DateRangePickerButtonProps) => {
    const rangeText = range?.from
        ? range.to
            ? `${format(range.from, 'dd/MM')} - ${format(range.to, 'dd/MM')}`
            : format(range.from, 'dd/MM/yyyy')
        : "Selecionar Período";

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group shrink-0"
        >
            <CalendarIcon size={18} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                {rangeText}
            </span>
        </button>
    );
};