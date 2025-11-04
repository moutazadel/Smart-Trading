

import React, { useState, useEffect, useMemo } from 'react';
import { Trade, Quote } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { ArrowTrendingUpIcon } from '../icons/ArrowTrendingUpIcon';
import { ArrowTrendingDownIcon } from '../icons/ArrowTrendingDownIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { fetchStockQuote } from '../../services/marketApi';
import { RefreshIcon } from '../icons/RefreshIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';


interface TradeCardProps {
    trade: Trade;
    currency: string;
    onOpenCloseModal: (trade: Trade) => void;
    onDelete: (tradeId: string) => void;
    onOpenEditModal: (trade: Trade) => void;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, currency, onOpenCloseModal, onDelete, onOpenEditModal }) => {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuote = async () => {
        setIsLoading(true);
        setError(null);
        const { data, error } = await fetchStockQuote(trade.stockName);
        if (error) {
            setError(error);
        }
        setQuote(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchQuote();
    }, [trade.stockName]);

    const unrealizedPnl = useMemo(() => {
        if (!quote || quote.c === 0) return null;
        const currentMarketValue = (trade.tradeValue / trade.purchasePrice) * quote.c;
        return currentMarketValue - trade.tradeValue;
    }, [quote, trade]);


    const formatSpecialCurrency = (amount: number) => {
        // FIX: Cast options to `any` to allow `numberingSystem` which is a valid but sometimes untyped property.
        const num = amount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2, numberingSystem: 'arab' } as any);
        if (currency === 'EGP') return `${num} م.ج`;
        return `${num} ${currency}`;
    };
    
    const formatDate = (isoString: string) => {
        if (!isoString) return 'غير محدد';
        const date = new Date(isoString);
        const year = new Intl.NumberFormat('ar-EG-u-nu-arab', { useGrouping: false }).format(date.getFullYear());
        const month = new Intl.NumberFormat('ar-EG-u-nu-arab', { useGrouping: false }).format(date.getMonth() + 1);
        const day = new Intl.NumberFormat('ar-EG-u-nu-arab', { useGrouping: false }).format(date.getDate());
        return `${year}/${month}/${day}`;
    };

    const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
        return num.toLocaleString('ar-EG', {
            useGrouping: false,
            numberingSystem: 'arab',
            ...options,
        } as any);
    };

    const quantity = trade.tradeValue / trade.purchasePrice;

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-yellow-400">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                {/* Right Group (Stock Info) */}
                <div className="flex-[2] text-right">
                    <p className="font-bold text-xl text-yellow-400">{trade.stockName.toUpperCase()}</p>
                    <p className="text-sm text-gray-300">
                        {formatNumber(quantity, {maximumFractionDigits: 2})} سهم بسعر {formatNumber(trade.purchasePrice, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </p>
                </div>

                {/* Middle Group (Date & Value) */}
                <div className="flex-[1.5] text-right sm:text-center sm:px-4">
                    <p className="text-gray-400 text-sm">{formatDate(trade.openDate)}</p>
                    <p className="font-bold text-white text-lg">{formatSpecialCurrency(trade.tradeValue)}</p>
                </div>

                {/* Left Group (TP/SL) */}
                <div className="flex-[2] text-right sm:text-left space-y-1">
                    <div className="flex items-center sm:justify-end gap-2 text-green-400 font-semibold">
                        <span>{formatNumber(trade.takeProfit, {minimumFractionDigits: 2})}</span>
                        <ArrowTrendingUpIcon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center sm:justify-end gap-2 text-red-400 font-semibold">
                        <span>{formatNumber(trade.stopLoss, {minimumFractionDigits: 2})}</span>
                        <ArrowTrendingDownIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-300">بيانات السوق الحية</h4>
                        <button onClick={fetchQuote} disabled={isLoading} className="text-gray-400 hover:text-cyan-400 disabled:text-gray-600 disabled:cursor-wait p-1 rounded-full hover:bg-gray-700">
                            {isLoading ? <SpinnerIcon className="w-4 h-4" /> : <RefreshIcon className="w-4 h-4" />}
                        </button>
                    </div>
                    {error && <span className="text-xs text-yellow-500">{error}</span>}
                </div>
                {isLoading ? (
                    <div className="text-center text-sm text-gray-500 py-2">جاري تحميل السعر...</div>
                ) : quote ? (
                    <div className="flex justify-between items-center text-sm">
                        <div className="text-right">
                            <span className="text-gray-400">السعر الحالي: </span>
                            <span className="font-bold text-white">{formatNumber(quote.c, {minimumFractionDigits: 2})}</span>
                        </div>
                        {unrealizedPnl !== null && (
                            <div className="text-left">
                                <span className="text-gray-400">ربح/خسارة غير محققة: </span>
                                <span className={`font-bold ${unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatSpecialCurrency(unrealizedPnl)}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-sm text-gray-500 py-2">{error ? '' : 'لا توجد بيانات حية.'}</div>
                )}
            </div>

            <hr className="border-gray-700 my-3" />

            {/* Actions */}
            <div className="flex justify-start items-center gap-2">
                <button onClick={() => onOpenCloseModal(trade)} className="bg-yellow-500 text-black font-bold text-sm px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors">إغلاق</button>
                <button onClick={() => onOpenEditModal(trade)} className="text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-gray-700"><PencilIcon /></button>
                <button onClick={() => onDelete(trade.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-700"><TrashIcon /></button>
            </div>
        </div>
    );
};

export default TradeCard;