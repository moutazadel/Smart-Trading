export interface Trade {
  id: string;
  portfolioId: string;
  stockName: string;
  purchasePrice: number;
  tradeValue: number;
  stopLoss: number;
  takeProfit: number;
  notes?: string;
  status: 'open' | 'closed';
  closePrice?: number;
  outcome?: 'profit' | 'loss';
  openDate: string;
  closeDate?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  amount: number;
  achieved: boolean;
  notified: boolean;
}

export interface Portfolio {
  id: string;
  name: string;
  initialCapital: number;
  currentCapital: number;
  financialGoals: FinancialGoal[];
  trades: Trade[];
  currency: string;
  withdrawals?: { amount: number; date: string; }[];
}

export const expenseCategories = {
    'بقالة': 'Groceries',
    'تسوق': 'Shopping',
    'مطاعم': 'Restaurants',
    'مواصلات': 'Transportation',
    'سفر': 'Travel',
    'ترفيه': 'Entertainment',
    'مرافق': 'Utilities',
    'خدمات صحية': 'Health Services',
    'خدمات': 'Services',
    'تحويلات': 'Transfers',
    'سحب نقدي': 'Cash Withdrawal',
    'هدايا': 'Gifts',
    'تبرعات': 'Donations',
    'أخرى': 'Other',
} as const;

export type ExpenseCategory = keyof typeof expenseCategories;

export interface Expense {
  id: string;
  description: string;
  amount: number;
  portfolioId?: string;
  portfolioName?: string;
  date: string;
  category: ExpenseCategory;
}

export interface SubscriptionPlan {
    name: string;
    price: string;
    features: string[];
    color: string;
}

export interface CurrencySummary {
    totalInitialCapital: number;
    totalCurrentCapital: number;
    totalProfitLoss: number;
    totalProfitLossPercent: number;
    totalClosedTrades: number;
}

export interface SummaryData {
    [currency: string]: CurrencySummary;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  avatar?: string; // base64 string
}

export enum View {
    Profile = 'profile',
    Portfolios = 'portfolios',
    PortfolioDetail = 'portfolioDetail',
    Comparison = 'comparison',
    Expenses = 'expenses',
    Subscriptions = 'subscriptions',
    Settings = 'settings'
}

export interface ComparisonData {
    id: string;
    name: string;
    currency: string;
    initialCapital: number;
    currentCapital: number;
    totalProfitLoss: number;
    winRate: number;
    totalClosedTrades: number;
    avgTradeValue: number;
    roi: number;
    sharpeRatio: number;
}

export interface Quote {
    c: number; // current price
    d: number; // change
    dp: number; // percent change
    h: number; // high price of the day
    l: number; // low price of the day
    o: number; // open price of the day
    pc: number; // previous close price
}
