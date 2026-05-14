import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Select, MenuItem, FormControl } from '@mui/material';
import { FilterState, InternshipStatus } from '../types';

interface TableFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    availableCourses: string[];
    availableAdvisors?: string[];
    showAdvisorFilter?: boolean;
}

const selectStyles = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderWidth: '1px' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb', borderWidth: '2px' },
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
    disableScrollLock: true,
    PaperProps: {
        sx: {
            maxHeight: 250,
            borderRadius: '12px',
            marginTop: '8px',
            '& .MuiMenuItem-root': { fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }
        }
    }
};

export const TableFilters = ({ filters, onFilterChange, availableCourses, availableAdvisors = [], showAdvisorFilter = false }: TableFiltersProps) => {
    const statuses: InternshipStatus[] = ['Em dia', 'Pendente', 'Em atraso', 'Finalizado'];

    const clearFilter = (key: keyof FilterState) => {
        onFilterChange({ ...filters, [key]: key === 'status' ? 'Todos' : '' });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-left">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
                    <input
                        type="text"
                        placeholder="BUSCAR NOME, RA OU E-MAIL..."
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        className="w-full pl-12 pr-4 py-[13px] bg-white border border-slate-200 rounded-[16px] text-[11px] font-black uppercase tracking-widest outline-none transition-all placeholder:text-slate-400/50"
                    />
                </div>

                <FormControl className="min-w-[160px]">
                    <Select
                        value={(filters.status as string) === 'Todos' ? '' : filters.status}
                        onChange={(e) => onFilterChange({ ...filters, status: (e.target.value as any) || 'Todos' })}
                        displayEmpty
                        renderValue={(selected) => {
                            const value = selected as string;
                            if (!value || value === 'Todos') return <span className="opacity-40">STATUS</span>;
                            return value;
                        }}
                        sx={selectStyles}
                        MenuProps={menuProps}
                    >
                        <MenuItem disabled value="">SELECIONE O STATUS</MenuItem>
                        {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl className="min-w-[180px]">
                    <Select
                        value={filters.course}
                        onChange={(e) => onFilterChange({ ...filters, course: e.target.value as string })}
                        displayEmpty
                        renderValue={(selected) => !selected ? <span className="opacity-40">CURSO</span> : (selected as string)}
                        sx={selectStyles}
                        MenuProps={menuProps}
                    >
                        <MenuItem disabled value="">SELECIONE O CURSO</MenuItem>
                        {availableCourses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>

                {showAdvisorFilter && (
                    <FormControl className="min-w-[200px]">
                        <Select
                            value={filters.advisor}
                            onChange={(e) => onFilterChange({ ...filters, advisor: e.target.value as string })}
                            displayEmpty
                            renderValue={(selected) => !selected ? <span className="opacity-40">ORIENTADOR</span> : (selected as string)}
                            sx={selectStyles}
                            MenuProps={menuProps}
                        >
                            <MenuItem disabled value="">SELECIONE O ORIENTADOR</MenuItem>
                            {availableAdvisors.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                        </Select>
                    </FormControl>
                )}
            </div>

            {(filters.search || (filters.status as string) !== 'Todos' || filters.course || filters.advisor) && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 mr-2"><Filter size={12} /> FILTROS:</span>
                    {filters.search && <FilterBadge label={`BUSCA: ${filters.search}`} onClear={() => clearFilter('search')} />}
                    {(filters.status as string) !== 'Todos' && <FilterBadge label={`STATUS: ${filters.status}`} onClear={() => clearFilter('status')} />}
                    {filters.course && <FilterBadge label={`CURSO: ${filters.course}`} onClear={() => clearFilter('course')} />}
                    {filters.advisor && <FilterBadge label={`ORIENTADOR: ${filters.advisor}`} onClear={() => clearFilter('advisor')} />}
                    <button onClick={() => onFilterChange({ search: '', status: 'Todos', course: '', advisor: '' })} className="text-[10px] font-black text-blue-600 uppercase ml-2 cursor-pointer transition-colors hover:text-blue-800">Limpar Tudo</button>
                </div>
            )}
        </div>
    );
};

const FilterBadge = ({ label, onClear }: { label: string, onClear: () => void }) => (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[10px] font-black uppercase tracking-widest leading-none">
        {label}
        <button onClick={onClear} className="hover:bg-blue-200 rounded-full p-0.5 cursor-pointer transition-colors"><X size={12} strokeWidth={3} /></button>
    </div>
);