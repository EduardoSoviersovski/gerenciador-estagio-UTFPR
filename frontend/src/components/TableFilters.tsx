import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { Select, MenuItem, FormControl, Tooltip } from '@mui/material';
import { FilterState, InternshipStatus, STATUS_MAP } from '../types';

interface TableFiltersProps {
    filters: FilterState & { year?: string; sortOrder?: 'newest' | 'oldest' };
    onFilterChange: (filters: any) => void;
    availableCourses: string[];
    availableAdvisors?: string[];
    availableYears?: string[];
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
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
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

// Dicionário para mostrar o nome completo no menu de opções
const COURSE_MAP: Record<string, string> = {
    'BSI': 'Sistemas de Informação (BSI)',
    'EC': 'Engenharia de Computação (EC)',
    'SI': 'Sistemas de Informação (SI)',
};

export const TableFilters = ({
    filters,
    onFilterChange,
    availableCourses,
    availableAdvisors = [],
    availableYears = [],
    showAdvisorFilter = false
}: TableFiltersProps) => {

    const clearFilter = (key: string) => {
        onFilterChange({ ...filters, [key]: key === 'status' ? 'Todos' : '' });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-left">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
                    <input
                        type="text"
                        placeholder="BUSCAR NOME, RA OU E-MAIL..."
                        maxLength={1000}
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        className="w-full pl-12 pr-4 py-[13px] bg-white border border-slate-200 rounded-[16px] text-[11px] font-black uppercase tracking-widest outline-none transition-all placeholder:text-slate-400/50"
                    />
                </div>

                <FormControl className="w-[150px] shrink-0">
                    <Select
                        value={filters.sortOrder || 'newest'}
                        onChange={(e) => onFilterChange({ ...filters, sortOrder: e.target.value })}
                        displayEmpty
                        renderValue={(selected) => (
                            <div className="flex items-center gap-2 truncate">
                                <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
                                <span className="truncate">{selected === 'oldest' ? 'MAIS ANTIGOS' : 'MAIS RECENTES'}</span>
                            </div>
                        )}
                        sx={selectStyles}
                        MenuProps={menuProps}
                    >
                        <MenuItem value="newest">MAIS RECENTES</MenuItem>
                        <MenuItem value="oldest">MAIS ANTIGOS</MenuItem>
                    </Select>
                </FormControl>

                <FormControl className="w-[140px] shrink-0">
                    <Select
                        value={(filters.status as string) === 'Todos' ? '' : filters.status}
                        onChange={(e) => onFilterChange({ ...filters, status: (e.target.value as any) || 'Todos' })}
                        displayEmpty
                        renderValue={(selected) => {
                            const value = selected as string;
                            if (!value || value === 'Todos') return <span className="opacity-40">STATUS</span>;
                            return <span className="truncate">{STATUS_MAP[value as InternshipStatus] || value}</span>;
                        }}
                        sx={selectStyles}
                        MenuProps={menuProps}
                    >
                        <MenuItem disabled value="">SELECIONE O STATUS</MenuItem>
                        {Object.entries(STATUS_MAP).map(([backendValue, displayLabel]) => (
                            <MenuItem key={backendValue} value={backendValue}>{displayLabel}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {availableYears.length > 0 && (
                    <FormControl className="w-[110px] shrink-0">
                        <Select
                            value={filters.year || ''}
                            onChange={(e) => onFilterChange({ ...filters, year: e.target.value as string })}
                            displayEmpty
                            renderValue={(selected) => !selected ? <span className="opacity-40">ANO</span> : (selected as string)}
                            sx={selectStyles}
                            MenuProps={menuProps}
                        >
                            <MenuItem disabled value="">SELECIONE O ANO</MenuItem>
                            {availableYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                        </Select>
                    </FormControl>
                )}

                <FormControl className="w-[160px] shrink-0">
                    <Select
                        value={filters.course}
                        onChange={(e) => onFilterChange({ ...filters, course: e.target.value as string })}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) return <span className="opacity-40">CURSO</span>;
                            const fullLabel = COURSE_MAP[selected as string] || (selected as string);
                            return <span className="truncate" title={fullLabel}>{fullLabel}</span>;
                        }}
                        sx={selectStyles}
                        MenuProps={menuProps}
                    >
                        <MenuItem disabled value="">SELECIONE O CURSO</MenuItem>
                        {availableCourses.map(c => <MenuItem key={c} value={c}>{COURSE_MAP[c] || c}</MenuItem>)}
                    </Select>
                </FormControl>

                {showAdvisorFilter && (
                    <FormControl className="w-[170px] shrink-0">
                        <Select
                            value={filters.advisor}
                            onChange={(e) => onFilterChange({ ...filters, advisor: e.target.value as string })}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) return <span className="opacity-40">ORIENTADOR</span>;
                                return <span className="truncate" title={selected as string}>{selected as string}</span>;
                            }}
                            sx={selectStyles}
                            MenuProps={menuProps}
                        >
                            <MenuItem disabled value="">SELECIONE O ORIENTADOR</MenuItem>
                            {availableAdvisors.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                        </Select>
                    </FormControl>
                )}
            </div>

            {(filters.search || (filters.status as string) !== 'Todos' || filters.course || filters.advisor || filters.year) && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 mr-2"><Filter size={12} /> FILTROS:</span>
                    {filters.search && <FilterBadge label={`BUSCA: ${filters.search}`} onClear={() => clearFilter('search')} />}

                    {(filters.status as string) !== 'Todos' && (
                        <FilterBadge
                            label={`STATUS: ${STATUS_MAP[filters.status as InternshipStatus] || filters.status}`}
                            onClear={() => clearFilter('status')}
                        />
                    )}

                    {filters.year && <FilterBadge label={`ANO: ${filters.year}`} onClear={() => clearFilter('year')} />}
                    {filters.course && <FilterBadge label={`CURSO: ${filters.course}`} onClear={() => clearFilter('course')} />}
                    {filters.advisor && <FilterBadge label={`ORIENTADOR: ${filters.advisor}`} onClear={() => clearFilter('advisor')} />}

                    <button
                        onClick={() => onFilterChange({ search: '', status: 'Todos', course: '', advisor: '', year: '', sortOrder: 'newest' })}
                        className="text-[10px] font-black text-blue-600 uppercase ml-2 cursor-pointer transition-colors hover:text-blue-800"
                    >
                        Limpar Tudo
                    </button>
                </div>
            )}
        </div>
    );
};

const FilterBadge = ({ label, onClear }: { label: string, onClear: () => void }) => (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[10px] font-black uppercase tracking-widest leading-none max-w-full sm:max-w-[550px]">
        <Tooltip
            title={label}
            placement="top"
            arrow
            slotProps={{
                tooltip: {
                    sx: {
                        backgroundColor: '#1e293b',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '8px 12px',
                        borderRadius: '8px',
                    }
                },
                arrow: { sx: { color: '#1e293b' } }
            }}
        >
            <span className="truncate flex-1">{label}</span>
        </Tooltip>
        <button onClick={onClear} className="hover:bg-blue-200 rounded-full p-0.5 cursor-pointer transition-colors shrink-0">
            <X size={12} strokeWidth={3} />
        </button>
    </div>
);