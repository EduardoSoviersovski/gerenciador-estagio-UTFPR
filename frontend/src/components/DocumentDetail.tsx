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
    readOnly?: boolean;
    isReportTab?: boolean;
    hasActiveProcess?: boolean;
}

export const DocumentDetail = ({ doc, isOpen, onClose, readOnly = false, isReportTab = false, hasActiveProcess = false }: DocumentDetailProps) => {
    if (!doc) return null;

    const hasFile = doc.status !== 'not_sent';

    const showDownload = !doc.isManual && !!doc.templateUrl;

    const gridLayoutClass = (showDownload && !readOnly) ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

    const hideStatus = isReportTab || readOnly;

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
                    hideStatus={hideStatus}
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
                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex flex-col items-center text-center gap-3">
                            <AlertCircle className="text-amber-500" size={32} />
                            <div>
                                <p className="text-sm font-bold text-amber-900 uppercase">Upload Indisponível</p>
                                <p className="text-[11px] text-amber-700 mt-1 max-w-xs leading-relaxed">
                                    {isReportTab
                                        ? (hasActiveProcess
                                            ? "O envio de relatórios preenchidos deve ser feito na página de Relatórios."
                                            : "Um processo ativo é necessário para habilitar o envio de relatórios.")
                                        : "Vincule seu RA para habilitar o envio de documentos para análise."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {!readOnly && (
                    <div className="pt-2">
                        <ActivityChat />
                    </div>
                )}
            </div>
        </Modal>
    );
};