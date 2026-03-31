import React from 'react';
import { FileDown, Info } from 'lucide-react';

interface ActivityFileDownloadProps {
    templateUrl?: string;
    isManual: boolean;
}

export const ActivityFileDownload = ({ templateUrl, isManual }: ActivityFileDownloadProps) => {
    if (isManual || !templateUrl) return null;

    return (
        <div className="flex flex-col w-full">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Info size={14} className="text-blue-500" />
                Documento Base
            </h4>

            <a
                href={templateUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer group hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm active:scale-[0.98]"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileDown size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-900 leading-none">Modelo Oferecido pela UTFPR</p>
                        <p className="text-[11px] text-blue-600 mt-1 italic tracking-wide">
                            Clique em qualquer lugar do card para baixar
                        </p>
                    </div>
                </div>
            </a>
        </div>
    );
};