import React, { useState } from 'react';
import { Menu, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import { FileText } from 'lucide-react';
import { FileDownloadCard } from './ui/FileDownloadCard';
import { DocumentService } from '../services/documentService';

interface ActivityFileDownloadProps {
    documentTypeId: number;
    templateName?: string;
}

export const ActivityFileDownload = ({ documentTypeId, templateName }: ActivityFileDownloadProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    const handleDownloadClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = async (format?: 'pdf' | 'docx') => {
        setAnchorEl(null);
        if (format) {
            await performDownload(format);
        }
    };

    const performDownload = async (format: 'pdf' | 'docx') => {
        setIsLoading(true);
        try {
            const blob = await DocumentService.downloadTemplate(documentTypeId, format);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const safeName = templateName ? templateName.replace(/\s+/g, '_') : 'Template';
            link.download = `Template_${safeName}.${format}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar template:", error);
            setNotification({
                open: true,
                message: `Erro ao baixar o modelo em ${format.toUpperCase()}. O arquivo pode não estar cadastrado.`,
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full">
            <FileDownloadCard
                title="Modelo Oferecido pela UTFPR"
                subtitle={isLoading ? "Baixando..." : "Clique para baixar"}
                onClick={isLoading ? undefined : handleDownloadClick}
            />

            {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CircularProgress size={20} />
                </div>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleMenuClose()}
                disableScrollLock={true}
            >
                <MenuItem onClick={() => handleMenuClose('pdf')} sx={{ gap: 1.5, fontSize: '13px' }}>
                    <FileText size={16} className="text-red-500" /> Baixar em PDF
                </MenuItem>
                <MenuItem onClick={() => handleMenuClose('docx')} sx={{ gap: 1.5, fontSize: '13px' }}>
                    <FileText size={16} className="text-blue-600" /> Baixar em DOCX (Word)
                </MenuItem>
            </Menu>

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
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
};