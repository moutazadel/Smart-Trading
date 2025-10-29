import React from 'react';
import { Portfolio } from '../types';
import { TrashIcon } from './icons/TrashIcon';


interface PortfolioCardProps {
    portfolio: Portfolio;
    onViewDetails: (id: string) => void;
    onDelete: (id: string, name: string) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, onViewDetails, onDelete }) => {
    const profitLoss = portfolio.currentCapital - portfolio.initialCapital;
    const isProfit = profitLoss >= 0;

    const formatCurrency = (amount: number, currency: string) => {
      // Use 'arab' numbering system for Arabic-Indic numerals
      return amount.toLocaleString('ar-EG', { style: 'currency', currency: currency, minimumFractionDigits: 2, numberingSystem: 'arab' } as any);
    }
    
    const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
        return num.toLocaleString('ar-EG', {
            useGrouping: false,
            numberingSystem: 'arab',
            ...options,
        } as any);
    };

    const closedTrades = portfolio.trades.filter(t => t.status === 'closed');
    const winningTrades = closedTrades.filter(t => t.outcome === 'profit').length;
    const winRatePercent = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;


    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(portfolio.id, portfolio.name);
    };

    return (
        <div 
            className={`bg-[#20293A] p-5 rounded-2xl shadow-lg border-t-4 ${isProfit ? 'border-green-500' : 'border-red-500'} flex flex-col justify-between transition-all duration-300 cursor-pointer relative`}
            onClick={() => onViewDetails(portfolio.id)}
        >
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded border border-white shadow-md">
                {portfolio.currency}
            </div>
             <button 
                onClick={handleDelete} 
                className="absolute top-3 left-3 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 z-10"
                title={`حذف محفظة ${portfolio.name}`}
            >
                <TrashIcon />
            </button>
            
            <div>
                <div className="text-center pt-2 pb-4">
                    <h3 className="text-2xl font-bold text-white">{portfolio.name}</h3>
                </div>

                <div className="flex justify-between items-center my-4">
                    {/* Labels are first in order, so they render on the right in RTL */}
                    <div className="text-gray-400 text-lg text-right space-y-3">
                        <p>رأس المال الحالي</p>
                        <p>صافي الربح/الخسارة</p>
                        <p>نسبة الصفقات الرابحة</p>
                    </div>
                    {/* Values are second, rendering on the left in RTL */}
                    <div className="font-bold text-lg text-left space-y-3">
                        <p className="text-white">{formatCurrency(portfolio.currentCapital, portfolio.currency)}</p>
                        <p className={isProfit ? 'text-green-400' : 'text-red-400'}>{isProfit ? '+' : ''}{formatCurrency(profitLoss, portfolio.currency)}</p>
                        <p className="text-white">{formatNumber(winRatePercent, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</p>
                    </div>
                </div>
            </div>
            
            <button
                onClick={(e) => {
                    e.stopPropagation(); // prevent card's onClick from firing
                    onViewDetails(portfolio.id);
                }}
                className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                إدارة
            </button>
        </div>
    );
};

export default PortfolioCard;