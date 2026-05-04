import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Plus, AlertCircle } from 'lucide-react';
import { ProcessFormData, InternshipStatus } from '../../types';
import { StudentSection } from '../forms/StudentSection';
import { AdvisorSection } from '../forms/AdvisorSection';
import { CompanySection } from '../forms/CompanySection';
import { ProcessDetailsSection } from '../forms/ProcessDetailsSection';
import { StatusSelect } from '../ui/StatusSelect';
import { ProcessReviewModal } from './ProcessReviewModal';

interface ProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: ProcessFormData) => void;
    initialData?: ProcessFormData | null;
}

export const ProcessModal = ({ isOpen, onClose, onSuccess, initialData }: ProcessModalProps) => {
    const isEdit = !!initialData;
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const labelMapping: Record<string, { label: string, group: 'aluno' | 'orientador' | 'empresa' | 'processo' }> = {
        student_name: { label: 'Nome do Aluno', group: 'aluno' },
        student_email: { label: 'E-mail Institucional', group: 'aluno' },
        student_phone: { label: 'Telefone de Contato', group: 'aluno' },
        student_ra: { label: 'Registro Acadêmico (RA)', group: 'aluno' },
        advisor_name: { label: 'Nome do Orientador', group: 'orientador' },
        advisor_email: { label: 'E-mail do Orientador', group: 'orientador' },
        advisor_phone: { label: 'Telefone do Orientador', group: 'orientador' },
        company_name: { label: 'Razão Social da Empresa', group: 'empresa' },
        company_cnpj: { label: 'CNPJ', group: 'empresa' },
        supervisor_name: { label: 'Supervisor da Empresa', group: 'empresa' },
        supervisor_email: { label: 'E-mail do Supervisor', group: 'empresa' },
        supervisor_cpf: { label: 'CPF do Supervisor', group: 'empresa' },
        sei_number: { label: 'Número do Processo SEI', group: 'processo' },
        category: { label: 'Tipo de Estágio', group: 'processo' },
        status: { label: 'Status do Processo', group: 'processo' },
        start_date: { label: 'Início do Processo', group: 'processo' }
    };

    const emptyForm: ProcessFormData = {
        student_name: '', student_email: '', student_phone: '', student_ra: '',
        advisor_name: '', advisor_email: '', advisor_phone: '',
        company_name: '', company_cnpj: '',
        supervisor_name: '', supervisor_email: '', supervisor_cpf: '',
        sei_number: '', category: 'NON_MANDATORY', status: 'Pendente',
        start_date: ''
    };

    const [formData, setFormData] = useState<ProcessFormData>(emptyForm);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || emptyForm);
            setSelectedDate(initialData?.start_date ? new Date(initialData.start_date) : null);
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            start_date: selectedDate
        }));
    }, [selectedDate]);

    const modifiedFields = useMemo(() => {
        if (!isEdit || !initialData) return [];
        return Object.keys(formData).filter((key) => {
            const k = key as keyof ProcessFormData;
            return formData[k] !== initialData[k];
        });
    }, [formData, initialData, isEdit]);

    const reviewData = useMemo(() => {
        const groups = { aluno: [] as any[], orientador: [] as any[], empresa: [] as any[], processo: [] as any[] };

        Object.keys(labelMapping).forEach(field => {
            const info = labelMapping[field];
            const value = (formData as any)[field];

            if (isEdit) {
                if (modifiedFields.includes(field)) {
                    groups[info.group].push({
                        fieldLabel: info.label,
                        from: (initialData as any)?.[field],
                        to: value
                    });
                }
            } else {
                if (value && value !== '' && field !== 'status') {
                    groups[info.group].push({
                        fieldLabel: info.label,
                        from: undefined,
                        to: value
                    });
                }
            }
        });
        return groups;
    }, [formData, modifiedFields, isEdit, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (e.target instanceof HTMLInputElement) e.target.setCustomValidity("");
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInvalid = (e: React.FormEvent<HTMLFormElement>) => {
        const target = e.target as HTMLInputElement;
        if (target.validity.valueMissing) target.setCustomValidity("Este campo é obrigatório.");
        else if (target.validity.typeMismatch && target.type === "email") target.setCustomValidity("E-mail inválido.");
        else target.setCustomValidity("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsReviewOpen(true);
    };

    const handleConfirmFinal = () => {
        onSuccess(formData);
        setIsReviewOpen(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[999] flex justify-center items-start pt-4 p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 text-left text-slate-800">

                    <div className={`px-8 py-6 border-b border-slate-100 flex items-center justify-between ${isEdit ? 'bg-blue-50/30' : 'bg-slate-50/50'}`}>
                        <div className="text-left">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                {isEdit ? 'Editar Processo' : 'Novo Processo'}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {isEdit ? `ID: ${initialData?.id || 'N/A'}` : 'UTFPR - CAMPUS CURITIBA'}
                            </p>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors outline-none">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <form id="process-form" onSubmit={handleSubmit} onInvalid={handleInvalid} className="p-8 space-y-12 overflow-y-auto custom-scrollbar">
                        {isEdit && (
                            <>
                                <div className="p-8 rounded-[24px] bg-slate-50/80 border border-slate-100 flex items-center justify-center">
                                    <div className="flex items-center gap-4 text-center">
                                        <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600 shrink-0">
                                            <AlertCircle size={24} />
                                        </div>
                                        <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                                            Você está no <span className="font-bold text-slate-700 uppercase tracking-tighter">Modo de Edição</span>.
                                            Campos modificados serão <span className="text-blue-600 font-bold underline decoration-blue-200 underline-offset-4">destacados em azul</span>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-start">
                                    <StatusSelect
                                        value={formData.status}
                                        onChange={(val: InternshipStatus) => setFormData(p => ({ ...p, status: val }))}
                                        isModified={modifiedFields.includes('status')}
                                    />
                                </div>
                            </>
                        )}

                        <StudentSection formData={formData} handleChange={handleChange} modifiedFields={modifiedFields} />
                        <AdvisorSection formData={formData} handleChange={handleChange} modifiedFields={modifiedFields} />
                        <CompanySection formData={formData} handleChange={handleChange} modifiedFields={modifiedFields} />
                        <ProcessDetailsSection
                            formData={formData}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            handleChange={handleChange}
                            modifiedFields={modifiedFields}
                        />
                    </form>

                    <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white shrink-0">
                        <button type="button" onClick={onClose} className="cursor-pointer px-6 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="process-form"
                            className={`cursor-pointer flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${isEdit ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                                }`}
                        >
                            {isEdit ? <Save size={16} /> : <Plus size={16} />}
                            {isEdit ? 'Revisar e Salvar' : 'Revisar e Criar'}
                        </button>
                    </div>
                </div>
            </div>

            <ProcessReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onConfirm={handleConfirmFinal}
                groupedChanges={reviewData}
                isEdit={isEdit}
            />
        </>
    );
};