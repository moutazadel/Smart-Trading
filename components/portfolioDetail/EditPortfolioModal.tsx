import React, { useState } from 'react';

interface EditPortfolioModalProps {
    initialName: string;
    onClose: () => void;
    onSave: (newName: string) => void;
}

const EditPortfolioModal: React.FC<EditPortfolioModalProps> = ({ initialName, onClose, onSave }) => {
    const [name, setName] = useState(initialName);

    const handleSave = () => {
        if (!name.trim()) {
            alert("اسم المحفظة لا يمكن أن يكون فارغًا.");
            return;
        }
        onSave(name.trim());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6 text-center text-cyan-400">تعديل اسم المحفظة</h2>

                <div>
                    <label htmlFor="portfolioName" className="block text-sm font-medium text-gray-300 mb-2">الاسم الجديد</label>
                    <input
                        id="portfolioName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="أدخل الاسم الجديد للمحفظة"
                    />
                </div>

                <div className="flex justify-between gap-4 mt-8">
                    <button onClick={handleSave} className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">حفظ</button>
                    <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                </div>
            </div>
        </div>
    );
};

export default EditPortfolioModal;
