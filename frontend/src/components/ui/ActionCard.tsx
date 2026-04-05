import React from 'react';

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    colorClass: string;
}

export const ActionCard = ({ title, description, icon, onClick, colorClass }: ActionCardProps) => {
    return (
        <button
            onClick={onClick}
            className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all text-left flex flex-col gap-4 w-full"
        >
            <div className={`p-3 rounded-xl w-fit text-white shadow-sm ${colorClass} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {description}
                </p>
            </div>
        </button>
    );
};