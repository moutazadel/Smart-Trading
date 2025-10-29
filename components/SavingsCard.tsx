import React from 'react';
import { PiggyBankIcon } from './icons/PiggyBankIcon';

interface SavingsCardProps {
    balance: number;
    currency: string;
    onWithdraw: () => void;
}

const SavingsCard: React.FC<SavingsCardProps> = ({ balance, currency, onWithdraw }) => {
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ar-EG', { style: 'currency', currency, minimumFractionDigits: 2, numberingSystem: 'arab' } as any);
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-2xl shadow-lg flex justify-between items-center gap-4">
            {/* Right side group (first in DOM for RTL) */}
            <div className="flex items-center gap-4 text-right">
                {/* Icon first in DOM to be on the right in RTL */}
                <div className="bg-pink-500/20 p-3 rounded-full">
                    <PiggyBankIcon className="w-8 h-8 text-pink-400" />
                </div>
                 <div>
                    <h3 className="text-md font-semibold text-pink-400">رصيد المدخرات</h3>
                    <p className="text-2xl font-bold text-white tracking-wider">{formatCurrency(balance)}</p>
                </div>
            </div>
            
            {/* Left side button (second in DOM for RTL) */}
            <button
                onClick={onWithdraw}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
                سحب من المحافظ
            </button>
        </div>
    );
};

export default SavingsCard;