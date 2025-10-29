import React, { useState } from 'react';
import { Portfolio } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';

interface UpdateCapitalModalProps {
    portfolio: Portfolio;
    onClose: () => void;
    onAddCapital: (amountToAdd: number) => void;
}

const UpdateCapitalModal: React.FC<UpdateCapitalModalProps> = ({ portfolio, onClose, onAddCapital }) => {
    const [amountToAdd, setAmountToAdd] = useState('');

    const handleAdd = () => {
        const amount = parseFloat(amountToAdd);
        if (isNaN(amount) || amount <= 0) {
            alert("الرجاء إدخال مبلغ صحيح للإضافة.");
            return;
        }
        onAddCapital(amount);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 transform" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="bg-cyan-500/20 p-2 rounded-full">
                                <PlusIcon className="w-6 h-6 text-cyan-400"/>
                            </div>
                            <h3 className="text-xl font-bold text-white">إضافة أموال جديدة للمحفظة</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-6 text-center">
                            سيتم زيادة كل من رأس المال المبدئي والحالي بنفس القيمة، مع الحفاظ على صافي الربح/الخسارة كما هو.
                        </p>
                        <label htmlFor="amountToAdd" className="block text-sm font-medium text-gray-300 mb-2">المبلغ المراد إضافته</label>
                        <input
                            type="number"
                            id="amountToAdd"
                            value={amountToAdd}
                            onChange={(e) => setAmountToAdd(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder={`مثال: 500 ${portfolio.currency}`}
                            min="0.01"
                            step="0.01"
                        />
                        <div className="flex justify-between gap-4 pt-6">
                            <button onClick={handleAdd} className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">إضافة المبلغ</button>
                            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCapitalModal;