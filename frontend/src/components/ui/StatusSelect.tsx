import * as React from 'react';
import { FormControl, Select, MenuItem, InputLabel, SelectChangeEvent, Box } from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { InternshipStatus } from '../../types';

interface StatusSelectProps {
    value: InternshipStatus;
    onChange: (status: InternshipStatus) => void;
    isModified?: boolean;
    disabled?: boolean;
}

export const StatusSelect = ({ value, onChange, isModified, disabled }: StatusSelectProps) => {
    return (
        <Box sx={{ minWidth: 200 }}>
            <FormControl
                fullWidth
                size="small"
                disabled={disabled}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: disabled ? '#f1f5f9' : '#f8fafc',
                        transition: 'all 0.3s ease',
                        border: isModified ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        '& fieldset': { border: 'none' },
                        '&:hover': { backgroundColor: disabled ? '#f1f5f9' : '#f1f5f9' },
                        '&.Mui-focused': { border: '2px solid #3b82f6' }
                    },
                    '& .Mui-disabled': {
                        cursor: 'not-allowed',
                        color: '#94a3b8 !important',
                        WebkitTextFillColor: '#94a3b8 !important'
                    }
                }}
            >
                <InputLabel
                    id="status-select-label"
                    shrink
                    sx={{
                        fontSize: '10px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#94a3b8',
                        '&.Mui-focused': { color: '#94a3b8' },
                        transform: 'translate(4px, -18px) scale(1)',
                        '&.MuiInputLabel-shrink': {
                            transform: 'translate(4px, -18px) scale(1)',
                        }
                    }}
                >
                    Status do Processo {isModified && (
                        <span style={{
                            color: '#3b82f6',
                            textTransform: 'lowercase',
                            fontWeight: 'bold',
                            marginLeft: '4px'
                        }}>
                            (modificado)
                        </span>
                    )}
                </InputLabel>

                <Select
                    labelId="status-select-label"
                    value={value}
                    onChange={(e: SelectChangeEvent) => onChange(e.target.value as InternshipStatus)}
                    MenuProps={{ disableScrollLock: true }}
                    startAdornment={
                        <CheckCircle
                            size={16}
                            style={{
                                marginRight: '12px',
                                color: disabled ? '#cbd5e1' : (isModified ? '#3b82f6' : '#94a3b8')
                            }}
                        />
                    }
                    sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        marginTop: '8px'
                    }}
                >
                    <MenuItem value="Em dia" sx={{ fontSize: '13px', fontWeight: 600 }}>Em dia</MenuItem>
                    <MenuItem value="Pendente" sx={{ fontSize: '13px', fontWeight: 600 }}>Pendente</MenuItem>
                    <MenuItem value="Em atraso" sx={{ fontSize: '13px', fontWeight: 600 }}>Em atraso</MenuItem>
                    <MenuItem value="Finalizado" sx={{ fontSize: '13px', fontWeight: 600 }}>Finalizado</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};