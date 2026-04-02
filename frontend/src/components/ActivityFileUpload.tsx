import React, { useState } from 'react';
import { FileUploadZone } from './ui/FileUploadZone';
import { FilePreviewModal } from './FilePreviewModal';

export const ActivityFileUpload = ({ hasFile }: { hasFile: boolean }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const mockFile = {
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070',
    name: 'relatorio_entrega_v1.jpg'
  };

  const handleFileAction = (file: File) => {
    console.log("Arquivo capturado para envio/substituição:", file.name);
  };

  return (
    <div className="space-y-4 w-full">
      <h4 className="text-sm font-semibold text-gray-700 font-sans">Documentação</h4>

      <FileUploadZone
        hasFile={hasFile}
        fileName={mockFile.name}
        onPreview={() => setIsPreviewOpen(true)}
        onFileSelect={handleFileAction}
      />

      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={mockFile.url}
        fileName={mockFile.name}
        fileType="image"
      />
    </div>
  );
};