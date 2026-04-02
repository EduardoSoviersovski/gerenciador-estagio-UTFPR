import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'md' | 'lg' | 'xl' | 'full';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
    const sizeClasses = {
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl',
    };

    // Verifica se deve mostrar o header padrão ou apenas o botão de fechar flutuante
    const hasTitle = title.trim().length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className={`relative bg-white w-full ${sizeClasses[size]} max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
                    >
                        {/* Se tiver título, mostra o header padrão. Se não, mostra apenas o botão flutuante */}
                        {hasTitle ? (
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white">
                                <h3 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            /* Botão de fechar absoluto para quando o modal não tem título (caso do DocumentDetail) */
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all"
                            >
                                <X size={20} />
                            </button>
                        )}

                        <div className={`overflow-y-auto custom-scrollbar flex-1 ${!hasTitle ? 'pt-10 p-8' : 'p-8'}`}>
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};