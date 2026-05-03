import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Plus, AlertCircle } from 'lucide-react';
import { ProcessFormData, InternshipStatus } from '../../types';
import { StudentSection } from '../forms/StudentSection';
import { AdvisorSection } from '../forms/AdvisorSection';
import { CompanySection } from '../forms/CompanySection';
import { ProcessDetailsSection } from '../forms/ProcessDetailsSection';
import { StatusSelect } from '../ui/StatusSelect';
import { EditReviewModal } from './EditReviewModal';

interface ProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: ProcessFormData) => void;
    initialData?: ProcessFormData | null;
}

export const ProcessModal = ({ isOpen, onClose, onSuccess, initialData }: ProcessModalProps) => {
    const isEdit = !!initialData;
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const emptyForm: ProcessFormData = {
        student_name: '',
        student_email: '',
        student_phone: '',
        student_ra: '',
        advisor_name: '',
        advisor_email: '',
        advisor_phone: '',
        company_name: '',
        company_cnpj: '',
        supervisor_name: '',
        supervisor_email: '',
        supervisor_cpf: '',
        sei_number: '',
        category: 'NON_MANDATORY',
        status: 'Pendente'
    };

    const [formData, setFormData] = useState<ProcessFormData>(emptyForm);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || emptyForm);
            setSelectedDate(null);
        }
    }, [isOpen, initialData]);

    const modifiedFields = useMemo(() => {
        if (!isEdit || !initialData) return [];
        return Object.keys(formData).filter((key) => {
            const k = key as keyof ProcessFormData;
            return formData[k] !== initialData[k];
        });
    }, [formData, initialData, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (e.target instanceof HTMLInputElement) {
            e.target.setCustomValidity("");
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInvalid = (e: React.FormEvent<HTMLFormElement>) => {
        const target = e.target as HTMLInputElement;
        if (target.validity.valueMissing) {
            target.setCustomValidity("Este campo é obrigatório.");
        } else if (target.validity.typeMismatch && target.type === "email") {
            target.setCustomValidity("Por favor, insira um endereço de e-mail válido.");
        } else {
            target.setCustomValidity("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && modifiedFields.length > 0) {
            setIsReviewOpen(true);
        } else {
            onSuccess(formData);
            onClose();
        }
    };

    const handleConfirmFinal = () => {
        onSuccess(formData);
        setIsReviewOpen(false);
        onClose();
    };

    const changesList = modifiedFields.map(field => {
        const k = field as keyof ProcessFormData;
        return {
            field,
            from: (initialData as any)?.[k] || 'Vazio',
            to: (formData as any)[k]
        };
    });

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[999] flex justify-center items-start pt-4 p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 text-left text-slate-800">

                    {/* Header */}
                    <div className={`px-8 py-6 border-b border-slate-100 flex items-center justify-between ${isEdit ? 'bg-blue-50/30' : 'bg-slate-50/50'}`}>
                        <div className="text-left">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                {isEdit ? 'Editar Processo' : 'Novo Processo'}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {isEdit ? `ID: ${initialData?.id || 'N/A'}` : 'UTFPR - CAMPUS PINHAIS'}
                            </p>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors outline-none">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <form id="process-form" onSubmit={handleSubmit} onInvalid={handleInvalid} className="p-8 space-y-12 overflow-y-auto custom-scrollbar">
                        {isEdit && (
                            <>
                                {/* Alerta Centralizado com Fonte Aumentada */}
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
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-xl">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="process-form"
                            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${isEdit ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                                }`}
                        >
                            {isEdit ? <Save size={16} /> : <Plus size={16} />}
                            {isEdit ? 'Revisar e Salvar' : 'Criar Processo'}
                        </button>
                    </div>
                </div>
            </div>

            <EditReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onConfirm={handleConfirmFinal}
                changes={changesList}
            />
        </>
    );
};