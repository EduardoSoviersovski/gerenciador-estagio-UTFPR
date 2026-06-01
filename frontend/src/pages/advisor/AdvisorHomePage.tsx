import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Clock, FileWarning, FileText } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { TableFilters } from '../../components/TableFilters';
import { TablePagination } from '../../components/TablePagination';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DateRangeModal } from '../../components/modals/DateRangeModal';
import { PATHS } from '../../routes/paths';
import { FilterState, Column } from '../../types';
import { DateRange } from 'react-day-picker';
import { CircularProgress } from '@mui/material';

import { useAuth } from '../../contexts/AuthContext';
import { advisorService } from '../../services/advisorService';
import { AdminProcessSummary } from '../../types/api';

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
    const { user } = useAuth(); // Para pegar o email do orientador logado

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [range, setRange] = useState<DateRange | undefined>();

    // Estados para consumo da API
    const [students, setStudents] = useState<AdminProcessSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: 'Todos',
        course: '',
        advisor: '' // Não será usado na view do orientador
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
                const data = await advisorService.getStudentProcesses(user.email);
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

    const filteredStudents = students.filter(s => {
        const matchesSearch =
            s.student_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            s.student_ra.includes(filters.search) ||
            s.sei_number.includes(filters.search);

        const matchesStatus = filters.status === 'Todos' || s.process_status === filters.status;
        const matchesCourse = !filters.course || s.student_course === filters.course;

        return matchesSearch && matchesStatus && matchesCourse;
    });

    const paginatedData = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns: Column<AdminProcessSummary>[] = [
        { header: 'Aluno', key: 'student_name' },
        { header: 'RA', key: 'student_ra' },
        { header: 'Curso', key: 'student_course' },
        {
            header: 'Status',
            key: 'process_status',
            render: (val: any) => <StatusBadge status={val} />
        },
        {
            header: 'Ação',
            key: 'actions',
            render: (_, s) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${PATHS.ALUNO.ROOT}/${s.student_ra}`);
                    }}
                    className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer transition-all"
                >
                    Analisar
                </button>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <CircularProgress size={32} sx={{ color: '#000' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-red-500 font-medium">
                {error}
            </div>
        );
    }

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
                <SummaryCard icon={<UserCheck />} label="Total de Alunos" value={students.length} colorClass="text-blue-600" />
                <SummaryCard icon={<Clock />} label="Ativos" value={students.filter(s => s.process_status === 'ACTIVE').length} colorClass="text-emerald-600" />
                <SummaryCard icon={<FileWarning />} label="Finalizados" value={students.filter(s => s.process_status === 'FINISHED').length} colorClass="text-amber-600" />
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Lista de Supervisionados</h2>
                </div>

                <TableFilters
                    filters={filters}
                    onFilterChange={(f) => {
                        setFilters(f);
                        setCurrentPage(1);
                    }}
                    availableCourses={availableCourses}
                    showAdvisorFilter={false} // Importante: escondemos o filtro de orientador!
                />

                <DataTable
                    columns={columns}
                    data={paginatedData}
                // Retiramos as props de "selectable" e "selectedIds" 
                // pois o orientador não deve ter a opção de deletar os processos por aqui
                />

                <TablePagination
                    count={Math.ceil(filteredStudents.length / itemsPerPage)}
                    page={currentPage}
                    onChange={setCurrentPage}
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