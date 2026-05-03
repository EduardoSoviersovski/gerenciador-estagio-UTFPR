import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { ProcessFormData } from '../../types';

interface EditReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    changes: { field: string; from: any; to: any }[];
}

export const EditReviewModal = ({ isOpen, onClose, onConfirm, changes }: EditReviewModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1100] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                            <CheckCircle2 size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Revisar Alterações</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-blue-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                </div>

                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {changes.map((change, idx) => (
                        <div key={idx} className="group p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-white transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{change.field.replace('_', ' ')}</p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500 line-through opacity-60">{String(change.from || '—')}</span>
                                <ArrowRight size={14} className="text-blue-400" />
                                <span className="text-sm font-bold text-slate-800">{String(change.to || '—')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                    <button onClick={onClose} className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Voltar</button>
                    <button onClick={onConfirm} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Salvar Alterações</button>
                </div>
            </div>
        </div>
    );
};