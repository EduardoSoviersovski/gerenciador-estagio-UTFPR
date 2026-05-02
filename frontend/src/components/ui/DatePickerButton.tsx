import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerButtonProps {
    date: Date | undefined;
    onClick: () => void;
    label?: string;
}

export const DatePickerButton = ({ date, onClick, label = "Data de Início" }: DatePickerButtonProps) => {
    const dateText = date
        ? format(date, 'dd/MM/yyyy', { locale: ptBR })
        : "Selecionar Data";

    return (
        <div className="space-y-1.5 w-full">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {label} <span className="text-red-500">*</span>
            </span>
            <button
                type="button"
                onClick={onClick}
                className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group cursor-pointer"
            >
                <CalendarIcon size={18} className="text-blue-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-700">
                    {dateText}
                </span>
            </button>
        </div>
    );
};