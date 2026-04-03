import React, { useRef } from 'react';
import { Upload, FileText, Eye, RefreshCw } from 'lucide-react';

interface FileUploadZoneProps {
    hasFile: boolean;
    fileName?: string;
    onFileSelect: (file: File) => void;
    onPreview: () => void;
    accept?: string;
}

export const FileUploadZone = ({
    hasFile,
    fileName,
    onFileSelect,
    onPreview,
    accept = ".pdf,.jpg,.jpeg,.png"
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
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                className="hidden"
                accept={accept}
            />

            {hasFile ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                <FileText size={18} />
                            </div>
                            <span className="text-sm text-gray-600 truncate font-medium">{fileName}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={onPreview}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Visualizar"
                            >
                                <Eye size={20} />
                            </button>

                            <button
                                onClick={triggerUpload}
                                className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                title="Substituir arquivo"
                            >
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 italic px-1">
                        * O novo envio substituirá a versão anterior.
                    </p>
                </div>
            ) : (
                <label
                    onClick={triggerUpload}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <Upload className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <p className="text-sm text-gray-500 font-medium">Clique para upload ou arraste o arquivo</p>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{accept.replace(/\./g, ' ')}</p>
                    </div>
                </label>
            )}
        </div>
    );
};