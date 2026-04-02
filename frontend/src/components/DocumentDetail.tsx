import React from 'react';
import { Info, FileText, Download } from 'lucide-react';
import { DocumentEntry } from '../types';
import { FileDownloadCard } from './ui/FileDownloadCard';
import { FileUploadZone } from './ui/FileUploadZone';
import { ActivityChat } from './ActivityChat';
import { Modal } from './ui/Modal';

interface DocumentDetailProps {
    doc: DocumentEntry | null;
    isOpen: boolean;
    onClose: () => void;
}

export const DocumentDetail = ({ doc, isOpen, onClose }: DocumentDetailProps) => {
    if (!doc) return null;

    const userRole = 'student'; // Simulação de role, pode ser ajustada para receber do pai ou contexto
    const hasFile = doc.status !== 'not_sent';

    const showDownload = !doc.isManual && !!doc.templateUrl;

    // Layout dinâmico: 2 colunas se houver download, 1 coluna (total) se for apenas upload
    const gridLayoutClass = showDownload ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={doc.isManual ? "Gerenciar Documento Adicional" : "Documento Oficial do Sistema"}
            size="xl"
        >
            <div className="space-y-8">
                {/* Cabeçalho de Identificação do Documento */}
                <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${doc.isManual ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        <FileText size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight leading-tight">
                            {doc.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${doc.isManual ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                                }`}>
                                {doc.isManual ? 'Manual' : 'Sistema'}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                Status: <span className="text-gray-700 font-bold uppercase">{doc.status.replace('_', ' ')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Banner de Alerta para Modificações (Status: action_required) */}
                {doc.status === 'action_required' && (
                    <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex gap-4 items-start border-l-4 border-l-red-500">
                        <Info className="text-red-500 shrink-0" size={24} />
                        <div>
                            <p className="text-sm font-black text-red-800 uppercase tracking-tight">Ajustes Solicitados</p>
                            <p className="text-xs text-red-600 mt-1 leading-relaxed font-medium">
                                Sua última entrega foi revisada e precisa de correções. Verifique os feedbacks no histórico abaixo e reenvie o arquivo atualizado.
                            </p>
                        </div>
                    </div>
                )}

                {/* Seção de Arquivos (Download do Template e Upload da Entrega) */}
                <div className={`grid ${gridLayoutClass} gap-8 w-full items-start`}>

                    {/* Lógica de Download Restaurada */}
                    {showDownload && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-[10px] font-black">
                                <Download size={12} />
                                <h4>Modelo para Preenchimento</h4>
                            </div>
                            <FileDownloadCard
                                title="Template Oficial UTFPR"
                                subtitle="Baixe este modelo para garantir os padrões da coordenação"
                                url={doc.templateUrl!} // Forçamos que a URL existe devido ao check do showDownload
                            />
                        </div>
                    )}

                    {/* Área de Upload/Substituição */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sua Versão do Documento</h4>
                        <FileUploadZone
                            hasFile={hasFile}
                            fileName={doc.fileUrl?.split('/').pop() || "documento_anexo.pdf"}
                            onPreview={() => console.log("Abrindo visualização...")}
                            onFileSelect={(file) => console.log("Substituindo por:", file.name)}
                        />
                    </div>
                </div>

                {/* Histórico de Comentários e Feedback do Orientador */}
                <div className="pt-6 border-t border-gray-50">
                    <ActivityChat
                        role={userRole}
                        messages={[]}
                        onSendMessage={(msg) => console.log("Novo comentário no documento:", msg)}
                    />
                </div>
            </div>
        </Modal>
    );
};