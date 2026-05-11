import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Clock, FileWarning, FileText } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { TableFilters } from '../../components/TableFilters';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DateRangeModal } from '../../components/modals/DateRangeModal';
import { PATHS } from '../../routes/paths';
import { ManagedStudent, FilterState, Column } from '../../types';
import { DateRange } from 'react-day-picker';

const SummaryCard = ({ icon, label, value, colorClass }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 flex-1 min-w-[200px]">
        <div className={`p-3 bg-slate-50 rounded-2xl ${colorClass}`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <p className="text-2xl font-black text-slate-800">{value}</p>
        </div>
    </div>
);

export const AdvisorHomePage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [range, setRange] = useState<DateRange | undefined>();

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: 'Todos',
        course: '',
        advisor: ''
    });

    const [students] = useState<ManagedStudent[]>([
        {
            id: '1',
            name: 'Pedro Tortola',
            ra: '1561464',
            email: 'pedro@mail.com',
            course: 'Eng. Computação',
            status: 'Em dia',
            lastUpdate: '10/05/2026'
        },
        {
            id: '2',
            name: 'Eduardo Souto',
            ra: '1561465',
            email: 'edu@mail.com',
            course: 'Sistemas de Informação',
            status: 'Pendente',
            lastUpdate: '08/05/2026'
        }
    ]);

    const availableCourses = Array.from(new Set(students.map(s => s.course)));

    const filteredStudents = students.filter(s => {
        const matchesSearch =
            s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            s.ra.includes(filters.search) ||
            s.email.toLowerCase().includes(filters.search.toLowerCase());

        const matchesStatus = filters.status === 'Todos' || s.status === filters.status;
        const matchesCourse = !filters.course || s.course === filters.course;

        return matchesSearch && matchesStatus && matchesCourse;
    });

    const columns: Column<ManagedStudent>[] = [
        { header: 'Aluno', key: 'name' },
        { header: 'RA', key: 'ra' },
        { header: 'Curso', key: 'course' },
        {
            header: 'Status',
            key: 'status',
            render: (val) => <StatusBadge status={val} />
        },
        { header: 'Última Entrega', key: 'lastUpdate' },
        {
            header: 'Ação',
            key: 'actions',
            render: (_, s) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${PATHS.ALUNO.ROOT}/${s.ra}`);
                    }}
                    className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer transition-all"
                >
                    Analisar
                </button>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="text-left space-y-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Painel de Supervisão</h1>
                    <p className="text-sm text-slate-500 font-medium">Gerenciamento de estagiários sob sua responsabilidade.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all group shrink-0 shadow-sm cursor-pointer"
                >
                    <FileText size={18} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        Gerar Relatório de Supervisão
                    </span>
                </button>
            </div>

            <div className="flex flex-wrap gap-6">
                <SummaryCard icon={<UserCheck />} label="Alunos Ativos" value={students.length} colorClass="text-emerald-600" />
                <SummaryCard icon={<Clock />} label="Pendentes" value={students.filter(s => s.status === 'Pendente').length} colorClass="text-amber-600" />
                <SummaryCard icon={<FileWarning />} label="Em Atraso" value={students.filter(s => s.status === 'Em atraso').length} colorClass="text-red-600" />
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Lista de Supervisionados</h2>
                </div>

                <TableFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    availableCourses={availableCourses}
                    showAdvisorFilter={false}
                />

                <DataTable
                    columns={columns}
                    data={filteredStudents}
                />
            </div>

            <DateRangeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedRange={range}
                onSelectRange={setRange}
                onConfirm={() => setIsModalOpen(false)}
            />
        </div>
    );
};