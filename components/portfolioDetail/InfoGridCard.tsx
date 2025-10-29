import React from 'react';

interface InfoGridCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    isProfit?: boolean;
    isTextSmall?: boolean;
}

const InfoGridCard: React.FC<InfoGridCardProps> = ({ title, value, icon, isProfit, isTextSmall = false }) => {
    const valueColor = isProfit === true ? 'text-green-400' : isProfit === false ? 'text-red-400' : 'text-white';

    return (
        <div className="bg-gray-800/50 p-4 rounded-xl shadow-lg flex items-center gap-4 overflow-hidden">
            <div className="text-cyan-400 flex-shrink-0">
                {icon}
            </div>
            <div className="flex-grow min-w-0">
                <p className="text-sm text-gray-400 truncate" title={title}>{title}</p>
                <p className={`font-bold tracking-wider ${isTextSmall ? 'text-lg' : 'text-2xl'} ${valueColor} whitespace-nowrap`}>{value}</p>
            </div>
        </div>
    );
};

export default InfoGridCard;