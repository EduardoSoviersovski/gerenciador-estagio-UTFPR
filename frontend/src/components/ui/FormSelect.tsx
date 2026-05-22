import React from 'react';
import { FormControl, Select, SelectProps, SelectChangeEvent } from '@mui/material';

interface FormSelectProps extends Omit<SelectProps, 'onChange'> {
    label: string;
    name: string;
    value: any;
    onChange: (e: SelectChangeEvent<any>) => void;
    isModified?: boolean;
    children: React.ReactNode;
    renderValue?: (value: any) => React.ReactNode;
}

export const FormSelect = ({
    label,
    name,
    value,
    onChange,
    isModified = false,
    children,
    sx,
    ...rest
}: FormSelectProps) => {

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

            <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: '0.75rem',
                    backgroundColor: '#f8fafc',
                    transition: 'all 0.3s ease',

                    '& .MuiSelect-select': {
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        paddingLeft: '16px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#334155',
                    },

                    '& fieldset': {
                        borderColor: isModified ? '#3b82f6' : '#e2e8f0',
                        borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                        borderColor: isModified ? '#3b82f6' : '#cbd5e1',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: '2px',
                    }
                }
            }}>
                <Select
                    id={`${name}-select`}
                    name={name}
                    value={value || ''}
                    onChange={onChange as any}
                    displayEmpty
                    MenuProps={{ disableScrollLock: true }}
                    sx={{
                        ...sx
                    }}
                    {...rest}
                >
                    {children}
                </Select>
            </FormControl>
        </div>
    );
};