import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoFieldProps {
    label: string;
    value: string;
    icon: LucideIcon;
    iconColor?: string;
    badge?: boolean;
}

export const InfoField = ({ label, value, icon: Icon, iconColor = "text-blue-500", badge = false }: InfoFieldProps) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    const checkTruncation = () => {
        if (textRef.current) {
            const { scrollWidth, clientWidth } = textRef.current;
            setIsTruncated(scrollWidth > clientWidth);
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
                className={`flex items-center justify-start gap-2 w-full transition-transform duration-200 ${isTruncated ? 'hover:scale-[1.02]' : ''}`}
                title={isTruncated ? value : ""}
            >
                <Icon size={16} className={`${iconColor} shrink-0`} />
                {badge ? (
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">
                        {value}
                    </span>
                ) : (
                    <span
                        ref={textRef}
                        className={`text-sm font-semibold text-slate-700 truncate transition-all duration-300 ${isTruncated ? 'cursor-help hover:text-blue-600' : 'cursor-default'
                            }`}
                    >
                        {value}
                    </span>
                )}
            </div>
        </div>
    );
};