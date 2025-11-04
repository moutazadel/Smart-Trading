

import React, { useState, useMemo } from 'react';
import { Trade } from '../../types';
import TradeCard from './TradeCard';
import CloseTradeModal from './CloseTradeModal';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';

interface TradingViewProps {
    trades: Trade[];
    currency: string;
    onCloseTrade: (tradeId: string, closePrice: number) => void;
    onDeleteTrade: (tradeId: string) => void;
    onOpenEditModal: (trade: Trade) => void;
    onOpenAddTradeModal: () => void;
}

const TradingView: React.FC<TradingViewProps> = ({ trades, currency, onCloseTrade, onDeleteTrade, onOpenEditModal, onOpenAddTradeModal }) => {
    const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
    const [isCloseModalOpen, setCloseModalOpen] = useState(false);
    const [tradeToClose, setTradeToClose] = useState<Trade | null>(null);

    const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
        return num.toLocaleString('ar-EG', {
            useGrouping: false,
            numberingSystem: 'arab',
            ...options,
        } as any);
    };

    const handleOpenCloseModal = (trade: Trade) => {
        setTradeToClose(trade);
        setCloseModalOpen(true);
    };

    const handleConfirmClose = (tradeId: string, closePrice: number) => {
        onCloseTrade(tradeId, closePrice);
        setCloseModalOpen(false);
        setTradeToClose(null);
    };
    
    const sortedTrades = useMemo(() => {
        return [...trades].sort((a, b) => {
            const dateAStr = a.status === 'open' ? a.openDate : a.closeDate!;
            const dateBStr = b.status === 'open' ? b.openDate : b.closeDate!;
            return new Date(dateBStr).getTime() - new Date(dateAStr).getTime();
        });
    }, [trades]);

    const openTrades = sortedTrades.filter(t => t.status === 'open');
    const closedTrades = sortedTrades.filter(t => t.status === 'closed');

    const filterButtonClass = (key: 'all' | 'open' | 'closed') => `px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
        filter === key ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;
    
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <button 
                    onClick={onOpenAddTradeModal}
                    title="فتح صفقة جديدة"
                    className="flex items-center gap-2 bg-cyan-500 text-white font-bold py-2 px-5 rounded-lg transition-colors w-full sm:w-auto hover:bg-cyan-600"
                >
                    <PlusIcon />
                    فتح صفقة جديدة
                </button>
                <div className="flex items-center gap-2 p-1 bg-gray-900/50 rounded-lg">
                    <button onClick={() => setFilter('all')} className={filterButtonClass('all')}>الكل</button>
                    <button onClick={() => setFilter('open')} className={filterButtonClass('open')}>المفتوحة</button>
                    <button onClick={() => setFilter('closed')} className={filterButtonClass('closed')}>المغلقة</button>
                </div>
            </div>

            <div className="space-y-8">
                {(filter === 'all' || filter === 'open') && (
                    <div>
                        <h3 className="text-xl font-bold text-yellow-400 mb-4">الصفقات المفتوحة ({formatNumber(openTrades.length)})</h3>
                        {openTrades.length > 0 ? (
                            <div className="space-y-4">
                                {openTrades.map(trade => (
                                    <TradeCard 
                                        key={trade.id} 
                                        trade={trade} 
                                        currency={currency}
                                        onOpenCloseModal={handleOpenCloseModal}
                                        onDelete={onDeleteTrade}
                                        onOpenEditModal={onOpenEditModal}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-800/50 rounded-lg">
                                <p className="text-gray-400">لا توجد صفقات مفتوحة حاليًا.</p>
                            </div>
                        )}
                    </div>
                )}

                {(filter === 'all' || filter === 'closed') && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">سجل الصفقات ({formatNumber(closedTrades.length)})</h3>
                        {closedTrades.length > 0 ? (
                             <div className="overflow-x-auto bg-gray-800/50 p-2 rounded-lg">
                                <table className="w-full text-sm text-right text-gray-400">
                                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">#</th>
                                            <th scope="col" className="px-6 py-3">السهم</th>
                                            <th scope="col" className="px-6 py-3">التاريخ</th>
                                            <th scope="col" className="px-6 py-3">الربح/الخسارة</th>
                                            <th scope="col" className="px-6 py-3">النسبة</th>
                                            <th scope="col" className="px-6 py-3 text-center">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {closedTrades.map((trade, index) => {
                                            const profitLoss = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
                                            const profitLossPercent = (profitLoss / trade.tradeValue) * 100;
                                            const isProfit = profitLoss >= 0;

                                            const closeDateObj = new Date(trade.closeDate!);
                                            const formattedDate = closeDateObj.toLocaleDateString('ar-EG', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            });

                                            return (
                                                <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                                    <td className="px-4 py-4 font-medium text-white">#{index + 1}</td>
                                                    <th scope="row" className="px-6 py-4 font-bold text-white whitespace-nowrap">{trade.stockName.toUpperCase()}</th>
                                                    <td className="px-6 py-4 whitespace-nowrap">{formattedDate}</td>
                                                    <td className={`px-6 py-4 font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                                        {currency} {Math.abs(profitLoss).toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{isProfit ? '+' : ''}
                                                    </td>
                                                    <td className={`px-6 py-4 font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                                        ({Math.abs(profitLossPercent).toFixed(2)}%{isProfit ? '+' : ''})
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button onClick={() => onDeleteTrade(trade.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                                            <TrashIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                           <div className="text-center py-10 bg-gray-800/50 rounded-lg">
                                 <p className="text-gray-400">لم يتم إغلاق أي صفقات بعد.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isCloseModalOpen && tradeToClose && (
                <CloseTradeModal 
                    trade={tradeToClose}
                    currency={currency}
                    onClose={() => setCloseModalOpen(false)}
                    onConfirm={handleConfirmClose}
                />
            )}
        </>
    );
};

export default TradingView;