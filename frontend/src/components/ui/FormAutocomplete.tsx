import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface FormAutocompleteProps {
    label: string;
    name: string;
    value: string;
    options: string[];
    onChange: (e: { target: { name: string; value: string } }) => void;
    onBlur?: (e: { target: { name: string; value: string } }) => void;
    isModified?: boolean;
    isEdit?: boolean;
    error?: string;
    icon?: LucideIcon;
    placeholder?: string;
}

export const FormAutocomplete = ({
    label,
    name,
    value,
    options,
    onChange,
    onBlur,
    isModified = false,
    isEdit = false,
    error,
    icon: Icon,
    placeholder
}: FormAutocompleteProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;

    const shouldBeBlue = isFocused || isModified || (!isEdit && hasValue);

    let borderColor = 'border-slate-200';
    let iconColor = 'text-slate-400 group-hover:text-blue-500';
    let labelColor = 'text-slate-400';

    if (error) {
        borderColor = 'border-red-500';
        iconColor = 'text-red-500';
        labelColor = 'text-red-500';
    } else if (shouldBeBlue) {
        borderColor = 'border-blue-500';
        iconColor = 'text-blue-600';
        if (isModified) labelColor = 'text-blue-600 font-bold';
    } else if (isModified) {
        labelColor = 'text-blue-600 font-bold';
    }

    return (
        <div className="flex flex-col w-full text-left space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${labelColor}`}>
                {label}
                {isModified && !error && (
                    <span className="text-blue-600 lowercase tracking-normal font-bold">
                        (modificado)
                    </span>
                )}
            </label>

            <div className={`flex items-center gap-3 w-full px-4 bg-slate-50 border-[2px] rounded-xl transition-all group ${borderColor}`}>
                {Icon && (
                    <Icon size={18} className={`transition-colors duration-300 flex-shrink-0 ${iconColor}`} />
                )}

                <Autocomplete
                    freeSolo
                    options={options}
                    value={value || ''}
                    onChange={(event, newValue) => {
                        onChange({ target: { name, value: newValue || '' } });
                        if (newValue && onBlur) {
                            onBlur({ target: { name, value: newValue } });
                        }
                    }}
                    onInputChange={(event, newInputValue) => {
                        onChange({ target: { name, value: newInputValue || '' } });
                    }}
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={placeholder}
                            variant="outlined"
                            onFocus={() => setIsFocused(true)}
                            onBlur={(e) => {
                                setIsFocused(false);
                                if (onBlur) {
                                    onBlur({ target: { name, value: e.target.value } });
                                }
                            }}
                            slotProps={{
                                htmlInput: {
                                    ...params.inputProps,
                                    autoComplete: 'new-password',
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    padding: '0px !important',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none'
                                },
                                '& .MuiInputBase-input': {
                                    padding: '12px 0 !important',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#334155',
                                }
                            }}
                        />
                    )}
                />
            </div>
            {error && (
                <span className="text-xs text-red-500 font-medium ml-1">
                    {error}
                </span>
            )}
        </div>
    );
};