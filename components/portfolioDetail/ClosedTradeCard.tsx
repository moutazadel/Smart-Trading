import React from 'react';
import { Trade } from '../../types';
import { ArrowTrendingUpIcon } from '../icons/ArrowTrendingUpIcon';
import { ArrowTrendingDownIcon } from '../icons/ArrowTrendingDownIcon';

interface ClosedTradeCardProps {
    trade: Trade;
    currency: string;
}

const ClosedTradeCard: React.FC<ClosedTradeCardProps> = ({ trade, currency }) => {
    const profitLoss = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
    const profitLossPercent = (profitLoss / trade.tradeValue) * 100;
    const isProfit = profitLoss >= 0;

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ar-EG', { style: 'currency', currency: currency, minimumFractionDigits: 2, numberingSystem: 'arab' } as any);
    };

    const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
        return num.toLocaleString('ar-EG', {
            numberingSystem: 'arab',
            ...options
        } as any);
    }

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-gray-600 space-y-3">
            {/* Top section with prices and info */}
            <div className="flex justify-between items-start">
                {/* Right side: Purchase Info (first in DOM for RTL) */}
                <div className="text-right space-y-1">
                    <h4 className="font-bold text-lg text-white">{trade.stockName.toUpperCase()}</h4>
                    <p className="text-gray-400 text-sm">سعر الشراء</p>
                    <p className="font-bold text-white text-lg">{formatNumber(trade.purchasePrice, { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Middle arrow */}
                <div className="flex-grow flex items-center justify-center pt-10">
                    <span className="text-gray-500 text-2xl">←</span>
                </div>

                {/* Left side: Close Info (last in DOM for RTL) */}
                <div className="text-left space-y-1">
                    <div className="text-xs text-gray-400">
                        <p>فتح: {trade.openDate}</p>
                        <p>إغلاق: {trade.closeDate}</p>
                    </div>
                    <p className="text-gray-400 text-sm">سعر الإغلاق</p>
                    <p className="font-bold text-white text-lg">{formatNumber(trade.closePrice!, { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-700" />

            {/* Bottom section with result */}
            <div className="flex justify-between items-center">
                {/* Right side: "النتيجة" (first in DOM for RTL) */}
                <span className="font-bold text-lg text-gray-300">النتيجة</span>

                {/* Left side: The actual result (last in DOM for RTL) */}
                <div className={`flex items-center gap-3 font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                    <span className="text-lg">{formatCurrency(profitLoss)}</span>
                    <div className="flex items-center gap-1 text-sm">
                        {isProfit ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
                        <span>({formatNumber(profitLossPercent, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClosedTradeCard;