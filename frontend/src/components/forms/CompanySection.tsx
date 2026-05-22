import React from 'react';
import { Building2, FileText, User, Hash, Mail } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { ProcessFormData } from '../../types';
import { SelectChangeEvent } from '@mui/material';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    modifiedFields: string[];
    errors: Record<string, string>;
}

export const CompanySection = ({ formData, handleChange, handleBlur, modifiedFields, errors }: SectionProps) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Building2 size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                Dados da Empresa
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <FormInput
                label="Razão Social" name="company_name" icon={Building2}
                value={formData.company_name} onChange={handleChange as any} onBlur={handleBlur}
                isModified={modifiedFields.includes('company_name')}
            />
            <FormInput
                label="CNPJ" name="company_cnpj" icon={FileText}
                value={formData.company_cnpj} onChange={handleChange as any} onBlur={handleBlur}
                isModified={modifiedFields.includes('company_cnpj')}
                error={errors.company_cnpj}
                placeholder="Apenas números"
            />
            <FormInput
                label="Nome do Supervisor" name="supervisor_name" icon={User}
                value={formData.supervisor_name} onChange={handleChange as any} onBlur={handleBlur}
                isModified={modifiedFields.includes('supervisor_name')}
                error={errors.supervisor_name}
                placeholder="Apenas letras"
            />
            <FormInput
                label="E-mail do Supervisor" name="supervisor_email" type="email" icon={Mail}
                value={formData.supervisor_email} onChange={handleChange as any} onBlur={handleBlur}
                isModified={modifiedFields.includes('supervisor_email')}
            />
            <FormInput
                label="CPF do Supervisor" name="supervisor_cpf" icon={Hash}
                value={formData.supervisor_cpf} onChange={handleChange as any} onBlur={handleBlur}
                isModified={modifiedFields.includes('supervisor_cpf')}
                error={errors.supervisor_cpf}
                placeholder="Apenas números"
            />
        </div>
    </div>
);