import React from 'react';
import { View } from '../types';
import { WalletIcon } from './icons/WalletIcon';
import { ChartIcon } from './icons/ChartIcon';
import { GroupIcon } from './icons/GroupIcon';
import { CogIcon } from './icons/CogIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
    
    const navItems = [
        { id: View.Portfolios, label: "جميع المحافظ", icon: <WalletIcon /> },
        { id: View.Comparison, label: "مقارنة", icon: <ScaleIcon /> },
        { id: View.Expenses, label: "المصروفات", icon: <ChartIcon /> },
        { id: View.Subscriptions, label: "الاشتراكات", icon: <GroupIcon /> },
        { id: View.Profile, label: "الملف الشخصي", icon: <UserIcon /> },
        { id: View.Settings, label: "الإعدادات", icon: <CogIcon /> },
    ];
    
    return (
        <nav>
            <div className="hidden md:flex bg-gray-900 rounded-full p-1 items-center">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-2 ${
                            activeView === item.id ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>
             <div className="flex md:hidden bg-gray-900 rounded-full p-1 items-center justify-around">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        title={item.label}
                        onClick={() => setActiveView(item.id)}
                        className={`p-3 text-sm font-semibold rounded-full transition-colors ${
                            activeView === item.id ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {item.icon}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Header;
