// src/components/ActivityDetail.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TimelineStep } from '../types';

interface ActivityDetailProps {
  step: TimelineStep;
  onClose: () => void;
}

export const ActivityDetail = ({ step, onClose }: ActivityDetailProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full bg-white rounded-xl border border-gray-100 shadow-md p-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
          <p className="text-sm text-gray-500">Data: {step.date}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium"
        >
          Fechar
        </button>
      </div>
      
      <div className="mt-8 h-32 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-gray-300">
        Conteúdo da atividade {step.title} aparecerá aqui...
      </div>
    </motion.div>
  );
};