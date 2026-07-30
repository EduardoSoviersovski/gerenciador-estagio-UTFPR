import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ptBR as ptBRLocale } from 'date-fns/locale';
import { subYears, startOfYear, endOfYear } from 'date-fns';
import { DatePickerButton } from './DatePickerButton';
import { LucideIcon } from 'lucide-react';
import { Popover } from '@mui/material';

interface FormDatePickerProps {
    label?: string;
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
    icon?: LucideIcon;
    isModified?: boolean;
    isEdit?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export const FormDatePicker = ({ selectedDate, onChange, label, icon, isModified, isEdit, minDate, maxDate }: FormDatePickerProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    const today = new Date();
    const defaultMinDate = subYears(startOfYear(today), 10);
    const defaultMaxDate = endOfYear(today);
    const resolvedMinDate = minDate || defaultMinDate;
    const resolvedMaxDate = maxDate || defaultMaxDate;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl);

    const handleDateChange = (newDate: Date | null, selectionState?: any) => {
        if (selectionState === 'finish') {
            onChange(newDate);
            handleClose();
        } else {
            onChange(newDate);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
            <div className="relative group w-full">
                <div onClick={handleClick} className="w-full cursor-pointer">
                    <DatePickerButton
                        label={label}
                        date={selectedDate ?? undefined}
                        onClick={() => { }}
                        icon={icon}
                        isModified={isModified}
                        isFocused={isOpen}
                        isEdit={isEdit}
                    />
                </div>

                <Popover
                    open={isOpen}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    disableScrollLock={true} /* <--- A MÁGICA ESTÁ AQUI: Impede que o MUI empurre a tela pro lado */
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: '28px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                border: '1px solid #f1f5f9',
                                padding: '8px',
                                marginTop: '-8px',
                                zIndex: 99999,
                            }
                        }
                    }}
                >
                    <DateCalendar
                        value={selectedDate}
                        minDate={resolvedMinDate}
                        maxDate={resolvedMaxDate}
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
                                    color: 'white',
                                }
                            }
                        }}
                    />
                </Popover>
            </div>
        </LocalizationProvider>
    );
};