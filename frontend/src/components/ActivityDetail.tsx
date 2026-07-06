import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { TimelineStep, ACTIVITY_TEMPLATES } from '../types';
import { ActivityHeader } from './ActivityHeader';
import { ActivityFileDownload } from './ActivityFileDownload';
import { ActivityFileUpload } from './ActivityFileUpload';
import { ActivityChat } from './ActivityChat';
import { DOCUMENT_TYPE_IDS } from '../constants/documentTypes';

interface ActivityDetailProps {
  step: TimelineStep;
  processId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export const ActivityDetail = ({ step, processId, onClose, onUpdate }: ActivityDetailProps) => {
  const [reportDetails, setReportDetails] = useState<any>(null);
  const fileExists = step.status !== 'PENDING';
  const documentTypeId = step.type ? DOCUMENT_TYPE_IDS[step.type] : null;

  const formatAndSanitizeDate = (dateStr?: string) => {
    if (!dateStr) return { formatted: undefined, isLate: false };

    const cleanStr = dateStr.replace(/\*\*/g, '').trim();

    const date = new Date(cleanStr);
    const formatted = !isNaN(date.getTime()) ? date.toLocaleDateString('pt-BR') : cleanStr;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isLate = date < today;

    return { formatted, isLate };
  };

  const startData = formatAndSanitizeDate(step.startDate);
  const dueData = formatAndSanitizeDate(step.dueDate);

  const sanitizedStep = {
    ...step,
    startDate: startData.formatted,
    dueDate: dueData.formatted,
    isDueDateLate: dueData.isLate
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
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full z-20 transition-colors hover:bg-gray-50 cursor-pointer outline-none"
        >
          <X size={20} />
        </button>

        <div className="flex justify-between items-start w-full">
          <ActivityHeader
            step={sanitizedStep}
            processId={processId}
            documentTypeId={documentTypeId}
            currentStatus={step.statusId}
            onUpdate={onUpdate}
          />
        </div>

        <div className="border-b border-gray-100 w-[calc(100%+4rem)] -ml-8 my-8" />

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
                <ActivityFileUpload hasFile={fileExists} isUnmaped={step.type === 'OUTROS'} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 w-[calc(100%+4rem)] -ml-8 my-8" />

        {documentTypeId && processId ? (
          <div className="mt-8 h-[400px]">
            <ActivityChat processId={Number(processId)} documentTypeId={documentTypeId} />
          </div>
        ) : (
          <div className="mt-8 p-8 text-center text-gray-400 text-sm bg-gray-50 rounded-2xl border border-gray-100">
            Chat não disponível para este tipo de atividade.
          </div>
        )}
      </div>
    </motion.div>
  );
};