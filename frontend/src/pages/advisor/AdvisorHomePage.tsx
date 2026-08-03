import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Clock, FileWarning, FileText } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { TableFilters } from '../../components/TableFilters';
import { TablePagination } from '../../components/TablePagination';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DateRangeModal } from '../../components/modals/DateRangeModal';
import { FilterState, Column } from '../../types';
import { DateRange } from 'react-day-picker';

import { useAuth } from '../../contexts/AuthContext';
import { advisorService } from '../../services/advisorService';
import { AdminProcessSummary } from '../../types/api';
import { SmartTooltipCell } from '../../components/ui/SmartTooltipCell';

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

const SummaryCardSkeleton = () => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 flex-1 min-w-[200px] h-[104px]">
        <div className="w-12 h-12 rounded-2xl bg-slate-200 animate-pulse shrink-0" />
        <div className="space-y-2 w-full">
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-12 bg-slate-200 rounded animate-pulse" />
        </div>
    </div>
);

export const AdvisorHomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [range, setRange] = useState<DateRange | undefined>();

    const [students, setStudents] = useState<AdminProcessSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<FilterState & { year?: string; sortOrder?: 'newest' | 'oldest' }>({
        search: '',
        status: 'Todos',
        course: '',
        advisor: '',
        year: '',
        sortOrder: 'newest'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchStudents = async () => {
            if (!user?.email) {
                setError("Usuário não autenticado ou sem e-mail.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await advisorService.getStudentProcesses();
                setStudents(data);
            } catch (err) {
                setError("Não foi possível carregar a lista de alunos.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [user?.email]);

    const availableCourses = Array.from(new Set(students.map(s => s.student_course)));

    const availableYears = Array.from(new Set(students.map(p => p.start_date ? p.start_date.substring(0, 4) : '')))
        .filter(Boolean)
        .sort((a, b) => Number(b) - Number(a));

    const filteredStudents = students.filter(s => {
        const matchesSearch =
            s.student_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            s.student_ra.includes(filters.search) ||
            s.sei_number.includes(filters.search);

        const matchesStatus = filters.status === 'Todos' || s.process_status === filters.status;
        const matchesCourse = !filters.course || s.student_course === filters.course;
        const matchesYear = !filters.year || (s.start_date && s.start_date.startsWith(filters.year));

        return matchesSearch && matchesStatus && matchesCourse && matchesYear;
    });

    const sortedData = [...filteredStudents].sort((a, b) => {
        const timeA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const timeB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return filters.sortOrder === 'oldest' ? timeA - timeB : timeB - timeA;
    });

    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns: Column<AdminProcessSummary>[] = [
        {
            header: 'Aluno',
            key: 'student_name',
            className: 'px-4 max-w-[160px] sm:max-w-[250px]',
            render: (val: any) => (
                <div className="w-full">
                    <SmartTooltipCell>{val}</SmartTooltipCell>
                </div>
            )
        },
        {
            header: 'RA',
            key: 'student_ra',
            className: 'px-4 w-fit whitespace-nowrap'
        },
        {
            header: 'Curso',
            key: 'student_course',
            className: 'px-2 w-fit whitespace-nowrap text-center',
            render: (val: any) => <div className="font-medium text-slate-600">{val}</div>
        },
        {
            header: 'Início',
            key: 'start_date',
            className: 'px-4 w-fit whitespace-nowrap text-center',
            render: (val: any) => {
                if (!val) return '-';
                const datePart = val.split('T')[0];
                const [year, month, day] = datePart.split('-');
                return `${day}/${month}/${year}`;
            }
        },
        {
            header: 'Status',
            key: 'process_status',
            render: (val: any) => (
                <div className="flex justify-start w-full min-w-fit">
                    <StatusBadge status={val} />
                </div>
            )
        },
    ];

    if (error) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-red-500 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {loading ? (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="text-left space-y-3 w-full">
                        <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-4 w-80 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="h-[46px] w-[260px] bg-slate-200 rounded-2xl animate-pulse shrink-0" />
                </div>
            ) : (
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
            )}

            <div className="flex flex-wrap gap-6">
                {loading ? (
                    <>
                        <SummaryCardSkeleton />
                        <SummaryCardSkeleton />
                        <SummaryCardSkeleton />
                    </>
                ) : (
                    <>
                        <SummaryCard icon={<UserCheck />} label="Total de Alunos" value={students.length} colorClass="text-blue-600" />
                        <SummaryCard icon={<Clock />} label="Ativos" value={students.filter(s => s.process_status === 'ACTIVE').length} colorClass="text-emerald-600" />
                        <SummaryCard icon={<FileWarning />} label="Finalizados" value={students.filter(s => s.process_status === 'COMPLETED').length} colorClass="text-amber-600" />
                    </>
                )}
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-8">
                {loading ? (
                    <div className="animate-pulse space-y-8">
                        <div className="h-6 w-64 bg-slate-200 rounded-lg" />
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-12 w-64 bg-slate-200 rounded-2xl" />
                                <div className="h-12 w-40 bg-slate-200 rounded-2xl" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-12 w-full bg-slate-100 rounded-xl" />
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-16 w-full bg-slate-50 rounded-xl border border-slate-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-10">
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Lista de Supervisionados</h2>

                            {/* Dica visual adicionada */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    💡 Clique em uma linha para inspecionar
                                </span>
                            </div>
                        </div>

                        <TableFilters
                            filters={filters}
                            onFilterChange={(f) => {
                                setFilters(f);
                                setCurrentPage(1);
                            }}
                            availableCourses={availableCourses}
                            availableYears={availableYears}
                            showAdvisorFilter={false}
                        />

                        <DataTable
                            columns={columns}
                            data={paginatedData}
                            onRowClick={(student) => navigate(`/student/process/${student.process_id}`)}
                        />

                        <TablePagination
                            count={Math.ceil(sortedData.length / itemsPerPage)}
                            page={currentPage}
                            onChange={setCurrentPage}
                        />
                    </>
                )}
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