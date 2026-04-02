import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { TimelineStep } from '../types';
import { ActivityHeader } from './ActivityHeader';
import { ActivityFileDownload } from './ActivityFileDownload';
import { ActivityFileUpload } from './ActivityFileUpload';
import { ActivityChat, ChatMessage } from './ActivityChat';

interface ActivityDetailProps {
  step: TimelineStep;
  onClose: () => void;
}

export const ActivityDetail = ({ step, onClose }: ActivityDetailProps) => {
  // Configurações de Role e Estado do Arquivo
  const userRole = 'student';
  const fileExists = step.status === 'completed';

  /**
   * Simulação de busca de mensagens individuais baseadas no ID da etapa.
   * No futuro, este dado virá de uma chamada de API (ex: GET /api/messages/:stepId)
   */
  const getMockMessages = (stepId: string): ChatMessage[] => {
    const messageDatabase: Record<string, ChatMessage[]> = {
      '1': [
        {
          id: 'm1',
          sender: 'Prof. Ricardo',
          text: 'Documentação inicial de estágio recebida e conferida. Tudo certo com o plano de atividades.',
          time: '08:00',
          isMe: false
        },
        {
          id: 'm2',
          sender: 'Sistema',
          text: 'Etapa marcada como concluída após validação do orientador.',
          time: '08:05',
          isMe: true
        }
      ],
      '2': [
        {
          id: 'm3',
          sender: 'Prof. Ricardo',
          text: 'Pedro, verifiquei o relatório parcial. Você esqueceu de anexar a folha de frequências assinada. Por favor, substitua o arquivo.',
          time: '14:20',
          isMe: false
        }
      ],
    };
    return messageDatabase[stepId] || [];
  };


  const handleSendMessage = (text: string) => {
    console.log(`[Backend Sim] Enviando mensagem para Step ${step.id}: ${text}`);
  };

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
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-20"
        >
          <X size={20} />
        </button>

        <ActivityHeader step={step} />

        <div className={`grid ${gridLayoutClass} gap-6 mt-6 w-full items-start`}>
          {showDownload && (
            <ActivityFileDownload
              templateUrl={step.templateUrl}
              isManual={step.isManual}
            />
          )}

          <ActivityFileUpload hasFile={fileExists} />
        </div>

        <ActivityChat
          role={userRole}
          messages={getMockMessages(step.id)}
          onSendMessage={handleSendMessage}
        />
      </div>
    </motion.div>
  );
};