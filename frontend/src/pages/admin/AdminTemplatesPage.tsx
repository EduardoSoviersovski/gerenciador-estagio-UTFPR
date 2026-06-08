import React, { useState, useEffect } from 'react';
import {
    FileText,
    Files,
    ShieldCheck,
    Clock,
    Download,
    Trash2
} from 'lucide-react';

import { EditTemplateModal } from '../../components/modals/EditTemplateModal';
import { DeleteTemplateModal } from '../../components/modals/DeleteTemplateModal';
import { adminService } from '../../services/adminService';

type TemplateCategory = 'REPORTS' | 'DOCUMENTS';

export interface Template {
    id: string;
    name: string;
    documentTypeName?: string;
    category: TemplateCategory;
    lastUpdate: string;
    fileUrl?: string;
}

const TemplateCardSkeleton = () => (
    <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px] overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 animate-pulse" />
        <div className="flex items-start justify-between">
            <div className="space-y-4 w-full pl-2">
                <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
                </div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-2 bg-slate-200 rounded animate-pulse w-1/3" />
        </div>
    </div>
);

export const AdminTemplatesPage: React.FC = () => {
    const [category, setCategory] = useState<TemplateCategory>('DOCUMENTS');
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getAllTemplates();

            const mappedTemplates: Template[] = data.map((t: any) => {
                const displayName = t.file_name
                    ? t.file_name.replace(/\.[^/.]+$/, "")
                    : (t.document_type_name || 'Template Sem Nome');

                return {
                    id: String(t.document_type_id || t.id),
                    name: displayName,
                    documentTypeName: t.document_type_name,
                    category: String(t.document_type_name).toLowerCase().includes('report') ? 'REPORTS' : 'DOCUMENTS',
                    lastUpdate: new Date().toLocaleDateString('pt-BR')
                };
            });

            setTemplates(mappedTemplates);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const existingTemplatesData = templates.map(t => ({
        id: t.id,
        name: t.name,
    }));

    const filteredTemplates = templates.filter(t => t.category === category);

    const handleSaveEdit = async (id: string, newName: string, newSlug: string, newFile: File | null) => {
        try {
            let fileToSend = newFile;

            if (fileToSend) {
                const fileExtension = fileToSend.name.split('.').pop() || 'docx';
                fileToSend = new File([fileToSend], `${newName}.${fileExtension}`, { type: fileToSend.type });
            } else {
                const templateToUpdate = templates.find(t => t.id === id);
                if (!templateToUpdate) throw new Error("Template não encontrado");

                const blob = await adminService.downloadTemplate(id);

                fileToSend = new File([blob], `${newName}.docx`, { type: blob.type });
            }

            await adminService.uploadTemplate(Number(id), fileToSend);
            await fetchTemplates();
            setIsEditModalOpen(false);
        } catch (error) {
            alert("Não foi possível atualizar o template.");
        }
    };

    const handleDownload = async (template: Template, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const blob = await adminService.downloadTemplate(template.id);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${template.name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Erro ao baixar o arquivo.");
        }
    };

    const handleConfirmDelete = async () => {
        if (templateToDelete) {
            setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
            setIsDeleteModalOpen(false);
            setTemplateToDelete(null);
        }
    };

    return (
        <div className="p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {isLoading ? (
                <div className="space-y-3 text-left">
                    <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                    <div className="h-10 w-80 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-4 w-64 bg-slate-200 rounded animate-pulse mt-2" />
                </div>
            ) : (
                <div className="space-y-2 text-left">
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
                            Gerencie os modelos oficiais.
                        </p>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex gap-6 border-b border-slate-100 pb-2">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                </div>
            ) : (
                <div className="flex gap-4 border-b border-slate-100 pb-1">
                    {(['REPORTS', 'DOCUMENTS'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setCategory(tab)}
                            className={`pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${category === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600 cursor-pointer'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {tab === 'REPORTS' ? <FileText size={14} /> : <Files size={14} />}
                                {tab === 'REPORTS' ? 'Relatórios' : 'Documentos Diversos'}
                            </div>
                            {category === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in slide-in-from-left-2" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(n => <TemplateCardSkeleton key={n} />)
                ) : (
                    filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => { setSelectedTemplate(template); setIsEditModalOpen(true); }}
                            className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all text-left min-h-[220px]"
                        >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />

                            <div className="flex items-start justify-between">
                                <div className="space-y-3 pr-4">
                                    <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all w-fit">
                                        <FileText size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight group-hover:text-blue-600 leading-tight pt-1">
                                            {template.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleDownload(template, e)}
                                        className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setTemplateToDelete(template); setIsDeleteModalOpen(true); }}
                                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={10} strokeWidth={3} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                        Ultima atualização: {template.lastUpdate}
                                    </span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Editar
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <EditTemplateModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                template={selectedTemplate}
                existingTemplates={existingTemplatesData}
                onSave={handleSaveEdit}
            />

            <DeleteTemplateModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                templateName={templateToDelete?.name || ''}
            />
        </div>
    );
};