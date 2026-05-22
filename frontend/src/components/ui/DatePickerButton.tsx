import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DatePickerButtonProps {
    label?: string;
    date?: Date;
    onClick: () => void;
    icon?: LucideIcon;
    isModified?: boolean;
    isFocused?: boolean;
    isEdit?: boolean;
}

export const DatePickerButton = ({ label, date, onClick, icon: Icon, isModified, isFocused, isEdit }: DatePickerButtonProps) => {

    const hasValue = date instanceof Date && !isNaN(date.getTime());

    const shouldBeBlue = isFocused || isModified || (!isEdit && hasValue);

    const borderColor = shouldBeBlue ? 'border-blue-500' : 'border-slate-200';
    const iconColor = shouldBeBlue ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500';

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <span className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${isModified ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                    {label}
                    {isModified && (
                        <span className="text-blue-600 lowercase tracking-normal font-bold">
                            (modificado)
                        </span>
                    )}
                </span>
            )}

            <button
                type="button"
                onClick={onClick}
                className={`flex items-center gap-3 w-full px-4 py-3 bg-slate-50 border-[2px] rounded-xl transition-all group ${borderColor}`}
            >
                {Icon && (
                    <Icon size={18} className={`transition-colors duration-300 ${iconColor}`} />
                )}

                <span className={`text-sm font-semibold ${hasValue ? 'text-slate-700' : 'text-slate-400'}`}>
                    {hasValue ? date.toLocaleDateString('pt-BR') : 'Selecione uma data'}
                </span>
            </button>
        </div>
    );
};