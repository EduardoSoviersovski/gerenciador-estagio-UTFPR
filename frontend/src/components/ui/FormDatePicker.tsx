import React, { useRef, useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ptBR as ptBRLocale } from 'date-fns/locale';
import { subYears, startOfYear, endOfYear } from 'date-fns';
import { DatePickerButton } from './DatePickerButton';

interface FormDatePickerProps {
    label?: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
}

export const FormDatePicker = ({ value, onChange, label }: FormDatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    const minDate = subYears(startOfYear(today), 10);
    const maxDate = endOfYear(today);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateChange = (newDate: Date | null, selectionState?: any) => {
        if (selectionState === 'finish') {
            onChange(newDate);
            setIsOpen(false);
        } else {
            onChange(newDate);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
            <div className="relative" ref={containerRef}>
                <DatePickerButton
                    label={label}
                    date={value ?? undefined}
                    onClick={() => setIsOpen(!isOpen)}
                />

                {isOpen && (
                    <div className="absolute top-[-340px] left-0 z-[1000] bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 rounded-[28px] animate-in zoom-in-95 duration-200">
                        <DateCalendar
                            value={value}
                            minDate={minDate}
                            maxDate={maxDate}
                            views={['year', 'day']}
                            onChange={(date, selectionState) => handleDateChange(date, selectionState)}
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                '& .MuiPickersCalendarHeader-label': {
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#1e293b',
                                },
                                '& .MuiDayCalendar-header .MuiTypography-root': {
                                    fontSize: '10px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    color: '#94a3b8',
                                },
                                '& .MuiPickersDay-root': {
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    borderRadius: '12px',
                                    color: '#475569',
                                    '&.Mui-selected': {
                                        backgroundColor: '#2563eb !important',
                                        color: 'white',
                                    }
                                },
                                '& .MuiPickersYear-yearButton': {
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    borderRadius: '12px',
                                    '&.Mui-selected': {
                                        backgroundColor: '#2563eb !important',
                                    }
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
};