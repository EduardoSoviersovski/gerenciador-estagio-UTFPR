import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { TimelineStep, ACTIVITY_TEMPLATES } from '../types';
import { ActivityHeader } from './ActivityHeader';
import { ActivityFileDownload } from './ActivityFileDownload';
import { ActivityFileUpload } from './ActivityFileUpload';
import { ActivityChat, ChatMessage } from './ActivityChat';

interface ActivityDetailProps {
  step: TimelineStep;
  onClose: () => void;
}

export const ActivityDetail = ({ step, onClose }: ActivityDetailProps) => {
  const fileExists = step.status === 'completed';

  const sanitizeDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    return dateStr.replace(/\*\*/g, '').trim();
  };

  const sanitizedStep = {
    ...step,
    startDate: sanitizeDate(step.startDate),
    dueDate: sanitizeDate(step.dueDate)
  };

  const mappedTemplate = step.type ? ACTIVITY_TEMPLATES[step.type] : null;
  const effectiveTemplateUrl = step.templateUrl || mappedTemplate;
  const showDownload = !!effectiveTemplateUrl && step.type !== 'OUTROS';

  const gridLayoutClass = showDownload ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden relative"
    >
      <div className="p-8">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full z-20 transition-colors hover:bg-gray-50">
          <X size={20} />
        </button>

        <ActivityHeader step={sanitizedStep} />

        <div className="mt-8">
          <div className={`grid ${gridLayoutClass} gap-10 w-full items-stretch`}>
            {showDownload && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-4 ml-1 tracking-wider">
                  Modelo para Download
                </span>
                <div className="flex-1">
                  <ActivityFileDownload templateUrl={effectiveTemplateUrl!} isManual={step.isManual} />
                </div>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400 mb-4 ml-1 tracking-wider">
                {fileExists ? "Documento Enviado" : "Enviar Documento"}
              </span>
              <div className="flex-1">
                <ActivityFileUpload hasFile={fileExists} isUnmpaed={step.type === 'OUTROS'} />
              </div>
            </div>
          </div>
        </div>

        <ActivityChat
          role="student"
          messages={[]}
          onSendMessage={(txt) => console.log(txt)}
        />
      </div>
    </motion.div>
  );
};