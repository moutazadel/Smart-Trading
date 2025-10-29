import React, { useState, useMemo } from 'react';
import { Portfolio } from '../types';
import { ComparisonData } from '../types';

interface PortfolioComparisonViewProps {
    portfolios: Portfolio[];
}

interface SortConfig {
    key: keyof ComparisonData | null;
    direction: 'ascending' | 'descending';
}

const PortfolioComparisonView: React.FC<PortfolioComparisonViewProps> = ({ portfolios }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });


    const handleCheckboxChange = (portfolioId: string) => {
        setSelectedIds(prev =>
            prev.includes(portfolioId)
                ? prev.filter(id => id !== portfolioId)
                : [...prev, portfolioId]
        );
    };

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

    const requestSort = (key: keyof ComparisonData) => {
        if (sortConfig.key !== key) {
            setSortConfig({ key, direction: 'ascending' });
            return;
        }

        if (sortConfig.direction === 'ascending') {
            setSortConfig({ key, direction: 'descending' });
        } else {
            setSortConfig({ key: null, direction: 'ascending' });
        }
    };

    const sortedComparisonData = useMemo<ComparisonData[]>(() => {
        let data = portfolios
            .filter(p => selectedIds.includes(p.id))
            .map(p => {
                const closedTrades = p.trades.filter(t => t.status === 'closed');
                const totalClosed = closedTrades.length;
                
                const winningTrades = closedTrades.filter(t => t.outcome === 'profit').length;
                const winRate = totalClosed > 0 ? (winningTrades / totalClosed) * 100 : 0;
                
                const totalProfitLoss = p.currentCapital - p.initialCapital;

                const totalTradeValue = p.trades.reduce((sum, t) => sum + t.tradeValue, 0);
                const avgTradeValue = p.trades.length > 0 ? totalTradeValue / p.trades.length : 0;
                
                const roi = p.initialCapital > 0 ? (totalProfitLoss / p.initialCapital) * 100 : 0;

                let sharpeRatio = 0;
                if (totalClosed > 1) { // Standard deviation requires at least 2 data points
                    const tradeReturns = closedTrades.map(trade => {
                        const pnl = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
                        return (pnl / trade.tradeValue); // return as decimal, e.g. 0.1 for 10%
                    });

                    const meanReturn = tradeReturns.reduce((acc, val) => acc + val, 0) / totalClosed;
                    
                    const squaredDiffs = tradeReturns.map(ret => Math.pow(ret - meanReturn, 2));
                    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / totalClosed;
                    const stdDev = Math.sqrt(variance);
                    
                    const portfolioReturnDecimal = roi / 100;
                    
                    // Simplified Sharpe Ratio = (Portfolio Return) / StdDev of trade returns
                    // Assumes risk-free rate is 0 as we cannot properly annualize returns without time data.
                    if (stdDev > 0) {
                        sharpeRatio = portfolioReturnDecimal / stdDev;
                    }
                }

                return {
                    id: p.id,
                    name: p.name,
                    currency: p.currency,
                    initialCapital: p.initialCapital,
                    currentCapital: p.currentCapital,
                    totalProfitLoss: totalProfitLoss,
                    winRate: winRate,
                    totalClosedTrades: totalClosed,
                    avgTradeValue: avgTradeValue,
                    roi: roi,
                    sharpeRatio: sharpeRatio,
                };
            });
        
        if (sortConfig.key) {
            data.sort((a, b) => {
                const valA = a[sortConfig.key!];
                const valB = b[sortConfig.key!];

                if (typeof valA === 'number' && typeof valB === 'number') {
                     if (valA < valB) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (valA > valB) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                }
                return 0;
            });
        }
        
        return data;
    }, [portfolios, selectedIds, sortConfig]);

    if (portfolios.length < 2) {
        return (
            <div className="text-center py-20 bg-gray-800/50 rounded-xl">
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">مقارنة أداء المحافظ</h2>
                <p className="text-gray-400">تحتاج إلى محفظتين على الأقل لبدء المقارنة.</p>
            </div>
        );
    }
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">مقارنة أداء المحافظ</h2>
            <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
                حدد المحافظ التي ترغب في مقارنتها لعرض تحليل مفصل لأدائها جنبًا إلى جنب.
            </p>

            <div className="bg-gray-800/50 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">اختر المحافظ للمقارنة:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {portfolios.map(p => (
                        <label key={p.id} className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(p.id)}
                                onChange={() => handleCheckboxChange(p.id)}
                                className="form-checkbox h-5 w-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600"
                            />
                            <span className="font-semibold text-white">{p.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {selectedIds.length < 2 ? (
                 <div className="text-center py-16 bg-gray-800/50 rounded-xl">
                    <h3 className="text-2xl font-semibold text-gray-300">الرجاء تحديد محفظتين على الأقل</h3>
                    <p className="text-gray-400 mt-2">اختر من القائمة أعلاه لبدء المقارنة.</p>
                </div>
            ) : (
                <div className="bg-gray-800/50 rounded-xl shadow-lg overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-900/70">
                            <tr>
                                <th className="p-4 font-semibold text-white sticky right-0 bg-gray-900/70 z-10">المقياس</th>
                                {sortedComparisonData.map(data => (
                                    <th key={data.id} className="p-4 font-semibold text-cyan-400 text-center">{data.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {[
                                { label: 'رأس المال المبدئي', key: 'initialCapital' },
                                { label: 'رأس المال الحالي', key: 'currentCapital' },
                                { label: 'صافي الربح/الخسارة', key: 'totalProfitLoss' },
                                { label: 'العائد على الاستثمار (ROI)', key: 'roi' },
                                { label: 'نسبة الصفقات الرابحة', key: 'winRate' },
                                { label: 'نسبة شارب', key: 'sharpeRatio' },
                                { label: 'متوسط قيمة الصفقة', key: 'avgTradeValue' },
                                { label: 'إجمالي الصفقات المغلقة', key: 'totalClosedTrades' },
                            ].map(metric => (
                                <tr key={metric.key} className="hover:bg-gray-700/50 group">
                                    <td className="p-4 font-medium text-gray-300 sticky right-0 bg-gray-800 group-hover:bg-gray-700/50 z-10">
                                        <button
                                            type="button"
                                            onClick={() => requestSort(metric.key as keyof ComparisonData)}
                                            className="flex items-center justify-between w-full text-right transition-colors hover:text-cyan-400"
                                        >
                                            <span>{metric.label}</span>
                                            <span className="w-4 text-gray-500">
                                                {sortConfig.key === metric.key
                                                    ? (sortConfig.direction === 'ascending' ? '▲' : '▼')
                                                    : '↕'
                                                }
                                            </span>
                                        </button>
                                    </td>
                                    {sortedComparisonData.map(data => {
                                        const value = data[metric.key as keyof ComparisonData];
                                        let displayValue: string | number = value;
                                        let valueClass = 'text-white';

                                        if (typeof value === 'number') {
                                            if (metric.key === 'totalProfitLoss') {
                                                displayValue = formatCurrency(value, data.currency);
                                                valueClass = value >= 0 ? 'text-green-400' : 'text-red-400';
                                            } else if (['initialCapital', 'currentCapital', 'avgTradeValue'].includes(metric.key)) {
                                                displayValue = formatCurrency(value, data.currency);
                                            } else if (metric.key === 'winRate' || metric.key === 'roi') {
                                                displayValue = `${formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
                                                if (metric.key === 'roi') {
                                                    valueClass = value >= 0 ? 'text-green-400' : 'text-red-400';
                                                }
                                            } else if (metric.key === 'sharpeRatio') {
                                                displayValue = formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                if (value > 1.5) valueClass = 'text-green-400';
                                                else if (value > 0.5) valueClass = 'text-yellow-400';
                                                else if (value < 0) valueClass = 'text-red-400';
                                            } else {
                                                displayValue = formatNumber(value);
                                            }
                                        }

                                        return (
                                            <td key={`${data.id}-${metric.key}`} className={`p-4 font-bold text-lg text-center ${valueClass}`}>
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PortfolioComparisonView;
