import React, { useState } from 'react';
import { Portfolio } from '../types';

interface WithdrawToSavingsModalProps {
    portfolios: Portfolio[];
    onClose: () => void;
    onWithdraw: (portfolioId: string, amount: number) => void;
}

const WithdrawToSavingsModal: React.FC<WithdrawToSavingsModalProps> = ({ portfolios, onClose, onWithdraw }) => {
    const [amount, setAmount] = useState('');
    const [selectedPortfolio, setSelectedPortfolio] = useState<string>(portfolios[0]?.id || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const withdrawAmount = parseFloat(amount);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0 || !selectedPortfolio) {
            alert("الرجاء ملء جميع الحقول بشكل صحيح.");
            return;
        }
        onWithdraw(selectedPortfolio, withdrawAmount);
    };
    
    if (portfolios.length === 0) {
        return (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
                <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                     <h2 className="text-2xl font-bold mb-6 text-center text-amber-400">لا يمكن السحب</h2>
                     <p className="text-gray-300 text-center mb-6">يجب عليك إنشاء محفظة استثمارية أولاً قبل أن تتمكن من السحب إلى المدخرات.</p>
                     <div className="flex justify-center">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors">حسنًا</button>
                     </div>
                </div>
            </div>
        )
    }

    const selectedPortfolioData = portfolios.find(p => p.id === selectedPortfolio);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-center text-pink-400">سحب إلى المدخرات</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300 mb-2">السحب من محفظة</label>
                        <select
                            id="portfolio"
                            value={selectedPortfolio}
                            onChange={(e) => setSelectedPortfolio(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                        >
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (الرصيد: {p.currentCapital.toLocaleString('ar-EG', { style: 'currency', currency: p.currency, minimumFractionDigits: 2, numberingSystem: 'arab' } as any)})</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">المبلغ</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="مثال: 500"
                            required
                            min="0.01"
                            step="0.01"
                            max={selectedPortfolioData?.currentCapital}
                        />
                         {selectedPortfolioData && <p className="text-xs text-gray-400 mt-2">الحد الأقصى للسحب: {selectedPortfolioData.currentCapital.toLocaleString('ar-EG', { style: 'currency', currency: selectedPortfolioData.currency, numberingSystem: 'arab' } as any)}</p>}
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                        <button type="submit" className="py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition-colors">تأكيد السحب</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawToSavingsModal;
