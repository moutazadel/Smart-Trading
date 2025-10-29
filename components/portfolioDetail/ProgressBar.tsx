import React from 'react';

interface ProgressBarProps {
    current: number;
    start: number;
    goal: number;
    nextGoalAvailable: boolean;
    formatCurrency: (amount: number) => string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, start, goal, nextGoalAvailable, formatCurrency }) => {
    const range = goal - start;
    const progress = current - start;
    const percentage = range > 0 ? Math.max(0, Math.min(100, (progress / range) * 100)) : (current >= start ? 100 : 0);

    const remaining = Math.max(0, goal - current);

    return (
        <div className="bg-gray-800/50 p-4 rounded-xl shadow-lg my-4">
            <div className="flex justify-between items-center mb-2 text-sm font-semibold">
                <span className="text-green-400">{nextGoalAvailable ? `متبقي: ${formatCurrency(remaining)}` : 'تم تحقيق الهدف!'}</span>
                <span className="text-gray-300">التقدم نحو الهدف</span>
                <span className="text-gray-400">{formatCurrency(goal)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-cyan-500 to-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-xs font-bold text-white shadow-sm">
                        {/* FIX: Cast options to `any` to allow `numberingSystem` which is a valid but sometimes untyped property. */}
                        {percentage.toLocaleString('ar-EG', {
                            maximumFractionDigits: 0,
                            numberingSystem: 'arab'
                        } as any)}%
                     </span>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
