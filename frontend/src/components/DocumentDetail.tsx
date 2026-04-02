import React from 'react';
import { DocumentEntry } from '../types';
import { FileDownloadCard } from './ui/FileDownloadCard';
import { FileUploadZone } from './ui/FileUploadZone';
import { ActivityChat } from './ActivityChat';
import { Modal } from './ui/Modal';
import { DocumentHeaderDetails } from './DocumentHeaderDetails';

interface DocumentDetailProps {
    doc: DocumentEntry | null;
    isOpen: boolean;
    onClose: () => void;
}

export const DocumentDetail = ({ doc, isOpen, onClose }: DocumentDetailProps) => {
    if (!doc) return null;

    const userRole = 'student';
    const hasFile = doc.status !== 'not_sent';
    const showDownload = !doc.isManual && !!doc.templateUrl;
    const gridLayoutClass = showDownload ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

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

                    <div className="space-y-6 flex flex-col items-center text-center">
                        <h4 className="text-sm font-semibold text-gray-600">Documentação</h4>
                        <FileUploadZone
                            hasFile={hasFile}
                            fileName={doc.fileUrl?.split('/').pop() || "documento_enviado.pdf"}
                            onPreview={() => console.log("Abrindo Visualizador...")}
                            onFileSelect={(file) => console.log("Arquivo selecionado:", file.name)}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <ActivityChat
                        role={userRole}
                        messages={[]}
                        onSendMessage={(msg) => console.log(`Enviando feedback para doc ${doc.id}:`, msg)}
                    />
                </div>
            </div>
        </Modal>
    );
};