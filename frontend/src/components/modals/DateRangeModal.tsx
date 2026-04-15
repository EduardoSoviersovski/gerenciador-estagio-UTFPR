import React from 'react';
import { DateRange } from 'react-day-picker';
import { X, FileDown, CalendarClock } from 'lucide-react';
import { RangeInputs } from '../RangeInputs';

interface DateRangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRange: DateRange | undefined;
    onSelectRange: (range: DateRange | undefined) => void;
    onConfirm: () => void;
}

export const DateRangeModal = ({ isOpen, onClose, selectedRange, onSelectRange, onConfirm }: DateRangeModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-[48px] shadow-2xl p-10 w-full max-w-xl animate-in fade-in zoom-in duration-300 border border-slate-100">
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mb-10">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-[24px] mb-6 shadow-sm">
                        <CalendarClock size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
                        Exportar Relatório
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Selecione o intervalo de datas da supervisão
                    </p>
                </div>

                <div className="mb-10">
                    <RangeInputs
                        selectedRange={selectedRange}
                        onSelectRange={onSelectRange}
                    />
                </div>

                <button
                    disabled={!selectedRange?.from || !selectedRange?.to}
                    onClick={onConfirm}
                    className="w-full py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-[24px] hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 group"
                >
                    <FileDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                    Gerar Relatório em PDF
                </button>
            </div>
        </div>
    );
};