import React from 'react';
import { DateRange } from 'react-day-picker';
import { setDate, setMonth, setYear, getDaysInMonth } from 'date-fns';
import {
    Select,
    MenuItem,
    FormControl,
    SelectChangeEvent
} from '@mui/material';

interface RangeInputsProps {
    selectedRange: DateRange | undefined;
    onSelectRange: (range: DateRange | undefined) => void;
}

export const RangeInputs = ({ selectedRange, onSelectRange }: RangeInputsProps) => {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const updateRange = (type: 'from' | 'to', part: 'day' | 'month' | 'year', value: number) => {
        const baseDate = type === 'from'
            ? (selectedRange?.from || new Date())
            : (selectedRange?.to || new Date());

        let newDate: Date;
        if (part === 'day') newDate = setDate(baseDate, value);
        else if (part === 'month') newDate = setMonth(baseDate, value);
        else newDate = setYear(baseDate, value);

        const maxDays = getDaysInMonth(newDate);
        if (newDate.getDate() > maxDays) newDate = setDate(newDate, maxDays);

        onSelectRange({
            from: type === 'from' ? newDate : selectedRange?.from,
            to: type === 'to' ? newDate : selectedRange?.to
        });
    };

    const selectStyles = {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e2e8f0',
            borderWidth: '1px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563eb',
            borderWidth: '2px',
        },
        '& .MuiSelect-select': {
            padding: '12px 16px',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center'
        }
    };

    const menuProps = {
        disablePortal: true,
        disableScrollLock: true,
        PaperProps: {
            sx: {
                maxHeight: 200,
                borderRadius: '12px',
                marginTop: '8px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#e2e8f0', borderRadius: '10px' }
            }
        }
    };

    const SelectGroup = ({ label, type }: { label: string, type: 'from' | 'to' }) => {
        const date = type === 'from' ? selectedRange?.from : selectedRange?.to;
        const daysCount = date ? getDaysInMonth(date) : 31;
        const days = Array.from({ length: daysCount }, (_, i) => i + 1);

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</span>
                    <div className="h-px bg-slate-100 flex-1" />
                </div>

                <div className="flex gap-2">
                    <FormControl className="flex-1">
                        <Select
                            value={date?.getDate() || ''}
                            onChange={(e: SelectChangeEvent<number>) => updateRange(type, 'day', Number(e.target.value))}
                            displayEmpty
                            sx={selectStyles}
                            MenuProps={menuProps}
                        >
                            <MenuItem value="" disabled><span className="text-[9px] font-black opacity-40">DIA</span></MenuItem>
                            {days.map(d => <MenuItem key={d} value={d} sx={{ fontSize: '12px', fontWeight: 'bold' }}>{d}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl className="flex-[2]">
                        <Select
                            value={date?.getMonth() ?? ''}
                            onChange={(e: SelectChangeEvent<number>) => updateRange(type, 'month', Number(e.target.value))}
                            displayEmpty
                            sx={selectStyles}
                            MenuProps={menuProps}
                        >
                            <MenuItem value="" disabled><span className="text-[9px] font-black opacity-40">MÊS</span></MenuItem>
                            {months.map((m, i) => <MenuItem key={m} value={i} sx={{ fontSize: '12px', fontWeight: 'bold' }}>{m}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl className="flex-[1.5]">
                        <Select
                            value={date?.getFullYear() || ''}
                            onChange={(e: SelectChangeEvent<number>) => updateRange(type, 'year', Number(e.target.value))}
                            displayEmpty
                            sx={selectStyles}
                            MenuProps={menuProps}
                        >
                            <MenuItem value="" disabled><span className="text-[9px] font-black opacity-40">ANO</span></MenuItem>
                            {years.map(y => <MenuItem key={y} value={y} sx={{ fontSize: '12px', fontWeight: 'bold' }}>{y}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <SelectGroup label="Início do Período" type="from" />
            <SelectGroup label="Término do Período" type="to" />
        </div>
    );
};