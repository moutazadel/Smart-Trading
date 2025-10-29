import React, { useState } from 'react';
import { FinancialGoal } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';

interface FinancialGoalsModalProps {
    goals: FinancialGoal[];
    onClose: () => void;
    onSave: (goals: FinancialGoal[]) => void;
}

const FinancialGoalsModal: React.FC<FinancialGoalsModalProps> = ({ goals: initialGoals, onClose, onSave }) => {
    const [goals, setGoals] = useState<FinancialGoal[]>(() => JSON.parse(JSON.stringify(initialGoals)));

    const handleAddGoal = () => {
        setGoals([...goals, {
            id: crypto.randomUUID(),
            name: '',
            amount: 0,
            achieved: false,
            notified: false,
        }]);
    };

    const handleUpdateGoal = (id: string, field: 'name' | 'amount', value: string) => {
        setGoals(goals.map(goal => {
            if (goal.id === id) {
                if (field === 'amount') {
                    const amount = parseFloat(value);
                    return { ...goal, amount: isNaN(amount) ? 0 : amount };
                }
                return { ...goal, [field]: value };
            }
            return goal;
        }));
    };

    const handleDeleteGoal = (id: string) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const handleSaveChanges = () => {
        for (const goal of goals) {
            if (!goal.name.trim()) {
                alert('يجب أن يكون لجميع الأهداف اسم.');
                return;
            }
            if (goal.amount <= 0) {
                alert('يجب أن تكون المبالغ المستهدفة أكبر من صفر.');
                return;
            }
        }
        const sortedGoals = [...goals].sort((a, b) => a.amount - b.amount);
        onSave(sortedGoals);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-2 text-center text-cyan-400">إدارة الأهداف المالية</h2>
                <p className="text-sm text-gray-400 mb-6 text-center">قم بإضافة وتعديل أهدافك. سيتم ترتيبها تلقائيًا حسب المبلغ.</p>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                    {goals.map((goal, index) => (
                        <div key={goal.id} className="flex items-center gap-3">
                            <span className="bg-gray-700 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">{index + 1}</span>
                            <div className="flex-grow">
                                <label className="text-xs text-gray-400">اسم الهدف</label>
                                <input
                                    type="text"
                                    value={goal.name}
                                    onChange={(e) => handleUpdateGoal(goal.id, 'name', e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                                    placeholder="مثال: الهدف الأول"
                                />
                            </div>
                            <div className="w-32">
                                <label className="text-xs text-gray-400">المبلغ المستهدف</label>
                                <input
                                    type="number"
                                    value={goal.amount || ''}
                                    onChange={(e) => handleUpdateGoal(goal.id, 'amount', e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                                    placeholder="1000"
                                />
                            </div>
                            <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 mt-4">
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddGoal}
                    className="w-full mt-4 py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <PlusIcon />
                    إضافة هدف جديد
                </button>

                <div className="flex justify-between gap-4 mt-8">
                    <button onClick={handleSaveChanges} className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">حفظ التعديلات</button>
                    <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                </div>
            </div>
        </div>
    );
};

export default FinancialGoalsModal;