import React, { useRef } from 'react';
import { Upload, FileText, Eye, RefreshCw, Download, Lock } from 'lucide-react';
import { Tooltip } from '@mui/material';

interface FileUploadZoneProps {
    hasFile: boolean;
    fileName?: string;
    onFileSelect: (file: File) => void;
    onPreview: () => void;
    onDownload?: () => void;
    accept?: string;
    className?: string;
    isUnmaped?: boolean;
    isTemplate?: boolean;
    allowUpload?: boolean;
}

export const FileUploadZone = ({
    hasFile,
    fileName,
    onFileSelect,
    onPreview,
    onDownload,
    accept = ".pdf,.jpg,.jpeg,.png",
    className = "",
    isUnmaped = false,
    isTemplate = false,
    allowUpload = true
}: FileUploadZoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const canPreview = (name: string | undefined) => {
        if (!name) return false;
        const extension = name.split('.').pop()?.toLowerCase();
        const webViewable = ['pdf', 'jpg', 'jpeg', 'png'];
        return webViewable.includes(extension || '');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && allowUpload) {
            onFileSelect(file);
            e.target.value = '';
        }
    };

    const triggerUpload = () => {
        if (allowUpload) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className={`w-full h-full flex flex-col flex-1 ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                className="hidden"
                accept={isTemplate ? ".docx" : accept}
                disabled={!allowUpload}
            />

            {hasFile ? (
                <div className="flex flex-col gap-2 h-full justify-center flex-1">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                <FileText size={18} />
                            </div>
                            <span className="text-sm text-gray-600 truncate font-medium">
                                {fileName}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
                                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                                title="Baixar arquivo"
                            >
                                <Download size={20} />
                            </button>

                            {!canPreview(fileName) ? (
                                <Tooltip title="Visualização indisponível para arquivos .docx. Baixe o arquivo para revisar." arrow placement="top">
                                    <div className="p-2 text-gray-300 cursor-help">
                                        <Eye size={20} className="opacity-50" />
                                    </div>
                                </Tooltip>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onPreview(); }}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                    title="Visualizar"
                                >
                                    <Eye size={20} />
                                </button>
                            )}

                            {allowUpload && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); triggerUpload(); }}
                                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all cursor-pointer"
                                    title="Substituir arquivo"
                                >
                                    <RefreshCw size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 italic px-1">
                        {!allowUpload
                            ? "* Você não tem permissão para alterar este arquivo."
                            : isTemplate
                                ? "* O novo template substituirá a versão base do sistema."
                                : "* O novo envio substituirá a versão anterior."}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2 h-full justify-center flex-1">
                    <label
                        onClick={allowUpload ? triggerUpload : undefined}
                        className={`flex w-full h-full border-2 border-dashed rounded-xl transition-all group p-4 
                            ${!isUnmaped ? 'items-center justify-start' : 'flex-col items-center justify-center'}
                            ${allowUpload
                                ? 'border-gray-200 cursor-pointer hover:bg-gray-50 hover:border-blue-300'
                                : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'}`}
                    >
                        <div className={`flex items-center gap-3 ${isUnmaped ? 'flex-col text-center' : 'text-left'}`}>
                            <div className={`p-2 rounded-lg shrink-0 transition-colors ${allowUpload ? 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600' : 'bg-gray-200 text-gray-300'}`}>
                                {allowUpload ? <Upload size={18} /> : <Lock size={18} />}
                            </div>
                            <div>
                                <p className={`text-sm font-bold leading-none ${allowUpload ? 'text-gray-500' : 'text-gray-300'} ${isUnmaped ? 'mb-1' : ''}`}>
                                    {!allowUpload
                                        ? "Apenas visualização habilitada"
                                        : isTemplate ? "Clique para upload do template base" : "Clique para fazer upload do arquivo"}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-1 italic tracking-wide">
                                    {allowUpload ? (isTemplate ? "apenas .docx" : accept.replace(/\./g, ' ')) : "Somente leitura"}
                                </p>
                            </div>
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};