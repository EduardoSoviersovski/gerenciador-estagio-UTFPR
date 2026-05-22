import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerButtonProps {
    date: Date | undefined;
    onClick: () => void;
    label?: string;
    icon?: React.ElementType;
    isModified?: boolean;
}

export const DatePickerButton = ({
    date,
    onClick,
    label = "Data de Início",
    icon: CustomIcon,
    isModified = false
}: DatePickerButtonProps) => {

    const dateText = date
        ? format(date, 'dd/MM/yyyy', { locale: ptBR })
        : "Selecionar Data";

    const IconToRender = CustomIcon || CalendarIcon;

    return (
        <div className="space-y-1.5 w-full">
            <span className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${isModified ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}>
                {label}
                {isModified && (
                    <span className="text-blue-600 text-lowercase font-bold">
                        (modificado)
                    </span>
                )}
            </span>

            <button
                type="button"
                onClick={onClick}
                className={`flex items-center gap-3 w-full px-4 py-3 bg-slate-50 rounded-xl hover:shadow-sm transition-all group cursor-pointer border ${isModified
                    ? 'border-blue-500 border-[2px]'
                    : 'border-slate-200 hover:border-blue-300'
                    }`}
            >
                <IconToRender size={18} className="text-blue-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-700">
                    {dateText}
                </span>
            </button>
        </div>
    );
};