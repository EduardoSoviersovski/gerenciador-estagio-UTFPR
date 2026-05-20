import React from 'react';
import { Building2, FileText, User, Hash, Mail } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { ProcessFormData } from '../../types';
import { SelectChangeEvent } from '@mui/material';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    modifiedFields: string[];
}

export const CompanySection = ({ formData, handleChange, modifiedFields }: SectionProps) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Building2 size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                Dados da Empresa
            </h3>
        </div>

        {/* Padrão de 2 colunas, igual ao restante do formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <FormInput
                label="Razão Social" name="company_name" icon={Building2}
                value={formData.company_name} onChange={handleChange as any}
                isModified={modifiedFields.includes('company_name')}
            />
            <FormInput
                label="CNPJ" name="company_cnpj" icon={FileText}
                value={formData.company_cnpj} onChange={handleChange as any}
                isModified={modifiedFields.includes('company_cnpj')}
            />
            <FormInput
                label="Nome do Supervisor" name="supervisor_name" icon={User}
                value={formData.supervisor_name} onChange={handleChange as any}
                isModified={modifiedFields.includes('supervisor_name')}
            />
            <FormInput
                label="E-mail do Supervisor" name="supervisor_email" type="email" icon={Mail}
                value={formData.supervisor_email} onChange={handleChange as any}
                isModified={modifiedFields.includes('supervisor_email')}
            />
            <FormInput
                label="CPF do Supervisor" name="supervisor_cpf" icon={Hash}
                value={formData.supervisor_cpf} onChange={handleChange as any}
                isModified={modifiedFields.includes('supervisor_cpf')}
            />
        </div>
    </div>
);