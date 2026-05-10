import React from 'react';
import { X, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileName: string;
    fileType: 'image' | 'pdf';
}

export const FilePreviewModal = ({ isOpen, onClose, fileUrl, fileName, fileType }: FilePreviewModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 truncate max-w-[200px] sm:max-w-md">
                                        {fileName}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                        Visualização {fileType === 'pdf' ? 'Documento' : 'Imagem'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={fileUrl}
                                    download
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                    title="Baixar arquivo"
                                >
                                    <Download size={20} />
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-4">
                            {fileType === 'image' ? (
                                <img
                                    src={fileUrl}
                                    alt={fileName}
                                    className="max-w-full max-h-full object-contain shadow-lg rounded-sm"
                                />
                            ) : (
                                <iframe
                                    src={`${fileUrl}#toolbar=0`}
                                    className="w-full h-full rounded-sm shadow-inner"
                                    title="PDF Preview"
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            )
            }
        </AnimatePresence >
    );
};