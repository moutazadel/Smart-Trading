import React, { useState } from 'react';
import { Portfolio } from '../../types';
import { ArrowsPathIcon } from '../icons/ArrowsPathIcon';
import { BanknotesIcon } from '../icons/BanknotesIcon';

interface ManageCapitalModalProps {
    portfolio: Portfolio;
    onClose: () => void;
    onAdjustCapital: (amountToAdjust: number) => void;
    onResetCapital: (newCapital: number) => void;
}

const ManageCapitalModal: React.FC<ManageCapitalModalProps> = ({ portfolio, onClose, onAdjustCapital, onResetCapital }) => {
    const [mode, setMode] = useState<'adjust' | 'reset'>('adjust');
    const [amount, setAmount] = useState('');

    const handleAdjust = () => {
        const adjustAmount = parseFloat(amount);
        if (isNaN(adjustAmount) || adjustAmount === 0) {
            alert("الرجاء إدخال مبلغ صحيح غير صفري للتعديل.");
            return;
        }
        onAdjustCapital(adjustAmount);
        onClose();
    };

    const handleReset = () => {
        const newCapital = parseFloat(amount);
        if (isNaN(newCapital) || newCapital <= 0) {
            alert("الرجاء إدخال مبلغ رأس مال جديد وصحيح وموجب.");
            return;
        }
        onResetCapital(newCapital);
        onClose();
    };
    
    const handleSubmit = () => {
        if (mode === 'adjust') {
            handleAdjust();
        } else {
            handleReset();
        }
    };

    const getTabClass = (tabMode: 'adjust' | 'reset') => {
        return `flex-1 py-3 px-4 font-semibold text-center transition-colors rounded-t-lg flex items-center justify-center gap-2 ${
            mode === tabMode 
            ? 'bg-slate-800 text-cyan-400' 
            : 'bg-slate-900 text-gray-400 hover:bg-slate-700'
        }`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-md mx-4 transform" onClick={e => e.stopPropagation()}>
                <div className="flex">
                    <button onClick={() => { setMode('adjust'); setAmount(''); }} className={getTabClass('adjust')}>
                        <BanknotesIcon className="w-5 h-5" />
                        إيداع / سحب
                    </button>
                    <button onClick={() => { setMode('reset'); setAmount(''); }} className={getTabClass('reset')}>
                        <ArrowsPathIcon className="w-5 h-5" />
                        إعادة تعيين رأس المال
                    </button>
                </div>
                
                <div className="bg-slate-800 p-6 rounded-b-xl">
                    {mode === 'adjust' ? (
                        <div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">تعديل رأس المال</h3>
                            <p className="text-sm text-gray-400 mb-6 text-center">
                                أدخل مبلغًا للإيداع (موجب) أو للسحب (سالب). سيتم الحفاظ على صافي الربح/الخسارة.
                            </p>
                            <label htmlFor="adjustAmount" className="block text-sm font-medium text-gray-300 mb-2">المبلغ المراد تعديله</label>
                            <input
                                type="number"
                                id="adjustAmount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder={`مثال: 500 للإيداع, -200 للسحب`}
                            />
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">إعادة تعيين رأس المال المبدئي</h3>
                            <p className="text-sm text-gray-400 mb-6 text-center">
                                أدخل قيمة جديدة لرأس المال المبدئي. سيتم تصفير الربح/الخسارة والبدء من جديد.
                            </p>
                            <label htmlFor="resetAmount" className="block text-sm font-medium text-gray-300 mb-2">رأس المال المبدئي الجديد</label>
                            <input
                                type="number"
                                id="resetAmount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder={`رأس المال الحالي: ${portfolio.currentCapital.toLocaleString('ar-EG', { numberingSystem: 'arab' } as any)}`}
                                min="0.01"
                                step="0.01"
                            />
                        </div>
                    )}

                    <div className="flex justify-between gap-4 pt-6">
                        <button onClick={handleSubmit} className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">تأكيد</button>
                        <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCapitalModal;
