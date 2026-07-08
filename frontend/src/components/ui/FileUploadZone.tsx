import React, { useRef, useState } from 'react';
import { Upload, FileText, Download, Lock, Loader2, Replace, Image } from 'lucide-react';
import { Menu, MenuItem, Tooltip } from '@mui/material';

interface FileUploadZoneProps {
    hasFile: boolean;
    fileName?: string;
    onFileSelect: (file: File) => void;
    onDownload: (format: 'pdf' | 'jpg') => void;
    className?: string;
    isUnmaped?: boolean;
    isTemplate?: boolean;
    allowUpload?: boolean;
    isLoading?: boolean;
}

export const FileUploadZone = ({
    hasFile,
    fileName,
    onFileSelect,
    onDownload,
    className = "",
    isUnmaped = false,
    isTemplate = false,
    allowUpload = true,
    isLoading = false
}: FileUploadZoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && allowUpload && !isLoading) {
            if (!isTemplate && file.type !== 'application/pdf') {
                alert("Formato inválido. Por favor, envie apenas arquivos PDF.");
                return;
            }
            onFileSelect(file);
            e.target.value = '';
        }
    };

    const triggerUpload = () => {
        if (allowUpload && !isLoading) {
            fileInputRef.current?.click();
        }
    };

    const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (format?: 'pdf' | 'jpg') => {
        setAnchorEl(null);
        if (format) onDownload(format);
    };

    return (
        <div className={`w-full h-full flex flex-col flex-1 relative ${className}`}>

            {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-[2px] rounded-xl flex items-center justify-center border border-blue-100">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                className="hidden"
                accept={isTemplate ? ".docx" : ".pdf"}
                disabled={!allowUpload || isLoading}
            />

            {hasFile ? (
                <div className={`flex flex-col gap-2 h-full justify-center flex-1 ${isLoading ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                <FileText size={18} />
                            </div>
                            <span className="text-sm text-gray-600 truncate font-medium">
                                {fileName}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownloadClick}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all text-xs font-semibold cursor-pointer"
                                title="Baixar arquivo"
                            >
                                <Download size={16} />
                                <span>Baixar</span>
                            </button>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => handleMenuClose()}
                                disableScrollLock={true}
                            >
                                <MenuItem onClick={() => handleMenuClose('pdf')} sx={{ gap: 1.5, fontSize: '13px' }}>
                                    <FileText size={16} className="text-red-500" /> Baixar PDF
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuClose('jpg')} sx={{ gap: 1.5, fontSize: '13px' }}>
                                    <Image size={16} className="text-blue-500" /> Baixar JPEG
                                </MenuItem>
                            </Menu>

                            {allowUpload && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); triggerUpload(); }}
                                    disabled={isLoading}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all text-xs font-semibold cursor-pointer"
                                    title="Substituir arquivo"
                                >
                                    <Replace size={16} />
                                    <span>Substituir</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2 h-full justify-center flex-1">
                    <label
                        onClick={allowUpload && !isLoading ? triggerUpload : undefined}
                        className={`flex w-full h-full border-2 border-dashed rounded-xl transition-all group p-4 
                            ${!isUnmaped ? 'items-center justify-start' : 'flex-col items-center justify-center'}
                            ${allowUpload && !isLoading
                                ? 'border-gray-200 cursor-pointer hover:bg-gray-50 hover:border-blue-300'
                                : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'}`}
                    >
                        <div className={`flex items-center gap-3 ${isUnmaped ? 'flex-col text-center' : 'text-left'}`}>
                            <div className={`p-2 rounded-lg shrink-0 transition-colors ${allowUpload && !isLoading ? 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600' : 'bg-gray-200 text-gray-300'}`}>
                                {allowUpload ? <Upload size={18} /> : <Lock size={18} />}
                            </div>
                            <div>
                                <p className={`text-sm font-bold leading-none ${allowUpload && !isLoading ? 'text-gray-500' : 'text-gray-300'} ${isUnmaped ? 'mb-1' : ''}`}>
                                    Clique para enviar seu arquivo PDF
                                </p>
                            </div>
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};