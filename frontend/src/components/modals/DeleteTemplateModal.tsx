import React from 'react';
import { Modal } from '../ui/Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    templateName: string;
}

export const DeleteTemplateModal = ({ isOpen, onClose, onConfirm, templateName }: DeleteTemplateModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão">
            <div className="flex flex-col items-center text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center animate-bounce">
                    <AlertTriangle size={32} />
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Você está prestes a excluir o template <span className="font-bold text-slate-800">"{templateName}"</span>.
                    </h4>
                </div>

                <div className="w-full bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">
                        Atenção - Impacto no Sistema
                    </p>
                    <p className="text-xs text-amber-600 font-medium">
                        Esta ação não pode ser desfeita e afetará todos os processos que dependem deste template para geração de documentos.
                    </p>
                </div>

                <div className="flex gap-3 w-full pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-10 px-4 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 h-10 px-4 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-red-700 transition-all shadow-md shadow-red-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Trash2 size={12} />
                        <span className="truncate">Deletar Permanentemente</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};