import React from 'react';
import { FileDownloadCard } from './ui/FileDownloadCard';

interface ActivityFileDownloadProps {
    templateUrl?: string;
    isManual: boolean;
}

export const ActivityFileDownload = ({ templateUrl, isManual }: ActivityFileDownloadProps) => {
    if (!templateUrl) return null;

    return (
        <FileDownloadCard
            title="Modelo Oferecido pela UTFPR"
            subtitle="Clique para baixar"
            url={templateUrl}
        />
    );
};