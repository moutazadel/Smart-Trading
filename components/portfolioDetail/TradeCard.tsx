

import React from 'react';
import { Trade } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { ArrowTrendingUpIcon } from '../icons/ArrowTrendingUpIcon';
import { ArrowTrendingDownIcon } from '../icons/ArrowTrendingDownIcon';
import { PencilIcon } from '../icons/PencilIcon';

interface TradeCardProps {
    trade: Trade;
    currency: string;
    onOpenCloseModal: (trade: Trade) => void;
    onDelete: (tradeId: string) => void;
    onOpenEditModal: (trade: Trade) => void;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, currency, onOpenCloseModal, onDelete, onOpenEditModal }) => {

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