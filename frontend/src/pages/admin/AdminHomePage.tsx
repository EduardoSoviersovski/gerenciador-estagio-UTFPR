import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Plus, Settings, Users, Briefcase, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { TableFilters } from '../../components/TableFilters';
import { TablePagination } from '../../components/TablePagination';
import { PATHS } from '../../routes/paths';
import { FilterState, InternshipStatus, Column, ProcessFormData, AllowedCourses } from '../../types';
import { ProcessModal } from '../../components/modals/ProcessModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { StatusBadge } from '../../components/ui/StatusBadge';

import { adminService } from '../../services/adminService';
import { AdminProcessSummary, CreateProcessRequest, EditProcessRequest } from '../../types/api';
import Swal from 'sweetalert2';
import { DepartmentValue } from '../../constants/departments';

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

const AdminSummaryCardSkeleton = () => (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 flex-1 min-w-[220px] h-[168px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="space-y-2 mt-2 w-full flex flex-col items-center">
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
    </div>
);

const TableSkeleton = () => (
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
);

export const AdminHomePage = () => {
    const navigate = useNavigate();

    const [processes, setProcesses] = useState<AdminProcessSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: 'Todos',
        course: '',
        advisor: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProcess, setEditingProcess] = useState<ProcessFormData | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [rawProcessData, setRawProcessData] = useState<EditProcessRequest | null>(null);

    const fetchProcesses = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllProcesses();
            setProcesses(data);
        } catch (err) {
            console.error("Erro ao carregar processos:", err);
            setError("Não foi possível carregar a lista de processos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcesses();
    }, []);

    const availableCourses = Array.from(new Set(processes.map(p => p.student_course)));
    const availableAdvisors = Array.from(new Set(processes.map(p => p.advisor_name)));

    const handleOpenCreateModal = () => {
        setEditingProcess(null);
        setIsProcessModalOpen(true);
    };

    const handleOpenEditModal = async (processSummary: AdminProcessSummary) => {
        try {
            const fullData = await adminService.getProcessById(processSummary.process_id);
            Swal.close();

            setRawProcessData(fullData);

            const processToEdit: ProcessFormData = {
                id: processSummary.process_id,
                ...fullData,
                internship_type: String(fullData.internship_type).toLowerCase() === 'mandatory' ? 'mandatory' : 'non_mandatory',
                status: (fullData.process_status || 'ACTIVE').toUpperCase().trim() as InternshipStatus,
                target_hours: fullData.total_target_hours || fullData.target_hours || ''
            };

            setEditingProcess(processToEdit);
            setIsProcessModalOpen(true);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao carregar',
                text: 'Não foi Business buscar os detalhes completos deste processo.',
                confirmButtonColor: '#1e293b',
                customClass: { popup: 'rounded-[24px]' }
            });
            console.error("Falha ao abrir modal de edição:", error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);

            const targetIdsToDelete = processes
                .filter(p => selectedIds.includes(p.sei_number))
                .map(p => p.process_id);

            await adminService.deleteProcesses(targetIdsToDelete);
            setSelectedIds([]);
            setIsDeleteModalOpen(false);
            setCurrentPage(1);
            await fetchProcesses();

        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao deletar',
                text: err.response?.data?.detail || 'Não foi possível completar a exclusão dos itens.',
                confirmButtonColor: '#1e293b',
                customClass: { popup: 'rounded-[24px]' }
            });
            console.error("Falha na operação de exclusão:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessSubmit = async (data: ProcessFormData) => {
        try {
            setLoading(true);

            const formattedStartDate = typeof data.start_date === 'string'
                ? data.start_date
                : (data.start_date as unknown as Date)?.toISOString().split('T')[0];

            if (editingProcess && editingProcess.id) {
                const editPayload: EditProcessRequest = {
                    sei_number: data.sei_number,
                    student_name: data.student_name,
                    student_ra: data.student_ra,
                    student_email: data.student_email,
                    student_phone: data.student_phone,
                    student_course: data.student_course as AllowedCourses,
                    student_period: Number(data.student_period),
                    advisor_name: data.advisor_name,
                    advisor_email: data.advisor_email,
                    advisor_phone: data.advisor_phone,
                    advisor_department: data.advisor_department as DepartmentValue,
                    company_name: data.company_name,
                    company_cnpj: data.company_cnpj,
                    supervisor_name: data.supervisor_name,
                    supervisor_email: data.supervisor_email,
                    supervisor_cpf: data.supervisor_cpf,
                    process_status: data.process_status,
                    start_date: formattedStartDate,
                    weekly_hours: Number(data.weekly_hours),
                    target_hours: Number(data.target_hours),
                    internship_type: data.internship_type === 'mandatory' ? 'mandatory' : 'non_mandatory',
                };
                console.log("Payload para edição:", editPayload);
                await adminService.updateProcess(editingProcess.id.toString(), editPayload);
            } else {
                const createPayload: CreateProcessRequest = {
                    ...data,
                    student_period: Number(data.student_period),
                    weekly_hours: Number(data.weekly_hours),
                    target_hours: Number(data.target_hours),
                    start_date: formattedStartDate,
                    internship_type: data.internship_type === 'mandatory' ? 'mandatory' : 'non_mandatory',
                } as CreateProcessRequest;

                await adminService.createProcess(createPayload);
            }

            const updated = await adminService.getAllProcesses();
            setProcesses(updated);
            setIsProcessModalOpen(false);
            setEditingProcess(null);

        } catch (err: any) {
            let htmlContent = "Ocorreu um problema ao tentar salvar o processo.";

            if (err.validationDetails) {
                htmlContent = `
            <div style="text-align: left; font-size: 14px; color: #475569;">
                O backend recusou a submissão devido aos campos:
                ${err.validationDetails}
            </div>`;
            }

            Swal.fire({
                icon: 'error',
                title: 'Erro de Validação',
                html: htmlContent,
                confirmButtonColor: '#1e293b',
                customClass: { popup: 'rounded-[24px]' }
            });

            console.error("Erro capturado na página:", err);
        } finally {
            setLoading(false);
        }
    };

    const selectedProcessesForDelete = processes
        .filter(p => selectedIds.includes(p.sei_number))
        .map(p => ({
            id: p.sei_number,
            studentName: p.student_name,
            ra: p.student_ra
        }));

    const filtered = processes.filter(p => {
        const matchesSearch =
            p.student_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            p.student_ra.includes(filters.search) ||
            p.sei_number.includes(filters.search);

        const matchesStatus = filters.status === 'Todos' || p.process_status === filters.status;
        const matchesCourse = !filters.course || p.student_course === filters.course;
        const matchesAdvisor = !filters.advisor || p.advisor_name === filters.advisor;

        return matchesSearch && matchesStatus && matchesCourse && matchesAdvisor;
    });

    const paginatedData = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns: Column<AdminProcessSummary>[] = [
        {
            header: '',
            key: 'actions',
            render: (_, process) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(process);
                    }}
                    className="p-1 text-slate-300 hover:text-blue-600 transition-all cursor-pointer"
                >
                    <Pencil size={16} />
                </button>
            )
        },
        { header: 'Aluno', key: 'student_name' },
        { header: 'RA', key: 'student_ra' },
        { header: 'Curso', key: 'student_course' },
        { header: 'Orientador', key: 'advisor_name' },
        {
            header: 'Status',
            key: 'process_status',
            render: (val: any) => <StatusBadge status={val} />
        },
        {
            header: '',
            key: 'actions',
            render: (_, process) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${PATHS.ALUNO.ROOT}/${process.student_ra}`);
                    }}
                    className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer"
                >
                    Inspecionar
                </button>
            )
        }
    ];

    if (error) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-red-500 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10 text-left">

            {loading ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 w-full">
                        <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                        <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-[54px] w-[180px] bg-slate-200 rounded-2xl animate-pulse shrink-0" />
                        <div className="h-[54px] w-[180px] bg-slate-200 rounded-2xl animate-pulse shrink-0" />
                    </div>
                </div>
            ) : (
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
                            onClick={handleOpenCreateModal}
                            className="flex items-center gap-3 px-8 py-4 bg-[#1e293b] text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 cursor-pointer"
                        >
                            <Plus size={18} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Novo Processo</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-6">
                {loading ? (
                    <>
                        <AdminSummaryCardSkeleton />
                        <AdminSummaryCardSkeleton />
                    </>
                ) : (
                    <>
                        <AdminSummaryCard icon={<Users />} label="Total de Alunos" value={processes.length} colorClass="text-blue-600" />
                        <AdminSummaryCard icon={<Briefcase />} label="Processos Ativos" value={processes.filter(p => p.process_status !== 'FINISHED').length} colorClass="text-emerald-600" />
                    </>
                )}
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 space-y-8">
                    {loading ? (
                        <TableSkeleton />
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">Base de Dados SEI</h2>
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
                            </div>

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
                                selectable={true}
                                idKey="sei_number"
                                selectedIds={selectedIds}
                                onSelectionChange={(ids: any) => setSelectedIds(ids)}
                            />
                        </>
                    )}
                </div>

                {!loading && (
                    <TablePagination
                        count={Math.ceil(filtered.length / itemsPerPage)}
                        page={currentPage}
                        onChange={setCurrentPage}
                    />
                )}
            </div>

            <ProcessModal
                isOpen={isProcessModalOpen}
                onClose={() => {
                    setIsProcessModalOpen(false);
                    setEditingProcess(null);
                }}
                initialData={editingProcess}
                onSuccess={handleProcessSubmit}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                selectedItems={selectedProcessesForDelete}
            />
        </div>
    );
};