import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoFieldProps {
    label: string;
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
            const target = containerRef.current.querySelector('.truncate-target');
            if (target) {
                setIsTruncated(target.scrollWidth > target.clientWidth);
            }
        }
    };

    useEffect(() => {
        checkTruncation();
        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [value]);

    return (
        <div className="flex flex-col items-start justify-start w-full gap-1.5 group min-w-0 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {label}
            </span>

            <div
                ref={containerRef}
                className={`flex items-center justify-start w-full transition-transform duration-200 ${isTruncated ? 'hover:scale-[1.02]' : ''
                    }`}
            >
                <div className="flex shrink-0 items-center justify-start w-6">
                    <Icon size={16} className={`${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0 flex items-center">
                    {badge ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">
                            {value}
                        </span>
                    ) : (
                        <div
                            className={`text-sm font-semibold text-slate-700 truncate-target truncate w-full flex items-center ${isTruncated ? 'cursor-help' : 'cursor-default'
                                }`}
                        >
                            {value}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};