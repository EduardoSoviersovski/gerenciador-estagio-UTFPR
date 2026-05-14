import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { Tooltip } from '@mui/material';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    isModified?: boolean;
}

export const FormInput = ({ label, icon: Icon, isModified, value, ...props }: FormInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    const checkTruncation = () => {
        if (inputRef.current) {
            const hasOverflow = inputRef.current.scrollWidth > (inputRef.current.clientWidth + 5);
            setIsTruncated(hasOverflow);
        }
    };

    useEffect(() => {
        const timer = setTimeout(checkTruncation, 50);
        return () => clearTimeout(timer);
    }, [value]);

    const shouldShowTooltip = isTruncated && value && value.toString().length > 15;

    return (
        <div className={`space-y-1.5 text-left w-full transition-all duration-300 ${isModified ? 'scale-[1.01]' : ''}`}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {label} {isModified && <span className="text-blue-500 lowercase font-bold">(modificado)</span>}
            </label>

            <Tooltip
                title={shouldShowTooltip ? value : ""}
                disableFocusListener
                disableTouchListener
                arrow
                placement="top"
                enterTouchDelay={700}
            >
                <div className={`relative group transition-all border-2 rounded-xl ${isModified
                    ? 'border-blue-500 shadow-md shadow-blue-50'
                    : 'border-transparent'
                    }`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <Icon
                            size={16}
                            className={isModified ? 'text-blue-600' : 'text-slate-400'}
                        />
                    </div>

                    <input
                        {...props}
                        ref={inputRef}
                        value={value}
                        title=""
                        autoComplete="off"
                        onMouseEnter={checkTruncation}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300"
                    />
                </div>
            </Tooltip>
        </div>
    );
};