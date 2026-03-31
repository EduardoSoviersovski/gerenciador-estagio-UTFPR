import React from 'react';
import { Upload, Eye, FileText } from 'lucide-react';

interface ActivityFileUploadProps {
  hasFile: boolean;
}

export const ActivityFileUpload = ({ hasFile }: ActivityFileUploadProps) => {
  return (
    <div className="space-y-4 w-full">
      <h4 className="text-sm font-semibold text-gray-700">Documentação</h4>

      {hasFile ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-500" />
            <span className="text-sm text-gray-600">relatorio_março_v1.pdf</span>
          </div>
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
            <Eye size={16} /> Visualizar
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm text-gray-500">Clique para upload ou arraste o arquivo</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOCX até 10MB</p>
          </div>
          <input type="file" className="hidden" />
        </label>
      )}
    </div>
  );
};