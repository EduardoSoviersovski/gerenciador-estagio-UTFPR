import React from 'react';
import { FormInput } from '../ui/FormInput';
import { FormDatePicker } from '../ui/FormDatePicker';
import { FileText, Calendar } from 'lucide-react';
import { ProcessFormData } from '../../types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface ProcessDetailsSectionProps {
    formData: ProcessFormData;
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    modifiedFields: string[];
}

export const ProcessDetailsSection = ({
    formData, selectedDate, setSelectedDate, handleChange, modifiedFields
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <FormInput
                    label="Protocolo (SEI)" name="sei_number" icon={FileText}
                    value={formData.sei_number} onChange={handleChange as any}
                    isModified={modifiedFields.includes('sei_number')}
                />

                <FormControl fullWidth className={modifiedFields.includes('category') ? 'bg-blue-50/10' : ''}>
                    <InputLabel id="category-label">Tipo de Estágio</InputLabel>
                    <Select
                        labelId="category-label"
                        name="category"
                        value={formData.category || ''}
                        label="Tipo de Estágio"
                        onChange={handleChange}
                        MenuProps={{ disableScrollLock: true }}
                        sx={{
                            borderRadius: '0.75rem',
                            backgroundColor: '#f8fafc',
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: modifiedFields.includes('category') ? '#60a5fa' : '#e2e8f0',
                                borderWidth: modifiedFields.includes('category') ? '2px' : '1px',
                            }
                        }}
                    >
                        <MenuItem value="mandatory">Obrigatório</MenuItem>
                        <MenuItem value="non_mandatory">Não Obrigatório</MenuItem>
                    </Select>
                </FormControl>

                <FormDatePicker
                    label="Data de Início"
                    icon={Calendar}
                    selectedDate={selectedDate}
                    onChange={setSelectedDate}
                    isModified={modifiedFields.includes('start_date')}
                />

                <FormControl fullWidth className={modifiedFields.includes('weekly_hours') ? 'bg-blue-50/10' : ''}>
                    <InputLabel id="weekly-hours-label">Carga Horária Semanal</InputLabel>
                    <Select
                        labelId="weekly-hours-label"
                        name="weekly_hours"
                        value={formData.weekly_hours ? String(formData.weekly_hours) : ''}
                        label="Carga Horária Semanal"
                        onChange={handleChange}
                        MenuProps={{ disableScrollLock: true }}
                        sx={{
                            borderRadius: '0.75rem',
                            backgroundColor: '#f8fafc',
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: modifiedFields.includes('weekly_hours') ? '#60a5fa' : '#e2e8f0',
                                borderWidth: modifiedFields.includes('weekly_hours') ? '2px' : '1px',
                            }
                        }}
                    >
                        <MenuItem value="20">20 horas</MenuItem>
                        <MenuItem value="30">30 horas</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth className={modifiedFields.includes('target_hours') ? 'bg-blue-50/10' : ''}>
                    <InputLabel id="target-hours-label">Meta de Horas (Total)</InputLabel>
                    <Select
                        labelId="target-hours-label"
                        name="target_hours"
                        value={formData.target_hours ? String(formData.target_hours) : ''}
                        label="Meta de Horas (Total)"
                        onChange={handleChange}
                        MenuProps={{ disableScrollLock: true }}
                        sx={{
                            borderRadius: '0.75rem',
                            backgroundColor: '#f8fafc',
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: modifiedFields.includes('target_hours') ? '#60a5fa' : '#e2e8f0',
                                borderWidth: modifiedFields.includes('target_hours') ? '2px' : '1px',
                            }
                        }}
                    >
                        <MenuItem value="200">200 horas</MenuItem>
                        <MenuItem value="400">400 horas</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};