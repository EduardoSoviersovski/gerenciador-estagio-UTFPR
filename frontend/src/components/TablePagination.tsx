import React from 'react';
import { Pagination, Stack } from '@mui/material';

interface TablePaginationProps {
    count: number;
    page: number;
    onChange: (page: number) => void;
}

export const TablePagination = ({ count, page, onChange }: TablePaginationProps) => {
    return (
        <div className="flex justify-center py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl">
            <Stack spacing={2}>
                <Pagination
                    count={count}
                    page={page}
                    onChange={(_, value) => onChange(value)}
                    shape="rounded"
                    color="primary"
                    size="small"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            fontFamily: 'inherit',
                            fontWeight: 700,
                            fontSize: '11px',
                            color: '#64748b',
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#2563eb !important',
                            color: 'white !important',
                        }
                    }}
                />
            </Stack>
        </div>
    );
};