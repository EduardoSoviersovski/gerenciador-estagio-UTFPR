import React from 'react';
import { Modal } from './ui/Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    docTitle: string;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, docTitle }: DeleteConfirmModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Excluir Documento">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                <p className="text-gray-600 text-sm mb-6">
                    Tem certeza que deseja excluir **{docTitle}**? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                        <Trash2 size={18} />
                        Excluir
                    </button>
                </div>
            </div>
        </Modal>
    );
};