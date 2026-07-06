import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ReportTimeline } from '../../components/ReportTimeLine';
import { ActivityDetail } from '../../components/ActivityDetail';
import { TimelineStep } from '../../types';
import { useInternshipData } from '../../hooks/useInternshipData';
import { generateReportSkeletons } from '../../utils/reportFactory';
import { DocumentService } from '../../services/documentService';
import { ProcessDocument } from '../../types/api';

export const Reports = () => {
  const { processId } = useParams<{ processId: string }>();
  const { data: internshipData, loading } = useInternshipData(processId);

  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [processDocuments, setProcessDocuments] = useState<ProcessDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
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
  }, [processId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const steps = useMemo<TimelineStep[]>(() => {
    if (!internshipData?.process) return [];

    const type = internshipData.process.process.type;
    const startDate = internshipData.process.process.start_date || new Date().toISOString();

    const skeletons = generateReportSkeletons(type, startDate);

    return skeletons.map((skeleton): TimelineStep => {
      const skeletonName = String(skeleton.type || '').trim().toUpperCase();

      const realDocument = processDocuments.find((doc) => {
        const docName = String(doc.document_type || '').trim().toUpperCase();
        return docName === skeletonName;
      });

      const getValidStatus = (val?: string): TimelineStep['status'] => {
        if (!val) return 'PENDING';
        const upper = val.toUpperCase();
        if (upper === 'APPROVED') return 'APPROVED';
        if (upper === 'REJECTED') return 'REJECTED';
        if (upper === 'REQUEST_CHANGES') return 'REQUEST_CHANGES';
        if (upper === 'ERROR') return 'ERROR';
        return 'PENDING';
      };
      if (realDocument) {
        return {
          ...skeleton,
          id: String(realDocument.id),
          status: getValidStatus(realDocument.status),
          statusId: realDocument.status_id,
          isSkeleton: false,
        };
      }

      return {
        ...skeleton,
        isSkeleton: true,
        status: 'PENDING',
      };
    });
  }, [internshipData, processDocuments]);

  const selectedStep = useMemo(() => steps.find(s => s.id === activeStepId), [steps, activeStepId]);

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
            onUpdate={fetchDocuments}
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