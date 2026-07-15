import React from 'react';
import { FormInput } from '../ui/FormInput';
import { FormDatePicker } from '../ui/FormDatePicker';
import { FormSelect } from '../ui/FormSelect';
import { FormSlider } from '../ui/FormSlider';
import { FileText, Calendar, Clock, Target } from 'lucide-react';
import { ProcessFormData } from '../../types';
import { MenuItem, SelectChangeEvent } from '@mui/material';

interface ProcessDetailsSectionProps {
    formData: ProcessFormData;
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    modifiedFields: string[];
    errors: Record<string, string>;
    isEdit: boolean;
}

export const ProcessDetailsSection = ({
    formData, selectedDate, setSelectedDate, handleChange, handleBlur, modifiedFields, errors, isEdit
}: ProcessDetailsSectionProps) => {

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FileText size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Detalhes do Processo
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormInput
                    label="Protocolo (SEI)" name="sei_number" icon={FileText}
                    value={formData.sei_number} onChange={handleChange as any} onBlur={handleBlur}
                    isModified={modifiedFields.includes('sei_number')}
                    isEdit={isEdit}
                />

                <FormSelect
                    label="Tipo de Estágio"
                    name="internship_type"
                    icon={FileText}
                    value={formData.internship_type || ''}
                    onChange={handleChange}
                    isModified={modifiedFields.includes('internship_type')}
                    isEdit={isEdit}
                >
                    <MenuItem value="mandatory">Obrigatório</MenuItem>
                    <MenuItem value="non_mandatory">Não Obrigatório</MenuItem>
                </FormSelect>

                <FormDatePicker
                    label="Data de Início"
                    icon={Calendar}
                    selectedDate={selectedDate}
                    isEdit={isEdit}
                    onChange={setSelectedDate}
                    isModified={modifiedFields.includes('start_date')}
                />

                <FormSlider
                    label="Carga Horária Semanal"
                    icon={Clock}
                    name="weekly_hours"
                    isEdit={isEdit}
                    value={Number(formData.weekly_hours) || 1}
                    onChange={handleChange}
                    isModified={modifiedFields.includes('weekly_hours')}
                    min={1}
                    max={30}
                />

                <FormSelect
                    label="Meta de Horas (Total)"
                    icon={Target}
                    isEdit={isEdit}
                    name="target_hours"
                    value={formData.target_hours ? String(formData.target_hours) : ''}
                    onChange={handleChange}
                    isModified={modifiedFields.includes('target_hours')}
                >
                    <MenuItem value="200">200 horas</MenuItem>
                    <MenuItem value="400">400 horas</MenuItem>
                </FormSelect>
            </div>
        </div>
    );
};