import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // IMPORTANTE
import { DocumentCard } from '../../components/DocumentCard';
import { DocumentDetail } from '../../components/DocumentDetail';
import { AddDocumentModal } from '../../components/AddDocumentModal';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { DocumentEntry } from '../../types';
import { X, Info } from 'lucide-react';

interface DocumentsProps {
  readOnly?: boolean;
}

export const Documents = ({ readOnly = false }: DocumentsProps) => {
  // Captura o RA da URL caso exista (ex: /student/1561464/documents)
  const { ra } = useParams<{ ra: string }>();

  const [documents, setDocuments] = useState<DocumentEntry[]>([
    {
      id: '1',
      title: 'Termo de Compromisso (TCE)',
      status: 'approved',
      isManual: false,
      updatedAt: '12/03/2026',
      templateUrl: 'https://utfpr.edu.br/modelo-tce.pdf'
    },
    {
      id: '2',
      title: 'Plano de Atividades',
      status: 'action_required',
      isManual: false,
      updatedAt: '15/03/2026',
      templateUrl: '#'
    },
    {
      id: '3',
      title: 'Ficha de Frequência Mensal',
      status: 'not_sent',
      isManual: false,
      templateUrl: '#'
    },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<DocumentEntry | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocumentEntry | null>(null);

  const fixedDocs = documents.filter(d => !d.isManual);
  const manualDocs = documents.filter(d => d.isManual);

  const handleAddDoc = (name: string) => {
    if (readOnly) return;
    const newDoc: DocumentEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title: name,
      status: 'not_sent',
      isManual: true,
      updatedAt: new Date().toLocaleDateString('pt-BR'),
    };
    setDocuments([...documents, newDoc]);
  };

  const handleDeleteConfirm = () => {
    if (readOnly) return;
    if (docToDelete) {
      setDocuments(documents.filter(d => d.id !== docToDelete.id));
      setDocToDelete(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Repositório de Documentos</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-500">
            {readOnly
              ? 'Visualize e baixe os modelos de documentos oficiais para o seu processo.'
              : 'Gestão centralizada de arquivos da UTFPR e documentos manuais.'}
          </p>
          {/* Exibe o RA na header se estiver em modo de edição para conferência */}
          {ra && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold">RA: {ra}</span>}
        </div>

        {readOnly && (
          <div className="mt-6 flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              <strong>Modo de Visualização:</strong> Como seu processo ainda não foi localizado, você tem acesso apenas ao download dos modelos oficiais. O envio de arquivos será liberado após o vínculo do seu RA.
            </p>
          </div>
        )}
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-3 italic">
            Modelos UTFPR <div className="h-px bg-gray-100 flex-1" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fixedDocs.map(doc => (
              <DocumentCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc)} />
            ))}
          </div>
        </section>

        {!readOnly && (
          <section className="animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-3 italic">
              Documentos Manuais <div className="h-px bg-gray-100 flex-1" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {manualDocs.map(doc => (
                <div key={doc.id} className="relative group">
                  <DocumentCard doc={doc} onClick={() => setSelectedDoc(doc)} />
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
              ))}

              <DocumentCard isAddCard onClick={() => setIsAddModalOpen(true)} />
            </div>
          </section>
        )}
      </div>

      {!readOnly && (
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
        readOnly={readOnly}
      />
    </div>
  );
};