import React, { useState } from 'react';

interface AddPortfolioModalProps {
    onClose: () => void;
    onAdd: (name: string, initialCapital: number, financialGoal: number, currency: string) => void;
}

interface ConfirmationData {
    name: string;
    initialCapital: number;
    financialGoal: number;
    currency: string;
}

const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [initialCapital, setInitialCapital] = useState('');
    const [financialGoal, setFinancialGoal] = useState('');
    const [currency, setCurrency] = useState('EGP');
    const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const capital = parseFloat(initialCapital);
        const goal = parseFloat(financialGoal);
        
        let alertMessage = '';
        if (!name.trim()) {
            alertMessage = "الرجاء إدخال اسم للمحفظة.";
        } else if (isNaN(capital) || capital <= 0) {
            alertMessage = "الرجاء إدخال رأس مال مبدئي إيجابي وصحيح.";
        } else if (isNaN(goal) || goal <= 0) {
            alertMessage = "الرجاء إدخال هدف مالي إيجابي وصحيح.";
        } else if (goal <= capital) {
            alertMessage = "يجب أن يكون الهدف المالي أكبر من رأس المال المبدئي.";
        }
        
        if (alertMessage) {
            alert(alertMessage);
        } else {
            setConfirmationData({ name: name.trim(), initialCapital: capital, financialGoal: goal, currency });
        }
    };

    const handleConfirm = () => {
        if (confirmationData) {
            onAdd(
                confirmationData.name,
                confirmationData.initialCapital,
                confirmationData.financialGoal,
                confirmationData.currency
            );
        }
    };
    
    const formatSimpleNumber = (num: number) => {
        // Use 'en-US' locale to ensure standard numerals with grouping, as seen in the screenshot.
        return num.toLocaleString('en-US'); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
                {!confirmationData ? (
                    <>
                        <h2 className="text-2xl font-bold mb-8 text-cyan-400 text-center">إعداد محفظة جديدة</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="portfolioName" className="block text-sm font-medium text-gray-300 mb-2">اسم المحفظة</label>
                                <input
                                    type="text"
                                    id="portfolioName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                                    placeholder="مثال: محفظتي للتداول اليومي"
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="initialCapital" className="block text-sm font-medium text-gray-300 mb-2">رأس المال المبدئي</label>
                                    <input
                                        type="number"
                                        id="initialCapital"
                                        value={initialCapital}
                                        onChange={(e) => setInitialCapital(e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                                        placeholder="مثال: 1000"
                                        required
                                        min="0.01"
                                        step="0.01"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-2">العملة</label>
                                    <div className="relative">
                                        <select
                                            id="currency"
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 appearance-none focus:ring-cyan-500 focus:border-cyan-500"
                                        >
                                            <option value="EGP">EGP - جنيه مصري</option>
                                            <option value="USD">USD - دولار أمريكي</option>
                                            <option value="EUR">EUR - يورو</option>
                                            <option value="GBP">GBP - جنيه إسترليني</option>
                                            <option value="SAR">SAR - ريال سعودي</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
                                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="financialGoal" className="block text-sm font-medium text-gray-300 mb-2">الهدف المالي الأول</label>
                                <input
                                    type="number"
                                    id="financialGoal"
                                    value={financialGoal}
                                    onChange={(e) => setFinancialGoal(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                                    placeholder="مثال: 5000"
                                    required
                                    min="1"
                                    step="0.01"
                                />
                            </div>
                            
                            <div className="flex justify-between gap-4 pt-4">
                                <button type="submit" className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">ابدأ التتبع</button>
                                <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-yellow-400">تأكيد بدء المحفظة</h2>
                        <p className="text-gray-300 mb-8 text-center leading-relaxed">
                            هل أنت متأكد من رغبتك في بدء محفظة جديدة برأس مال
                            مبدئي {formatSimpleNumber(confirmationData.initialCapital)} وهدف أولي {formatSimpleNumber(confirmationData.financialGoal)}؟
                        </p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={handleConfirm} 
                                className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors"
                            >
                                نعم، ابدأ
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setConfirmationData(null)} 
                                className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddPortfolioModal;