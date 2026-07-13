import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineStep } from '../types';

interface ReportTimelineProps {
    steps: TimelineStep[];
    onStepClick: (id: string) => void;
    activeStepId: string | null;
}

const STATUS_CONFIG: Record<string, { color: string, label: string }> = {
    'PENDING': { color: 'bg-gray-300', label: 'Pendente' },
    'REQUEST_CHANGES': { color: 'bg-amber-500', label: 'Solicitar Alterações' },
    'APPROVED': { color: 'bg-green-500', label: 'Aprovado' },
    'REJECTED': { color: 'bg-red-500', label: 'Rejeitado' },
    'ERROR': { color: 'bg-red-600', label: 'Erro' }
};

export const ReportTimeline = ({
    steps,
    onStepClick,
    activeStepId
}: ReportTimelineProps) => {


    const lastIndex = steps.reduce((acc, step, idx) =>
        ['APPROVED', 'REJECTED', 'REQUEST_CHANGES'].includes(step.status) ? idx : acc, 0
    );

    const progressWidth = steps.length > 1
        ? (lastIndex / (steps.length - 1)) * 100
        : 0;

    return (
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <div className="relative flex justify-between items-center w-full min-h-[80px]">

                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressWidth}%` }}
                    className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 origin-left rounded-full transition-all duration-500"
                />

                <AnimatePresence>
                    {steps.map((step) => {
                        const isActive = step.id === activeStepId;
                        const config = STATUS_CONFIG[step.status] || STATUS_CONFIG['PENDING'];
                        const isSkeleton = step.isSkeleton;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                onClick={() => onStepClick(step.id)}
                                className={`relative z-10 flex flex-col items-center cursor-pointer group flex-1 
                    ${isSkeleton ? 'opacity-60' : 'opacity-100'} 
                `}
                            >
                                <div className={`w-5 h-5 rounded-full border-4 transition-all duration-300 z-10
                    ${isActive
                                        ? 'bg-blue-600 border-blue-200 scale-125 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                                        : isSkeleton
                                            ? 'bg-white border-gray-300'
                                            : `border-white ${config.color}`
                                    }
                `} />

                                <div className="absolute top-8 w-32 text-center pointer-events-none">
                                    <p className={`text-[10px] font-bold uppercase transition-colors duration-300
                        ${isActive ? 'text-blue-600 scale-110' : 'text-gray-700'}`}>
                                        {step.title}
                                    </p>
                                    <p className="text-[9px] text-gray-400 mt-0.5">{step.date}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};