import React, { useState } from 'react';
import { Slider } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface FormSliderProps {
    label: string;
    name: string;
    value: number;
    onChange: (e: any) => void;
    min?: number;
    max?: number;
    isModified?: boolean;
    isEdit?: boolean;
    icon?: LucideIcon;
}

export const FormSlider = ({
    label,
    name,
    value,
    onChange,
    min = 1,
    max = 30,
    isModified = false,
    isEdit = false,
    icon: Icon,
}: FormSliderProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = value !== undefined && value !== null && value > 0;

    const shouldBeBlue = isFocused || isModified || (!isEdit && hasValue);

    const borderColor = shouldBeBlue ? 'border-blue-500' : 'border-slate-200';
    const iconColor = shouldBeBlue ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500';

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        onChange({
            target: {
                name,
                value: newValue
            }
        });
    };

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

            <div className={`flex items-center gap-3 w-full px-4 min-h-[48px] bg-slate-50 border-[2px] rounded-xl transition-all group ${borderColor}`}>
                {Icon && (
                    <Icon size={18} className={`transition-colors duration-300 ${iconColor} shrink-0`} />
                )}

                <div className="flex-1 flex items-center gap-4 px-2 mt-1">
                    <Slider
                        value={value || min}
                        min={min}
                        max={max}
                        onChange={handleSliderChange}
                        onMouseDown={() => setIsFocused(true)}
                        onMouseUp={() => setIsFocused(false)}
                        onChangeCommitted={() => setIsFocused(false)}
                        valueLabelDisplay="auto" // Mostra um tooltip enquanto arrasta
                        sx={{
                            color: shouldBeBlue ? '#3b82f6' : '#94a3b8',
                            '& .MuiSlider-thumb': {
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: `0px 0px 0px 8px ${shouldBeBlue ? 'rgb(59 130 246 / 16%)' : 'rgb(148 163 184 / 16%)'}`,
                                },
                                '&.Mui-active': {
                                    boxShadow: `0px 0px 0px 14px ${shouldBeBlue ? 'rgb(59 130 246 / 16%)' : 'rgb(148 163 184 / 16%)'}`,
                                },
                            },
                        }}
                    />

                    <span
                        className="text-sm font-bold w-[45px] text-right"
                        style={{ color: shouldBeBlue ? '#1e293b' : '#64748b' }}
                    >
                        {value || 0}h
                    </span>
                </div>
            </div>
        </div>
    );
};