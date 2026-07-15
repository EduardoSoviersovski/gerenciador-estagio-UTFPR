import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { FileText, Files, Info, X, Plus, FilePlus, ShieldCheck } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useInternshipData } from '../../hooks/useInternshipData';
import { DocumentService } from '../../services/documentService';
import { ProcessDocument } from '../../types/api';
import { ADMIN_TEMPLATES_MAP } from '../../constants/templateTypes';
import { PATHS } from '../../routes/paths';

import { AddDocumentModal } from '../../components/AddDocumentModal';
import { ActivityHeader } from '../../components/ActivityHeader';
import { ActivityFileDownload } from '../../components/ActivityFileDownload';
import { ActivityFileUpload } from '../../components/ActivityFileUpload';
import { ActivityChat } from '../../components/ActivityChat';
import { TimelineStep } from '../../types';

type TabCategory = 'DOCUMENTS' | 'REPORTS' | 'MANUAL';
type ModalMode = 'REPORT' | 'MAPPED_DOC' | 'MANUAL_DOC' | 'NEW_MANUAL_DOC';

interface ModalContext {
  mode: ModalMode;
  templateId: number;
  documentId?: number;
  customTitle?: string;
}

interface StudentDocumentModalProps {
  context: ModalContext | null;
  isOpen: boolean;
  onClose: () => void;
  processId: number | null;
  uploadedDoc: ProcessDocument | undefined;
  onUpdate: () => void;
  userRole?: string;
}

const StudentDocumentModal = ({ context, isOpen, onClose, processId, uploadedDoc, onUpdate, userRole }: StudentDocumentModalProps) => {
  if (!isOpen || !context) return null;

  const isTemplateMode = context.mode === 'REPORT' || context.mode === 'MAPPED_DOC';
  const hasFileUploaded = !!uploadedDoc && uploadedDoc.fileName !== 'Pendente_de_envio' && uploadedDoc.fileName !== '';
  const currentStatus = uploadedDoc?.statusId || 1; // 1 = PENDING

  const template = ADMIN_TEMPLATES_MAP.find(t => t.id === context.templateId) || {
    id: 6,
    name: 'Envio de Documento Manual',
    category: 'DOCUMENTS'
  };

  const displayTitle = context.customTitle || template.name;

  const stepMock = {
    id: uploadedDoc?.id?.toString() || 'skeleton',
    title: displayTitle,
    type: context.templateId === 6 ? 'OUTROS' : 'DOCUMENTO',
    status: 'PENDING',
    isSkeleton: !uploadedDoc,
    fileName: uploadedDoc?.fileName || ''
  } as TimelineStep;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full z-20 transition-colors hover:bg-gray-50 cursor-pointer outline-none"
        >
          <X size={20} />
        </button>

        {isTemplateMode ? (
          <div className="p-8 pb-12 flex-1 text-left flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Modelo Oficial da UTFPR
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight pr-12">
                {displayTitle}
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-2">
                Clique no card abaixo para escolher o formato desejado (PDF ou Word).
              </p>
            </div>
            <div className="w-full mt-4">
              <ActivityFileDownload
                documentTypeId={template.id}
                templateName={template.name}
              />
            </div>
          </div>
        ) : (
          <div className="p-8 pb-4 flex-1 text-left">
            <div className="flex justify-between items-start w-full pr-8">
              <ActivityHeader
                step={stepMock}
                processId={processId?.toString()}
                documentTypeId={template.id}
                currentStatus={currentStatus}
                onUpdate={onUpdate}
                userRole={userRole}
              />
            </div>

            <div className="border-b border-gray-100 w-[calc(100%+4rem)] -ml-8 my-8" />

            <div className="flex flex-col max-w-2xl mx-auto">
              <span className="text-[10px] font-bold uppercase text-slate-400 mb-4 ml-1 tracking-wider text-center">
                {hasFileUploaded ? "Documento Enviado" : "Enviar Documento"}
              </span>

              <div className="h-[120px]">
                {!processId ? (
                  <div className="h-full flex flex-col items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-center text-sm">
                    <Info size={24} className="mb-2 text-yellow-600" />
                    <span>O envio de arquivos será liberado após o registro do seu processo.</span>
                  </div>
                ) : (
                  <ActivityFileUpload
                    hasFile={hasFileUploaded}
                    isUnmaped={true}
                    processId={processId}
                    documentTypeId={template.id}
                    documentId={uploadedDoc?.id}
                    fileName={uploadedDoc?.fileName}
                    onUpdate={() => {
                      onUpdate();
                    }}
                  />
                )}
              </div>
            </div>

            <div className="border-b border-gray-100 w-[calc(100%+4rem)] -ml-8 my-8" />

            {processId && uploadedDoc ? (
              <div className="h-[400px]">
                <ActivityChat
                  processId={processId}
                  documentTypeId={template.id}
                  documentId={uploadedDoc.id}
                  isSkeleton={false}
                  onUpdate={onUpdate}
                />
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm bg-gray-50 rounded-2xl border border-gray-100">
                Chat de correções não disponível no momento. Envie o documento para iniciar.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Documents = () => {
  const { processId } = useParams<{ processId: string }>();
  const { user } = useAuth();

  const safeRole = user?.role?.toUpperCase() || '';
  const isAdmin = safeRole === 'ADMIN';

  const { data, loading: processLoading, error } = useInternshipData(processId);
  const [uploadedDocuments, setUploadedDocuments] = useState<ProcessDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<string>('DOCUMENTS');
  const [modalContext, setModalContext] = useState<ModalContext | null>(null);
  const [isAddNameModalOpen, setIsAddNameModalOpen] = useState(false);

  if (error === "UNAUTHORIZED") return <Navigate to={PATHS.UNAUTHORIZED} replace />;
  if (error === "NOT_FOUND" && !isAdmin) return <Navigate to={PATHS.UNAUTHORIZED} replace />;

  const hasProcess = !!data?.process?.process?.id && error !== "NOT_FOUND";
  const numericProcessId = hasProcess ? Number(data.process.process.id) : null;
  const isPageLoading = processLoading || docsLoading;

  const fetchStudentDocuments = useCallback(async () => {
    if (!numericProcessId) return;
    setDocsLoading(true);
    try {
      const docs = await DocumentService.getProcessDocuments(numericProcessId);
      setUploadedDocuments(docs);
    } catch (error) {
      console.error("Erro ao buscar documentos do aluno:", error);
    } finally {
      setDocsLoading(false);
    }
  }, [numericProcessId]);

  useEffect(() => {
    fetchStudentDocuments();
  }, [fetchStudentDocuments]);

  useEffect(() => {
    if (!processLoading) {
      if (hasProcess) {
        setActiveTab('MANUAL');
      } else {
        setActiveTab('DOCUMENTS');
      }
    }
  }, [hasProcess, processLoading]);

  const reportTemplates = ADMIN_TEMPLATES_MAP.filter(t => t.category === 'REPORTS');
  const mappedDocuments = ADMIN_TEMPLATES_MAP.filter(t => t.category === 'DOCUMENTS' && t.id !== 6);
  const manualDocuments = uploadedDocuments.filter(d => d.documentTypeId === 6);

  const handleUploadManualDoc = async (name: string, file: File) => {
      if (!numericProcessId) return;
      try {
          await DocumentService.uploadDocument(numericProcessId, 6, file, undefined, name);

          setIsAddNameModalOpen(false);
          fetchStudentDocuments();
      } catch (error) {
          console.error("Erro ao fazer upload do documento manual:", error);
      }
  };

  const TABS = [
    ...(hasProcess ? [{ id: 'MANUAL', label: 'Envio de Documento Manual', icon: FilePlus }] : []),
    { id: 'DOCUMENTS', label: 'Templates de Documentos', icon: Files },
    { id: 'REPORTS', label: 'Templates de Relatórios', icon: FileText }
  ] as const;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-8 text-left">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Repositório de Documentos</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-slate-500 font-medium text-sm">
            {hasProcess
              ? 'Envie arquivos adicionais ou visualize e baixe os modelos oficiais da UTFPR.'
              : 'Visualize e baixe os modelos oficiais. O envio será liberado quando seu processo for criado.'}
          </p>
          {data?.process?.student?.ra && hasProcess && (
            <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md font-bold">
              RA: {data.process.student.ra}
            </span>
          )}
        </div>
      </header>

      <div className="flex gap-4 border-b border-slate-100 pb-1 mb-8 text-left overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600 cursor-pointer'}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={14} />
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in slide-in-from-left-2" />
              )}
            </button>
          )
        })}
      </div>

      <div className="space-y-12">

        {activeTab === 'MANUAL' && hasProcess && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => setIsAddNameModalOpen(true)}
                className="relative bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all min-h-[140px] group"
              >
                <div className="p-3 bg-white text-slate-400 rounded-full shadow-sm group-hover:text-blue-600 mb-3 transition-colors">
                  <Plus size={24} />
                </div>
                <p className="text-sm font-bold text-slate-600 group-hover:text-blue-700">
                  Adicionar Documento
                </p>
              </div>

              {manualDocuments.map((doc) => {
                const displayTitle = doc.customName || doc.fileName || "Documento Manual";

                return (
                  <div
                    key={doc.id}
                    onClick={() => setModalContext({
                      mode: 'MANUAL_DOC',
                      templateId: 6,
                      documentId: doc.id,
                      customTitle: displayTitle
                    })}
                    className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-left min-h-[140px]"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-100 group-hover:bg-emerald-500 transition-colors" />
                    <div className="flex justify-between items-start w-full">
                      <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                        <FilePlus size={24} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3
                        className="text-slate-800 font-black text-[15px] uppercase tracking-tight group-hover:text-emerald-600 leading-tight line-clamp-2"
                        title={displayTitle}
                      >
                        {displayTitle}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'DOCUMENTS' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isPageLoading ? (
                [1, 2, 3].map(n => <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm min-h-[140px] animate-pulse" />)
              ) : (
                mappedDocuments.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setModalContext({ mode: 'MAPPED_DOC', templateId: template.id })}
                    className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-left min-h-[140px] w-full"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />
                    <div className="flex justify-between items-start w-full">
                      <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                        <Files size={24} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-slate-800 font-black text-[15px] uppercase tracking-tight group-hover:text-blue-600 leading-tight line-clamp-2">
                        {template.name}
                      </h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'REPORTS' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setModalContext({ mode: 'REPORT', templateId: template.id })}
                  className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-left min-h-[140px]"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />
                  <div className="flex justify-between items-start w-full">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <FileText size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-slate-800 font-black text-[15px] uppercase tracking-tight group-hover:text-blue-600 leading-tight line-clamp-2">
                      {template.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <AddDocumentModal
        isOpen={isAddNameModalOpen}
        onClose={() => setIsAddNameModalOpen(false)}
        onAdd={handleUploadManualDoc}
      />

      <StudentDocumentModal
        isOpen={!!modalContext}
        onClose={() => setModalContext(null)}
        context={modalContext}
        processId={numericProcessId}
        uploadedDoc={modalContext?.mode === 'MANUAL_DOC'
          ? uploadedDocuments.find(d => d.id === modalContext.documentId)
          : undefined}
        onUpdate={fetchStudentDocuments}
        userRole={user?.role}
      />
    </div>
  );
};
