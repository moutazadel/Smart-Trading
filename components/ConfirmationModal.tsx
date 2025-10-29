import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    
    // Use a neutral/positive color for general confirmation, reserving red for destructive actions.
    const isDestructive = title.toLowerCase().includes('delete') || title.includes('حذف');
    const confirmButtonClass = isDestructive 
        ? 'bg-red-600 hover:bg-red-700' 
        : 'bg-cyan-500 hover:bg-cyan-600';


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" 
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all text-center" 
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">{title}</h2>
                <p className="text-gray-300 mb-8">{message}</p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={onConfirm} 
                        className={`flex-1 py-3 px-4 text-white font-bold rounded-lg transition-colors ${confirmButtonClass}`}
                    >
                        نعم، تأكيد
                    </button>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;