import React from 'react';
import { FileDown } from 'lucide-react';

interface FileDownloadCardProps {
    title: string;
    subtitle: string;
    url: string;
}

export const FileDownloadCard = ({ title, subtitle, url }: FileDownloadCardProps) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer group hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm active:scale-[0.98] w-full"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileDown size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-blue-900 leading-none">{title}</p>
                    <p className="text-[11px] text-blue-600 mt-1 italic tracking-wide">
                        {subtitle}
                    </p>
                </div>
            </div>
        </a>
    );
};