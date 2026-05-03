import React from 'react';
import { Building2, FileText, User, Hash, Mail, Briefcase } from 'lucide-react';
import { FormInput } from '../ui/FormInput';

export const CompanySection = ({ formData, handleChange }: any) => (
    <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 size={16} className="text-emerald-600" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Empresa e Supervisão</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
                <FormInput label="Razão Social" icon={Building2} name="company_name" value={formData.company_name} onChange={handleChange} required />
            </div>
            <div className="md:col-span-5">
                <FormInput label="CNPJ" icon={FileText} name="company_cnpj" value={formData.company_cnpj} onChange={handleChange} />
            </div>
            <div className="md:col-span-7">
                <FormInput label="Nome do Supervisor" icon={User} name="supervisor_name" value={formData.supervisor_name} onChange={handleChange} required />
            </div>
            <div className="md:col-span-5">
                <FormInput label="CPF Supervisor" icon={Hash} name="supervisor_cpf" value={formData.supervisor_cpf} onChange={handleChange} />
            </div>
            <div className="md:col-span-7">
                <FormInput label="E-mail Supervisor" icon={Mail} name="supervisor_email" type="email" value={formData.supervisor_email} onChange={handleChange} required />
            </div>
            <div className="md:col-span-5 space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Categoria</label>
                <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                        name="category"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none appearance-none cursor-pointer text-slate-700 font-medium h-[46px]"
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
);