import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Pencil, Trash2, Plus,
    ShieldCheck, Briefcase, Users
} from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { TablePagination } from '../../components/TablePagination';
import { Column } from '../../types';
import { StatusBadge, InternshipStatus } from '../../components/ui/StatusBadge';
import { PATHS } from '../../routes/paths';
import { AddProcessModal } from '../../components/modals/AddProcessModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';

interface InternshipProcess {
    id: string;
    studentName: string;
    ra: string;
    company: string;
    advisor: string;
    status: InternshipStatus;
}

const INITIAL_DATA: InternshipProcess[] = Array.from({ length: 45 }).map((_, i) => ({
    id: String(i + 1),
    studentName: i === 0 ? 'Pedro Tortola' : `Estudante Exemplo ${i + 1}`,
    ra: String(1561464 + i),
    company: i % 2 === 0 ? 'Google' : 'Meta',
    advisor: i % 3 === 0 ? 'Gabriel Godinho' : 'Eduardo Souto',
    status: (['Em dia', 'Pendente', 'Em atraso', 'Finalizado'] as InternshipStatus[])[i % 4]
}));

const AdminSummaryCard = ({ icon, label, value, colorClass }: any) => (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 flex-1 min-w-[200px]">
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

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [processes, setProcesses] = useState<InternshipProcess[]>(INITIAL_DATA);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredProcesses = processes.filter(p =>
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ra.includes(searchTerm) ||
        p.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);
    const paginatedData = filteredProcesses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const selectedProcessesForModal = processes
        .filter(p => selectedIds.includes(p.id))
        .map(p => ({
            id: p.id,
            studentName: p.studentName,
            ra: p.ra
        }));

    const handleConfirmDelete = () => {
        console.log("Chamando Backend para excluir IDs:", selectedIds);

        setProcesses(prev => prev.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
        setIsDeleteModalOpen(false);
        setCurrentPage(1);
    };

    const handleAddProcessSuccess = (newProcess: any) => {
        console.log("Novo processo criado com sucesso:", newProcess);
        setIsAddModalOpen(false);
    };

    const columns: Column<InternshipProcess>[] = [
        {
            header: '',
            key: 'actions',
            render: (_, process) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("Edit Mode - Abrir popup para ID:", process.id);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-all cursor-pointer"
                >
                    <Pencil size={16} />
                </button>
            )
        },
        { header: 'Aluno', key: 'studentName' },
        { header: 'RA', key: 'ra' },
        { header: 'Empresa', key: 'company' },
        { header: 'Orientador', key: 'advisor' },
        {
            header: 'Status',
            key: 'status',
            render: (value: InternshipStatus) => <StatusBadge status={value} />
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
                    className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer whitespace-nowrap"
                >
                    Inspecionar
                </button>
            )
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Cabeçalho da Página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Painel Administrativo</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Gestão Global de Estágios</h1>
                    <p className="text-sm text-slate-500 font-medium">Controle centralizado de todos os processos da universidade.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-[#1e293b] text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 cursor-pointer"
                >
                    <Plus size={18} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Novo Processo</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-6">
                <AdminSummaryCard icon={<Users />} label="Total de Alunos" value={processes.length} colorClass="text-blue-600" />
                <AdminSummaryCard icon={<Briefcase />} label="Processos Ativos" value={processes.filter(p => p.status !== 'Finalizado').length} colorClass="text-emerald-600" />
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Base de Dados SEI</h2>
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-in zoom-in cursor-pointer hover:bg-red-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Excluir ({selectedIds.length})</span>
                                </button>
                            )}
                        </div>
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por nome, RA ou empresa..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        selectable={true}
                        idKey="id"
                        selectedIds={selectedIds}
                        onSelectionChange={(ids: any) => setSelectedIds(ids)}
                    />
                </div>

                <TablePagination
                    count={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                />
            </div>

            <AddProcessModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddProcessSuccess}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                selectedItems={selectedProcessesForModal}
            />
        </div>
    );
};