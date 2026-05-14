import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { FileUploadZone } from '../ui/FileUploadZone';
import { FormInput } from '../ui/FormInput';
import { FileText, Plus, ShieldCheck, AlertCircle } from 'lucide-react';

interface CreateTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, slug: string, file: File) => void;
    existingTemplates: { name: string; slug: string }[];
}

export const CreateTemplateModal = ({ isOpen, onClose, onCreate, existingTemplates }: CreateTemplateModalProps) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setSlug('');
            setFile(null);
        }
    }, [isOpen]);

    // Lógica de Unicidade
    const isSlugTaken = existingTemplates.some(t => t.slug === slug.trim());
    const isNameTaken = existingTemplates.some(t => t.name.toLowerCase() === name.trim().toLowerCase());

    // Validações Gerais
    const isNameValid = name.trim().length > 0 && !isNameTaken;
    const isSlugValid = slug.trim().length > 3 && !isSlugTaken;
    const isFileValid = file !== null;
    const canCreate = isNameValid && isFileValid && isSlugValid;

    const handleCreate = () => {
        if (canCreate && file) {
            onCreate(name.trim(), slug.trim(), file);
            onClose();
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
            .toUpperCase()
            .replace(/\s/g, '_')
            .replace(/[^A-Z0-9_]/g, '');
        setSlug(value);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Novo Template" size="md">
            <div className="space-y-6 p-1 text-left">
                <div className="space-y-2">
                    <FormInput
                        label="Identificador do Sistema (Chave Única)"
                        value={slug}
                        onChange={handleSlugChange}
                        placeholder="EX: RELATORIO_PARCIAL"
                        icon={ShieldCheck}
                    />
                    {isSlugTaken && (
                        <div className="flex items-center gap-1 text-[9px] text-red-500 font-bold ml-1">
                            <AlertCircle size={10} />
                            <span>ESTE IDENTIFICADOR JÁ ESTÁ EM USO</span>
                        </div>
                    )}
                </div>

                {/* Nome de Exibição */}
                <div className="space-y-2">
                    <FormInput
                        label="Nome de Exibição"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Relatório Parcial de Atividades"
                        icon={FileText}
                        isModified={isNameTaken}
                    />
                    {isNameTaken && (
                        <div className="flex items-center gap-1 text-[9px] text-red-500 font-bold ml-1">
                            <AlertCircle size={10} />
                            <span>JÁ EXISTE UM TEMPLATE COM ESTE NOME</span>
                        </div>
                    )}
                </div>

                {/* Upload */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Arquivo Base (.docx)
                    </label>
                    <div className="h-32">
                        <FileUploadZone
                            hasFile={file !== null}
                            fileName={file?.name}
                            onFileSelect={(f) => setFile(f)}
                            onPreview={() => { }}
                            accept=".docx"
                            isTemplate={true}
                        />
                    </div>
                </div>

                {/* Botões */}
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
                        onClick={handleCreate}
                        disabled={!canCreate}
                        className={`flex-1 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 
                            ${canCreate
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 cursor-pointer'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'
                            }`}
                    >
                        <Plus size={12} />
                        Criar Template
                    </button>
                </div>
            </div>
        </Modal>
    );
};