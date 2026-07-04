import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReportTimeline } from '../../components/ReportTimeLine';
import { ActivityDetail } from '../../components/ActivityDetail';
import { TimelineStep, ActivityType } from '../../types';
import { useInternshipData } from '../../hooks/useInternshipData';
import { generateReportSkeletons } from '../../utils/reportFactory';
import { DocumentService } from '../../services/documentService';
import { ProcessDocument } from '../../types/api';

export const Reports = () => {
  const { processId } = useParams<{ processId: string }>();
  const { data: internshipData, loading } = useInternshipData(processId);

  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const [processDocuments, setProcessDocuments] = useState<ProcessDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!processId) return;
      try {
        setDocumentsLoading(true);
        const docs = await DocumentService.getProcessDocuments(Number(processId));
        setProcessDocuments(docs);
      } catch (error) {
        console.error("Erro ao buscar documentos do processo:", error);
      } finally {
        setDocumentsLoading(false);
      }
    };
    fetchDocuments();
    console.log("Fetching process documents for processId:", processId, selectedStep);
  }, [processId]);

  useEffect(() => {
    if (internshipData?.process) {
      const type = internshipData.process.process.type;
      const startDate = internshipData.process.process.start_date || new Date().toISOString();

      const skeletons = generateReportSkeletons(type, startDate);

      const mergedSteps: TimelineStep[] = skeletons.map((skeleton) => {
        const realDocument = processDocuments.find(
          (doc) => doc.document_type_name === skeleton.type
        );

        if (realDocument) {
          return {
            ...skeleton,
            id: String(realDocument.id),
            status: (realDocument.status_name?.toUpperCase() as TimelineStep['status']) || 'PENDING',
          };
        }

        return skeleton;
      });

      setSteps(mergedSteps);
    }
  }, [internshipData, processDocuments]);

  const handleConfirmAdd = (type: ActivityType, title: string) => {
    const now = new Date();
    const fullDate = now.toLocaleDateString('pt-BR');
    const shortDate = fullDate.substring(0, 5);

    const newStep: TimelineStep = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      type: type as string,
      date: shortDate,
      status: 'PENDING',
      isManual: true,
      startDate: fullDate,
    };

    setSteps([...steps, newStep]);
  };

  const selectedStep = steps.find(s => s.id === activeStepId);

  if (loading || documentsLoading) {
    return (
      <div className="p-8 min-h-screen bg-gray-50/50 flex items-center justify-center">
        <p className="text-gray-500 font-medium animate-pulse">Carregando cronograma...</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Cronograma de Atividades</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe o progresso e envie seus documentos</p>
        </div>
      </div>

      <div className="mb-8">
        <ReportTimeline
          steps={steps}
          onRemoveStep={(id) => setSteps(s => s.filter(x => x.id !== id))}
          onStepClick={setActiveStepId}
          activeStepId={activeStepId}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        {selectedStep && processId ? (
          <ActivityDetail
            step={selectedStep}
            processId={processId}
            onClose={() => setActiveStepId(null)}
          />
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-[32px] bg-white/50">
            <p className="text-gray-400 text-sm font-medium">Selecione uma etapa para ver detalhes.</p>
          </div>
        )}
      </div>
    </div>
  );
};