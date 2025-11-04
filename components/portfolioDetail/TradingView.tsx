
import React, { useState, useMemo } from 'react';
import { Trade } from '../../types';
import TradeCard from './TradeCard';
import CloseTradeModal from './CloseTradeModal';
import { TrashIcon } from '../icons/TrashIcon';
import EditTradeModal from './EditTradeModal'; // Import the new modal
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
    const [performanceView, setPerformanceView] = useState<'monthly' | 'yearly'>('monthly');

    const formatCurrency = (amount: number) => {
      return amount.toLocaleString('ar-EG', { style: 'currency', currency: currency, minimumFractionDigits: 2, numberingSystem: 'arab' } as any);
    }
    
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
    
    // Sort trades by date to show newest first
    const sortedTrades = useMemo(() => {
        return [...trades].sort((a, b) => {
            const dateAStr = a.status === 'open' ? a.openDate : a.closeDate!;
            const dateBStr = b.status === 'open' ? b.openDate : b.closeDate!;
            // Dates are now ISO strings.
            return new Date(dateBStr).getTime() - new Date(dateAStr).getTime();
        });
    }, [trades]);

    const openTrades = sortedTrades.filter(t => t.status === 'open');
    const closedTrades = sortedTrades.filter(t => t.status === 'closed');
    const hasOpenTrade = openTrades.length > 0;

    const monthlyPerformance = useMemo(() => {
        const dataByMonth: { [key: string]: { netProfit: number; winningTrades: number; losingTrades: number; totalInvested: number; date: Date } } = {};

        closedTrades.forEach(trade => {
            if (!trade.closeDate) return;
            const closeDate = new Date(trade.closeDate);
            const monthKey = `${closeDate.getFullYear()}-${closeDate.getMonth()}`;

            if (!dataByMonth[monthKey]) {
                dataByMonth[monthKey] = {
                    netProfit: 0,
                    winningTrades: 0,
                    losingTrades: 0,
                    totalInvested: 0,
                    date: closeDate
                };
            }

            const profitLoss = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
            dataByMonth[monthKey].netProfit += profitLoss;
            dataByMonth[monthKey].totalInvested += trade.tradeValue;

            if (profitLoss >= 0) {
                dataByMonth[monthKey].winningTrades++;
            } else {
                dataByMonth[monthKey].losingTrades++;
            }
        });

        return Object.values(dataByMonth)
            .map(monthData => ({
                ...monthData,
                period: monthData.date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' }),
                profitLossPercentage: monthData.totalInvested > 0 ? (monthData.netProfit / monthData.totalInvested) * 100 : 0
            }))
            .sort((a, b) => b.date.getTime() - a.date.getTime());

    }, [closedTrades]);

    const yearlyPerformance = useMemo(() => {
        const dataByYear: { [key: string]: { netProfit: number; winningTrades: number; losingTrades: number; totalInvested: number; date: Date } } = {};

        closedTrades.forEach(trade => {
            if (!trade.closeDate) return;
            const closeDate = new Date(trade.closeDate);
            const yearKey = `${closeDate.getFullYear()}`;

            if (!dataByYear[yearKey]) {
                dataByYear[yearKey] = {
                    netProfit: 0,
                    winningTrades: 0,
                    losingTrades: 0,
                    totalInvested: 0,
                    date: closeDate
                };
            }

            const profitLoss = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
            dataByYear[yearKey].netProfit += profitLoss;
            dataByYear[yearKey].totalInvested += trade.tradeValue;

            if (profitLoss >= 0) {
                dataByYear[yearKey].winningTrades++;
            } else {
                dataByYear[yearKey].losingTrades++;
            }
        });

        return Object.values(dataByYear)
            .map(yearData => ({
                ...yearData,
                period: yearData.date.toLocaleDateString('ar-EG', { year: 'numeric' }),
                profitLossPercentage: yearData.totalInvested > 0 ? (yearData.netProfit / yearData.totalInvested) * 100 : 0
            }))
            .sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [closedTrades]);

    const performanceDataToDisplay = performanceView === 'monthly' ? monthlyPerformance : yearlyPerformance;

    const filterButtonClass = (key: string) => `px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
        filter === key ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;
    
    return (
        <>
            {closedTrades.length > 0 && (
                <div className="mb-8 bg-gray-800/50 p-6 rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                         <h3 className="text-xl font-bold text-white">الأداء الشهري/السنوي للصفقات المغلقة</h3>
                         <div className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-lg">
                            <button 
                                onClick={() => setPerformanceView('monthly')}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${performanceView === 'monthly' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                شهري
                            </button>
                            <button 
                                onClick={() => setPerformanceView('yearly')}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${performanceView === 'yearly' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                سنوي
                            </button>
                        </div>
                    </div>

                    {performanceDataToDisplay.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right text-gray-300">
                                <thead className="text-xs uppercase bg-gray-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">{performanceView === 'monthly' ? 'الشهر' : 'السنة'}</th>
                                        <th scope="col" className="px-6 py-3 text-center">صفقات رابحة</th>
                                        <th scope="col" className="px-6 py-3 text-center">صفقات خاسرة</th>
                                        <th scope="col" className="px-6 py-3">صافي الربح</th>
                                        <th scope="col" className="px-6 py-3">نسبة الربح/الخسارة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performanceDataToDisplay.map(data => (
                                        <tr key={data.period} className="border-b border-gray-700 hover:bg-gray-700/20">
                                            <th scope="row" className="px-6 py-4 font-bold text-white whitespace-nowrap">{data.period}</th>
                                            <td className="px-6 py-4 text-center font-semibold text-green-400">{formatNumber(data.winningTrades)}</td>
                                            <td className="px-6 py-4 text-center font-semibold text-red-400">{formatNumber(data.losingTrades)}</td>
                                            <td className={`px-6 py-4 font-bold ${data.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(data.netProfit)}</td>
                                            <td className={`px-6 py-4 font-bold ${data.profitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {formatNumber(data.profitLossPercentage, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">لا توجد صفقات مغلقة لعرضها.</p>
                    )}
                </div>
            )}

            <div className="bg-gray-800/50 p-6 rounded-xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                     <button 
                        onClick={onOpenAddTradeModal} 
                        disabled={hasOpenTrade}
                        title={hasOpenTrade ? "لا يمكن فتح صفقة جديدة، لديك صفقة مفتوحة بالفعل." : "فتح صفقة جديدة"}
                        className={`flex items-center gap-2 bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto ${hasOpenTrade ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-600'}`}
                    >
                        <PlusIcon />
                        فتح صفقة جديدة
                    </button>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setFilter('closed')} className={filterButtonClass('closed')}>المغلقة</button>
                        <button onClick={() => setFilter('open')} className={filterButtonClass('open')}>المفتوحة</button>
                        <button onClick={() => setFilter('all')} className={filterButtonClass('all')}>الكل</button>
                    </div>
                </div>
                <div>
                    {(filter === 'all' || filter === 'open') && (
                        <>
                            <h3 className="text-xl font-bold text-yellow-400 mb-3">الصفقات المفتوحة ({openTrades.length})</h3>
                            {openTrades.length > 0 ? (
                                <div className="space-y-3">
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
                                <p className="text-gray-400 text-center py-8">لا توجد صفقات مفتوحة حاليًا.</p>
                            )}
                        </>
                    )}

                    {(filter === 'all' || filter === 'closed') && (
                        <>
                            <h3 className="text-xl font-bold text-white mt-8 mb-3">سجل الصفقات ({closedTrades.length})</h3>
                            {closedTrades.length > 0 ? (
                                <div className="overflow-x-auto">
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
                                <p className="text-gray-400 text-center py-8">لم يتم إغلاق أي صفقات بعد.</p>
                            )}
                        </>
                    )}
                </div>
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
