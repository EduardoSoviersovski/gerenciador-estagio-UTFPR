import React, { useRef } from 'react';
import { Upload, FileText, Eye, RefreshCw } from 'lucide-react';

interface FileUploadZoneProps {
    hasFile: boolean;
    fileName?: string;
    onFileSelect: (file: File) => void;
    onPreview: () => void;
    accept?: string;
    className?: string;
    isUnmpaed?: boolean;
}

export const FileUploadZone = ({
    hasFile,
    fileName,
    onFileSelect,
    onPreview,
    accept = ".pdf,.jpg,.jpeg,.png",
    className = "",
    isUnmpaed = false
}: FileUploadZoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
            e.target.value = '';
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`w-full h-full flex flex-col flex-1 ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                className="hidden"
                accept={accept}
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
                            <button onClick={onPreview} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Visualizar">
                                <Eye size={20} />
                            </button>
                            <button onClick={triggerUpload} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" title="Substituir arquivo">
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 italic px-1">
                        * O novo envio substituirá a versão anterior.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2 h-full justify-center flex-1">
                    <label
                        onClick={triggerUpload}
                        className={`flex w-full h-full border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group p-4 
                            ${!isUnmpaed ? 'items-center justify-start' : 'flex-col items-center justify-center'}`}
                    >
                        <div className={`flex items-center gap-3 ${isUnmpaed ? 'flex-col text-center' : 'text-left'}`}>
                            <div className="p-2 bg-gray-100 text-gray-400 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shrink-0">
                                <Upload size={18} />
                            </div>
                            <div>
                                <p className={`text-sm font-bold text-gray-500 leading-none ${isUnmpaed ? 'mb-1' : ''}`}>
                                    Clique para fazer upload do arquivo
                                </p>
                                <p className="text-[11px] text-gray-400 mt-1 italic tracking-wide">
                                    {accept.replace(/\./g, ' ')}
                                </p>
                            </div>
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};