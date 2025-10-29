import React from 'react';
import { PencilIcon } from '../icons/PencilIcon';

interface StatCardProps {
    title: string;
    value: string;
    color: 'yellow' | 'blue' | 'green';
    onEdit?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, onEdit }) => {
    const colorClasses = {
        yellow: 'bg-yellow-500/80',
        blue: 'bg-cyan-500/90',
        green: 'bg-green-500/80',
    };

    return (
        <div className={`${colorClasses[color]} p-4 rounded-xl shadow-lg text-white flex flex-col justify-between`}>
            <div className="flex justify-between items-start">
                <span className="font-semibold">{title}</span>
                {onEdit && (
                    <button onClick={onEdit} className="text-white/70 hover:text-white">
                        <PencilIcon />
                    </button>
                )}
            </div>
            <p className="text-4xl font-black mt-2 text-right">{value}</p>
        </div>
    );
};

export default StatCard;