import * as React from 'react';
import { MenuItem, SelectChangeEvent, Box } from '@mui/material';
import { FormSelect } from './FormSelect';
import { FileText } from 'lucide-react';
import { StatusConfirmModal } from '../modals/StatusConfirmModal';
import { DOC_STATUS_MAP } from '../../constants/documentStatus';

interface StatusDocumentSelectProps {
    value: number;
    onChange: (statusId: number) => void;
    disabled?: boolean;
}

export const StatusDocumentSelect = ({ value, onChange, disabled }: StatusDocumentSelectProps) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [pendingStatus, setPendingStatus] = React.useState<number | null>(null);

    const handleBeforeChange = (e: SelectChangeEvent) => {
        const newValue = Number(e.target.value);
        setPendingStatus(newValue);
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        if (pendingStatus !== null && typeof onChange === 'function') {
            onChange(pendingStatus);
            setIsModalOpen(false);
            setPendingStatus(null);
        }
    };

    const containerWidth = 240;

    return (
        <Box sx={{ minWidth: containerWidth, flexShrink: 0 }}>
            <FormSelect
                label="Status"
                name="status"
                value={value || 1}
                icon={FileText}
                onChange={handleBeforeChange}
                disabled={disabled}
                isEdit={true}
                renderValue={(selected: any) => DOC_STATUS_MAP[selected as number] || "Pendente"}
                sx={{ height: '40px', fontSize: '13px' }}
                MenuProps={{
                    disableScrollLock: true,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                    },
                    PaperProps: {
                        sx: {
                            maxHeight: 200,
                            borderRadius: '12px',
                            width: 190,
                            overflowX: 'hidden',
                            boxSizing: 'border-box'
                        }
                    }
                }}
            >
                {Object.entries(DOC_STATUS_MAP).map(([id, label]) => (
                    <MenuItem key={id} value={Number(id)}>{label}</MenuItem>
                ))}
            </FormSelect>

            {pendingStatus !== null && (
                <StatusConfirmModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setPendingStatus(null); }}
                    onConfirm={handleConfirm}
                    statusName={DOC_STATUS_MAP[pendingStatus]}
                />
            )}
        </Box>
    );
};