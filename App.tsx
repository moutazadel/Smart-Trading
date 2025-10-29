import React, { useState, useEffect, useMemo } from 'react';
import { Portfolio, Expense, SubscriptionPlan, View, Trade, SummaryData, CurrencySummary, FinancialGoal, ExpenseCategory, UserProfile } from './types';
import Header from './components/Header';
import PortfolioCard from './components/PortfolioCard';
import AddPortfolioModal from './components/AddPortfolioModal';
import AddExpenseModal from './components/AddExpenseModal';
import ExpenseChart from './components/ExpenseChart';
import SubscriptionCard from './components/SubscriptionCard';
import PortfolioDetail from './views/PortfolioDetail';
import { PlusIcon } from './components/icons/PlusIcon';
import Summary from './components/Summary';
import SettingsView from './views/SettingsView';
import PortfolioComparisonView from './views/PortfolioComparisonView';
import { TrashIcon } from './components/icons/TrashIcon';
import ConfirmationModal from './components/ConfirmationModal';
import { WalletIcon } from './components/icons/WalletIcon';
import SavingsCard from './components/SavingsCard';
import WithdrawToSavingsModal from './components/WithdrawToSavingsModal';
import ExpenseCategoryFilter from './components/ExpenseCategoryFilter';
import ProfileView from './views/ProfileView';
import LoginView from './views/LoginView';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

const DEFAULT_PROFILE: UserProfile = {
    name: 'مستخدم جديد',
    email: 'user@example.com',
    phone: '',
    country: '',
    city: '',
    avatar: '',
};

const App: React.FC = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [savingsBalance, setSavingsBalance] = useState<number>(0);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState<View>(View.Portfolios);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
    const [isAddPortfolioModalOpen, setAddPortfolioModalOpen] = useState(false);
    const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
    const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [sortKey, setSortKey] = useState<string>('default');
    const [filterKey, setFilterKey] = useState<string>('all');
    const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<ExpenseCategory | 'الكل'>('الكل');
    
    // Notification State
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
        const saved = localStorage.getItem('notificationsEnabled');
        return saved ? JSON.parse(saved) : true; // Default to enabled
    });
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);
    
    // Confirmation Modal State
    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });


    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }
        setIsLoading(false);

        const savedPortfoliosRaw = localStorage.getItem('portfolios');
        if (savedPortfoliosRaw) {
            let parsedPortfolios: any[] = JSON.parse(savedPortfoliosRaw);
            const migratedPortfolios = parsedPortfolios.map((p: any) => {
                if (!p.financialGoals) {
                    p.financialGoals = [];
                    if (p.financialGoal) { 
                        p.financialGoals.push({
                            id: crypto.randomUUID(),
                            name: 'الهدف الأول',
                            amount: p.financialGoal,
                            achieved: p.currentCapital >= p.financialGoal,
                            notified: p.goalReachedNotified || false,
                        });
                    }
                    delete p.financialGoal;
                    delete p.goalReachedNotified;
                }
                p.financialGoals = p.financialGoals.map((g: any) => ({
                    id: g.id || crypto.randomUUID(),
                    name: g.name || 'هدف',
                    amount: g.amount || 0,
                    achieved: g.achieved !== undefined ? g.achieved : (p.currentCapital >= g.amount),
                    notified: g.notified !== undefined ? g.notified : false,
                }));
                if (!p.withdrawals) p.withdrawals = [];
                return p;
            });
            setPortfolios(migratedPortfolios as Portfolio[]);
        }

        const savedExpensesRaw = localStorage.getItem('expenses');
        if (savedExpensesRaw) {
            let parsedExpenses: any[] = JSON.parse(savedExpensesRaw);
            const migratedExpenses = parsedExpenses.map(e => ({
                ...e,
                category: e.category || 'أخرى'
            }));
            setExpenses(migratedExpenses as Expense[]);
        }

        const savedSavings = localStorage.getItem('savingsBalance');
        if (savedSavings) {
            setSavingsBalance(JSON.parse(savedSavings));
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem('portfolios', JSON.stringify(portfolios));
    }, [portfolios]);
    
    useEffect(() => {
        localStorage.setItem('savingsBalance', JSON.stringify(savingsBalance));
    }, [savingsBalance]);

    useEffect(() => {
        if (profile) {
            localStorage.setItem('userProfile', JSON.stringify(profile));
        }
    }, [profile]);

    useEffect(() => {
        let wasChanged = false;
        const updatedPortfolios = portfolios.map(p => {
            let goalsChanged = false;
            const updatedGoals = p.financialGoals.map(goal => {
                const newGoal = { ...goal };
                if (p.currentCapital >= goal.amount) {
                    if (!newGoal.achieved) {
                        newGoal.achieved = true;
                        goalsChanged = true;
                        if (!newGoal.notified) {
                             if (notificationsEnabled && notificationPermission === 'granted') {
                                 new Notification('✨ تم الوصول للهدف!', {
                                    body: `تهانينا! لقد وصلت محفظة "${p.name}" إلى هدفها "${goal.name}".`,
                                    icon: '/vite.svg'
                                });
                            }
                            newGoal.notified = true;
                        }
                    }
                } else {
                    if (newGoal.achieved) {
                        newGoal.achieved = false;
                        newGoal.notified = false;
                        goalsChanged = true;
                    }
                }
                return newGoal;
            });
    
            if (goalsChanged) {
                wasChanged = true;
                return { ...p, financialGoals: updatedGoals };
            }
            return p;
        });
    
        if (wasChanged) {
            setPortfolios(updatedPortfolios);
        }
    }, [portfolios, notificationsEnabled, notificationPermission]);

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    useEffect(() => {
        localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
    }, [notificationsEnabled]);
    
    const requestNotificationPermission = async () => {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };
    
    const closeConfirmation = () => {
        setConfirmation({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    };

    const addPortfolio = (name: string, initialCapital: number, financialGoal: number, currency: string) => {
        const newPortfolio: Portfolio = {
            id: crypto.randomUUID(),
            name,
            initialCapital,
            currentCapital: initialCapital,
            financialGoals: [{
                id: crypto.randomUUID(),
                name: "الهدف الأول",
                amount: financialGoal,
                achieved: initialCapital >= financialGoal,
                notified: false,
            }],
            trades: [],
            currency,
            withdrawals: [],
        };
        setPortfolios([...portfolios, newPortfolio]);
        setAddPortfolioModalOpen(false);
    };
    
    const deletePortfolio = (idToDelete: string, name: string) => {
        setConfirmation({
            isOpen: true,
            title: `حذف محفظة "${name}"`,
            message: 'هل أنت متأكد من رغبتك في حذف هذه المحفظة؟ سيتم حذف جميع الصفقات المرتبطة بها بشكل نهائي. المصروفات المسحوبة من هذه المحفظة ستبقى.',
            onConfirm: () => {
                setPortfolios(portfolios.filter(p => p.id !== idToDelete));
                // Old expenses are kept, but unlinked visually
                setExpenses(expenses.map(e => e.portfolioId === idToDelete ? { ...e, portfolioId: undefined, portfolioName: `${e.portfolioName} (محذوفة)` } : e));
                closeConfirmation();
            },
        });
    };
    
    const updatePortfolioDetails = (portfolioId: string, newDetails: { financialGoals?: FinancialGoal[], name?: string }) => {
        setPortfolios(portfolios.map(p => {
            if (p.id === portfolioId) {
                let updatedPortfolio = { ...p };
                
                if (newDetails.name !== undefined) {
                    updatedPortfolio.name = newDetails.name;
                    
                    // Update old expense records with the new portfolio name
                    setExpenses(prevExpenses => prevExpenses.map(expense => 
                        expense.portfolioId === portfolioId ? { ...expense, portfolioName: newDetails.name! } : expense
                    ));
                }

                if (newDetails.financialGoals !== undefined) {
                    updatedPortfolio.financialGoals = newDetails.financialGoals;
                }

                updatedPortfolio.financialGoals = updatedPortfolio.financialGoals.map(goal => ({
                    ...goal,
                    achieved: updatedPortfolio.currentCapital >= goal.amount,
                    notified: (updatedPortfolio.currentCapital < goal.amount) ? false : goal.notified
                }));
                
                return updatedPortfolio;
            }
            return p;
        }));
    };

    const addCapitalToPortfolio = (portfolioId: string, amountToAdd: number) => {
        setPortfolios(portfolios.map(p => {
            if (p.id === portfolioId) {
                const newInitialCapital = p.initialCapital + amountToAdd;
                return {
                    ...p,
                    initialCapital: newInitialCapital,
                    currentCapital: p.currentCapital + amountToAdd,
                };
            }
            return p;
        }));
    };

    const addTrade = (portfolioId: string, tradeData: Omit<Trade, 'id' | 'portfolioId' | 'status' | 'openDate'>) => {
        setPortfolios(portfolios.map(p => {
            if (p.id === portfolioId) {
                if (p.currentCapital < tradeData.tradeValue) {
                    alert("رصيد المحفظة غير كافٍ لفتح هذه الصفقة!");
                    return p;
                }
                const newTrade: Trade = {
                    ...tradeData,
                    id: crypto.randomUUID(),
                    portfolioId: p.id,
                    status: 'open',
                    openDate: new Date().toLocaleDateString('en-GB'), 
                };
                return { 
                    ...p, 
                    trades: [newTrade, ...p.trades],
                    currentCapital: p.currentCapital - tradeData.tradeValue
                };
            }
            return p;
        }));
    };
    
    const closeTrade = (portfolioId: string, tradeId: string, closePrice: number) => {
        setPortfolios(portfolios.map(p => {
            if (p.id === portfolioId) {
                const tradeToClose = p.trades.find(t => t.id === tradeId);
                if (!tradeToClose || tradeToClose.status !== 'open') return p;

                const capitalToReturn = tradeToClose.tradeValue * (closePrice / tradeToClose.purchasePrice);
                const profitLoss = capitalToReturn - tradeToClose.tradeValue;
                const profitLossPercent = (profitLoss / tradeToClose.tradeValue) * 100;

                if (notificationsEnabled && notificationPermission === 'granted') {
                    const SIGNIFICANT_THRESHOLD = 50;
                    if (profitLossPercent >= SIGNIFICANT_THRESHOLD) {
                        new Notification('🚀 ربح كبير!', {
                            body: `صفقة "${tradeToClose.stockName}" في محفظة "${p.name}" حققت ربحًا كبيرًا بنسبة ${profitLossPercent.toFixed(1)}%!`,
                            icon: '/vite.svg'
                        });
                    } else if (profitLossPercent <= -SIGNIFICANT_THRESHOLD) {
                        new Notification('📉 خسارة كبيرة', {
                            body: `صفقة "${tradeToClose.stockName}" في محفظة "${p.name}" تعرضت لخسارة كبيرة بنسبة ${Math.abs(profitLossPercent).toFixed(1)}%!`,
                            icon: '/vite.svg'
                        });
                    }
                }

                const updatedTrade: Trade = {
                    ...tradeToClose,
                    status: 'closed',
                    closePrice: closePrice,
                    closeDate: new Date().toLocaleDateString('en-GB'),
                    outcome: profitLoss >= 0 ? 'profit' : 'loss',
                };

                return {
                    ...p,
                    currentCapital: p.currentCapital + capitalToReturn,
                    trades: p.trades.map(t => t.id === tradeId ? updatedTrade : t),
                };
            }
            return p;
        }));
    };
    
    const deleteTrade = (portfolioId: string, tradeId: string) => {
        const portfolio = portfolios.find(p => p.id === portfolioId);
        const trade = portfolio?.trades.find(t => t.id === tradeId);
        if (!trade) return;

        setConfirmation({
            isOpen: true,
            title: `حذف صفقة "${trade.stockName}"`,
            message: 'هل أنت متأكد من حذف هذه الصفقة؟ هذا الإجراء سيؤثر على رصيد المحفظة ولا يمكن التراجع عنه.',
            onConfirm: () => {
                setPortfolios(portfolios.map(p => {
                    if (p.id === portfolioId) {
                        const tradeToDelete = p.trades.find(t => t.id === tradeId);
                        if (!tradeToDelete) return p;
            
                        let capitalAdjustment = 0;
                        if (tradeToDelete.status === 'open') {
                            capitalAdjustment = tradeToDelete.tradeValue;
                        } else if (tradeToDelete.status === 'closed' && tradeToDelete.closePrice) { 
                            const profitLoss = (tradeToDelete.closePrice * (tradeToDelete.tradeValue / tradeToDelete.purchasePrice)) - tradeToDelete.tradeValue;
                            capitalAdjustment = -profitLoss; 
                        }
                        
                        return {
                            ...p,
                            currentCapital: p.currentCapital + capitalAdjustment,
                            trades: p.trades.filter(t => t.id !== tradeId),
                        };
                    }
                    return p;
                }));
                closeConfirmation();
            },
        });
    };

    const updateTrade = (portfolioId: string, tradeId: string, newDetails: Partial<Omit<Trade, 'id' | 'portfolioId'>>) => {
        setPortfolios(portfolios.map(p => {
            if (p.id === portfolioId) {
                let capitalAdjustment = 0;
                const updatedTrades = p.trades.map(t => {
                    if (t.id === tradeId && t.status === 'open') {
                        if (newDetails.tradeValue !== undefined && newDetails.tradeValue !== t.tradeValue) {
                            capitalAdjustment = t.tradeValue - newDetails.tradeValue; // refund old value, subtract new
                        }
                        return { ...t, ...newDetails };
                    }
                    return t;
                });

                if (p.currentCapital + capitalAdjustment < 0) {
                    alert("لا يمكن تعديل قيمة الصفقة. رصيد المحفظة غير كافٍ.");
                    return p;
                }

                return {
                    ...p,
                    trades: updatedTrades,
                    currentCapital: p.currentCapital + capitalAdjustment
                };
            }
            return p;
        }));
    };

    const addExpense = (description: string, amount: number, category: ExpenseCategory) => {
        if (savingsBalance >= amount) {
            const newExpense: Expense = {
                id: crypto.randomUUID(),
                description,
                amount,
                date: new Date().toLocaleDateString('ar-EG'),
                category,
            };
            setExpenses([newExpense, ...expenses]);
            setSavingsBalance(prev => prev - amount);
            setAddExpenseModalOpen(false);
        } else {
            alert("رصيد المدخرات غير كافٍ!");
        }
    };
    
    const deleteExpense = (expenseId: string) => {
        const expenseToDelete = expenses.find(e => e.id === expenseId);
        if (!expenseToDelete) return;

        const message = expenseToDelete.portfolioId
            ? 'هل أنت متأكد من حذف هذا المصروف؟ سيتم إعادة المبلغ إلى المحفظة الأصلية.'
            : 'هل أنت متأكد من حذف هذا المصروف؟ سيتم إعادة المبلغ إلى رصيد المدخرات.';

        setConfirmation({
            isOpen: true,
            title: `حذف مصروف "${expenseToDelete.description}"`,
            message: message,
            onConfirm: () => {
                if (expenseToDelete.portfolioId) {
                    setPortfolios(portfolios.map(p => {
                        if (p.id === expenseToDelete.portfolioId) {
                            return { ...p, currentCapital: p.currentCapital + expenseToDelete.amount };
                        }
                        return p;
                    }));
                } else {
                    setSavingsBalance(prev => prev + expenseToDelete.amount);
                }
                setExpenses(expenses.filter(e => e.id !== expenseId));
                closeConfirmation();
            },
        });
    };

    const withdrawToSavings = (portfolioId: string, amount: number) => {
        const portfolio = portfolios.find(p => p.id === portfolioId);
        if (portfolio && portfolio.currentCapital >= amount) {
            setPortfolios(portfolios.map(p => {
                if (p.id === portfolioId) {
                    const newWithdrawals = [...(p.withdrawals || []), { amount, date: new Date().toLocaleDateString('en-GB') }];
                    return { ...p, currentCapital: p.currentCapital - amount, withdrawals: newWithdrawals };
                }
                return p;
            }));
            setSavingsBalance(prev => prev + amount);
            setWithdrawModalOpen(false);
        } else {
            alert("رصيد المحفظة غير كافٍ!");
        }
    };

    const handleViewPortfolio = (id: string) => {
        setSelectedPortfolioId(id);
        setActiveView(View.PortfolioDetail);
    };

    const handleBackToPortfolios = () => {
        setSelectedPortfolioId(null);
        setActiveView(View.Portfolios);
    }
    
    const handleSaveProfile = (updatedProfile: UserProfile) => {
        setProfile(updatedProfile);
        setActiveView(View.Portfolios);
    };

    const handleLogin = (user: { name: string; email: string; avatar?: string }) => {
        const newProfile: UserProfile = {
            ...DEFAULT_PROFILE,
            name: user.name,
            email: user.email,
            avatar: user.avatar || '',
        };
        setProfile(newProfile);
    };
    
    const handleLogout = () => {
        setConfirmation({
            isOpen: true,
            title: 'تسجيل الخروج',
            message: 'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
            onConfirm: () => {
                localStorage.removeItem('userProfile');
                setProfile(null);
                closeConfirmation();
            },
        });
    };


    const handleResetAllData = () => {
        setConfirmation({
            isOpen: true,
            title: 'حذف جميع البيانات',
            message: 'هل أنت متأكد من رغبتك في إعادة تعيين التطبيق؟ سيتم حذف جميع المحافظ والصفقات والمصروفات والمدخرات بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.',
            onConfirm: () => {
                localStorage.clear();
                window.location.reload();
            },
        });
    };

    const handleExportData = () => {
        try {
            const portfoliosData = localStorage.getItem('portfolios') || '[]';
            const expensesData = localStorage.getItem('expenses') || '[]';
            const savingsData = localStorage.getItem('savingsBalance') || '0';
            const profileData = localStorage.getItem('userProfile') || '{}';
    
            const dataToExport = {
                profile: JSON.parse(profileData),
                portfolios: JSON.parse(portfoliosData),
                expenses: JSON.parse(expensesData),
                savingsBalance: JSON.parse(savingsData),
            };
    
            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
    
            const a = document.createElement('a');
            a.href = url;
            a.download = `smart-wallet-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error("Failed to export data:", error);
            alert("فشل تصدير البيانات.");
        }
    };
    
    const handleImportData = (fileContent: string) => {
        try {
            const data = JSON.parse(fileContent);
    
            if (!data || !data.portfolios || !data.expenses) {
                throw new Error("ملف غير صالح أو تالف.");
            }
            
            setConfirmation({
                isOpen: true,
                title: 'تأكيد استيراد البيانات',
                message: 'هل أنت متأكد من رغبتك في استيراد البيانات؟ سيتم الكتابة فوق جميع بياناتك الحالية.',
                onConfirm: () => {
                    setPortfolios(data.portfolios || []);
                    setExpenses(data.expenses || []);
                    setSavingsBalance(data.savingsBalance || 0);
                    setProfile(data.profile || DEFAULT_PROFILE);
                    alert("تم استيراد البيانات بنجاح!");
                    setActiveView(View.Portfolios);
                    closeConfirmation();
                },
            });
        } catch (error) {
            console.error("Failed to import data:", error);
            alert(`فشل استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
        }
    };
    
    const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
    
    const summaryDataByCurrency = useMemo<SummaryData>(() => {
        const summary: { [key: string]: CurrencySummary } = {};

        portfolios.forEach(p => {
            if (!summary[p.currency]) {
                summary[p.currency] = {
                    totalInitialCapital: 0,
                    totalCurrentCapital: 0,
                    totalProfitLoss: 0,
                    totalProfitLossPercent: 0,
                    totalClosedTrades: 0,
                };
            }
            summary[p.currency].totalInitialCapital += p.initialCapital;
            summary[p.currency].totalCurrentCapital += p.currentCapital;
            summary[p.currency].totalClosedTrades += p.trades.filter(t => t.status === 'closed').length;
        });

        Object.keys(summary).forEach(currency => {
            const data = summary[currency];
            data.totalProfitLoss = data.totalCurrentCapital - data.totalInitialCapital;
            data.totalProfitLossPercent = data.totalInitialCapital > 0 ? (data.totalProfitLoss / data.totalInitialCapital) * 100 : 0;
        });
        return summary;
    }, [portfolios]);

    const subscriptionPlans: SubscriptionPlan[] = [
        { name: "الباقة البرونزية", price: "50$/شهرياً", features: ["تحليلات أساسية للسوق", "توصيات تداول محدودة", "دعم عبر البريد الإلكتروني"], color: "bg-yellow-800/50" },
        { name: "الباقة الفضية", price: "100$/شهرياً", features: ["جميع مزايا البرونزية", "تحليلات متقدمة", "توصيات تداول يومية", "مجموعة خاصة"], color: "bg-gray-500/50" },
        { name: "الباقة الذهبية", price: "200$/شهرياً", features: ["جميع مزايا الفضية", "جلسات تداول حية", "استشارات خاصة", "دعم فوري"], color: "bg-yellow-500/50" },
    ];

    const filteredAndSortedPortfolios = useMemo(() => {
        let result = [...portfolios];

        if (filterKey === 'profit') {
            result = result.filter(p => p.currentCapital >= p.initialCapital);
        } else if (filterKey === 'loss') {
            result = result.filter(p => p.currentCapital < p.initialCapital);
        }

        switch (sortKey) {
            case 'name_asc':
                result.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
                break;
            case 'name_desc':
                result.sort((a, b) => b.name.localeCompare(a.name, 'ar'));
                break;
            case 'initialCapital_desc':
                result.sort((a, b) => b.initialCapital - a.initialCapital);
                break;
            case 'initialCapital_asc':
                result.sort((a, b) => a.initialCapital - b.initialCapital);
                break;
            case 'currentCapital_desc':
                result.sort((a, b) => b.currentCapital - a.currentCapital);
                break;
            case 'currentCapital_asc':
                result.sort((a, b) => a.currentCapital - b.currentCapital);
                break;
            case 'profit_desc':
                result.sort((a, b) => (b.currentCapital - b.initialCapital) - (a.currentCapital - a.initialCapital));
                break;
            case 'loss_desc':
                result.sort((a, b) => (a.currentCapital - a.initialCapital) - (b.currentCapital - b.initialCapital));
                break;
            default:
                break;
        }

        return result;
    }, [portfolios, sortKey, filterKey]);

    const filteredExpenses = useMemo(() => {
        if (expenseCategoryFilter === 'الكل') return expenses;
        return expenses.filter(e => e.category === expenseCategoryFilter);
    }, [expenses, expenseCategoryFilter]);


    const renderContent = () => {
        const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId);

        if (activeView === View.PortfolioDetail && selectedPortfolio) {
            return <PortfolioDetail 
                        portfolio={selectedPortfolio} 
                        profile={profile}
                        onBack={handleBackToPortfolios}
                        onAddTrade={(tradeData) => addTrade(selectedPortfolio.id, tradeData)}
                        onCloseTrade={(tradeId, closePrice) => closeTrade(selectedPortfolio.id, tradeId, closePrice)}
                        onDeleteTrade={(tradeId) => deleteTrade(selectedPortfolio.id, tradeId)}
                        onUpdateDetails={(details) => updatePortfolioDetails(selectedPortfolio.id, details)}
                        onUpdateTrade={(tradeId, details) => updateTrade(selectedPortfolio.id, tradeId, details)}
                        onAddCapital={(amount) => addCapitalToPortfolio(selectedPortfolio.id, amount)}
                    />;
        }

        switch (activeView) {
            case View.Profile:
                return <ProfileView profile={profile!} onSave={handleSaveProfile} />;
            case View.Comparison:
                return <PortfolioComparisonView portfolios={portfolios} />;
            case View.Expenses:
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-cyan-400">المصروفات</h2>
                        </div>

                        <div className="mb-6">
                            <SavingsCard 
                                balance={savingsBalance} 
                                currency="EGP" // Assuming EGP for savings for now
                                onWithdraw={() => setWithdrawModalOpen(true)} 
                            />
                        </div>

                        <div className="mb-4">
                            <ExpenseCategoryFilter 
                                selectedCategory={expenseCategoryFilter}
                                onSelectCategory={setExpenseCategoryFilter}
                            />
                        </div>

                        <div className="mb-8 flex justify-start">
                            <button onClick={() => setAddExpenseModalOpen(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                <PlusIcon />
                                إضافة مصروف
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                            <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col justify-center items-center">
                                <h3 className="text-xl font-semibold mb-4 text-gray-300">المدخرات مقابل المصروفات</h3>
                                <ExpenseChart savingsBalance={savingsBalance} totalExpenses={totalExpenses} />
                            </div>
                            <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-semibold mb-4 text-gray-300">سجل المصروفات</h3>
                                <div className="max-h-[400px] overflow-y-auto pr-2">
                                    {filteredExpenses.length > 0 ? filteredExpenses.map(expense => {
                                        return (
                                        <div key={expense.id} className="bg-gray-900 p-4 rounded-lg mb-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-lg">{expense.description}</p>
                                                <p className="text-sm text-gray-400">{expense.category} - {expense.date}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-red-400 text-xl font-bold">{expense.amount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', numberingSystem: 'arab' } as any)}</p>
                                                <button onClick={() => deleteExpense(expense.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                    )}) : <p className="text-gray-400 text-center py-8">لا يوجد مصروفات تطابق هذا التصنيف.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case View.Subscriptions:
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">باقات الاشتراك</h2>
                        <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">اختر الباقة التي تناسب احتياجاتك واحصل على بيانات تداول حصرية لمساعدتك في تحقيق أهدافك الاستثمارية.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {subscriptionPlans.map(plan => <SubscriptionCard key={plan.name} plan={plan} />)}
                        </div>
                    </div>
                );
            case View.Settings:
                return <SettingsView 
                            onExport={handleExportData} 
                            onImport={handleImportData}
                            notificationsEnabled={notificationsEnabled}
                            onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
                            notificationPermission={notificationPermission}
                            onRequestNotificationPermission={requestNotificationPermission}
                            onResetData={handleResetAllData}
                        />;
            case View.Portfolios:
            default:
                const filterButtonClass = (key: string) => `px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                    filterKey === key ? 'bg-cyan-500 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-700'
                }`;

                return (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <div className="w-full text-right">
                                <h2 className="text-3xl font-bold text-white">
                                    {profile?.name ? `أهلاً ${profile.name}` : 'جميع المحافظ'}
                                </h2>
                                {profile?.name && <p className="text-gray-400 mt-1">نظرة عامة على جميع محافظك.</p>}
                            </div>
                            <button onClick={() => setAddPortfolioModalOpen(true)} className="flex-shrink-0 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                <PlusIcon />
                                إضافة محفظة جديدة
                            </button>
                        </div>

                        <Summary summaryData={summaryDataByCurrency} />

                        {portfolios.length > 0 ? (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-6 gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gray-300">عرض:</span>
                                        <div className="bg-gray-900 rounded-full p-1 flex">
                                            <button onClick={() => setFilterKey('all')} className={filterButtonClass('all')}>الكل</button>
                                            <button onClick={() => setFilterKey('profit')} className={filterButtonClass('profit')}>رابحة</button>
                                            <button onClick={() => setFilterKey('loss')} className={filterButtonClass('loss')}>خاسرة</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="sort-select" className="font-semibold text-gray-300 shrink-0">ترتيب حسب:</label>
                                        <select 
                                            id="sort-select" 
                                            value={sortKey} 
                                            onChange={e => setSortKey(e.target.value)}
                                            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500"
                                        >
                                            <option value="default">الترتيب الافتراضي</option>
                                            <option value="name_asc">الاسم (أ - ي)</option>
                                            <option value="name_desc">الاسم (ي - أ)</option>
                                            <option value="initialCapital_desc">رأس المال المبدئي (الأعلى)</option>
                                            <option value="initialCapital_asc">رأس المال المبدئي (الأقل)</option>
                                            <option value="currentCapital_desc">رأس المال الحالي (الأعلى)</option>
                                            <option value="currentCapital_asc">رأس المال الحالي (الأقل)</option>
                                            <option value="profit_desc">الأكثر ربحاً</option>
                                            <option value="loss_desc">الأكثر خسارةً</option>
                                        </select>
                                    </div>
                                </div>
                                {filteredAndSortedPortfolios.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {filteredAndSortedPortfolios.map(p => <PortfolioCard key={p.id} portfolio={p} onViewDetails={handleViewPortfolio} onDelete={deletePortfolio} />)}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-gray-800/50 rounded-xl">
                                        <h3 className="text-2xl font-semibold text-gray-300">لا توجد محافظ تطابق معايير البحث</h3>
                                        <p className="text-gray-400 mt-2">حاول تغيير خيارات الفلترة.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-gray-800/50 rounded-xl">
                                <h3 className="text-2xl font-semibold text-gray-300">لم تقم بإنشاء أي محافظ بعد</h3>
                                <p className="text-gray-400 mt-2 mb-6">ابدأ بإنشاء محفظتك الأولى لتتبع استثماراتك.</p>
                                <button onClick={() => setAddPortfolioModalOpen(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors mx-auto">
                                    <PlusIcon />
                                    إضافة محفظة جديدة
                                </button>
                            </div>
                        )}
                    </div>
                );
        }
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <SpinnerIcon className="w-12 h-12" />
            </div>
        );
    }
    
    if (!profile) {
        return <LoginView onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <div className="flex-grow">
                <div className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-sm py-4">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                                  <WalletIcon className="w-6 h-6 text-gray-900" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-wider hidden sm:block">المحفظة الذكية</h1>
                            </div>
                             {activeView !== View.Profile && <Header 
                                activeView={activeView!} 
                                setActiveView={setActiveView} 
                                profile={profile}
                                onLogout={handleLogout}
                             />}
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                    <main className="pt-8">
                        {renderContent()}
                    </main>
                </div>
            </div>
            
            <footer className="text-center py-4 text-gray-500 text-sm border-t border-gray-800">
                هذا التطبيق من تطوير <a href="https://www.facebook.com/moutaz.adel" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">معتز عادل</a>
            </footer>

            {isAddPortfolioModalOpen && <AddPortfolioModal onClose={() => setAddPortfolioModalOpen(false)} onAdd={addPortfolio} />}
            {isAddExpenseModalOpen && <AddExpenseModal savingsBalance={savingsBalance} onClose={() => setAddExpenseModalOpen(false)} onAdd={addExpense} />}
            {isWithdrawModalOpen && <WithdrawToSavingsModal portfolios={portfolios} onClose={() => setWithdrawModalOpen(false)} onWithdraw={withdrawToSavings} />}
            <ConfirmationModal 
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={confirmation.onConfirm}
                onClose={closeConfirmation}
            />
        </div>
    );
};

export default App;