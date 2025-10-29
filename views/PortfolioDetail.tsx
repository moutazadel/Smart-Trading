import React, { useState, useMemo } from 'react';
import { Portfolio, Trade, Expense, FinancialGoal, UserProfile } from '../types';
import DetailHeader from '../components/portfolioDetail/DetailHeader';
import StatCard from '../components/portfolioDetail/StatCard';
import ProgressBar from '../components/portfolioDetail/ProgressBar';
import InfoGridCard from '../components/portfolioDetail/InfoGridCard';
import TradingView from '../components/portfolioDetail/TradingView';
import PerformanceAnalysis from '../components/portfolioDetail/PerformanceAnalysis';
import FinancialGoalsModal from '../components/portfolioDetail/FinancialGoalsModal';
import UpdateCapitalModal from '../components/portfolioDetail/UpdateCapitalModal';
import EditPortfolioModal from '../components/portfolioDetail/EditPortfolioModal';
import EditTradeModal from '../components/portfolioDetail/EditTradeModal';
import AddTradeModal from '../components/portfolioDetail/AddTradeModal';

// Icons
import { BarChartIcon } from '../components/icons/BarChartIcon';
import { CheckBadgeIcon } from '../components/icons/CheckBadgeIcon';
import { BookmarkIcon } from '../components/icons/BookmarkIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { ArrowTrendingUpIcon } from '../components/icons/ArrowTrendingUpIcon';
import { ArrowTrendingDownIcon } from '../components/icons/ArrowTrendingDownIcon';

interface PortfolioDetailProps {
    portfolio: Portfolio;
    profile: UserProfile | null;
    onBack: () => void;
    onAddTrade: (tradeData: Omit<Trade, 'id' | 'portfolioId' | 'status' | 'openDate'>) => void;
    onCloseTrade: (tradeId: string, closePrice: number) => void;
    onDeleteTrade: (tradeId: string) => void;
    onUpdateDetails: (details: { financialGoals?: FinancialGoal[], name?: string }) => void;
    onUpdateTrade: (tradeId: string, details: Partial<Omit<Trade, 'id' | 'portfolioId'>>) => void;
    onAddCapital: (amountToAdd: number) => void;
}

const PortfolioDetail: React.FC<PortfolioDetailProps> = ({ portfolio, profile, onBack, onAddTrade, onCloseTrade, onDeleteTrade, onUpdateDetails, onUpdateTrade, onAddCapital }) => {
    const [activeTab, setActiveTab] = useState<'trading' | 'analysis'>('trading');
    const [isGoalsModalOpen, setGoalsModalOpen] = useState(false);
    const [isCapitalModalOpen, setCapitalModalOpen] = useState(false);
    const [isEditPortfolioModalOpen, setEditPortfolioModalOpen] = useState(false);
    const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);
    const [isAddTradeModalOpen, setAddTradeModalOpen] = useState(false);

    const formatCurrency = (amount: number, currency: string) => {
        // FIX: Cast options to `any` to allow `numberingSystem` which is a valid but sometimes untyped property.
        return amount.toLocaleString('ar-EG', { 
            style: 'currency', 
            currency: currency, 
            minimumFractionDigits: 2,
            numberingSystem: 'arab'
        } as any);
    };

    const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
        // FIX: Cast options to `any` to allow `numberingSystem` which is a valid but sometimes untyped property.
        return num.toLocaleString('ar-EG', {
            useGrouping: false,
            numberingSystem: 'arab',
            ...options,
        } as any);
    };

    const formatCurrencyNoFraction = (amount: number, currency: string) => {
        // FIX: Cast options to `any` to allow `numberingSystem` which is a valid but sometimes untyped property.
        return amount.toLocaleString('ar-EG', { 
            style: 'currency', 
            currency: currency, 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0,
            numberingSystem: 'arab'
        } as any);
    };
    
    const handleSaveGoals = (updatedGoals: FinancialGoal[]) => {
        onUpdateDetails({ financialGoals: updatedGoals });
        setGoalsModalOpen(false);
    };

    const handleSaveName = (newName: string) => {
        onUpdateDetails({ name: newName });
        setEditPortfolioModalOpen(false);
    };
    
    const handleOpenEditTradeModal = (trade: Trade) => {
        setTradeToEdit(trade);
    };

    const handleSaveTrade = (tradeId: string, details: Partial<Omit<Trade, 'id' | 'portfolioId'>>) => {
        onUpdateTrade(tradeId, details);
        setTradeToEdit(null);
    };
    
    const handleAddTradeFromModal = (tradeData: Omit<Trade, 'id' | 'portfolioId' | 'status' | 'openDate'>) => {
        onAddTrade(tradeData);
        setAddTradeModalOpen(false);
    };

    const { netProfitLoss, winRate, totalClosedTrades, avgProfit, avgLoss } = useMemo(() => {
        const closedTrades = portfolio.trades.filter(t => t.status === 'closed');
        const totalClosed = closedTrades.length;
        if (totalClosed === 0) {
            return { netProfitLoss: 0, winRate: 0, totalClosedTrades: 0, avgProfit: 0, avgLoss: 0 };
        }
        
        let totalProfit = 0;
        let totalLoss = 0;
        let winningTrades = 0;
        
        closedTrades.forEach(trade => {
            const profit = (trade.closePrice! * (trade.tradeValue / trade.purchasePrice)) - trade.tradeValue;
            if (profit > 0) {
                totalProfit += profit;
                winningTrades++;
            } else {
                totalLoss += profit;
            }
        });

        return {
            netProfitLoss: totalProfit + totalLoss,
            winRate: (winningTrades / totalClosed) * 100,
            totalClosedTrades: totalClosed,
            avgProfit: winningTrades > 0 ? totalProfit / winningTrades : 0,
            avgLoss: (totalClosed - winningTrades) > 0 ? totalLoss / (totalClosed - winningTrades) : 0,
        };
    }, [portfolio.trades]);
    
    const { nextGoal, lastAchievedGoalAmount, goalsAchievedCount } = useMemo(() => {
        const sortedGoals = [...portfolio.financialGoals].sort((a, b) => a.amount - b.amount);
        const next = sortedGoals.find(g => portfolio.currentCapital < g.amount);
        const achievedGoals = sortedGoals.filter(g => portfolio.currentCapital >= g.amount);
        const lastAchieved = achievedGoals.length > 0 ? achievedGoals[achievedGoals.length - 1] : null;

        return {
            nextGoal: next,
            lastAchievedGoalAmount: lastAchieved ? lastAchieved.amount : portfolio.initialCapital,
            goalsAchievedCount: achievedGoals.length,
        };
    }, [portfolio.financialGoals, portfolio.currentCapital, portfolio.initialCapital]);

    const statCardTitle = nextGoal ? `الهدف التالي (${nextGoal.name})` : "تم تحقيق الأهداف";
    const statCardValue = nextGoal ? formatCurrency(nextGoal.amount, portfolio.currency) : `${formatNumber(goalsAchievedCount)} / ${formatNumber(portfolio.financialGoals.length)}`;

    const portfolioNetProfit = portfolio.currentCapital - portfolio.initialCapital;


    return (
        <div>
            <DetailHeader 
                portfolioName={portfolio.name} 
                onEditName={() => setEditPortfolioModalOpen(true)}
                userEmail={profile?.email}
                userAvatar={profile?.avatar}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <StatCard title="رأس المال المبدئي" value={formatCurrency(portfolio.initialCapital, portfolio.currency)} color="yellow" onEdit={() => setCapitalModalOpen(true)} />
                <StatCard title="رأس المال الحالي" value={formatCurrency(portfolio.currentCapital, portfolio.currency)} color="blue" />
                <StatCard title={statCardTitle} value={statCardValue} color="green" onEdit={() => setGoalsModalOpen(true)} />
            </div>

            <ProgressBar 
                current={portfolio.currentCapital}
                start={lastAchievedGoalAmount}
                goal={nextGoal?.amount || lastAchievedGoalAmount}
                nextGoalAvailable={!!nextGoal}
                formatCurrency={(amount) => formatCurrencyNoFraction(amount, portfolio.currency)}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
                <InfoGridCard title="إجمالي الصفقات المغلقة" value={formatNumber(totalClosedTrades)} icon={<BarChartIcon />} />
                <InfoGridCard title="نسبة الصفقات الرابحة" value={`${formatNumber(winRate, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`} icon={<CheckBadgeIcon />} />
                <InfoGridCard title="صفقات مفتوحة متوقعة للهدف" value="بيانات غير كافية" icon={<BookmarkIcon />} isTextSmall />
                <InfoGridCard title="صافي الربح/الخسارة" value={formatCurrency(portfolioNetProfit, portfolio.currency)} icon={<TrophyIcon />} isProfit={portfolioNetProfit >= 0} />
                <InfoGridCard title="متوسط الربح" value={formatCurrency(avgProfit, portfolio.currency)} icon={<ArrowTrendingUpIcon className="text-green-400"/>} />
                <InfoGridCard title="متوسط الخسارة" value={formatCurrency(avgLoss, portfolio.currency)} icon={<ArrowTrendingDownIcon className="text-red-400" />} />
            </div>

            <div className="flex items-center border-b border-gray-700 mb-6">
                <button 
                    onClick={() => setActiveTab('trading')}
                    className={`px-6 py-3 font-semibold text-lg transition-colors ${activeTab === 'trading' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
                >
                    تداول
                </button>
                <button 
                    onClick={() => setActiveTab('analysis')}
                    className={`px-6 py-3 font-semibold text-lg transition-colors ${activeTab === 'analysis' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
                >
                    تحليل الأداء
                </button>
            </div>

            {activeTab === 'trading' ? (
                <TradingView 
                    trades={portfolio.trades}
                    currency={portfolio.currency}
                    onOpenAddTradeModal={() => setAddTradeModalOpen(true)}
                    onCloseTrade={onCloseTrade}
                    onDeleteTrade={onDeleteTrade}
                    onOpenEditModal={handleOpenEditTradeModal}
                />
            ) : (
                <PerformanceAnalysis portfolio={portfolio} />
            )}
            
            {isGoalsModalOpen && (
                <FinancialGoalsModal 
                    goals={portfolio.financialGoals}
                    onClose={() => setGoalsModalOpen(false)}
                    onSave={handleSaveGoals}
                />
            )}

            {isCapitalModalOpen && (
                <UpdateCapitalModal 
                    portfolio={portfolio}
                    onClose={() => setCapitalModalOpen(false)}
                    onAddCapital={onAddCapital}
                />
            )}

            {isEditPortfolioModalOpen && (
                <EditPortfolioModal 
                    initialName={portfolio.name}
                    onClose={() => setEditPortfolioModalOpen(false)}
                    onSave={handleSaveName}
                />
            )}

            {tradeToEdit && (
                <EditTradeModal
                    trade={tradeToEdit}
                    currency={portfolio.currency}
                    onClose={() => setTradeToEdit(null)}
                    onSave={handleSaveTrade}
                />
            )}

            {isAddTradeModalOpen && (
                <AddTradeModal
                    currency={portfolio.currency}
                    onClose={() => setAddTradeModalOpen(false)}
                    onAdd={handleAddTradeFromModal}
                />
            )}
        </div>
    );
};

export default PortfolioDetail;