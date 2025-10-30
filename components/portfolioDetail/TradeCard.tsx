import React, { useState } from 'react';
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

    const handleClose = () => {
        onOpenCloseModal(trade);
    };

    const handleDelete = () => {
        onDelete(trade.id);
    };

    const quantity = trade.tradeValue / trade.purchasePrice;
    const formattedOpenDate = new Date(trade.openDate).toLocaleDateString('ar-EG');

    return (
        <div className="bg-gray-900/70 p-4 rounded-lg flex items-center">
            {/* Right Part (in RTL) */}
            <div className="flex-1 text-right space-y-1">
                <p className="font-bold text-lg text-yellow-400">{trade.stockName.toUpperCase()}</p>
                <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">{formatNumber(quantity, {maximumFractionDigits: 2})}</span> سهم بسعر <span className="font-semibold text-white">{formatNumber(trade.purchasePrice, {minimumFractionDigits: 2})}</span>
                </p>
                <div 
                    className="flex items-center justify-end gap-1 text-green-400 font-semibold text-sm p-1" 
                >
                    <span>{formatNumber(trade.takeProfit, {minimumFractionDigits: 2})}</span>
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                </div>
            </div>

            {/* Middle Part */}
            <div className="flex-1 text-center text-sm space-y-1">
                <p className="text-gray-400">{formattedOpenDate}</p>
                <p className="text-white font-semibold">{formatCurrency(trade.tradeValue)}</p>
                 <div 
                    className="flex items-center justify-center gap-1 text-red-400 font-semibold p-1" 
                 >
                    <span>{formatNumber(trade.stopLoss, {minimumFractionDigits: 2})}</span>
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                </div>
            </div>

            {/* Left Part (in RTL) */}
            <div className="flex items-center gap-2">
                <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors p-2"><TrashIcon /></button>
                <button onClick={() => onOpenEditModal(trade)} className="text-gray-400 hover:text-cyan-400 transition-colors p-2"><PencilIcon /></button>
                <button onClick={handleClose} className="bg-yellow-500 text-black font-bold text-sm px-4 py-1.5 rounded-md hover:bg-yellow-60-colors">إغلاق</button>
            </div>
        </div>
    );
};

export default TradeCard;
