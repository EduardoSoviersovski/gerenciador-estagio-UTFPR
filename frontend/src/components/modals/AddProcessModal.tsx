import React, { useState } from 'react';
import {
    X, Plus, User, Mail, Phone, Hash,
    ShieldCheck, Building2, FileText, Briefcase
} from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { FormDatePicker } from '../ui/FormDatePicker';

interface AddProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (payload: any) => void;
}

export const AddProcessModal = ({ isOpen, onClose, onSuccess }: AddProcessModalProps) => {
    const [formData, setFormData] = useState({
        student_name: '', student_email: '', student_phone: '', student_ra: '',
        advisor_name: '', advisor_email: '', advisor_phone: '',
        company_name: '', company_cnpj: '', supervisor_name: '',
        supervisor_email: '', supervisor_cpf: '', sei_number: '', category: 'NON_MANDATORY'
    });

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;
        setLoading(true);

        onSuccess({
            ...formData,
            start_date: selectedDate.toISOString()
        });

        onClose();
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[999] flex justify-center items-start pt-4 p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl h-fit max-h-[90vh] rounded-[32px] shadow-2xl border border-slate-100 flex flex-col relative overflow-visible">

                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div className="text-left">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Novo Processo de Estágio</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">UTFPR - Campus Pinhais</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer outline-none">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10 custom-scrollbar overflow-x-visible overflow-y-auto">

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <User size={16} className="text-blue-600" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 text-left">Dados do Aluno</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FormInput label="Nome Completo" icon={User} name="student_name" value={formData.student_name} onChange={handleChange} />
                            <FormInput label="E-mail Acadêmico" icon={Mail} name="student_email" type="email" value={formData.student_email} onChange={handleChange} />
                            <FormInput label="Telefone" icon={Phone} name="student_phone" value={formData.student_phone} onChange={handleChange} />
                            <FormInput label="RA" icon={Hash} name="student_ra" value={formData.student_ra} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <ShieldCheck size={16} className="text-indigo-600" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 text-left">Dados do Orientador</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInput label="Professor" icon={User} name="advisor_name" value={formData.advisor_name} onChange={handleChange} />
                            <FormInput label="E-mail Institucional" icon={Mail} name="advisor_email" type="email" value={formData.advisor_email} onChange={handleChange} />
                            <FormInput label="Telefone/Ramal" icon={Phone} name="advisor_phone" value={formData.advisor_phone} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Building2 size={16} className="text-emerald-600" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 text-left">Empresa e Supervisão</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormInput label="Razão Social" icon={Building2} name="company_name" value={formData.company_name} onChange={handleChange} />
                            <FormInput label="CNPJ" icon={FileText} name="company_cnpj" value={formData.company_cnpj} onChange={handleChange} />
                            <FormInput label="Nome do Supervisor" icon={User} name="supervisor_name" value={formData.supervisor_name} onChange={handleChange} />
                            <FormInput label="E-mail Supervisor" icon={Mail} name="supervisor_email" value={formData.supervisor_email} onChange={handleChange} />
                            <FormInput label="CPF Supervisor" icon={Hash} name="supervisor_cpf" value={formData.supervisor_cpf} onChange={handleChange} />

                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Categoria</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <select
                                        name="category"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer text-slate-700 font-medium"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="NON_MANDATORY">Não Obrigatório</option>
                                        <option value="MANDATORY">Obrigatório</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pb-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <FileText size={16} className="text-amber-600" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 text-left">Detalhes do Processo</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <FormInput label="Número SEI" icon={FileText} name="sei_number" placeholder="23064.XXXXXX/202X-XX" value={formData.sei_number} onChange={handleChange} />

                            <FormDatePicker
                                label="Data de Início"
                                value={selectedDate}
                                onChange={setSelectedDate}
                            />
                        </div>
                    </div>
                </form>

                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedDate}
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
                        Criar Processo
                    </button>
                </div>
            </div>
        </div>
    );
};