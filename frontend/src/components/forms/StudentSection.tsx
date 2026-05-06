import React from 'react';
import { User, Mail, Phone, Hash } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { ProcessFormData } from '../../types';

interface StudentSectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    modifiedFields: string[];
}

export const StudentSection = ({
    formData,
    handleChange,
    modifiedFields
}: StudentSectionProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User size={16} className="text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 text-left">
                    Dados do Aluno
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7">
                    <FormInput
                        label="Nome Completo"
                        icon={User}
                        name="student_name"
                        value={formData.student_name}
                        onChange={handleChange}
                        isModified={modifiedFields.includes('student_name')}
                        required
                        placeholder="Nome completo do acadêmico"
                    />
                </div>

                <div className="md:col-span-5">
                    <FormInput
                        label="RA"
                        icon={Hash}
                        name="student_ra"
                        value={formData.student_ra}
                        onChange={handleChange}
                        isModified={modifiedFields.includes('student_ra')}
                        required
                        placeholder="Ex: 2154879"
                    />
                </div>

                <div className="md:col-span-7">
                    <FormInput
                        label="E-mail Acadêmico"
                        icon={Mail}
                        name="student_email"
                        type="email"
                        value={formData.student_email}
                        onChange={handleChange}
                        isModified={modifiedFields.includes('student_email')}
                        required
                        placeholder="usuario@alunos.utfpr.edu.br"
                    />
                </div>

                <div className="md:col-span-5">
                    <FormInput
                        label="Telefone"
                        icon={Phone}
                        name="student_phone"
                        value={formData.student_phone}
                        onChange={handleChange}
                        isModified={modifiedFields.includes('student_phone')}
                        placeholder="(41) 9XXXX-XXXX"
                    />
                </div>
            </div>
        </div>
    );
};