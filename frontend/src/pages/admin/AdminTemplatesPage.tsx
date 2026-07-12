import React, { useState, useRef } from 'react';
import {
    FileText,
    Files,
    ShieldCheck,
    Loader2,
    FileDown,
    Replace,
    X
} from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';

import { adminService } from '../../services/adminService';
import { DocumentService } from '../../services/documentService';
import { ADMIN_TEMPLATES_MAP, TemplateCategory, TemplateMapItem } from '../../constants/templateTypes';

interface TemplateFormatManagerProps {
    template: TemplateMapItem;
    format: 'pdf' | 'docx';
    onNotification: (msg: string, type: 'success' | 'error') => void;
}

const TemplateFormatManager = ({ template, format, onNotification }: TemplateFormatManagerProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isHoveringReplace, setIsHoveringReplace] = useState(false);

    const isPdf = format === 'pdf';
    const acceptExt = isPdf ? '.pdf' : '.docx';
    const formatName = isPdf ? 'PDF' : 'Word (DOCX)';

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (fileExt !== format) {
            onNotification(`Formato inválido. Por favor, envie um arquivo .${format}`, 'error');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsLoading(true);
        try {
            await adminService.uploadTemplate(template.id, file, format);
            onNotification(`Versão ${format.toUpperCase()} atualizada com sucesso!`, 'success');
        } catch (error) {
            onNotification(`Erro ao enviar a versão ${format.toUpperCase()}.`, 'error');
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownload = async () => {
        setIsLoading(true);
        try {
            const blob = await DocumentService.downloadTemplate(template.id, format);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const safeName = template.name.replace(/\s+/g, '_');
            link.download = `Template_${safeName}.${format}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            onNotification(`A versão ${format.toUpperCase()} ainda não foi cadastrada para este template.`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full relative">
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-[2px] rounded-xl flex items-center justify-center border border-blue-100">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept={acceptExt}
                disabled={isLoading}
            />

            <div className={`flex items-center justify-between border rounded-xl shadow-sm transition-all duration-300 w-full h-[72px] ${isHoveringReplace ? 'bg-orange-50 border-orange-300' : 'bg-blue-50/50 border-blue-100 hover:border-blue-300'
                }`}>
                <div
                    onClick={handleDownload}
                    className={`flex items-center gap-3 p-4 flex-1 cursor-pointer group transition-all rounded-l-xl active:scale-[0.99] h-full overflow-hidden ${isHoveringReplace ? '' : 'hover:bg-blue-50'
                        }`}
                    title={`Baixar versão ${format.toUpperCase()}`}
                >
                    <div className={`p-2 rounded-lg transition-colors duration-300 shrink-0 ${isHoveringReplace ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                        }`}>
                        <FileDown size={20} />
                    </div>
                    <div className="flex flex-col overflow-hidden text-left">
                        <p className={`text-sm font-bold truncate leading-none transition-colors duration-300 ${isHoveringReplace ? 'text-orange-900' : 'text-blue-900'
                            }`}>
                            Versão {formatName}
                        </p>
                        <p className={`text-[11px] mt-1 italic tracking-wide transition-colors duration-300 ${isHoveringReplace ? 'text-orange-600' : 'text-blue-600'
                            }`}>
                            Clique para baixar
                        </p>
                    </div>
                </div>

                <div className={`flex items-center justify-center self-stretch border-l px-3 transition-colors duration-300 ${isHoveringReplace ? 'border-orange-200' : 'border-blue-100'
                    }`}>
                    <button
                        onMouseEnter={() => setIsHoveringReplace(true)}
                        onMouseLeave={() => setIsHoveringReplace(false)}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-blue-600 hover:text-white hover:bg-orange-500 rounded-lg transition-all duration-300 cursor-pointer group active:scale-[0.96]"
                        title={`Substituir arquivo ${format.toUpperCase()}`}
                    >
                        <Replace size={18} className="transition-transform duration-300 group-hover:rotate-180" />
                        <span>Substituir</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ManageTemplateModalProps {
    template: TemplateMapItem | null;
    isOpen: boolean;
    onClose: () => void;
    onNotification: (msg: string, type: 'success' | 'error') => void;
}

const ManageTemplateModal = ({ template, isOpen, onClose, onNotification }: ManageTemplateModalProps) => {
    if (!isOpen || !template) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-slate-100 flex items-start justify-between w-full">
                    <div className="text-left flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={16} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                Gerenciamento de Arquivos
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight break-words">
                            {template.name}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Baixe as versões atuais ou substitua-as fazendo um novo upload.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 bg-slate-50/50 text-left">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <p className="text-[11px] font-bold uppercase text-slate-400 mb-3 ml-1 tracking-wider">
                                Versão em Word (.docx)
                            </p>
                            <TemplateFormatManager
                                template={template}
                                format="docx"
                                onNotification={onNotification}
                            />
                        </div>

                        <div>
                            <p className="text-[11px] font-bold uppercase text-slate-400 mb-3 ml-1 tracking-wider">
                                Versão em PDF (.pdf)
                            </p>
                            <TemplateFormatManager
                                template={template}
                                format="pdf"
                                onNotification={onNotification}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminTemplatesPage: React.FC = () => {
    const [category, setCategory] = useState<TemplateCategory>('DOCUMENTS');
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateMapItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({
        open: false, msg: '', type: 'success'
    });

    // Filtra para remover o ID 6, pois o ID 6 é "Documento Genérico" e não tem template associado
    const filteredTemplates = ADMIN_TEMPLATES_MAP.filter(t => t.category === category && t.id !== 6);

    const handleOpenModal = (template: TemplateMapItem) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const showNotification = (msg: string, type: 'success' | 'error') => {
        setNotification({ open: true, msg, type });
    };

    return (
        <div className="p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="space-y-2 text-left w-full">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                        Painel Administrativo
                    </span>
                </div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                    Templates de Documentos
                </h1>
                <div>
                    <p className="text-slate-500 text-sm font-medium max-w-xl">
                        Clique em um documento abaixo para gerenciar (baixar ou substituir) as suas versões em PDF e Word.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-slate-100 pb-1">
                {(['REPORTS', 'DOCUMENTS'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCategory(tab)}
                        className={`pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${category === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600 cursor-pointer'}`}
                    >
                        <div className="flex items-center gap-2">
                            {tab === 'REPORTS' ? <FileText size={14} /> : <Files size={14} />}
                            {tab === 'REPORTS' ? 'Templates de Relatórios' : 'Template de Documentos'}
                        </div>
                        {category === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in slide-in-from-left-2" />
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => handleOpenModal(template)}
                        className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-left min-h-[160px] w-full"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />

                        <div className="flex items-start justify-between w-full">
                            <div className="space-y-4 pr-4 text-left w-full">
                                <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all w-fit">
                                    {template.category === 'REPORTS' ? <FileText size={24} /> : <Files size={24} />}
                                </div>
                                <div className="space-y-1 w-full text-left">
                                    <h3 className="text-slate-800 font-black text-[15px] uppercase tracking-tight group-hover:text-blue-600 leading-tight">
                                        {template.name}
                                    </h3>
                                    <p className="text-[11px] text-blue-600/70 font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                        Clique para gerenciar versões →
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ManageTemplateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                template={selectedTemplate}
                onNotification={showNotification}
            />

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={notification.type} variant="filled">
                    {notification.msg}
                </Alert>
            </Snackbar>
        </div>
    );
};