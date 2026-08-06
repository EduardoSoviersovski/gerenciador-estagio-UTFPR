import React, { useEffect, useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { FormDatePicker } from '../ui/FormDatePicker';

interface AdditivePlanApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (values: { newHourGoal: number; newWeeklyHours: number; additiveStartDate: string }) => Promise<void>;
    initialValues: { newHourGoal: number; newWeeklyHours: number; additiveStartDate: string; maxAdditiveStartDate: string } | null;
}

export const AdditivePlanApprovalModal = ({
    isOpen,
    onClose,
    onConfirm,
    initialValues,
}: AdditivePlanApprovalModalProps) => {
    const [newHourGoal, setNewHourGoal] = useState('');
    const [newWeeklyHours, setNewWeeklyHours] = useState('');
    const [additiveStartDate, setAdditiveStartDate] = useState<Date | null>(null);
    const [maxAdditiveStartDate, setMaxAdditiveStartDate] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const twoDigits = (value: number): string => (value < 10 ? `0${value}` : String(value));

    const formatDateToIso = (value: Date): string => {
        const year = value.getFullYear();
        const month = twoDigits(value.getMonth() + 1);
        const day = twoDigits(value.getDate());
        return `${year}-${month}-${day}`;
    };

    const getApprovalErrorMessage = (error: any): string => {
        const detail = error?.response?.data?.detail;
        if (typeof detail === 'string') {
            const normalizedDetail = detail.toLowerCase();
            if (normalizedDetail.indexOf('24 months') >= 0 || normalizedDetail.indexOf('24 meses') >= 0) {
                return detail;
            }
            return detail;
        }

        return 'Nao foi possivel aprovar o termo aditivo. Tente novamente.';
    };

    useEffect(() => {
        if (!isOpen || !initialValues) return;

        setNewHourGoal(String(initialValues.newHourGoal));
        setNewWeeklyHours(String(initialValues.newWeeklyHours));
        setAdditiveStartDate(new Date(`${initialValues.additiveStartDate}T00:00:00`));
        setMaxAdditiveStartDate(new Date(`${initialValues.maxAdditiveStartDate}T00:00:00`));
        setError(null);
    }, [isOpen, initialValues]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        const parsedHourGoal = Number(newHourGoal);
        const parsedWeeklyHours = Number(newWeeklyHours);

        if (!isFinite(parsedHourGoal) || parsedHourGoal < 1 || parsedHourGoal > 400) {
            setError('A nova meta de horas deve estar entre 1 e 400 horas.');
            return;
        }

        if (!isFinite(parsedWeeklyHours) || parsedWeeklyHours < 1 || parsedWeeklyHours > 30) {
            setError('A nova carga horária semanal deve estar entre 1 e 30 horas.');
            return;
        }

        if (!additiveStartDate) {
            setError('Informe a data de início do termo aditivo.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onConfirm({
                newHourGoal: parsedHourGoal,
                newWeeklyHours: parsedWeeklyHours,
                additiveStartDate: formatDateToIso(additiveStartDate),
            });
            onClose();
        } catch (error) {
            setError(getApprovalErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[1000] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4 bg-blue-50/50">
                    <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                        <CheckCircle size={24} />
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Aprovar Termo Aditivo</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto p-2 hover:bg-blue-100 rounded-full transition-colors cursor-pointer outline-none"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-4">
                    <p className="text-sm text-slate-600 font-medium">
                        Antes de aprovar, preencha os novos valores da meta e da carga horária semanal.
                    </p>

                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Nova Meta de Horas
                        <input
                            type="number"
                            min={1}
                            max={400}
                            value={newHourGoal}
                            onChange={(e) => setNewHourGoal(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </label>

                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Nova Carga Horária Semanal
                        <input
                            type="number"
                            min={1}
                            max={30}
                            value={newWeeklyHours}
                            onChange={(e) => setNewWeeklyHours(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </label>

                    <FormDatePicker
                        label="Data de Início do Termo Aditivo"
                        icon={Calendar}
                        selectedDate={additiveStartDate}
                        onChange={setAdditiveStartDate}
                        maxDate={maxAdditiveStartDate || undefined}
                    />

                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <div className="px-8 py-6 border-t border-slate-100 flex justify-center gap-3 bg-white">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Salvando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

