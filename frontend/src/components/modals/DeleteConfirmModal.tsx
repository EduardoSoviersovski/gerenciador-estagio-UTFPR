import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedItems: { id: string; studentName: string; ra: string }[];
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, selectedItems }: DeleteConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">

                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4 bg-red-50/50">
                    <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Confirmar Exclusão</h2>
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">Esta ação não pode ser desfeita</p>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-4">
                    <p className="text-sm text-slate-600 font-medium">
                        Você está prestes a excluir <span className="font-bold text-slate-800">{selectedItems.length}</span> processo(s). Verifique os itens abaixo:
                    </p>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl bg-slate-50/50 p-4">
                        <ul className="space-y-3">
                            {selectedItems.map((item) => (
                                <li key={item.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                    <span className="font-bold text-slate-700">{item.studentName}</span>
                                    <span className="text-slate-400 font-mono bg-white px-2 py-0.5 rounded border border-slate-100">RA: {item.ra}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center gap-2 px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all cursor-pointer"
                    >
                        <Trash2 size={16} />
                        Confirmar Exclusão
                    </button>
                </div>
            </div>
        </div>
    );
};