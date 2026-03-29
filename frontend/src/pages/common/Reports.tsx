import React, { useState } from 'react';
import { ReportTimeline } from '../../components/ReportTimeLine';
import { AddActivityForm } from '../../components/AddActivityForm';
import { TimelineStep } from '../../types';


export const Reports = () => {
  const [steps, setSteps] = useState<TimelineStep[]>([
    { id: '1', title: 'Início Estágio', date: '01/02', status: 'completed', isManual: false },
    { id: '2', title: 'Relatório Mensal', date: '01/03', status: 'current', isManual: false },
  ]);

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
    setSteps(prevSteps => prevSteps.filter(step => step.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cronograma de Atividades</h1>
          <p className="text-sm text-gray-500">Gerencie as etapas do seu estágio na UTFPR</p>
        </div>
        <AddActivityForm onAddStep={handleAddStep} />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <ReportTimeline 
          steps={steps} 
          onRemoveStep={handleRemoveStep} 
        />
      </div>
    </div>
  );
};