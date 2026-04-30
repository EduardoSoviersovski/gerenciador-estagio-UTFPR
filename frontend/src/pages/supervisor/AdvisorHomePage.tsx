import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ADICIONADO
import { FileText, UserCheck, Clock, FileWarning, Search } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DataTable } from '../../components/DataTable';
import { Column } from '../../types';
import { StatusBadge, InternshipStatus } from '../../components/ui/StatusBadge';
import { DateRangeModal } from '../../components/modals/DateRangeModal';
import { PATHS } from '../../routes/paths';
import { NoStudentsView } from '../../components/NoStudentsView';

interface ManagedStudent {
    id: string;
    name: string;
    ra: string;
    course: string;
    status: InternshipStatus;
    lastUpdate: string;
}

const SummaryCard = ({ icon, label, value, colorClass }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
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
    const [searchTerm, setSearchTerm] = useState('');

    const [students] = useState<ManagedStudent[]>(
        [
            {
                id: '101',
                name: 'Pedro Tortola',
                ra: '1561464',
                course: 'Eng. Computação',
                status: 'Em dia',
                lastUpdate: '22/04/2026'
            }
        ]
    );

    if (students.length === 0) {
        return <NoStudentsView />;
    }

    const handleGeneratePDF = () => {
        if (range?.from && range?.to) {
            console.log("Gerando PDF...");
            setIsModalOpen(false);
        }
    };

    const columns: Column<ManagedStudent>[] = [
        { header: 'Aluno', key: 'name' },
        { header: 'RA', key: 'ra' },
        { header: 'Curso', key: 'course' },
        {
            header: 'Status',
            key: 'status',
            render: (value: InternshipStatus) => <StatusBadge status={value} />
        },
        { header: 'Última Entrega', key: 'lastUpdate' },
        {
            header: 'Ação',
            key: 'actions',
            render: (_, student) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Impede o clique na linha da tabela
                        navigate(`${PATHS.ALUNO.ROOT}/${student.ra}`);
                    }}
                    className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer"
                >
                    Analisar
                </button>
            )
        }
    ];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ra.includes(searchTerm)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Painel de Supervisão</h1>
                    <p className="text-sm text-slate-500 font-medium">Acompanhamento de estagiários e validação de documentos.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all group shrink-0 shadow-sm"
                >
                    <FileText size={18} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        Gerar Relatório de Supervisão
                    </span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard icon={<UserCheck />} label="Alunos Ativos" value={students.length} colorClass="text-emerald-600" />
                <SummaryCard icon={<Clock />} label="Pendentes" value="0" colorClass="text-amber-600" />
                <SummaryCard icon={<FileWarning />} label="Em Atraso" value="0" colorClass="text-red-600" />
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Lista de Supervisionados</h2>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar aluno ou RA..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredStudents}
                    onRowClick={(student) => {
                        navigate(`${PATHS.ALUNO.ROOT}/${student.ra}`);
                    }}
                />
            </div>

            <DateRangeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedRange={range}
                onSelectRange={setRange}
                onConfirm={handleGeneratePDF}
            />
        </div>
    );
};