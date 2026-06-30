import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { ProcessFormData, InternshipStatus } from '../../types';
import { StudentSection } from '../forms/StudentSection';
import { AdvisorSection } from '../forms/AdvisorSection';
import { CompanySection } from '../forms/CompanySection';
import { ProcessDetailsSection } from '../forms/ProcessDetailsSection';
import { StatusSelect } from '../ui/StatusSelect';
import { ProcessReviewModal } from './ProcessReviewModal';
import { SelectChangeEvent } from '@mui/material';
import { adminService } from '../../services/adminService';

const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    let sum = 0, rest;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.substring(10, 11))) return false;
    return true;
};

interface ProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: ProcessFormData) => void;
    initialData?: ProcessFormData | null;
}

export const ProcessModal = ({ isOpen, onClose, onSuccess, initialData }: ProcessModalProps) => {
    const isEdit = !!initialData;
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [isStudentGoogleLinked, setIsStudentGoogleLinked] = useState(false);
    const [isAdvisorGoogleLinked, setIsAdvisorGoogleLinked] = useState(false);

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
        student_course: '', student_period: '', advisor_name: '', advisor_email: '',
        advisor_phone: '', advisor_department: '', company_name: '', company_cnpj: '',
        supervisor_name: '', supervisor_email: '', supervisor_cpf: '',
        sei_number: '', internship_type: '', process_status: 'ACTIVE',
        start_date: '', weekly_hours: '', target_hours: ''
    };

    const [formData, setFormData] = useState<ProcessFormData>(emptyForm);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const checkExistingUsersOnEdit = async () => {
            if (initialData?.student_email) {
                try {
                    const userData = await adminService.getUserByEmail(initialData.student_email);
                    setIsStudentGoogleLinked(!!userData.google_id);
                } catch (e) { }
            }
            if (initialData?.advisor_email) {
                try {
                    const userData = await adminService.getUserByEmail(initialData.advisor_email);
                    setIsAdvisorGoogleLinked(!!userData.google_id);
                } catch (e) { }
            }
        };

        if (isOpen) {
            setFormData(initialData || emptyForm);
            setErrors({});

            if (initialData) {
                checkExistingUsersOnEdit();
            } else {
                setIsStudentGoogleLinked(false);
                setIsAdvisorGoogleLinked(false);
            }

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
        setFormData(prev => ({ ...prev, start_date: selectedDate as any }));
    }, [selectedDate]);

    const validateField = (name: string, value: string) => {
        if (!value) return '';
        switch (name) {
            case 'student_email': return !value.endsWith('@alunos.utfpr.edu.br') ? 'Deve terminar em @alunos.utfpr.edu.br' : '';
            case 'advisor_email': return !value.endsWith('@utfpr.edu.br') ? 'Deve terminar em @utfpr.edu.br' : '';
            case 'supervisor_cpf': return !isValidCPF(value) ? 'CPF inválido' : '';
            case 'student_phone':
            case 'advisor_phone': return (value.length < 10 || value.length > 11) ? 'Obrigatório incluir o DDD (10-11 dígitos)' : '';
            default: return '';
        }
    };

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        const isEmailField = name === 'student_email' || name === 'advisor_email';
        const hasValueChanged = isEdit ? value !== (initialData as any)?.[name] : true;

        if (isEmailField && value.includes('@') && hasValueChanged) {
            try {
                const userData = await adminService.getUserByEmail(value);
                if (name === 'student_email') {
                    setFormData(prev => ({
                        ...prev,
                        student_name: userData.name || prev.student_name,
                        student_ra: userData.ra || prev.student_ra,
                        student_phone: userData.phone || prev.student_phone,
                    }));
                    setIsStudentGoogleLinked(!!userData.google_id);
                } else if (name === 'advisor_email') {
                    setFormData(prev => ({
                        ...prev,
                        advisor_name: userData.name || prev.advisor_name,
                        advisor_phone: userData.phone || prev.advisor_phone,
                        advisor_department: userData.department || prev.advisor_department,
                    }));
                    setIsAdvisorGoogleLinked(!!userData.google_id);
                }
            } catch (error: any) {
                if (error.response?.status === 404) {
                    if (name === 'student_email') setIsStudentGoogleLinked(false);
                    if (name === 'advisor_email') setIsAdvisorGoogleLinked(false);
                } else {
                    console.error("Erro ao buscar dados do usuário para o Autofill:", error);
                }
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => {
        const name = e.target.name as string;
        let value = e.target.value;
        setErrors(prev => ({ ...prev, [name]: '' }));
        if (['student_ra', 'supervisor_cpf', 'sei_number', 'student_phone', 'advisor_phone'].includes(name)) {
            value = value.replace(/\D/g, '').substring(0, name.includes('ra') ? 7 : 11);
        }
        if (name === 'company_cnpj') value = value.toUpperCase().substring(0, 14);
        if (['student_name', 'advisor_name', 'supervisor_name'].includes(name)) value = value.replace(/[0-9!@#$%^&*()_+=[\]{};:"\\|,.<>/?-]/g, '');
        const isNumeric = ['student_period', 'weekly_hours', 'target_hours'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? (value !== '' ? Number(value) : '') : value }));
    };

    const isFormValid = useMemo(() => {
        const required = ['student_name', 'student_email', 'student_ra', 'student_course', 'student_period', 'advisor_name', 'advisor_department', 'advisor_email', 'company_name', 'supervisor_name', 'supervisor_email', 'sei_number', 'internship_type', 'weekly_hours', 'target_hours', 'supervisor_cpf', 'company_cnpj', 'student_phone', 'advisor_phone'];
        const hasAllFields = required.every(field => !!(formData as any)[field]);
        return hasAllFields && Object.values(errors).every(err => err === '') && selectedDate !== null;
    }, [formData, selectedDate, errors]);

    const modifiedFields = useMemo(() => {
        if (!isEdit || !initialData) return [];
        return Object.keys(formData).filter((key) => {
            const k = key as keyof ProcessFormData;
            const currentVal = formData[k];
            const initialVal = initialData[k];
            if (k === 'start_date') {
                const currentStr = currentVal instanceof Date ? currentVal.toISOString().split('T')[0] : String(currentVal || '').split('T')[0];
                const initialStr = initialVal instanceof Date ? initialVal.toISOString().split('T')[0] : String(initialVal || '').split('T')[0];
                return currentStr !== initialStr;
            }
            return String(currentVal) !== String(initialVal);
        });
    }, [formData, initialData, isEdit]);

    const reviewData = useMemo(() => {
        const groups = { aluno: [] as any[], orientador: [] as any[], empresa: [] as any[], processo: [] as any[] };
        Object.keys(labelMapping).forEach(field => {
            const value = (formData as any)[field];
            if (isEdit ? modifiedFields.includes(field) : (!!value && field !== 'process_status')) {
                groups[labelMapping[field].group].push({
                    fieldKey: field,
                    fieldLabel: labelMapping[field].label,
                    from: (initialData as any)?.[field],
                    to: value
                });
            }
        });
        return groups;
    }, [formData, modifiedFields, isEdit, initialData]);

    const handleConfirmFinal = () => {
        onSuccess({ ...formData, start_date: selectedDate ? selectedDate.toISOString().split('T')[0] : '' });
        setIsReviewOpen(false);
        onClose();
    };

    const isSaveDisabled = !isFormValid || (isEdit && modifiedFields.length === 0);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[999] flex justify-center items-start pt-4 p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300"
            >
                <div
                    className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 text-left text-slate-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`px-8 py-6 border-b border-slate-100 flex items-center justify-between ${isEdit ? 'bg-blue-50/30' : 'bg-slate-50/50'}`}>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">{isEdit ? 'Editar Processo' : 'Novo Processo'}</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{isEdit ? `ID: ${initialData?.id}` : 'UTFPR - CAMPUS CURITIBA'}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer outline-none">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <form id="process-form" onSubmit={(e) => { e.preventDefault(); setIsReviewOpen(true); }} className="p-8 space-y-12 overflow-y-auto custom-scrollbar">
                        {isEdit && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StatusSelect
                                    value={formData.process_status as InternshipStatus}
                                    onChange={(v: InternshipStatus) => setFormData(p => ({ ...p, process_status: v }))}
                                    isModified={modifiedFields.includes('process_status')}
                                    isEdit={isEdit}
                                />
                            </div>
                        )}

                        <StudentSection
                            formData={formData}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            modifiedFields={modifiedFields}
                            errors={errors}
                            isEdit={isEdit}
                            isGoogleLinked={isStudentGoogleLinked}
                        />
                        <AdvisorSection
                            formData={formData}
                            handleChange={handleChange as any}
                            handleBlur={handleBlur}
                            modifiedFields={modifiedFields}
                            errors={errors}
                            isEdit={isEdit}
                            isGoogleLinked={isAdvisorGoogleLinked}
                        />
                        <CompanySection formData={formData} handleChange={handleChange as any} handleBlur={handleBlur} modifiedFields={modifiedFields} errors={errors} isEdit={isEdit} />
                        <ProcessDetailsSection formData={formData} selectedDate={selectedDate} setSelectedDate={setSelectedDate} handleChange={handleChange} handleBlur={handleBlur} modifiedFields={modifiedFields} errors={errors} isEdit={isEdit} />
                    </form>

                    <div className={`px-8 py-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 ${isEdit ? 'bg-blue-50/30' : 'bg-slate-50/50'}`}>
                        <button type="button" onClick={onClose} className="cursor-pointer px-6 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200 rounded-xl transition-all">Cancelar</button>
                        <button
                            type="submit"
                            form="process-form"
                            disabled={isSaveDisabled}
                            className="cursor-pointer disabled:cursor-not-allowed px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 hover:bg-slate-800 transition-all"
                        >
                            {isEdit ? 'Revisar e Salvar' : 'Revisar e Criar'}
                        </button>
                    </div>
                </div>
            </div>
            <ProcessReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} onConfirm={handleConfirmFinal} groupedChanges={reviewData} isEdit={isEdit} />
        </>
    );
}