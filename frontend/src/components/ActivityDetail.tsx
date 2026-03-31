import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { TimelineStep } from '../types';
import { ActivityHeader } from './ActivityHeader';
import { ActivityFileDownload } from './ActivityFileDownload';
import { ActivityFileUpload } from './ActivityFileUpload';
import { ActivityChat } from './ActivityChat';

interface ActivityDetailProps {
  step: TimelineStep;
  onClose: () => void;
}

export const ActivityDetail = ({ step, onClose }: ActivityDetailProps) => {
  const userRole = 'student';
  const fileExists = step.status === 'completed';


  const showDownload = !step.isManual && !!step.templateUrl;
  const gridLayoutClass = showDownload ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden relative"
    >
      <div className="p-8">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-20"
        >
          <X size={20} />
        </button>

        {/* 1. Cabeçalho: Título, Datas e Tags */}
        <ActivityHeader step={step} />

        {/* 2. Zona de Arquivos: Download e Upload */}
        <div className={`grid ${gridLayoutClass} gap-6 mt-6 w-full items-start`}>
          {showDownload && (
            <ActivityFileDownload
              templateUrl={step.templateUrl}
              isManual={step.isManual}
            />
          )}

          {/* O upload recebe o parâmetro hasFile do pai */}
          <ActivityFileUpload hasFile={fileExists} />
        </div>

        {/* 3. Área de Comunicação (Chat/Feedbacks) */}
        <ActivityChat role={userRole} />
      </div>
    </motion.div>
  );
};