import React from 'react';
import { ShieldCheck, User, Phone, Mail } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { ProcessFormData } from '../../types';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    modifiedFields: string[];
}

export const AdvisorSection = ({ formData, handleChange, modifiedFields }: SectionProps) => (
    <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck size={16} className="text-indigo-600" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                Dados do Orientador
            </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
                <FormInput
                    label="Nome Completo"
                    icon={User}
                    name="advisor_name"
                    value={formData.advisor_name}
                    onChange={handleChange}
                    isModified={modifiedFields.includes('advisor_name')}
                    required
                />
            </div>
            <div className="md:col-span-5">
                <FormInput
                    label="Telefone/Ramal"
                    icon={Phone}
                    name="advisor_phone"
                    value={formData.advisor_phone}
                    onChange={handleChange}
                    isModified={modifiedFields.includes('advisor_phone')}
                />
            </div>
            <div className="md:col-span-7">
                <FormInput
                    label="E-mail Institucional"
                    icon={Mail}
                    name="advisor_email"
                    type="email"
                    value={formData.advisor_email}
                    onChange={handleChange}
                    isModified={modifiedFields.includes('advisor_email')}
                    required
                />
            </div>
        </div>
    </div>
);