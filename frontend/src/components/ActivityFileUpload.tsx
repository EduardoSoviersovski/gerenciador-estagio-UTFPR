import React, { useState } from 'react';
import { FileUploadZone } from './ui/FileUploadZone';
import { FilePreviewModal } from './modals/FilePreviewModal';
import { useAuth } from '../contexts/AuthContext';
import { ActivityType } from '../types';

interface ActivityFileUploadProps {
  hasFile: boolean;
  isUnmaped: boolean;
  activityType?: ActivityType;
  onFileUploaded?: (fileName: string) => void;
}

export const ActivityFileUpload = ({
  hasFile,
  isUnmaped,
  activityType,
  onFileUploaded
}: ActivityFileUploadProps) => {
  const { user } = useAuth();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const mockFile = {
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070',
    name: 'relatorio_entrega_v1.jpg'
  };

  const canManageFile = () => {
    const safeRole = user?.role?.toUpperCase();
    if (safeRole === 'STUDENT') return true;
    if (safeRole === 'ADVISOR' && activityType === 'RELATORIO_FINAL') return true;
    return false;
  };

  const handleFileAction = (file: File) => {
    console.log("Arquivo capturado para envio/substituição:", file.name);
    onFileUploaded?.(file.name);
  };

  const handleDownload = async () => {
    if (!mockFile.url) return;
    try {
      const response = await fetch(mockFile.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = mockFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(mockFile.url, '_blank');
    }
  };

  return (
    <div className="w-full h-full flex flex-col flex-1">
      <FileUploadZone
        hasFile={hasFile}
        fileName={mockFile.name}
        onPreview={() => setIsPreviewOpen(true)}
        onFileSelect={handleFileAction}
        onDownload={handleDownload}
        allowUpload={canManageFile()}
        className="h-full flex-1"
        isUnmaped={isUnmaped}
      />

      {/* <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={mockFile.url}
        fileName={mockFile.name}
        fileType="image"
      /> */}
    </div>
  );
};