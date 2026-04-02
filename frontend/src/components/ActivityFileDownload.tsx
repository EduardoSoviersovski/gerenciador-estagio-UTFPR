import React from 'react';
import { FileDownloadCard } from './ui/FileDownloadCard';

interface ActivityFileDownloadProps {
    templateUrl?: string;
    isManual: boolean;
}

export const ActivityFileDownload = ({ templateUrl, isManual }: ActivityFileDownloadProps) => {
    if (isManual || !templateUrl) return null;

    return (
        <div className="space-y-4 w-full">
            <h4 className="text-sm font-semibold text-gray-700">Documento Base</h4>

            {/* Aqui passamos as strings específicas que você tinha definido */}
            <FileDownloadCard
                title="Modelo Oferecido pela UTFPR"
                subtitle="Clique em qualquer lugar do card para baixar"
                url={templateUrl}
            />
        </div>
    );
};