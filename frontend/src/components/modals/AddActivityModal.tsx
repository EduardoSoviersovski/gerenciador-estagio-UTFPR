import React, { useState } from 'react';
import { X, Plus, ClipboardList } from 'lucide-react';
import { ActivityType, ACTIVITY_LABELS } from '../../types';

interface AddActivityModalProps {
    onAddStep: (type: ActivityType, title: string) => void;
}

export const AddActivityModal = ({ onAddStep }: AddActivityModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<ActivityType>('RELATORIO_PARCIAL');
    const [customTitle, setCustomTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTitle = type === 'OUTROS' ? customTitle : ACTIVITY_LABELS[type];

        if (type === 'OUTROS' && !customTitle.trim()) return;

        onAddStep(type, finalTitle);
        resetForm();
    };

    const resetForm = () => {
        setIsOpen(false);
        setType('RELATORIO_PARCIAL');
        setCustomTitle('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
                <Plus size={18} />
                Nova Atividade
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                                    <ClipboardList size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Adicionar Atividade</h2>
                            </div>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Tipo de Relatório
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as ActivityType)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all cursor-pointer"
                                >
                                    {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {type === 'OUTROS' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Título Personalizado
                                    </label>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Ex: Relatório de Feedback"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};