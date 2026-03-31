import React, { useRef, useState } from 'react';
import { Upload, Eye, FileText, RefreshCw } from 'lucide-react';
import { FilePreviewModal } from './FilePreviewModal';

interface ActivityFileUploadProps {
  hasFile: boolean;
}

export const ActivityFileUpload = ({ hasFile }: ActivityFileUploadProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockFileData = {
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070',
    name: 'relatorio_final_v1.jpg',
    type: 'image' as const
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Novo arquivo selecionado para substituir o antigo:", file.name);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <h4 className="text-sm font-semibold text-gray-700">Documentação</h4>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {hasFile ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                <FileText size={18} />
              </div>
              <span className="text-sm text-gray-600 truncate font-medium">
                {mockFileData.name}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Visualizar"
              >
                <Eye size={20} />
              </button>

              {/* Botão de Substituir */}
              <button
                onClick={handleTriggerUpload}
                className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                title="Substituir Arquivo"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 italic px-1">
            * O envio de um novo arquivo substituirá automaticamente a versão anterior.
          </p>

          <FilePreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            fileUrl={mockFileData.url}
            fileName={mockFileData.name}
            fileType={mockFileData.type}
          />
        </div>
      ) : (
        <label
          onClick={handleTriggerUpload}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm text-gray-500 font-medium">Clique para upload ou arraste o arquivo</p>
            <p className="text-xs text-gray-400 mt-1 uppercase">PDF, JPG, PNG</p>
          </div>
        </label>
      )}
    </div>
  );
};