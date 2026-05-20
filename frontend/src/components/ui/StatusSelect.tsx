import * as React from 'react';
import { MenuItem, SelectChangeEvent, Box } from '@mui/material';
import { InternshipStatus, STATUS_MAP } from '../../types';
import { FormSelect } from './FormSelect';

interface StatusSelectProps {
    value: InternshipStatus;
    onChange: (status: InternshipStatus) => void;
    isModified?: boolean;
    disabled?: boolean;
}

export const StatusSelect = ({ value, onChange, isModified, disabled }: StatusSelectProps) => {

    return (
        <Box sx={{ minWidth: 280, width: { xs: '100%', md: 'auto' } }}>
            <FormSelect
                label="Status do Processo"
                name="status"
                value={value || ''}
                onChange={(e: SelectChangeEvent) => onChange(e.target.value as InternshipStatus)}
                isModified={isModified}
                disabled={disabled}
                renderValue={(selected: any) => STATUS_MAP[selected as InternshipStatus] || selected}
                sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#334155',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                }}
                MenuProps={{
                    disableScrollLock: true,
                    PaperProps: {
                        sx: {
                            maxHeight: 250,
                            borderRadius: '12px',
                            marginTop: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #e2e8f0',
                            '& .MuiMenuItem-root': {
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#334155',
                                padding: '10px 16px',
                                '&:hover': {
                                    backgroundColor: '#f1f5f9',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: '#eff6ff',
                                    color: '#2563eb',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#dbeafe',
                                    }
                                }
                            }
                        }
                    }
                }}
            >
                {Object.entries(STATUS_MAP).map(([backendValue, displayLabel]) => (
                    <MenuItem
                        key={backendValue}
                        value={backendValue}
                    >
                        {displayLabel}
                    </MenuItem>
                ))}
            </FormSelect>
        </Box>
    );
};