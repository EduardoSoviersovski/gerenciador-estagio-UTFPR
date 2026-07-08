import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FileUploadZone } from './ui/FileUploadZone';
import { DocumentService } from '../services/documentService';
import { useAuth } from '../contexts/AuthContext';
import { ActivityType } from '../types';

interface ActivityFileUploadProps {
  hasFile: boolean;
  isUnmaped: boolean;
  activityType?: ActivityType;
  processId: number;
  documentTypeId: number;
  documentId?: number;
  fileName?: string;
  onUpdate?: () => void;
}

export const ActivityFileUpload = ({
  hasFile,
  isUnmaped,
  processId,
  documentTypeId,
  documentId,
  fileName,
  onUpdate
}: ActivityFileUploadProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const canManageFile = () => {
    const safeRole = user?.role?.toUpperCase();
    if (safeRole === 'STUDENT') return true;
    if (safeRole === 'ADVISOR' && documentTypeId !== undefined) return true;
    return false;
  };

  const handleFileAction = async (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setNotification({
        open: true,
        message: "Formato inválido. Por favor, envie apenas arquivos em formato PDF.",
        severity: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      await DocumentService.uploadDocument(processId, documentTypeId, file, documentId);
      onUpdate?.();
      setNotification({
        open: true,
        message: "Arquivo enviado com sucesso!",
        severity: 'success'
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      setNotification({
        open: true,
        message: "Erro ao enviar arquivo. Tente novamente.",
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'jpg') => {
    if (!documentId) return;
    try {
      const blob = await DocumentService.downloadDocument(processId, documentId, format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'jpg' ? '.jpg' : '.pdf';
      link.download = fileName?.replace(/\.[^/.]+$/, "") + extension || `documento${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setNotification({
        open: true,
        message: `Erro ao baixar o arquivo em ${format.toUpperCase()}.`,
        severity: 'error'
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col flex-1">
      <FileUploadZone
        hasFile={hasFile}
        fileName={fileName}
        isLoading={isLoading}
        onFileSelect={handleFileAction}
        onDownload={handleDownload}
        allowUpload={canManageFile()}
        className="h-full flex-1"
        isUnmaped={isUnmaped}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};