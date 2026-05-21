import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    isModified?: boolean;
    error?: string;
}

export const FormInput = ({ label, icon: Icon, isModified, error, className, ...props }: FormInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
        ? 'border-red-400'
        : isFocused
            ? 'border-blue-500'
            : isModified
                ? 'border-blue-500'
                : 'border-slate-200';

    return (
        <div className={`space-y-1.5 w-full ${className || ''}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${error ? 'text-red-500' : isModified ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}>
                {label}
                {isModified && !error && (
                    <span className="text-blue-600 text-lowercase font-bold">
                        (modificado)
                    </span>
                )}
            </span>

            <div className={`flex items-center gap-3 w-full px-4 py-3 bg-slate-50 border-[2px] rounded-xl transition-all group ${borderColor}`}>
                <Icon size={18} className={error ? 'text-red-400' : isModified ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500 transition-colors'} />
                <input
                    className="w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none [&:-webkit-autofill]:shadow-[0_0_0_30px_#f8fafc_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#334155]"
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus && props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur && props.onBlur(e);
                    }}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-[10px] font-bold text-red-500 ml-1 animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};