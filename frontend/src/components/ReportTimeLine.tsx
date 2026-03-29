import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { TimelineStep } from '../types';

interface ReportTimelineProps {
    steps: TimelineStep[];
    onRemoveStep: (id: string) => void;
}

export const ReportTimeline = ({ steps, onRemoveStep }: ReportTimelineProps) => {
    const lastIndex = steps.reduce((acc, step, idx) =>
        (step.status === 'completed' || step.status === 'current') ? idx : acc, 0
    );

    const progressWidth = steps.length > 1 
        ? (lastIndex / (steps.length - 1)) * 100 
        : 0;

    return (
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="overflow-x-auto pb-12 pt-12 px-6 custom-scrollbar">
                <div
                    className="relative flex items-center min-h-[100px]"
                    style={{ width: `${(steps.length - 1) * 150}px`, minWidth: '100%' }}
                >
                    {/* Linha de fundo */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0" />
                    
                    {/* Linha de progresso */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressWidth}%` }}
                        className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 origin-left"
                    />

                    <AnimatePresence>
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="relative z-10 flex flex-col items-center"
                                style={{ width: '150px' }}
                            >
                                {step.isManual && (
                                    <button
                                        onClick={() => onRemoveStep(step.id)}
                                        className="absolute -top-10 p-1.5 bg-white border border-red-100 text-red-400 hover:text-red-600 hover:border-red-200 rounded-full shadow-sm transition-all z-20"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                
                                <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm z-10
                                    ${step.status === 'completed' ? 'bg-green-500' :
                                    step.status === 'current' ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-300'}`}
                                />
                                
                                <div className="absolute top-8 w-32 text-center">
                                    <p className="text-[10px] font-bold text-gray-700 uppercase">
                                        {step.title}
                                    </p>
                                    <p className="text-[9px] text-gray-400 mt-1">{step.date}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};