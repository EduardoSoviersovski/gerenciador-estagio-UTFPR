import React from 'react';
import { FileText } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { FormDatePicker } from '../ui/FormDatePicker';

interface ProcessDetailsSectionProps {
    formData: {
        sei_number: string;
    };
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProcessDetailsSection = ({
    formData,
    selectedDate,
    setSelectedDate,
    handleChange
}: ProcessDetailsSectionProps) => (
    <div className="space-y-6 pb-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText size={16} className="text-amber-600" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                Detalhes do Processo
            </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7">
                <FormInput
                    label="Número SEI"
                    icon={FileText}
                    name="sei_number"
                    placeholder="23064.XXXXXX/202X-XX"
                    value={formData.sei_number}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="md:col-span-5">
                <FormDatePicker
                    label="Data de Início"
                    value={selectedDate}
                    onChange={setSelectedDate}
                />
            </div>
        </div>
    </div>
);