import React, { useState } from 'react';
import { Portfolio, expenseCategories, ExpenseCategory } from '../types';

interface AddExpenseModalProps {
    savingsBalance: number;
    onClose: () => void;
    onAdd: (description: string, amount: number, category: ExpenseCategory) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ savingsBalance, onClose, onAdd }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('أخرى');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const expenseAmount = parseFloat(amount);
        if (description.trim() && !isNaN(expenseAmount) && expenseAmount > 0) {
            onAdd(description, expenseAmount, category);
        } else {
            alert("الرجاء ملء جميع الحقول بشكل صحيح.");
        }
    };
    
    // Exclude 'All' from the dropdown list
    const categoriesForDropdown = Object.keys(expenseCategories) as ExpenseCategory[];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-cyan-400">إضافة مصروف جديد</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">الوصف</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="مثال: فاتورة كهرباء"
                            required
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">المبلغ</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="مثال: 500"
                                required
                                min="0.01"
                                step="0.01"
                                max={savingsBalance}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">التصنيف</label>
                             <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 h-[42px] focus:ring-cyan-500 focus:border-cyan-500"
                            >
                                {categoriesForDropdown.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                     <p className="text-xs text-gray-400 mt-2 mb-6">الرصيد المتاح في المدخرات: {savingsBalance.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', numberingSystem: 'arab' } as any)}</p>
                    
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                        <button type="submit" className="py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">إضافة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;