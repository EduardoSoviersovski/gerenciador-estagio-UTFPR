import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternshipData } from '../../hooks/useInternshipData';
import { DocumentCard } from '../../components/DocumentCard';
import { DocumentDetail } from '../../components/DocumentDetail';
import { AddDocumentModal } from '../../components/AddDocumentModal';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { DocumentEntry } from '../../types';
import { X, Info, FileText, Files } from 'lucide-react';
import { PATHS } from '../../routes/paths';

interface DocumentsProps {
  readOnly?: boolean;
}

type TabCategory = 'REPORTS' | 'DOCUMENTS';

interface MockDoc extends DocumentEntry {
  category: TabCategory;
}

export const Documents = ({ readOnly = false }: DocumentsProps) => {
  const { processId } = useParams<{ processId: string }>();
  const { user } = useAuth();

  const safeRole = user?.role?.toUpperCase() || '';
  const isAdmin = safeRole === 'ADMIN';
  const { data, loading: processLoading, error } = useInternshipData(processId);

  if (error === "UNAUTHORIZED") {
    return <Navigate to={PATHS.UNAUTHORIZED} replace />;
  }

  if (error === "NOT_FOUND" && !isAdmin) {
    return <Navigate to={PATHS.UNAUTHORIZED} replace />;
  }

  const hasNoProcess = !processId || error === "NOT_FOUND" || !data;
  const isReadOnly = readOnly || hasNoProcess;

  const [activeTab, setActiveTab] = useState<TabCategory>('DOCUMENTS');
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<MockDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<MockDoc | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<MockDoc | null>(null);

  const isPageLoading = isLoading || processLoading;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        setDocuments([
          {
            id: '1',
            title: 'Termo de Compromisso (TCE)',
            category: 'DOCUMENTS',
            status: 'approved',
            isManual: false,
            updatedAt: '12/03/2026',
            templateUrl: 'https://utfpr.edu.br/modelo-tce.pdf'
          },
          {
            id: '2',
            title: 'Plano de Atividades',
            category: 'DOCUMENTS',
            status: 'action_required',
            isManual: false,
            updatedAt: '15/03/2026',
            templateUrl: '#'
          },
          {
            id: '3',
            title: 'Ficha de Frequência Mensal',
            category: 'DOCUMENTS',
            status: 'not_sent',
            isManual: false,
            templateUrl: '#'
          },
          {
            id: '4',
            title: 'Relatório Parcial de Atividades',
            category: 'REPORTS',
            status: 'not_sent',
            isManual: false,
            updatedAt: '10/05/2026',
            templateUrl: 'https://utfpr.edu.br/modelo-relatorio-parcial.pdf'
          },
          {
            id: '5',
            title: 'Relatório Final de Atividades',
            category: 'REPORTS',
            status: 'not_sent',
            isManual: false,
            updatedAt: '02/01/2026',
            templateUrl: 'https://utfpr.edu.br/modelo-relatorio-final.pdf'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const currentCategoryDocs = documents.filter(d => d.category === activeTab);
  const fixedDocs = currentCategoryDocs.filter(d => !d.isManual);
  const manualDocs = currentCategoryDocs.filter(d => d.isManual);

  const handleAddDoc = (name: string) => {
    if (isReadOnly) return;
    const newDoc: MockDoc = {
      id: Math.random().toString(36).substr(2, 9),
      title: name,
      category: 'DOCUMENTS',
      status: 'not_sent',
      isManual: true,
      updatedAt: new Date().toLocaleDateString('pt-BR'),
    };
    setDocuments([...documents, newDoc]);
  };

  const handleDeleteConfirm = () => {
    if (isReadOnly) return;
    if (docToDelete) {
      setDocuments(documents.filter(d => d.id !== docToDelete.id));
      setDocToDelete(null);
    }
  };

  const SkeletonCard = () => (
    <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px] overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 animate-pulse" />
      <div className="flex items-start justify-between">
        <div className="space-y-4 w-full pl-2">
          <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
        <div className="w-3 h-3 bg-slate-200 rounded-full animate-pulse" />
        <div className="h-2 bg-slate-200 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Repositório de Documentos</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-500">
            {isReadOnly
              ? 'Visualize e baixe os modelos de documentos oficiais para o seu processo.'
              : 'Gestão centralizada de arquivos e templates oficiais da UTFPR.'}
          </p>
          {data?.process?.student?.ra && !isReadOnly && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold">
              RA: {data.process.student.ra}
            </span>
          )}
        </div>

        {isReadOnly && (
          <div className="mt-6 flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              <strong>Modo de Visualização:</strong> Como seu processo ainda não foi localizado, você tem acesso apenas ao download dos modelos oficiais. O envio de arquivos será liberado após o vínculo de um processo ao seu perfil.
            </p>
          </div>
        )}
      </header>

      <div className="flex gap-4 border-b border-slate-100 pb-1 mb-8">
        {(['DOCUMENTS', 'REPORTS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600 cursor-pointer'
              }`}
          >
            <div className="flex items-center gap-2">
              {tab === 'DOCUMENTS' ? <Files size={14} /> : <FileText size={14} />}
              {tab === 'DOCUMENTS' ? 'Documentos Diversos' : 'Templates de Relatórios'}
            </div>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in slide-in-from-left-2" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-12 min-h-[400px]">
        {activeTab === 'REPORTS' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-6">
              <p className="text-sm text-slate-500">
                Baixe os modelos oficiais em branco. O envio dos relatórios preenchidos deve ser feito na aba "Cronograma".
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isPageLoading ? (
                [1, 2, 3].map(n => <SkeletonCard key={n} />)
              ) : (
                fixedDocs.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    templateOnly={true}
                    hideDate={true}
                    onClick={() => setSelectedDoc(doc)}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'DOCUMENTS' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12">
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-3 italic">
                Modelos UTFPR <div className="h-px bg-gray-200 flex-1" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isPageLoading ? (
                  [1, 2, 3].map(n => <SkeletonCard key={n} />)
                ) : (
                  fixedDocs.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      templateOnly={isReadOnly}
                      hideDate={isReadOnly}
                      onClick={() => setSelectedDoc(doc)}
                    />
                  ))
                )}
              </div>
            </section>

            {!isReadOnly && (
              <section>
                <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-3 italic">
                  Documentos Adicionais <div className="h-px bg-gray-200 flex-1" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {!isPageLoading && <DocumentCard isAddCard onClick={() => setIsAddModalOpen(true)} />}

                  {isPageLoading ? (
                    [1].map(n => <SkeletonCard key={`manual-skel-${n}`} />)
                  ) : (
                    manualDocs.map(doc => (
                      <div key={doc.id} className="relative group animate-in zoom-in-95 duration-200">
                        <DocumentCard
                          doc={doc}
                          onClick={() => setSelectedDoc(doc)}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDocToDelete(doc);
                          }}
                          className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 hover:scale-110 p-1.5 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-all z-10"
                          title="Excluir documento"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {!isReadOnly && (
        <>
          <AddDocumentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddDoc}
          />

          <DeleteConfirmModal
            isOpen={!!docToDelete}
            onClose={() => setDocToDelete(null)}
            onConfirm={handleDeleteConfirm}
            docTitle={docToDelete?.title || ''}
          />
        </>
      )}

      <DocumentDetail
        doc={selectedDoc}
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        readOnly={isReadOnly || activeTab === 'REPORTS'}
        isReportTab={activeTab === 'REPORTS'}
        hasActiveProcess={!hasNoProcess}
      />
    </div>
  );
};