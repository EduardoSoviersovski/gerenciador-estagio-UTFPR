import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { TimelineStep } from '../types';

interface ReportTimelineProps {
    steps: TimelineStep[];
    onRemoveStep: (id: string) => void;
    onStepClick: (id: string) => void;
    activeStepId: string | null;
}

export const ReportTimeline = ({
    steps,
    onRemoveStep,
    onStepClick,
    activeStepId
}: ReportTimelineProps) => {

    const lastIndex = steps.reduce((acc, step, idx) =>
        (step.status === 'completed' || step.status === 'current') ? idx : acc, 0
    );

    const progressWidth = steps.length > 1
        ? (lastIndex / (steps.length - 1)) * 100
        : 0;

    return (
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="overflow-x-auto pb-14 pt-12 px-10 custom-scrollbar">
                <div
                    className="relative flex items-center min-h-[100px]"
                    style={{ width: `${(steps.length - 1) * 150}px`, minWidth: '100%' }}
                >
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressWidth}%` }}
                        className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 origin-left rounded-full"
                    />

                    <AnimatePresence>
                        {steps.map((step) => {
                            const isActive = step.id === activeStepId;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    onClick={() => onStepClick(step.id)}
                                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                                    style={{ width: '150px' }}
                                >
                                    {step.isManual && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita abrir o detalhe ao excluir
                                                onRemoveStep(step.id);
                                            }}
                                            className="absolute -top-10 p-1.5 bg-white border border-red-100 text-red-400 hover:text-red-600 hover:border-red-200 rounded-full shadow-sm transition-all z-20 opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}

                                    <div className={`w-5 h-5 rounded-full border-4 transition-all duration-300 z-10
                                        ${isActive
                                            ? 'bg-blue-600 border-blue-200 scale-125 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                                            : 'border-white'}
                                        ${!isActive && step.status === 'completed' ? 'bg-green-500' : ''}
                                        ${!isActive && step.status === 'current' ? 'bg-blue-500' : ''}
                                        ${!isActive && step.status === 'pending' ? 'bg-gray-300' : ''}
                                        ${!isActive && step.status === 'error' ? 'bg-red-500' : ''}
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
        </div>
    );
};