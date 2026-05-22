import React, { useState } from 'react';
import { FormControl, Select, SelectProps, SelectChangeEvent } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface FormSelectProps extends Omit<SelectProps, 'onChange'> {
    label: string;
    name: string;
    value: any;
    onChange: (e: SelectChangeEvent<any>) => void;
    isModified?: boolean;
    isEdit?: boolean;
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
    children,
    icon: Icon,
    sx,
    ...rest
}: FormSelectProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;

    // Mesma lógica adaptada para o Select
    const shouldBeBlue = isFocused || isModified || (!isEdit && hasValue);

    const borderColor = shouldBeBlue ? 'border-blue-500' : 'border-slate-200';
    const iconColor = shouldBeBlue ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500';

    return (
        <div className="flex flex-col w-full text-left space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${isModified ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                {label}
                {isModified && (
                    <span className="text-blue-600 lowercase tracking-normal font-bold">
                        (modificado)
                    </span>
                )}
            </label>

            <div className={`flex items-center gap-3 w-full px-4 bg-slate-50 border-[2px] rounded-xl transition-all group ${borderColor}`}>
                {Icon && (
                    <Icon size={18} className={`transition-colors duration-300 ${iconColor}`} />
                )}

                <FormControl fullWidth>
                    <Select
                        id={`${name}-select`}
                        name={name}
                        value={value || ''}
                        onChange={onChange as any}
                        displayEmpty
                        onOpen={() => setIsFocused(true)}
                        onClose={() => setIsFocused(false)}
                        MenuProps={{ disableScrollLock: true }}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSelect-select': {
                                padding: '12px 0',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#334155',
                            },
                            ...sx
                        }}
                        {...rest}
                    >
                        {children}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};