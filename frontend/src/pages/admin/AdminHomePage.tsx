import React, { useState } from 'react';
import { ShieldCheck, Users, Briefcase, Plus, Search } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { Column } from '../../types'; // Certifique-se de importar a interface Column
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AddProcessModal } from '../../components/modals/AddProcessModal'; // Caminho atualizado
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

// Definindo a interface para o dado da tabela
interface AdminProcessData {
    id: string;
    name: string;
    ra: string;
    company: string;
    advisor: string;
    status: string;
}

export const AdminHomePage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [allProcesses] = useState<AdminProcessData[]>([
        { id: '1', name: 'Pedro Tortola', ra: '1561464', company: 'Google', advisor: 'Gabriel Godinho', status: 'ACTIVE' },
        { id: '2', name: 'Ana Silva', ra: '2233445', company: 'Meta', advisor: 'Eduardo Souto', status: 'ACTIVE' },
        { id: '3', name: 'Lucas Lima', ra: '9988776', company: 'Amazon', advisor: 'Gabriel Godinho', status: 'FINISHED' },
    ]);

    const columns: Column<AdminProcessData>[] = [
        { header: 'Aluno', key: 'name' },
        { header: 'RA', key: 'ra' },
        { header: 'Empresa', key: 'company' },
        { header: 'Orientador', key: 'advisor' },
        {
            header: 'Status',
            key: 'status',
            render: (val: any) => <StatusBadge status={val === 'ACTIVE' ? 'Em dia' : 'Finalizado'} />
        },
        {
            header: 'Ação',
            key: 'actions',
            render: (_, row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${PATHS.ALUNO.ROOT}/${row.ra}`);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline cursor-pointer"
                >
                    Inspecionar
                </button>
            )
        }
    ];

    const filteredData = allProcesses.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ra.includes(searchTerm) ||
        p.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <ShieldCheck size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Painel Administrativo</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestão Global de Estágios</h1>
                    <p className="text-slate-500 font-medium">Controle centralizado de todos os processos da universidade.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                >
                    <Plus size={18} />
                    Novo Processo
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                        <Users size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total de Alunos</p>
                    <p className="text-3xl font-black text-slate-800">{allProcesses.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                        <Briefcase size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processos Ativos</p>
                    <p className="text-3xl font-black text-slate-800">
                        {allProcesses.filter(p => p.status === 'ACTIVE').length}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Base de Dados SEI</h3>
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            placeholder="Buscar por nome, RA ou empresa..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    onRowClick={(row) => navigate(`${PATHS.ALUNO.ROOT}/${row.ra}`)}
                />
            </div>

            <AddProcessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(data) => console.log("Salvar:", data)}
            />
        </div>
    );
};