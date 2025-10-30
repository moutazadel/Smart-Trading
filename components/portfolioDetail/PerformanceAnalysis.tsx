import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Portfolio, Expense } from '../../types';
import ClosedTradeCard from './ClosedTradeCard';
import { ArrowUpTrayIcon } from '../icons/ArrowUpTrayIcon';

// Icons
import { TrophyIcon } from '../icons/TrophyIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { ScaleIcon } from '../icons/ScaleIcon';
import { ArrowTrendingUpIcon } from '../icons/ArrowTrendingUpIcon';
import { ArrowTrendingDownIcon } from '../icons/ArrowTrendingDownIcon';
import { BarChartIcon } from '../icons/BarChartIcon';
import { SearchIcon } from '../icons/SearchIcon';

interface PerformanceAnalysisProps {
    portfolio: Portfolio;
}

const stockList = [
  { code: 'COMI', name: 'البنك التجاري الدولي (مصر)' },
  { code: 'EAST', name: 'الشرقية - ايسترن كومباني' },
  { code: 'TMGH', name: 'مجموعة طلعت مصطفى القابضة' },
  { code: 'ETEL', name: 'المصرية للاتصالات' },
  { code: 'MFPC', name: 'مصر لإنتاج الأسمدة - موبكو' },
  { code: 'EGAL', name: 'مصر للالومنيوم' },
  { code: 'ABUK', name: 'ابو قير للأسمدة والصناعات الكيماوية' },
  { code: 'ORAS', name: 'اوراسكوم كونستراكشون بي إل سي' },
  { code: 'EMFD', name: 'إعمار مصر للتنمية' },
  { code: 'EFIH', name: 'اي فاينانس للاستثمارات المالية والرقمية' },
  { code: 'FWRY', name: 'فوري لتكنولوجيا البنوك والمدفوعات الإلكترونية' },
  { code: 'HRHO', name: 'المجموعة المالية هيرميس القابضة' },
  { code: 'BTFH', name: 'بلتون القابضة' },
  { code: 'JUFO', name: 'جهينة للصناعات الغذائية' },
  { code: 'ADIB', name: 'مصرف أبو ظبي الإسلامي - مصر' },
  { code: 'EKHO', name: 'القابضة المصرية الكويتية (دولار)' },
  { code: 'EKHOA', name: 'القابضة المصرية الكويتية (جنيه)' },
  { code: 'ORHD', name: 'اوراسكوم للتنمية مصر' },
  { code: 'GBCO', name: 'جي بي كوربوريشن' },
  { code: 'CIEB', name: 'بنك كريدي أجريكول مصر' },
  { code: 'PHDC', name: 'بالم هيلز للتعمير' },
  { code: 'ARCC', name: 'العربية للأسمنت' },
  { code: 'SKPC', name: 'سيدي كرير للبتروكيماويات' },
  { code: 'ORWE', name: 'النساجون الشرقيون للسجاد' },
  { code: 'ISPH', name: 'ابن سينا فارما' },
  { code: 'RAYA', name: 'راية القابضة للاستثمارات المالية' },
  { code: 'MASR', name: 'مدينة مصر للإسكان والتعمير' },
  { code: 'AMOC', name: 'الإسكندرية للزيوت المعدنية' },
  { code: 'MCQE', name: 'مصر للأسمنت - قنا' },
  { code: 'RMDA', name: 'راميدا - الصناعات الدوائية والتشخيصية' },
  { code: 'CCAP', name: 'القلعة للاستشارات المالية' },
];

const stockNameMap = new Map(stockList.map(stock => [stock.code, stock.name]));

const getStockFullName = (code: string) => {
    return stockNameMap.get(code.toUpperCase()) || code;
};


const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const valueStr = typeof value === 'number' 
        ? value.toLocaleString('ar-EG', { style: 'currency', currency: currency, numberingSystem: 'arab' } as any)
        : value;
    return (
      <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-700 backdrop-blur-sm">
        <p className="text-sm text-gray-300">{label || data.name}</p>
        <p className="font-bold text-white">{valueStr}</p>
      </div>
    );
  }
  return null;
};

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ portfolio }) => {
    const { trades } = portfolio;
    const [searchTerm, setSearchTerm] = useState('');

    const closedTrades = useMemo(() => {
        return trades
            .filter(trade => trade.status === 'closed' && trade.closeDate)
            .sort((a, b) => {
                // Dates are now ISO strings. Sort descending (most recent first)
                return new Date(b.closeDate!).getTime() - new Date(a.closeDate!).getTime();
            });
    }, [trades]);

    const capitalHistoryData = useMemo(() => {
        const sortedClosedTrades = [...closedTrades].sort((a, b) => {
             // Dates are now ISO strings. Sort ascending for history
             const dateA = a.closeDate ? new Date(a.closeDate) : new Date(0);
             const dateB = b.closeDate ? new Date(b.closeDate) : new Date(0);
             return dateA.getTime() - dateB.getTime();
        });

        let history = [{ date: 'البداية', capital: portfolio.initialCapital, name: 'رأس المال المبدئي' }];
        let runningCapital = portfolio.initialCapital;

        const combinedEvents: any[] = [
            ...sortedClosedTrades.map((t, i) => ({...t, type: 'trade', eventDate: new Date(t.closeDate!), name: `صفقة #${i+1}: ${t.stockName}`})),
            ...(portfolio.withdrawals || []).map(w => ({...w, type: 'withdrawal', eventDate: new Date(w.date), name: `سحب للمدخرات`}))
        ].sort((a,b) => a.eventDate.getTime() - b.eventDate.getTime());
        
        // This is a simplified running capital calculation for the graph.
        // It starts with initial capital and applies events.
        // NOTE: This does NOT account for capital taken out by open trades.
        // The Y-axis represents the portfolio's value as if all capital were liquid.
        combinedEvents.forEach(event => {
            if (event.type === 'trade') {
                const profitLoss = (event.closePrice! * (event.tradeValue / event.purchasePrice)) - event.tradeValue;
                runningCapital += profitLoss;
            } else if (event.type === 'withdrawal') {
                runningCapital -= event.amount;
            }
            history.push({ date: event.eventDate.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit'}), capital: runningCapital, name: event.name });
        });

        return history;
    }, [closedTrades, portfolio.initialCapital, portfolio.withdrawals]);

    const formatCurrency = (amount: number) => {
      return amount.toLocaleString('ar-EG', { style: 'currency', currency: portfolio.currency, minimumFractionDigits: 2, numberingSystem: 'arab' } as any);
    }
    
    const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
        return num.toLocaleString('ar-EG', {
            useGrouping: false,
            numberingSystem: 'arab',
            ...options,
        } as any);
    };
    
    const capitalDistributionData = useMemo(() => {
        const netProfit = portfolio.currentCapital - portfolio.initialCapital;
        if (portfolio.initialCapital <= 0 && netProfit <= 0) return [];
        const data = [];
        if(portfolio.initialCapital > 0) data.push({ name: 'رأس المال المبدئي', value: portfolio.initialCapital });
        if(netProfit > 0) data.push({ name: 'صافي الربح', value: netProfit });
        
        return data;
    }, [portfolio.currentCapital, portfolio.initialCapital]);

    const profitByStockData = useMemo(() => {
        const profitMap: { [key: string]: number } = {};
        closedTrades.forEach(trade => {
            const profitLoss = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
            if (profitLoss > 0) {
                if (!profitMap[trade.stockName]) {
                    profitMap[trade.stockName] = 0;
                }
                profitMap[trade.stockName] += profitLoss;
            }
        });

        return Object.entries(profitMap).map(([name, value]) => ({ name, value }));
    }, [closedTrades]);

    const stockAnalysisData = useMemo(() => {
        const analysis: { [key: string]: { trades: any[] } } = {};
        const sortedTradesForAnalysis = [...closedTrades].sort((a,b) => {
             const dateA = a.closeDate ? new Date(a.closeDate) : new Date(0);
             const dateB = b.closeDate ? new Date(b.closeDate) : new Date(0);
             return dateA.getTime() - dateB.getTime();
        });
        
        sortedTradesForAnalysis.forEach(trade => {
            if (!analysis[trade.stockName]) {
                analysis[trade.stockName] = { trades: [] };
            }
            analysis[trade.stockName].trades.push(trade);
        });

        return Object.entries(analysis).map(([stockName, data]) => {
            const stockTrades = data.trades;
            const totalTrades = stockTrades.length;
            let winningTradesCount = 0;
            let totalProfit = 0;
            let totalLoss = 0;
            let netProfitLoss = 0;
            const performanceHistory = [{ tradeNum: 0, cumulativeProfit: 0, name: 'البداية' }];
            let cumulativeProfit = 0;

            stockTrades.forEach((trade, index) => {
                const profit = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
                netProfitLoss += profit;
                cumulativeProfit += profit;
                performanceHistory.push({ tradeNum: index + 1, cumulativeProfit, name: `صفقة #${index+1}` });
                if (profit > 0) {
                    winningTradesCount++;
                    totalProfit += profit;
                } else {
                    totalLoss += profit;
                }
            });
            
            return {
                name: stockName,
                totalTrades: totalTrades,
                netProfitLoss: netProfitLoss,
                avgTradeValue: stockTrades.reduce((acc, t) => acc + t.tradeValue, 0) / totalTrades,
                winRate: totalTrades > 0 ? (winningTradesCount / totalTrades) * 100 : 0,
                avgProfit: winningTradesCount > 0 ? totalProfit / winningTradesCount : 0,
                avgLoss: (totalTrades - winningTradesCount) > 0 ? totalLoss / (totalTrades - winningTradesCount) : 0,
                performanceHistory,
            };
        });
    }, [closedTrades]);

    const filteredClosedTrades = useMemo(() => {
        if (!searchTerm) {
            return closedTrades;
        }
        return closedTrades.filter(trade => 
            trade.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (trade.closeDate && new Date(trade.closeDate).toLocaleDateString('ar-EG').includes(searchTerm))
        );
    }, [closedTrades, searchTerm]);

    const handleExportToCSV = () => {
        if (closedTrades.length === 0) {
            alert("لا توجد صفقات مغلقة لتصديرها.");
            return;
        }

        const headers = [
            "اسم السهم",
            "تاريخ الفتح",
            "تاريخ الإغلاق",
            "سعر الشراء",
            "سعر الإغلاق",
            "قيمة الصفقة",
            `الربح/الخسارة (${portfolio.currency})`,
            "الربح/الخسارة (%)",
            "ملاحظات"
        ];

        const rows = closedTrades.map(trade => {
            const pnl = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
            const pnlPercent = (pnl / trade.tradeValue) * 100;
            const profitLoss = pnl.toFixed(2);
            const profitLossPercent = pnlPercent.toFixed(2) + '%';
            const sanitizedNotes = trade.notes ? `"${trade.notes.replace(/"/g, '""')}"` : '';
            
            const rowData = [
                trade.stockName,
                new Date(trade.openDate).toLocaleDateString('en-GB'),
                trade.closeDate ? new Date(trade.closeDate).toLocaleDateString('en-GB') : '',
                trade.purchasePrice,
                trade.closePrice || '',
                trade.tradeValue,
                profitLoss,
                profitLossPercent,
                sanitizedNotes
            ];
            
            return rowData.join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `closed_trades_${portfolio.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const COLORS_CAPITAL = ['#06b6d4', '#10b981'];
    const COLORS_STOCKS = ['#10b981', '#22d3ee', '#818cf8', '#f59e0b', '#f472b6'];

    if (closedTrades.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-800/50 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-300">لا توجد بيانات تحليلية بعد</h3>
                <p className="text-gray-400 mt-2">قم بإغلاق بعض الصفقات أولاً لعرض تحليل الأداء.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
             <div className="bg-gray-800/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">نمو رأس المال مع الوقت</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={capitalHistoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(tick) => formatNumber(tick)} />
                             <Tooltip content={<CustomTooltip currency={portfolio.currency} />} />
                            <Line type="monotone" dataKey="capital" name="رأس المال" stroke="#22d3ee" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Capital Distribution */}
                <div className="bg-gray-800/50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">توزيع رأس المال</h3>
                    <div className="flex items-center h-[250px]">
                        <div className="w-2/3 h-full relative">
                             <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={capitalDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" fill="#8884d8" paddingAngle={5}>
                                        {capitalDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_CAPITAL[index % COLORS_CAPITAL.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip currency={portfolio.currency} />} />
                                </PieChart>
                            </ResponsiveContainer>
                             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-gray-300 text-sm">رأس المال الحالي</span>
                                <span className="font-bold text-2xl text-white">{formatCurrency(portfolio.currentCapital)}</span>
                            </div>
                        </div>
                        <div className="w-1/3 space-y-2 text-sm">
                            {capitalDistributionData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_CAPITAL[index % COLORS_CAPITAL.length] }}></div>
                                    <div>
                                        <p className="text-gray-400">{entry.name}</p>
                                        <p className="font-semibold text-white">{formatCurrency(entry.value)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Profit Distribution by Stock */}
                <div className="bg-gray-800/50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">توزيع الأرباح حسب السهم</h3>
                    <div className="flex items-center h-[250px]">
                         <div className="w-2/3 h-full relative">
                            {profitByStockData.length > 0 ? (
                                <>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={profitByStockData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" fill="#8884d8" paddingAngle={5}>
                                                {profitByStockData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS_STOCKS[index % COLORS_STOCKS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip currency={portfolio.currency} />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-gray-300 text-sm">صافي الربح/الخسارة</span>
                                        <span className={`font-bold text-2xl ${portfolio.currentCapital - portfolio.initialCapital >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(portfolio.currentCapital - portfolio.initialCapital)}</span>
                                    </div>
                                </>
                            ) : <p className="text-gray-400 text-center w-full">لا توجد أرباح لعرضها.</p>}
                        </div>
                        <div className="w-1/3 space-y-2 text-sm self-start overflow-y-auto max-h-[250px]">
                            {profitByStockData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_STOCKS[index % COLORS_STOCKS.length] }}></div>
                                    <p className="font-semibold text-white">{entry.name}</p>
                                    <p className="text-gray-400">({formatNumber((entry.value / profitByStockData.reduce((acc, e) => acc + e.value, 0)) * 100, {maximumFractionDigits: 0})}%)</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Performance Analysis */}
            <div>
                 <h2 className="text-2xl font-bold text-cyan-400 mb-6 mt-4">تحليل أداء الأسهم</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stockAnalysisData.map(stock => (
                        <div key={stock.name} className="bg-gray-800/50 p-6 rounded-xl flex flex-col">
                            <div className="text-center mb-4 min-h-[64px]">
                                <h4 className="text-2xl font-bold text-yellow-400">{stock.name}</h4>
                                <p className="text-sm text-gray-400">{getStockFullName(stock.name)}</p>
                            </div>
                            
                            <div className="space-y-3 text-sm flex-grow">
                                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-300"><TrophyIcon className="w-5 h-5 text-yellow-400"/> صافي الربح/الخسارة</div>
                                    <div className={`font-bold text-base ${stock.netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(stock.netProfitLoss)}</div>
                                </div>
                                 <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-300"><BarChartIcon className="w-5 h-5 text-cyan-400"/> إجمالي الصفقات</div>
                                    <div className="font-bold text-base text-white">{formatNumber(stock.totalTrades)}</div>
                                </div>
                                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-300"><CheckBadgeIcon className="w-5 h-5 text-green-400"/> نسبة الربح</div>
                                    <div className="font-bold text-base text-white">{formatNumber(stock.winRate, {minimumFractionDigits: 1, maximumFractionDigits: 1})}%</div>
                                </div>
                                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-300"><ScaleIcon className="w-5 h-5 text-gray-400"/> متوسط قيمة الصفقة</div>
                                    <div className="font-bold text-base text-white">{formatCurrency(stock.avgTradeValue)}</div>
                                </div>
                                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-300"><ArrowTrendingUpIcon className="w-5 h-5 text-green-400"/> متوسط الربح</div>
                                    <div className="font-bold text-base text-green-400">{formatCurrency(stock.avgProfit)}</div>
                                </div>
                                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-300"><ArrowTrendingDownIcon className="w-5 h-5 text-red-400"/> متوسط الخسارة</div>
                                    <div className="font-bold text-base text-red-400">{formatCurrency(stock.avgLoss)}</div>
                                </div>
                            </div>
                            
                            <div className="h-24 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stock.performanceHistory} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id={`colorProfit-${stock.name}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Tooltip content={<CustomTooltip currency={portfolio.currency} />} />
                                        <Area type="monotone" dataKey="cumulativeProfit" name="الربح التراكمي" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill={`url(#colorProfit-${stock.name})`} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-cyan-400">سجل الصفقات المغلقة</h2>
                        <button
                            onClick={handleExportToCSV}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            title="تصدير الصفقات المغلقة إلى ملف CSV"
                        >
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            <span>تصدير CSV</span>
                        </button>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="ابحث بالاسم أو التاريخ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                {filteredClosedTrades.length > 0 ? (
                    <div className="space-y-3">
                        {filteredClosedTrades.map(trade => (
                            <ClosedTradeCard key={trade.id} trade={trade} currency={portfolio.currency} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">
                        {searchTerm ? 'لا توجد صفقات تطابق بحثك.' : 'لم يتم إغلاق أي صفقات بعد.'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PerformanceAnalysis;
