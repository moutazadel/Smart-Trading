import React, { useState } from 'react';
import { Trade } from '../../types';

interface EditTradeModalProps {
    trade: Trade;
    currency: string;
    onClose: () => void;
    onSave: (tradeId: string, details: Partial<Omit<Trade, 'id' | 'portfolioId'>>) => void;
}

const EditTradeModal: React.FC<EditTradeModalProps> = ({ trade, currency, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        stockName: trade.stockName,
        purchasePrice: trade.purchasePrice.toString(),
        tradeValue: trade.tradeValue.toString(),
        stopLoss: trade.stopLoss.toString(),
        takeProfit: trade.takeProfit.toString(),
        notes: trade.notes || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const purchasePrice = parseFloat(formData.purchasePrice);
        const tradeValue = parseFloat(formData.tradeValue);
        const stopLoss = parseFloat(formData.stopLoss);
        const takeProfit = parseFloat(formData.takeProfit);
        
        if (isNaN(purchasePrice) || isNaN(tradeValue) || isNaN(stopLoss) || isNaN(takeProfit) || !formData.stockName.trim()) {
            alert('يرجى ملء جميع الحقول المطلوبة بأرقام صحيحة، باستثناء الملاحظات.');
            return;
        }

        if (purchasePrice <= 0 || tradeValue <= 0 || stopLoss <= 0 || takeProfit <= 0) {
            alert('يجب أن تكون القيم الرقمية أكبر من صفر.');
            return;
        }

        const newDetails: Partial<Omit<Trade, 'id' | 'portfolioId'>> = {
            stockName: formData.stockName.trim().toUpperCase(),
            purchasePrice,
            tradeValue,
            stopLoss,
            takeProfit,
            notes: formData.notes.trim(),
        };

        onSave(trade.id, newDetails);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">تعديل الصفقة: {trade.stockName}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-300">اسم السهم</label>
                        <input type="text" name="stockName" value={formData.stockName} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm text-gray-300">سعر الشراء</label>
                            <input type="number" step="any" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">قيمة الصفقة ({currency})</label>
                            <input type="number" step="any" name="tradeValue" value={formData.tradeValue} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm text-gray-300">سعر البيع (TP)</label>
                            <input type="number" step="any" name="takeProfit" value={formData.takeProfit} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">وقف الخسارة (SL)</label>
                            <input type="number" step="any" name="stopLoss" value={formData.stopLoss} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-300">ملاحظات (اختياري)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"></textarea>
                    </div>
                    <div className="flex justify-between gap-4 pt-4">
                        <button type="submit" className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">حفظ التغييرات</button>
                        <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTradeModal;
