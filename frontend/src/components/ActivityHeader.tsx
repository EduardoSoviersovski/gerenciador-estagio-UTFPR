import React from 'react';
import { TimelineStep } from '../types';
import { Calendar } from 'lucide-react';

export const ActivityHeader = ({ step }: { step: TimelineStep }) => {
    return (
        <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${step.isManual ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {step.isManual ? 'Manual' : 'Sistema'}
                    </span>
                </div>

                <div className="flex gap-4 mt-2">
                    {step.startDate && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>Início: {step.startDate}</span>
                        </div>
                    )}
                    {step.dueDate && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Calendar size={14} className="text-orange-400" />
                            <span>Prazo: {step.dueDate}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};