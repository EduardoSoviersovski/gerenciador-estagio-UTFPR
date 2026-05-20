import React from 'react';
import { FormControl, InputLabel, Select, SelectProps, SelectChangeEvent } from '@mui/material';

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
        <FormControl fullWidth sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                transition: 'all 0.3s ease',
                '& fieldset': {
                    borderColor: isModified ? '#3b82f6' : '#e2e8f0',
                    borderWidth: isModified ? '2px' : '1px',
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
            <InputLabel
                id={`${name}-label`}
                shrink
                sx={{
                    color: isModified ? '#3b82f6' : 'inherit',
                    fontWeight: isModified ? 700 : 400,
                    backgroundColor: 'transparent',
                    padding: '0 4px',
                    marginLeft: '-2px',
                    display: 'flex',
                    alignItems: 'center',
                    textShadow: `
                        -2px -2px 0 #ffffff,  
                         2px -2px 0 #ffffff,
                        -2px  2px 0 #ffffff,
                         2px  2px 0 #ffffff,
                        -2px  0px 0 #ffffff,
                         2px  0px 0 #ffffff,
                         0px -2px 0 #ffffff,
                         0px  2px 0 #ffffff
                    `,

                    '&.Mui-focused': { color: isModified ? '#3b82f6' : 'inherit' }
                }}
            >
                {label} {isModified && (
                    <span style={{ color: '#3b82f6', textTransform: 'lowercase', marginLeft: '4px' }}>
                        (modificado)
                    </span>
                )}
            </InputLabel>

            <Select
                labelId={`${name}-label`}
                name={name}
                value={value || ''}
                onChange={onChange as any}
                MenuProps={{ disableScrollLock: true }}
                sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#334155',
                    ...sx
                }}
                {...rest}
            >
                {children}
            </Select>
        </FormControl>
    );
};