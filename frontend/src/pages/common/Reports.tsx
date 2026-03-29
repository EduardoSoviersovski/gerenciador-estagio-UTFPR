import React, { useState } from 'react';
import { ReportTimeline } from '../../components/ReportTimeLine';
import { AddActivityForm } from '../../components/AddActivityForm';
import { ActivityDetail } from '../../components/ActivityDetail';
import { TimelineStep } from '../../types';

export const Reports = () => {
  const [steps, setSteps] = useState<TimelineStep[]>([
    { id: '1', title: 'Início Estágio', date: '01/02', status: 'completed', isManual: false },
    { id: '2', title: 'Relatório Mensal', date: '01/03', status: 'current', isManual: false },
  ]);

  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const handleAddStep = (title: string) => {
    const newStep: TimelineStep = {
      id: Math.random().toString(36).substring(2, 9),
      title: title,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      status: 'pending',
      isManual: true,
    };

    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (activeStepId === id) setActiveStepId(null);
    setSteps(prevSteps => prevSteps.filter(step => step.id !== id));
  };

  const handleStepClick = (id: string) => {
    setActiveStepId(prev => (prev === id ? null : id));
  };

  const selectedStep = steps.find(s => s.id === activeStepId);

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Cronograma de Atividades</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe o progresso e envie seus documentos</p>
        </div>
        
        <AddActivityForm onAddStep={handleAddStep} />
      </div>

      <div className="mb-8">
        <ReportTimeline 
          steps={steps} 
          onRemoveStep={handleRemoveStep} 
          onStepClick={handleStepClick}
          activeStepId={activeStepId}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        {selectedStep ? (
          <ActivityDetail 
            step={selectedStep} 
            onClose={() => setActiveStepId(null)} 
          />
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">Selecione uma etapa acima para ver os detalhes ou enviar arquivos.</p>
          </div>
        )}
      </div>
    </div>
  );
};