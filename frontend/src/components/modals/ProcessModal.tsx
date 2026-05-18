import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Plus } from 'lucide-react';
import {
    ProcessFormData,
    InternshipStatus
} from '../../types';
import { StudentSection } from '../forms/StudentSection';
import { AdvisorSection } from '../forms/AdvisorSection';
import { CompanySection } from '../forms/CompanySection';
import { ProcessDetailsSection } from '../forms/ProcessDetailsSection';
import { StatusSelect } from '../ui/StatusSelect';
import { ProcessReviewModal } from './ProcessReviewModal';
import { SelectChangeEvent } from '@mui/material';

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
        student_course: { label: 'Curso do Aluno', group: 'aluno' },
        student_period: { label: 'Período', group: 'aluno' },
        advisor_name: { label: 'Nome do Orientador', group: 'orientador' },
        advisor_email: { label: 'E-mail do Orientador', group: 'orientador' },
        advisor_phone: { label: 'Telefone do Orientador', group: 'orientador' },
        advisor_department: { label: 'Departamento', group: 'orientador' },
        company_name: { label: 'Razão Social da Empresa', group: 'empresa' },
        company_cnpj: { label: 'CNPJ', group: 'empresa' },
        supervisor_name: { label: 'Supervisor da Empresa', group: 'empresa' },
        supervisor_email: { label: 'E-mail do Supervisor', group: 'empresa' },
        supervisor_cpf: { label: 'CPF do Supervisor', group: 'empresa' },
        sei_number: { label: 'Número do Processo SEI', group: 'processo' },
        internship_type: { label: 'Tipo de Estágio', group: 'processo' },
        process_status: { label: 'Status do Processo', group: 'processo' },
        start_date: { label: 'Início do Processo', group: 'processo' },
        weekly_hours: { label: 'Carga Horária Semanal', group: 'processo' },
        target_hours: { label: 'Carga Horária Total', group: 'processo' }
    };

    const emptyForm: ProcessFormData = {
        student_name: '', student_email: '', student_phone: '', student_ra: '',
        student_course: '', student_period: '',
        advisor_name: '', advisor_email: '', advisor_phone: '', advisor_department: '',
        company_name: '', company_cnpj: '',
        supervisor_name: '', supervisor_email: '', supervisor_cpf: '',
        sei_number: '', internship_type: '', process_status: 'ACTIVE',
        start_date: '', weekly_hours: '', target_hours: ''
    };

    const [formData, setFormData] = useState<ProcessFormData>(emptyForm);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || emptyForm);
            if (initialData?.start_date) {
                const dateStr = String(initialData.start_date);
                const [year, month, day] = dateStr.split('T')[0].split('-');
                setSelectedDate(new Date(Number(year), Number(month) - 1, Number(day)));
            } else {
                setSelectedDate(new Date());
            }
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        setFormData(prev => ({ ...prev, start_date: selectedDate }));
    }, [selectedDate]);

    const isFormValid = useMemo(() => {
        const requiredFields = [
            'student_name', 'student_email', 'student_ra', 'student_course',
            'student_period', 'advisor_name', 'advisor_email', 'company_name',
            'supervisor_name', 'supervisor_email', 'sei_number', 'internship_type',
            'weekly_hours', 'target_hours'
        ];

        const hasAllFields = requiredFields.every(field => {
            const val = (formData as any)[field];
            return val !== '' && val !== null && val !== undefined;
        });

        return hasAllFields && selectedDate !== null;
    }, [formData, selectedDate]);

    // CORREÇÃO DEFINITIVA DO BUG DA DATA: Normaliza strings de data para evitar falsos positivos
    const modifiedFields = useMemo(() => {
        if (!isEdit || !initialData) return [];
        return Object.keys(formData).filter((key) => {
            const k = key as keyof ProcessFormData;

            if (k === 'start_date') {
                const currentVal = formData[k];
                const initialVal = initialData[k];

                const currentStr = currentVal instanceof Date
                    ? currentVal.toISOString().split('T')[0]
                    : String(currentVal || '').split('T')[0];

                const initialStr = initialVal instanceof Date
                    ? initialVal.toISOString().split('T')[0]
                    : String(initialVal || '').split('T')[0];

                return currentStr !== initialStr;
            }

            return formData[k] !== initialData[k];
        });
    }, [formData, initialData, isEdit]);

    const reviewData = useMemo(() => {
        const groups = {
            aluno: [] as any[],
            orientador: [] as any[],
            empresa: [] as any[],
            processo: [] as any[]
        };

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
                if (value && String(value).trim() !== '' && field !== 'status') {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => {
        const name = e.target.name as string;
        const value = e.target.value;

        if (e.target && 'setCustomValidity' in e.target) {
            (e.target as HTMLInputElement).setCustomValidity("");
        }

        const isNumeric = ['student_period', 'weekly_hours', 'target_hours'].includes(name);
        const finalValue = isNumeric ? (value !== '' ? Number(value) : '') : value;

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleConfirmFinal = () => {
        let formattedDate = '';
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }

        onSuccess({ ...formData, start_date: formattedDate });
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
                        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors outline-none cursor-pointer">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <form id="process-form" onSubmit={(e) => { e.preventDefault(); setIsReviewOpen(true); }} className="p-8 space-y-12 overflow-y-auto custom-scrollbar">
                        {isEdit && (
                            <div className="flex justify-start">
                                <StatusSelect
                                    value={formData.process_status}
                                    onChange={(val: InternshipStatus) => setFormData(p => ({ ...p, status: val }))}
                                    isModified={modifiedFields.includes('status')}
                                />
                            </div>
                        )}

                        <StudentSection formData={formData} handleChange={handleChange} modifiedFields={modifiedFields} />
                        <AdvisorSection formData={formData} handleChange={handleChange as any} modifiedFields={modifiedFields} />
                        <CompanySection formData={formData} handleChange={handleChange as any} modifiedFields={modifiedFields} />
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
                            disabled={!isFormValid}
                            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all 
                                ${!isFormValid
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                                    : 'bg-slate-900 text-white cursor-pointer hover:bg-slate-800'
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