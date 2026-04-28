import React from 'react';
import { DocumentEntry } from '../types';
import { FileDownloadCard } from './ui/FileDownloadCard';
import { FileUploadZone } from './ui/FileUploadZone';
import { ActivityChat } from './ActivityChat';
import { Modal } from './ui/Modal';
import { DocumentHeaderDetails } from './DocumentHeaderDetails';
import { AlertCircle } from 'lucide-react';

interface DocumentDetailProps {
    doc: DocumentEntry | null;
    isOpen: boolean;
    onClose: () => void;
    readOnly?: boolean; // Prop para controle de acesso
}

export const DocumentDetail = ({ doc, isOpen, onClose, readOnly = false }: DocumentDetailProps) => {
    if (!doc) return null;

    const userRole = 'student';
    const hasFile = doc.status !== 'not_sent';

    // O download só aparece se não for manual e tiver URL, ou se for readOnly (para baixar modelos)
    const showDownload = !doc.isManual && !!doc.templateUrl;

    // Se estiver em readOnly, não mostramos o upload, então o grid vira 1 coluna
    const gridLayoutClass = (showDownload && !readOnly) ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="xl"
        >
            <div className="space-y-2">
                <DocumentHeaderDetails
                    title={doc.title}
                    isManual={doc.isManual}
                    status={doc.status}
                />

                <div className={`grid ${gridLayoutClass} gap-12 w-full items-start px-4 pb-8`}>

                    {showDownload && (
                        <div className="space-y-6 flex flex-col items-center text-center">
                            <h4 className="text-sm font-semibold text-gray-600">Documento Base</h4>
                            <FileDownloadCard
                                title="Modelo Oferecido pela UTFPR"
                                subtitle="Clique em qualquer lugar do card para baixar"
                                url={doc.templateUrl!}
                            />
                        </div>
                    )}

                    {/* LÓGICA DE BLOQUEIO DE UPLOAD */}
                    {!readOnly ? (
                        <div className="space-y-6 flex flex-col items-center text-center">
                            <h4 className="text-sm font-semibold text-gray-600">Documentação</h4>
                            <FileUploadZone
                                hasFile={hasFile}
                                fileName={doc.fileUrl?.split('/').pop() || "documento_enviado.pdf"}
                                onPreview={() => console.log("Abrindo Visualizador...")}
                                onFileSelect={(file) => console.log("Arquivo selecionado:", file.name)}
                            />
                        </div>
                    ) : (
                        // Aviso simples no lugar do upload para não quebrar o layout
                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex flex-col items-center text-center gap-3">
                            <AlertCircle className="text-amber-500" size={32} />
                            <div>
                                <p className="text-sm font-bold text-amber-900 uppercase">Upload Indisponível</p>
                                <p className="text-[11px] text-amber-700 mt-1 max-w-xs leading-relaxed">
                                    Vincule seu RA para habilitar o envio de documentos para análise.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Escondemos o Chat se for apenas leitura, pois não há processo para comentar */}
                {!readOnly && (
                    <div className="pt-2">
                        <ActivityChat
                            role={userRole}
                            messages={[]}
                            onSendMessage={(msg) => console.log(`Enviando feedback para doc ${doc.id}:`, msg)}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};