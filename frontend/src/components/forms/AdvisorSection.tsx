import React from 'react';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { User, Mail, Phone, Building, Lock } from 'lucide-react';
import { ProcessFormData } from '../../types';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { UTFPR_DEPARTMENTS } from '../../constants/departments';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    modifiedFields: string[];
    errors: Record<string, string>;
    isEdit: boolean;
    isGoogleLinked?: boolean;
}

export const AdvisorSection = ({ formData, handleChange, handleBlur, modifiedFields, errors, isEdit, isGoogleLinked = false }: SectionProps) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <User size={20} />
            </div>
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Dados do Orientador
                </h3>
                {isGoogleLinked && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        <Lock size={12} /> Conta Google Vinculada
                    </span>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <FormInput
                label="Nome do Orientador"
                name="advisor_name"
                icon={User}
                value={formData.advisor_name}
                onChange={handleChange as any}
                onBlur={handleBlur}
                isModified={modifiedFields.includes('advisor_name')}
                error={errors.advisor_name}
                isEdit={isEdit}
                placeholder="Apenas letras"
                disabled={isGoogleLinked}
                className={isGoogleLinked ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}
            />

            <FormInput
                label="E-mail"
                name="advisor_email"
                type="email"
                icon={Mail}
                value={formData.advisor_email}
                onChange={handleChange as any}
                onBlur={handleBlur}
                isEdit={isEdit}
                isModified={modifiedFields.includes('advisor_email')}
                error={errors.advisor_email}
                placeholder="exemplo@utfpr.edu.br"
                disabled={isGoogleLinked}
                className={isGoogleLinked ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}
            />

            <FormInput
                label="Telefone de Contato"
                name="advisor_phone"
                icon={Phone}
                value={formData.advisor_phone}
                onChange={handleChange as any}
                onBlur={handleBlur}
                isEdit={isEdit}
                isModified={modifiedFields.includes('advisor_phone')}
                error={errors.advisor_phone}
                placeholder="Ex: 41999999999 (Apenas números)"
            />

            <FormSelect
                label="Departamento"
                name="advisor_department"
                value={formData.advisor_department || ''}
                onChange={handleChange}
                icon={Building}
                isEdit={isEdit}
                isModified={modifiedFields.includes('advisor_department')}
                displayEmpty
            >
                {UTFPR_DEPARTMENTS.map(dept => (
                    <MenuItem key={dept.value} value={dept.value}>{dept.label}</MenuItem>
                ))}
            </FormSelect>
        </div>
    </div>
);