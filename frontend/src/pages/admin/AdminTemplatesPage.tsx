import React, { useState, useEffect } from 'react';
import {
    FileText,
    Files,
    ShieldCheck,
    Clock,
    Plus,
    Download,
    Trash2
} from 'lucide-react';


import { EditTemplateModal } from '../../components/modals/EditTemplateModal';
import { DeleteTemplateModal } from '../../components/modals/DeleteTemplateModal';
import { CreateTemplateModal } from '../../components/modals/CreateTemplateModal';


type TemplateCategory = 'REPORTS' | 'DOCUMENTS';

interface Template {
    id: string;
    name: string;
    slug: string;
    category: TemplateCategory;
    lastUpdate: string;
    fileUrl?: string;
}

export const AdminTemplatesPage: React.FC = () => {
    const [category, setCategory] = useState<TemplateCategory>('REPORTS');
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockData: Template[] = [
                    { id: '1', name: 'Relatório Parcial de Atividades', slug: 'RELATORIO_PARCIAL', category: 'REPORTS', lastUpdate: '10/05/2026', fileUrl: '#' },
                    { id: '2', name: 'Relatório Final de Atividades', slug: 'RELATORIO_FINAL', category: 'REPORTS', lastUpdate: '02/01/2026', fileUrl: '#' },
                    { id: '3', name: 'Termo de Compromisso (TCE)', slug: 'TERMO_COMPROMISSO', category: 'DOCUMENTS', lastUpdate: '15/04/2026', fileUrl: '#' },
                    { id: '4', name: 'Plano de Atividades', slug: 'PLANO_TRABALHO', category: 'DOCUMENTS', lastUpdate: '20/03/2026', fileUrl: '#' }
                ];

                setTemplates(mockData);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);


    const existingTemplatesData = templates.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug
    }));

    const filteredTemplates = templates.filter(t => t.category === category);


    const handleCreateTemplate = async (name: string, slug: string, file: File) => {
        console.log("Enviando para o Back-end:", { name, slug, file, category });

        const newTemplate: Template = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            slug,
            category,
            lastUpdate: new Date().toLocaleDateString('pt-BR'),
            fileUrl: '#'
        };

        setTemplates(prev => [...prev, newTemplate]);
        setIsCreateModalOpen(false);
    };


    const handleSaveEdit = async (id: string, newName: string, newSlug: string, newFile: File | null) => {
        console.log("Atualizando template:", { id, newName, newSlug, newFile });

        setTemplates(prev => prev.map(t =>
            t.id === id
                ? {
                    ...t,
                    name: newName,
                    slug: newSlug,
                    lastUpdate: new Date().toLocaleDateString('pt-BR')
                }
                : t
        ));

        setIsEditModalOpen(false);
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
                    <p className="text-slate-500 text-sm font-medium max-w-xl">
                        Chaves e nomes devem ser únicos para garantir a integridade dos processos.
                    </p>
                </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer min-h-[220px]"
                >
                    <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                        <Plus size={28} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">
                        Novo {category === 'REPORTS' ? 'Relatório' : 'Documento'}
                    </span>
                </button>

                {isLoading ? (
                    [1, 2].map(n => (
                        <div key={n} className="bg-slate-50 animate-pulse rounded-3xl min-h-[220px]" />
                    ))
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
                                        onClick={(e) => { e.stopPropagation(); window.open(template.fileUrl); }}
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

            {/* --- Modais --- */}
            <CreateTemplateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateTemplate}
                existingTemplates={existingTemplatesData}
            />

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