import React from 'react';
import { LucideIcon, Lock } from 'lucide-react';
import { Tooltip } from '@mui/material';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    isModified?: boolean;
    isEdit?: boolean;
    error?: string;
    isGoogleLinked?: boolean;
}

export const FormInput = ({
    label,
    icon: Icon,
    isModified,
    isEdit,
    error,
    isGoogleLinked,
    className,
    ...props
}: FormInputProps) => {

    const hasValue = props.value !== undefined && props.value !== null && String(props.value).trim().length > 0;

    const shouldBeBlue = isModified || (!isEdit && hasValue);

    const borderColor = error
        ? 'border-red-400 focus-within:border-red-500'
        : isGoogleLinked
            ? 'border-slate-300'
            : shouldBeBlue
                ? 'border-blue-500'
                : 'border-slate-200 focus-within:border-blue-500';

    const iconColor = error
        ? 'text-red-400 group-focus-within:text-red-500'
        : isGoogleLinked
            ? 'text-slate-400'
            : shouldBeBlue
                ? 'text-blue-600'
                : 'text-slate-400 group-hover:text-blue-500 group-focus-within:text-blue-600 transition-colors';

    const labelColor = error
        ? 'text-red-500'
        : isGoogleLinked
            ? 'text-slate-500 font-bold'
            : isModified
                ? 'text-blue-600 font-bold'
                : 'text-slate-400';

    const isDisabledState = isGoogleLinked || props.disabled;

    const inputContent = (
        <div className={`space-y-1.5 w-full ${className || ''}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${labelColor}`}>
                {label}

                {/* Ícone de Cadeado sem o texto, na cor cinza */}
                {isGoogleLinked && !error && (
                    <div className="flex items-center gap-1 ml-1 cursor-help">
                        <Lock size={16} className="text-slate-500" />
                    </div>
                )}

                {isModified && !error && !isGoogleLinked && (
                    <span className="text-blue-600 lowercase tracking-normal font-bold ml-1">
                        (modificado)
                    </span>
                )}
            </span>

            <div className={`flex items-center gap-3 w-full px-4 py-3 bg-slate-50 border-[2px] rounded-xl transition-all group ${borderColor} ${isDisabledState ? 'cursor-not-allowed opacity-80 bg-slate-100' : ''}`}>
                <Icon size={18} className={iconColor} />
                <input
                    className="w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed [&:-webkit-autofill]:shadow-[0_0_0_30px_#f8fafc_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#334155]"
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

    if (isGoogleLinked) {
        return (
            <Tooltip
                title="Este campo não é editável pois seus dados estão vinculados e sincronizados diretamente com a sua conta do Google."
                arrow
                placement="top"
                slotProps={{
                    tooltip: {
                        sx: {
                            backgroundColor: '#1e293b',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '8px 12px',
                            borderRadius: '8px',
                        }
                    },
                    arrow: { sx: { color: '#1e293b' } }
                }}
            >
                {inputContent}
            </Tooltip>
        );
    }

    return inputContent;
};