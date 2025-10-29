import React from 'react';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { MoonIcon } from '../icons/MoonIcon';
import { PencilIcon } from '../icons/PencilIcon';

interface DetailHeaderProps {
    portfolioName: string;
    onEditName: () => void;
    userEmail?: string;
    userAvatar?: string;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ portfolioName, onEditName, userEmail, userAvatar }) => {
    return (
        <header className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-cyan-400">{portfolioName}</h1>
                <button 
                    onClick={onEditName} 
                    className="text-gray-400 hover:text-cyan-400 transition-colors p-1" 
                    title="تعديل اسم المحفظة"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-gray-300 hidden sm:block">{userEmail || '...'}</span>
                 {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                )}
                <button className="text-gray-400 hover:text-white">
                    <MoonIcon />
                </button>
            </div>
        </header>
    );
};

export default DetailHeader;