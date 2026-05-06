import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { SmartTooltipCell } from './SmartTooltipCell';

interface InfoFieldProps {
    label: string;
    // Alterado para ReactNode para aceitar o SmartTooltipCell
    value: React.ReactNode;
    icon: LucideIcon;
    iconColor?: string;
    badge?: boolean;
}

export const InfoField = ({
    label,
    value,
    icon: Icon,
    iconColor = "text-blue-500",
    badge = false
}: InfoFieldProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    const checkTruncation = () => {
        if (containerRef.current) {
            const span = containerRef.current.querySelector('.truncate-target');
            if (span) {
                setIsTruncated(span.scrollWidth > span.clientWidth);
            }
        }
    };

    useEffect(() => {
        checkTruncation();
        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [value]);

    return (
        <div className="flex flex-col items-start justify-start w-full gap-1.5 group">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {label}
            </span>
            <div
                ref={containerRef}
                className={`flex items-center justify-start gap-2 w-full transition-transform duration-200 ${isTruncated ? 'hover:scale-[1.02]' : ''
                    }`}
            >
                <Icon size={16} className={`${iconColor} shrink-0`} />

                {badge ? (
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">
                        {value}
                    </span>
                ) : (
                    <div className={`text-sm font-semibold text-slate-700 w-full truncate-target ${isTruncated ? 'cursor-help' : 'cursor-default'
                        }`}>
                        {value}
                    </div>
                )}
            </div>
        </div>
    );
};