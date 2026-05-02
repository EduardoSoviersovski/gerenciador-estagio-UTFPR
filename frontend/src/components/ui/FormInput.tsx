import React from 'react';
import { LucideIcon, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FormInputProps {
    label: string;
    icon: LucideIcon;
    type?: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput = ({
    label, icon: Icon, type = "text", name, placeholder, required = true, value, onChange
}: FormInputProps) => (
    <div className="space-y-1.5 w-full text-left">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
                required={required}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700"
            />
        </div>
    </div>
);

export const DatePickerButton = ({ date, onClick, label = "Data de Início" }: any) => {
    const dateText = date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : "Selecionar Data";

    return (
        <div className="space-y-1.5 w-full text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                {label} <span className="text-red-500">*</span>
            </label>
            <button
                type="button"
                onClick={onClick}
                className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 transition-all text-left outline-none cursor-pointer"
            >
                <CalendarIcon size={18} className="text-blue-600 shrink-0" />
                <span className={`text-sm font-semibold ${date ? 'text-slate-700' : 'text-slate-400'}`}>
                    {dateText}
                </span>
            </button>
        </div>
    );
};