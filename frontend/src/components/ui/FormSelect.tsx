import React, { useState } from 'react';
import { FormControl, Select, SelectProps, SelectChangeEvent } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface FormSelectProps extends Omit<SelectProps, 'onChange' | 'error'> {
    label: string;
    name: string;
    value: any;
    onChange: (e: SelectChangeEvent<any>) => void;
    isModified?: boolean;
    isEdit?: boolean;
    error?: string;
    children: React.ReactNode;
    icon?: LucideIcon;
}

export const FormSelect = ({
    label,
    name,
    value,
    onChange,
    isModified = false,
    isEdit = false,
    error,
    children,
    icon: Icon,
    sx,
    disabled,
    className,
    ...rest
}: FormSelectProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;

    const shouldBeBlue = isFocused || isModified || (!isEdit && hasValue);

    const borderColor = error
        ? 'border-red-400 focus-within:border-red-500'
        : shouldBeBlue
            ? 'border-blue-500'
            : 'border-slate-200 focus-within:border-blue-500';

    const iconColor = error
        ? 'text-red-400 group-focus-within:text-red-500'
        : shouldBeBlue
            ? 'text-blue-600'
            : 'text-slate-400 group-hover:text-blue-500 group-focus-within:text-blue-600 transition-colors';

    const labelColor = error
        ? 'text-red-500'
        : isModified
            ? 'text-blue-600 font-bold'
            : 'text-slate-400';

    const isDisabledState = disabled;

    return (
        <div className={`flex flex-col w-full text-left space-y-1.5 ${className || ''}`}>
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${labelColor}`}>
                {label}
                {isModified && !error && (
                    <span className="text-blue-600 lowercase tracking-normal font-bold">
                        (modificado)
                    </span>
                )}
            </label>

            <div className={`flex items-center gap-3 w-full px-4 border-[2px] rounded-xl transition-all group ${borderColor} ${isDisabledState ? 'cursor-not-allowed opacity-80 bg-slate-100' : 'bg-slate-50'}`}>
                {Icon && (
                    <Icon size={18} className={`transition-colors duration-300 ${iconColor}`} />
                )}

                <FormControl fullWidth disabled={disabled}>
                    <Select
                        id={`${name}-select`}
                        name={name}
                        value={value || ''}
                        onChange={onChange as any}
                        displayEmpty
                        onOpen={() => setIsFocused(true)}
                        onClose={() => setIsFocused(false)}
                        disabled={disabled}
                        MenuProps={{ disableScrollLock: true }}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSelect-select': {
                                padding: '12px 0',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                fontFamily: 'inherit',
                                color: hasValue ? '#334155' : '#94a3b8',
                            },
                            ...(isDisabledState && {
                                pointerEvents: 'none',
                            }),
                            ...sx
                        }}
                        {...rest}
                    >
                        {children}
                    </Select>
                </FormControl>
            </div>

            {error && (
                <p className="text-[10px] font-bold text-red-500 ml-1 animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};