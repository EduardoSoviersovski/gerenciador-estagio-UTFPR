import React, { useState, useRef } from 'react';
import { Modal } from './ui/Modal';
import { FilePlus, UploadCloud, File as FileIcon, X } from 'lucide-react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface AddDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, file: File) => void;
}

export const AddDocumentModal = ({ isOpen, onClose, onAdd }: AddDocumentModalProps) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    const handleFileSelect = (selectedFile: File | undefined) => {
        if (!selectedFile) return;

        const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
            setNotification({
                open: true,
                message: "Formato inválido. Por favor, selecione apenas arquivos em formato PDF.",
                severity: 'error'
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && file) {
            onAdd(name.trim(), file);
            setName('');
            setFile(null);
        }
    };

    const handleClose = () => {
        setName('');
        setFile(null);
        setNotification({ ...notification, open: false });
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} title="Novo Documento Manual">
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                            Título do Documento
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Certificado de Horas Extras"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                            Arquivo PDF
                        </label>
                        {!file ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                            >
                                <UploadCloud className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" size={24} />
                                <span className="text-sm font-medium text-slate-500 mb-1">
                                    Clique para selecionar o arquivo
                                </span>
                                <p className="text-[11px] font-medium tracking-wide transition-colors text-slate-400">
                                    Formatos aceitos: <span className="font-bold text-blue-500 group-hover:text-blue-600">.pdf</span>
                                </p>

                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept=".pdf"
                                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                                        <FileIcon size={20} />
                                    </div>
                                    <div className="truncate text-left">
                                        <p className="text-sm font-bold text-emerald-800 truncate">{file.name}</p>
                                        <p className="text-xs text-emerald-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="p-2 text-emerald-600 hover:bg-emerald-200 rounded-full transition-colors shrink-0 outline-none"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim() || !file}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        <FilePlus size={18} />
                        Criar Documento
                    </button>
                </form>
            </Modal>

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                style={{ zIndex: 99999 }}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};
