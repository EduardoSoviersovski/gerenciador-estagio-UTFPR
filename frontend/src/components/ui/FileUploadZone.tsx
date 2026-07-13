import React, { useRef, useState } from 'react';
import { Upload, FileDown, Lock, Loader2, Replace, Image, FileText } from 'lucide-react';
import { Menu, MenuItem } from '@mui/material';

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
    const [isHoveringReplace, setIsHoveringReplace] = useState(false);

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

    const handleDownloadClick = (event: React.MouseEvent<HTMLDivElement>) => {
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

                    <div className={`flex items-center justify-between border rounded-xl shadow-sm transition-all duration-300 w-full h-[72px] ${isHoveringReplace
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-blue-50/50 border-blue-100 hover:border-blue-300'
                        }`}>

                        <div
                            onClick={handleDownloadClick}
                            className={`flex items-center gap-3 p-4 flex-1 cursor-pointer group transition-all rounded-l-xl active:scale-[0.99] h-full overflow-hidden ${isHoveringReplace ? '' : 'hover:bg-blue-50'
                                }`}
                            title="Baixar arquivo"
                        >
                            <div className={`p-2 rounded-lg transition-colors duration-300 shrink-0 ${isHoveringReplace
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                                }`}>
                                <FileDown size={20} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <p className={`text-sm font-bold truncate leading-none transition-colors duration-300 ${isHoveringReplace ? 'text-orange-900' : 'text-blue-900'
                                    }`}>
                                    {fileName}
                                </p>
                                <p className={`text-[11px] mt-1 italic tracking-wide transition-colors duration-300 ${isHoveringReplace ? 'text-orange-600' : 'text-blue-600'
                                    }`}>
                                    Clique para baixar
                                </p>
                            </div>
                        </div>

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
                            <div className={`flex items-center justify-center self-stretch border-l px-3 transition-colors duration-300 ${isHoveringReplace ? 'border-orange-200' : 'border-blue-100'
                                }`}>
                                <button
                                    onMouseEnter={() => setIsHoveringReplace(true)}
                                    onMouseLeave={() => setIsHoveringReplace(false)}
                                    onClick={(e) => { e.stopPropagation(); triggerUpload(); }}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-blue-600 hover:text-white hover:bg-orange-500 rounded-lg transition-all duration-300 cursor-pointer group active:scale-[0.96]"
                                    title="Substituir arquivo"
                                >
                                    <Replace size={18} className="transition-transform duration-300 group-hover:rotate-180" />
                                    <span>Substituir</span>
                                </button>
                            </div>
                        )}
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

                            <div className="flex flex-col gap-1.5">
                                <p className={`text-sm font-bold leading-none ${allowUpload && !isLoading ? 'text-gray-500' : 'text-gray-300'} ${isUnmaped ? 'mt-1' : ''}`}>
                                    Clique para enviar seu arquivo
                                </p>
                                <p className={`text-[11px] font-medium tracking-wide transition-colors ${allowUpload && !isLoading ? 'text-gray-400' : 'text-gray-300'}`}>
                                    Formatos aceitos: <span className={`font-bold ${allowUpload && !isLoading ? 'text-blue-500 group-hover:text-blue-600' : 'text-gray-300'}`}>
                                        {isTemplate ? '.docx, .pdf' : '.pdf'}
                                    </span>
                                </p>
                            </div>

                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};