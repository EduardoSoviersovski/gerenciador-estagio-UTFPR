import React from 'react';
import { InternshipStatus, STATUS_MAP } from '../../types';

const styles: Record<InternshipStatus, string> = {
    PENDING_DOCS: 'bg-amber-100 text-amber-700 border-amber-200',
    PENDING_DIEEM: 'bg-purple-100 text-purple-700 border-purple-200',
    PENDING_CORRECTIONS: 'bg-red-100 text-red-700 border-red-200',
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
    PENDING_ADVISOR: 'bg-orange-100 text-orange-700 border-orange-200'
};

interface StatusBadgeProps {
    status: InternshipStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const displayStatus = STATUS_MAP[status] || status;
    const style = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap border ${style}`}>
            {displayStatus}
        </span>
    );
};