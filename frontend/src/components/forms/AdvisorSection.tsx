import React from 'react';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { User, Mail, Phone, Building } from 'lucide-react';
import { ProcessFormData } from '../../types';
import { MenuItem, SelectChangeEvent } from '@mui/material';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    modifiedFields: string[];
}

export const AdvisorSection = ({ formData, handleChange, modifiedFields }: SectionProps) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <User size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                Dados do Orientador
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <FormInput
                label="Nome do Orientador"
                name="advisor_name"
                icon={User}
                value={formData.advisor_name}
                onChange={handleChange as any}
                isModified={modifiedFields.includes('advisor_name')}
            />

            <FormInput
                label="E-mail"
                name="advisor_email"
                type="email"
                icon={Mail}
                value={formData.advisor_email}
                onChange={handleChange as any}
                isModified={modifiedFields.includes('advisor_email')}
            />

            <FormInput
                label="Telefone de Contato"
                name="advisor_phone"
                icon={Phone}
                value={formData.advisor_phone}
                onChange={handleChange as any}
                isModified={modifiedFields.includes('advisor_phone')}
            />

            <FormInput
                label="Departamento"
                name="advisor_department"
                icon={Building}
                value={formData.advisor_department}
                onChange={handleChange as any}
                isModified={modifiedFields.includes('advisor_department')}
            />
        </div>
    </div>
);