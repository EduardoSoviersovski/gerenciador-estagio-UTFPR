import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from '@mui/material';

interface SmartTooltipCellProps {
    children: React.ReactNode;
}

export const SmartTooltipCell = ({ children }: SmartTooltipCellProps) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

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
    }, [children]);

    return (
        <Tooltip
            title={children}
            disableHoverListener={!isTruncated}
            arrow
            placement="top"
            slotProps={{
                tooltip: {
                    sx: {
                        backgroundColor: '#1e293b',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '8px 12px',
                        borderRadius: '8px',
                    }
                },
                arrow: { sx: { color: '#1e293b' } }
            }}
        >
            <div
                ref={textRef}
                className="truncate w-full"
                onMouseEnter={checkTruncation}
            >
                {children}
            </div>
        </Tooltip>
    );
};