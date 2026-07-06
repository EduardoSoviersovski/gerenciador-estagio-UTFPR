import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface StatusConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    statusName: string;
}

export const StatusConfirmModal = ({ isOpen, onClose, onConfirm, statusName }: StatusConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4 bg-blue-50/50">
                    <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                        <CheckCircle size={24} />
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Confirmar Status</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto p-2 hover:bg-blue-100 rounded-full transition-colors cursor-pointer outline-none"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 text-center">
                    <p className="text-sm text-slate-600 font-medium">
                        Deseja alterar o status deste relatório para <span className="font-bold text-blue-600">{statusName}</span>?
                    </p>
                </div>

                <div className="px-8 py-6 border-t border-slate-100 flex justify-center gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all cursor-pointer"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};