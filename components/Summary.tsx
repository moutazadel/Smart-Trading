import React from 'react';
import { SummaryData } from '../types';

interface SummaryProps {
    summaryData: SummaryData;
}

const Summary: React.FC<SummaryProps> = ({ summaryData }) => {
    const currencies = Object.keys(summaryData);
    
    const formatCurrency = (amount: number, currency: string) => {
        return amount.toLocaleString('ar-EG', { style: 'currency', currency: currency, minimumFractionDigits: 2, numberingSystem: 'arab' } as any);
    }

    const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
        return num.toLocaleString('ar-EG', {
            useGrouping: false,
            numberingSystem: 'arab',
            ...options,
        } as any);
    };

    if (currencies.length <= 1) {
        const currency = currencies[0] || 'EGP';
        const data = summaryData[currency] || {
            totalInitialCapital: 0,
            totalCurrentCapital: 0,
            totalProfitLoss: 0,
            totalProfitLossPercent: 0,
            totalClosedTrades: 0,
        };
        const isProfit = data.totalProfitLoss >= 0;

        return (
             <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg text-center">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">رأس المال الإجمالي ({currency})</h3>
                <p className="text-5xl font-bold text-white tracking-wider mb-6">{formatCurrency(data.totalCurrentCapital, currency)}</p>
                <div className="flex flex-col sm:flex-row justify-around items-center border-t border-gray-700/50 pt-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-700/50 rtl:divide-x-reverse">
                    <div className="w-full sm:w-auto p-4">
                        <h4 className="text-sm text-gray-400 mb-1">صافي الربح/الخسارة</h4>
                        <p className={`text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(data.totalProfitLoss, currency)}</p>
                    </div>
                    <div className="w-full sm:w-auto p-4">
                        <h4 className="text-sm text-gray-400 mb-1">نسبة الربح/الخسارة</h4>
                        <p className={`text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>{formatNumber(data.totalProfitLossPercent, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
                    </div>
                    <div className="w-full sm:w-auto p-4">
                        <h4 className="text-sm text-gray-400 mb-1">الصفقات المغلقة</h4>
                        <p className="text-xl font-bold text-white">{formatNumber(data.totalClosedTrades)}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currencies.map(currency => {
                const data = summaryData[currency];
                const isProfit = data.totalProfitLoss >= 0;

                return (
                    <div key={currency} className="bg-gray-800/50 p-4 rounded-xl shadow-lg flex flex-col gap-4">
                        <div className="bg-black/20 p-4 rounded-xl text-center">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-2">رأس المال الإجمالي ({currency})</h3>
                            <p className="text-3xl font-bold text-white tracking-wider">{formatCurrency(data.totalCurrentCapital, currency)}</p>
                        </div>
                        <div className="flex-grow grid grid-cols-3 items-center text-center divide-x divide-gray-700/50 rtl:divide-x-reverse">
                            <div className="p-2">
                                <h4 className="text-xs text-gray-400 mb-1">صافي الربح/الخسارة</h4>
                                <p className={`text-lg font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(data.totalProfitLoss, currency)}</p>
                            </div>
                            <div className="p-2">
                                <h4 className="text-xs text-gray-400 mb-1">نسبة الربح/الخسارة</h4>
                                <p className={`text-lg font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>{formatNumber(data.totalProfitLossPercent, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
                            </div>
                            <div className="p-2">
                                <h4 className="text-xs text-gray-400 mb-1">الصفقات المغلقة</h4>
                                <p className="text-lg font-bold text-white">{formatNumber(data.totalClosedTrades)}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Summary;
