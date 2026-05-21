import React from 'react';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { User, Mail, Phone, Hash } from 'lucide-react';
import { ProcessFormData } from '../../types';
import { MenuItem, SelectChangeEvent } from '@mui/material';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    modifiedFields: string[];
    errors: Record<string, string>;
}

export const StudentSection = ({ formData, handleChange, handleBlur, modifiedFields, errors }: SectionProps) => {
    const isCourseModified = modifiedFields.includes('student_course');
    const isPeriodModified = modifiedFields.includes('student_period');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <User size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Dados do Aluno
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <FormInput
                    label="Nome Completo"
                    name="student_name"
                    icon={User}
                    value={formData.student_name}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isModified={modifiedFields.includes('student_name')}
                    error={errors.student_name}
                    placeholder="Apenas letras"
                />

                <FormInput
                    label="Registro Acadêmico (RA)"
                    name="student_ra"
                    icon={Hash}
                    value={formData.student_ra}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isModified={modifiedFields.includes('student_ra')}
                    error={errors.student_ra}
                    placeholder="Apenas números"
                />

                <FormInput
                    label="E-mail Institucional"
                    name="student_email"
                    type="email"
                    icon={Mail}
                    value={formData.student_email}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isModified={modifiedFields.includes('student_email')}
                    error={errors.student_email}
                    placeholder="exemplo@alunos.utfpr.edu.br"
                />

                <FormInput
                    label="Telefone de Contato"
                    name="student_phone"
                    icon={Phone}
                    value={formData.student_phone}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isModified={modifiedFields.includes('student_phone')}
                    error={errors.student_phone}
                    placeholder="Ex: 41999999999 (Apenas números)"
                />

                <FormSelect
                    label="Curso"
                    name="student_course"
                    value={formData.student_course || ''}
                    onChange={handleChange}
                    isModified={isCourseModified}
                >
                    <MenuItem value="EC">Engenharia de Computação</MenuItem>
                    <MenuItem value="BSI">Bacharelado em Sistemas de Informação</MenuItem>
                </FormSelect>

                <FormSelect
                    label="Período Atual"
                    name="student_period"
                    value={formData.student_period ? String(formData.student_period) : ''}
                    onChange={handleChange}
                    isModified={isPeriodModified}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(period => (
                        <MenuItem key={period} value={String(period)}>{period}º Período</MenuItem>
                    ))}
                </FormSelect>
            </div>
        </div>
    );
};