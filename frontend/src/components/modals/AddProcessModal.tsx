import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { StudentSection } from '../forms/StudentSection';
import { AdvisorSection } from '../forms/AdvisorSection';
import { CompanySection } from '../forms/CompanySection';
import { ProcessDetailsSection } from '../forms/ProcessDetailsSection';

export const AddProcessModal = ({ isOpen, onClose, onSuccess }: any) => {
    const [formData, setFormData] = useState({
        student_name: '', student_email: '', student_phone: '', student_ra: '',
        advisor_name: '', advisor_email: '', advisor_phone: '',
        company_name: '', company_cnpj: '', supervisor_name: '',
        supervisor_email: '', supervisor_cpf: '', sei_number: '', category: 'NON_MANDATORY'
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuccess({ ...formData, start_date: selectedDate });
    };

    return (
        <div className="fixed inset-0 z-[999] flex justify-center items-start pt-4 p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-100">

                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Novo Processo de Estágio</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full cursor-pointer transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-12 custom-scrollbar">
                    <StudentSection formData={formData} handleChange={handleChange} />
                    <AdvisorSection formData={formData} handleChange={handleChange} />
                    <CompanySection formData={formData} handleChange={handleChange} />
                    <ProcessDetailsSection
                        formData={formData}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        handleChange={handleChange}
                    />
                </form>

                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-all">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                        <Plus size={16} /> Criar Processo
                    </button>
                </div>
            </div>
        </div>
    );
};