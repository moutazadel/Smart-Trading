import React, { useState, useMemo, useEffect } from 'react';
import { Trade } from '../../types';

interface CloseTradeModalProps {
    trade: Trade;
    currency: string;
    onClose: () => void;
    onConfirm: (tradeId: string, closePrice: number) => void;
}

const CloseTradeModal: React.FC<CloseTradeModalProps> = ({ trade, currency, onClose, onConfirm }) => {
    const [customAmount, setCustomAmount] = useState('');
    const [closeOption, setCloseOption] = useState<'tp' | 'sl' | 'custom' | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [finalClosePrice, setFinalClosePrice] = useState<number | null>(null);
    const [calculatedClosePrice, setCalculatedClosePrice] = useState<number | null>(null);


    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ar-EG', { style: 'currency', currency: currency, minimumFractionDigits: 2, numberingSystem: 'arab' } as any);
    };
    
    const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
        return num.toLocaleString('ar-EG', {
            useGrouping: false,
            numberingSystem: 'arab',
            ...options,
        } as any);
    };

    const { profitAtTP, lossAtSL, quantity } = useMemo(() => {
        const quantity = trade.tradeValue / trade.purchasePrice;
        const profitAtTP = (trade.takeProfit * quantity) - trade.tradeValue;
        const lossAtSL = (trade.stopLoss * quantity) - trade.tradeValue;
        return { profitAtTP, lossAtSL, quantity };
    }, [trade]);
    
    const finalProfitLoss = useMemo(() => {
        if (finalClosePrice === null) return 0;
        const capitalToReturn = trade.tradeValue * (finalClosePrice / trade.purchasePrice);
        return capitalToReturn - trade.tradeValue;
    }, [finalClosePrice, trade]);

    useEffect(() => {
        if (closeOption === 'custom') {
            const customProfitLoss = parseFloat(customAmount.trim());
            if (!isNaN(customProfitLoss) && quantity > 0) {
                const derivedClosePrice = (customProfitLoss + trade.tradeValue) / quantity;
                if (derivedClosePrice > 0) {
                    setCalculatedClosePrice(derivedClosePrice);
                } else {
                    setCalculatedClosePrice(null);
                }
            } else {
                setCalculatedClosePrice(null);
            }
        } else {
            setCalculatedClosePrice(null);
        }
    }, [customAmount, closeOption, trade.tradeValue, quantity]);

    const handleInitiateConfirm = () => {
        let closePrice = 0;
        
        if (closeOption === 'tp') {
            closePrice = trade.takeProfit;
        } else if (closeOption === 'sl') {
            closePrice = trade.stopLoss;
        } else if (closeOption === 'custom') {
            const customAmountStr = customAmount.trim();
            if (customAmountStr === '') {
                alert("الرجاء إدخال قيمة مخصصة للربح أو الخسارة.");
                return;
            }
            const customProfitLoss = parseFloat(customAmountStr);
            if (isNaN(customProfitLoss)) {
                alert("القيمة المخصصة المدخلة ليست رقمًا صالحًا. الرجاء إدخال رقم.");
                return;
            }

            const derivedClosePrice = (customProfitLoss + trade.tradeValue) / quantity;

            if (derivedClosePrice <= 0) {
                alert("سعر الإغلاق المحسوب بناءً على القيمة المدخلة سيكون صفرًا أو سالبًا. الرجاء إدخال قيمة ربح/خسارة منطقية.");
                return;
            }
            closePrice = derivedClosePrice;
        } else {
            // This case should not happen with the new useEffect flow for tp/sl
            return;
        }

        setFinalClosePrice(closePrice);
        setShowConfirmation(true);
    };

    useEffect(() => {
        if (closeOption === 'tp' || closeOption === 'sl') {
            handleInitiateConfirm();
        }
    }, [closeOption]);


    const isConfirmDisabled = useMemo(() => {
        // This button is now only for custom values.
        if (closeOption !== 'custom') {
            return true;
        }
        const customAmountStr = customAmount.trim();
        if (customAmountStr === '' || isNaN(parseFloat(customAmountStr))) {
            return true;
        }
        return false;
    }, [closeOption, customAmount]);


    const handleFinalConfirm = () => {
        if (finalClosePrice !== null) {
            onConfirm(trade.id, finalClosePrice);
        }
    };
    
    const getButtonClass = (option: 'tp' | 'sl') => {
        const baseClass = "flex-1 p-3 rounded-lg text-white font-bold transition-all transform hover:scale-105";
        const colorClass = option === 'tp' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500';
        const borderClass = closeOption === option ? 'ring-4 ring-cyan-400 scale-105' : 'ring-2 ring-transparent';
        return `${baseClass} ${colorClass} ${borderClass}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4 transform transition-all text-center relative" onClick={e => e.stopPropagation()}>
                
                <div style={{ visibility: showConfirmation ? 'hidden' : 'visible' }}>
                    <h2 className="text-xl font-bold mb-2 text-white">إغلاق صفقة: <span className="text-cyan-400">{trade.stockName.toUpperCase()}</span></h2>
                    <p className="text-sm text-gray-400 mb-6">اختر إغلاق الصفقة بسعر الربح/الخسارة المحدد مسبقًا, أو أدخل قيمة مخصصة.</p>
                    
                    <div className="flex gap-4 mb-4">
                        <button 
                            className={getButtonClass('tp')} 
                            onClick={() => {
                                setCloseOption('tp');
                                setCustomAmount('');
                            }}
                        >
                            <p>تأكيد الربح</p>
                            <p className="text-sm font-normal">({formatCurrency(profitAtTP)})</p>
                        </button>
                        <button 
                            className={getButtonClass('sl')} 
                            onClick={() => {
                                setCloseOption('sl');
                                setCustomAmount('');
                            }}
                        >
                            <p>تأكيد الخسارة</p>
                            <p className="text-sm font-normal">({formatCurrency(lossAtSL)})</p>
                        </button>
                    </div>

                    <div className="relative my-6">
                        <hr className="border-slate-600"/>
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 px-2 text-gray-400 text-sm">أو</span>
                    </div>

                    <div>
                        <label htmlFor="customAmount" className="block text-sm font-medium text-gray-300 mb-2">إغلاق بقيمة مخصصة</label>
                        <input
                            type="number"
                            id="customAmount"
                            value={customAmount}
                            onFocus={() => setCloseOption('custom')}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setCloseOption('custom');
                            }}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 text-center focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="50 للربح, -25 للخسارة"
                        />
                         {calculatedClosePrice !== null && (
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                يعادل سعر إغلاق تقريبي: {formatNumber(calculatedClosePrice, {minimumFractionDigits: 2})} {currency}
                            </p>
                        )}
                    </div>
                    
                    <div className="flex justify-between gap-4 mt-8">
                        <button 
                            onClick={handleInitiateConfirm} 
                            disabled={isConfirmDisabled}
                            className={`flex-1 py-3 px-4 text-white font-bold rounded-lg transition-colors ${
                                isConfirmDisabled 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-cyan-500 hover:bg-cyan-600'
                            }`}
                        >
                            إضافة وتأكيد
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                    </div>
                </div>

                {/* Confirmation Overlay */}
                {showConfirmation && (
                    <div className="absolute inset-0 bg-slate-800 flex flex-col justify-center items-center p-6 rounded-xl">
                        <h3 className="text-2xl font-bold text-yellow-400 mb-4">تأكيد إغلاق الصفقة</h3>
                        <p className="text-gray-300 mb-4">هل أنت متأكد من رغبتك في إغلاق هذه الصفقة؟</p>
                        
                        <div className="bg-slate-900/50 p-3 rounded-lg w-full mb-6 text-right">
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-gray-400">النتيجة النهائية:</span>
                                <span className={`font-bold ${finalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatCurrency(finalProfitLoss)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">بسعر إغلاق:</span>
                                <span className="font-bold text-white">
                                    {formatNumber(finalClosePrice!, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {currency}
                                </span>
                            </div>
                        </div>

                        <div className="flex w-full gap-4">
                            <button onClick={handleFinalConfirm} className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">نعم، أغلق الصفقة</button>
                            <button onClick={() => setShowConfirmation(false)} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CloseTradeModal;