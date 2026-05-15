import React from 'react';
import { FormInput } from '../ui/FormInput';
import { User, Mail, Phone, Hash } from 'lucide-react';
import { ProcessFormData } from '../../types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    modifiedFields: string[];
}

export const StudentSection = ({ formData, handleChange, modifiedFields }: SectionProps) => (
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
                label="Nome Completo" name="student_name" icon={User}
                value={formData.student_name} onChange={handleChange as any}
                isModified={modifiedFields.includes('student_name')}
            />
            <FormInput
                label="Registro Acadêmico (RA)" name="student_ra" icon={Hash}
                value={formData.student_ra} onChange={handleChange as any}
                isModified={modifiedFields.includes('student_ra')}
            />
            <FormInput
                label="E-mail Institucional" name="student_email" type="email" icon={Mail}
                value={formData.student_email} onChange={handleChange as any}
                isModified={modifiedFields.includes('student_email')}
            />
            <FormInput
                label="Telefone de Contato" name="student_phone" icon={Phone}
                value={formData.student_phone} onChange={handleChange as any}
                isModified={modifiedFields.includes('student_phone')}
            />

            <FormControl fullWidth className={modifiedFields.includes('student_course') ? 'bg-blue-50/10' : ''}>
                <InputLabel id="course-label">Curso</InputLabel>
                <Select
                    labelId="course-label"
                    name="student_course"
                    value={formData.student_course || ''}
                    label="Curso"
                    onChange={handleChange}
                    MenuProps={{ disableScrollLock: true }}
                    sx={{
                        borderRadius: '0.75rem',
                        backgroundColor: '#f8fafc',
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: modifiedFields.includes('student_course') ? '#60a5fa' : '#e2e8f0',
                            borderWidth: modifiedFields.includes('student_course') ? '2px' : '1px',
                        }
                    }}
                >
                    <MenuItem value="Engenharia de Computação">Engenharia de Computação</MenuItem>
                    <MenuItem value="Bacharelado em Sistemas de Informação">Bacharelado em Sistemas de Informação</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth className={modifiedFields.includes('student_period') ? 'bg-blue-50/10' : ''}>
                <InputLabel id="period-label">Período Atual</InputLabel>
                <Select
                    labelId="period-label"
                    name="student_period"
                    value={formData.student_period ? String(formData.student_period) : ''}
                    label="Período Atual"
                    onChange={handleChange}
                    MenuProps={{ disableScrollLock: true }}
                    sx={{
                        borderRadius: '0.75rem',
                        backgroundColor: '#f8fafc',
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: modifiedFields.includes('student_period') ? '#60a5fa' : '#e2e8f0',
                            borderWidth: modifiedFields.includes('student_period') ? '2px' : '1px',
                        }
                    }}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(period => (
                        <MenuItem key={period} value={String(period)}>{period}º Período</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    </div>
);