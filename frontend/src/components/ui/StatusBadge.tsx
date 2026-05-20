import React from 'react';
import { InternshipStatus, STATUS_MAP } from '../../types';

const styles: Record<InternshipStatus, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    DELAYED: 'bg-red-100 text-red-700 border-red-200',
    FINISHED: 'bg-pink-100 text-pink-700 border-pink-200',
    CANCELLED: 'bg-slate-100 text-slate-700 border-slate-200'
};

interface StatusBadgeProps {
    status: InternshipStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const displayStatus = STATUS_MAP[status] || status;
    const style = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${style}`}>
            {displayStatus}
        </span>
    );
};