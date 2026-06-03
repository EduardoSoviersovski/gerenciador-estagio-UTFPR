import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { FileUploadZone } from '../ui/FileUploadZone';
import { FormInput } from '../ui/FormInput';
import { FileText, Save, AlertCircle } from 'lucide-react';

interface EditTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: { id: string; name: string } | null;
    existingTemplates: { id: string; name: string }[];
    onSave: (id: string, newName: string, newSlug: string, newFile: File | null) => void;
}

export const EditTemplateModal = ({ isOpen, onClose, template, existingTemplates, onSave }: EditTemplateModalProps) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (template) {
            setName(template.name);
            setFile(null);
        }
    }, [template, isOpen]);

    const isNameTaken = existingTemplates.some(t =>
        t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== template?.id
    );

    const isNameEmpty = name.trim().length === 0;
    const hasNameChanged = name.trim() !== template?.name;
    const hasFileChanged = file !== null;

    const canSave = (hasNameChanged || hasFileChanged) && !isNameEmpty && !isNameTaken;

    const handleSave = () => {
        if (template && canSave) {
            onSave(template.id, name.trim(), slug.trim(), file);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Editar Template ${template?.name || ''}`} size="md">
            <div className="space-y-6 p-1 text-left">

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

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Substituir Arquivo Base (.docx / .pdf)
                    </label>
                    <div className="h-32">
                        <FileUploadZone
                            hasFile={file !== null}
                            fileName={file?.name}
                            onFileSelect={(f) => setFile(f)}
                            onPreview={() => { }}
                            accept=".docx,.pdf"
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