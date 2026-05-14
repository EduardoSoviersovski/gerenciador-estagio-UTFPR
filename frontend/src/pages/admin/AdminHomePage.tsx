import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Plus, Settings, Users, Briefcase, Pencil } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { TableFilters } from '../../components/TableFilters';
import { TablePagination } from '../../components/TablePagination';
import { PATHS } from '../../routes/paths';
import { FilterState, InternshipStatus, Column } from '../../types';

interface InternshipProcess {
    id: string;
    studentName: string;
    ra: string;
    course: string;
    advisor: string;
    status: InternshipStatus;
}

const INITIAL_DATA: InternshipProcess[] = Array.from({ length: 45 }).map((_, i) => ({
    id: String(i + 1),
    studentName: i === 0 ? 'Pedro Tortola' : `Estudante Exemplo ${i + 1}`,
    ra: String(1561464 + i),
    course: i % 2 === 0 ? 'Eng. Computação' : 'Sistemas de Informação',
    advisor: i % 3 === 0 ? 'Gabriel Godinho' : 'Eduardo Souto',
    status: (['Em dia', 'Pendente', 'Em atraso', 'Finalizado'] as InternshipStatus[])[i % 4]
}));

const AdminSummaryCard = ({ icon, label, value, colorClass }: any) => (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 flex-1 min-w-[220px]">
        <div className={`p-4 bg-slate-50 rounded-2xl ${colorClass}`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
            <p className="text-4xl font-black text-slate-800">{value}</p>
        </div>
    </div>
);

export const AdminHomePage = () => {
    const navigate = useNavigate();
    const [processes] = useState<InternshipProcess[]>(INITIAL_DATA);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: 'Todos',
        course: '',
        advisor: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const availableCourses = Array.from(new Set(processes.map(p => p.course)));
    const availableAdvisors = Array.from(new Set(processes.map(p => p.advisor)));

    const filtered = processes.filter(p => {
        const matchesSearch =
            p.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
            p.ra.includes(filters.search);

        const matchesStatus = filters.status === 'Todos' || p.status === filters.status;
        const matchesCourse = !filters.course || p.course === filters.course;
        const matchesAdvisor = !filters.advisor || p.advisor === filters.advisor;

        return matchesSearch && matchesStatus && matchesCourse && matchesAdvisor;
    });

    const paginatedData = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns: Column<InternshipProcess>[] = [
        {
            header: '',
            key: 'actions',
            render: (_, process) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="p-1 text-slate-300 hover:text-blue-600 transition-all cursor-pointer"
                >
                    <Pencil size={16} />
                </button>
            )
        },
        { header: 'Aluno', key: 'studentName' },
        { header: 'RA', key: 'ra' },
        { header: 'Curso', key: 'course' },
        { header: 'Orientador', key: 'advisor' },
        {
            header: 'Status',
            key: 'status',
            render: (val) => (
                <span className="font-black uppercase text-[10px] tracking-widest text-slate-700">
                    {val}
                </span>
            )
        },
        {
            header: '',
            key: 'actions',
            render: (_, process) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${PATHS.ALUNO.ROOT}/${process.ra}`);
                    }}
                    className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer"
                >
                    Inspecionar
                </button>
            )
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest leading-none">
                        <ShieldCheck size={14} /> Painel Administrativo
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Gestão Global</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/management')}
                        className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                    >
                        <Settings size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Gestão de Dados</span>
                    </button>

                    <button
                        className="flex items-center gap-3 px-8 py-4 bg-[#1e293b] text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 cursor-pointer"
                    >
                        <Plus size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Novo Processo</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <AdminSummaryCard icon={<Users />} label="Total de Alunos" value={processes.length} colorClass="text-blue-600" />
                <AdminSummaryCard icon={<Briefcase />} label="Processos Ativos" value={processes.filter(p => p.status !== 'Finalizado').length} colorClass="text-emerald-600" />
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 space-y-8">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Base de Dados SEI</h2>

                    <TableFilters
                        filters={filters}
                        onFilterChange={(f) => {
                            setFilters(f);
                            setCurrentPage(1);
                        }}
                        availableCourses={availableCourses}
                        availableAdvisors={availableAdvisors}
                        showAdvisorFilter={true}
                    />

                    <DataTable
                        columns={columns}
                        data={paginatedData}
                    />
                </div>

                <TablePagination
                    count={Math.ceil(filtered.length / itemsPerPage)}
                    page={currentPage}
                    onChange={setCurrentPage}
                />
            </div>
        </div>
    );
};