import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { FileUploadZone } from '../ui/FileUploadZone';
import { FormInput } from '../ui/FormInput';
import { FileText, Save, ShieldCheck, AlertCircle } from 'lucide-react';

interface EditTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: { id: string; name: string; slug: string } | null;
    existingTemplates: { id: string; name: string; slug: string }[];
    onSave: (id: string, newName: string, newSlug: string, newFile: File | null) => void;
}

export const EditTemplateModal = ({ isOpen, onClose, template, existingTemplates, onSave }: EditTemplateModalProps) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (template) {
            setName(template.name);
            setSlug(template.slug);
            setFile(null); // Resetamos o arquivo para null, pois nada novo foi selecionado ainda
        }
    }, [template, isOpen]);

    // --- VALIDAÇÕES DE UNICIDADE ---
    const isNameTaken = existingTemplates.some(t =>
        t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== template?.id
    );

    const isSlugTaken = existingTemplates.some(t =>
        t.slug === slug.trim() && t.id !== template?.id
    );

    // --- VALIDAÇÕES DE OBRIGATORIEDADE ---
    const isNameEmpty = name.trim().length === 0;
    const isSlugEmpty = slug.trim().length === 0;
    const isSlugTooShort = !isSlugEmpty && slug.trim().length < 3;

    // --- LÓGICA DE ALTERAÇÃO ---
    // Verifica se o usuário mudou qualquer um dos 3 campos em relação ao original
    const hasNameChanged = name.trim() !== template?.name;
    const hasSlugChanged = slug.trim() !== template?.slug;
    const hasFileChanged = file !== null;

    // Pode salvar se:
    // 1. Algo mudou
    // 2. Não há erros de duplicidade
    // 3. Os campos obrigatórios estão preenchidos
    const canSave = (hasNameChanged || hasSlugChanged || hasFileChanged) &&
        !isNameEmpty && !isSlugEmpty && !isSlugTooShort &&
        !isNameTaken && !isSlugTaken;

    const handleSave = () => {
        if (template && canSave) {
            // Se 'file' for null, o back-end saberá que não deve alterar o documento
            onSave(template.id, name.trim(), slug.trim(), file);
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
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Template" size="md">
            <div className="space-y-6 p-1 text-left">

                {/* Slug */}
                <div className="space-y-2">
                    <FormInput
                        label="Identificador do Sistema (Chave Única)"
                        value={slug}
                        onChange={handleSlugChange}
                        placeholder="EX: RELATORIO_PARCIAL"
                        icon={ShieldCheck}
                        isModified={hasSlugChanged}
                    />
                    {isSlugEmpty && (
                        <p className="text-[9px] text-red-500 font-bold ml-1 flex items-center gap-1">
                            <AlertCircle size={10} /> O IDENTIFICADOR É OBRIGATÓRIO
                        </p>
                    )}
                    {isSlugTaken && (
                        <div className="flex items-center gap-1 text-[9px] text-red-500 font-bold ml-1">
                            <AlertCircle size={10} />
                            <span>ESTA CHAVE JÁ ESTÁ SENDO USADA POR OUTRO TEMPLATE</span>
                        </div>
                    )}
                </div>

                {/* Nome */}
                <div className="space-y-2">
                    <FormInput
                        label="Nome de Exibição"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Relatório Parcial"
                        icon={FileText}
                        isModified={hasNameChanged}
                    />
                    {isNameEmpty && (
                        <p className="text-[9px] text-red-500 font-bold ml-1 flex items-center gap-1">
                            <AlertCircle size={10} /> O NOME É OBRIGATÓRIO
                        </p>
                    )}
                    {isNameTaken && (
                        <div className="flex items-center gap-1 text-[9px] text-red-500 font-bold ml-1">
                            <AlertCircle size={10} />
                            <span>JÁ EXISTE OUTRO TEMPLATE COM ESTE NOME</span>
                        </div>
                    )}
                </div>

                {/* File */}
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
                        onClick={handleSave}
                        disabled={!canSave}
                        className={`flex-1 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 
                            ${canSave
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 cursor-pointer'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'
                            }`}
                    >
                        <Save size={12} />
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </Modal>
    );
};