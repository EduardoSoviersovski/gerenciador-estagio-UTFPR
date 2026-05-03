import React from 'react';
import { InternshipStatus } from '../../types';

interface StatusBadgeProps {
    status: InternshipStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const styles: Record<InternshipStatus, string> = {
        'Em dia': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Pendente': 'bg-amber-100 text-amber-700 border-amber-200',
        'Em atraso': 'bg-red-100 text-red-700 border-red-200',
        'Finalizado': 'bg-pink-100 text-pink-700 border-pink-200'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${styles[status]}`}>
            {status}
        </span>
    );
};