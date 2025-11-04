import React, { useState, useEffect, useRef } from 'react';
import { View, UserProfile } from '../types';
import { WalletIcon } from './icons/WalletIcon';
import { ChartIcon } from './icons/ChartIcon';
import { GroupIcon } from './icons/GroupIcon';
import { CogIcon } from './icons/CogIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
    activeView: View;
    setActiveView: (view: View) => void;
    profile: UserProfile;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, profile, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { id: View.Portfolios, label: "جميع المحافظ", icon: <WalletIcon /> },
        { id: View.Comparison, label: "مقارنة", icon: <ScaleIcon /> },
        { id: View.Expenses, label: "المصروفات", icon: <ChartIcon /> },
        { id: View.Subscriptions, label: "الاشتراكات", icon: <GroupIcon /> },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);
    
    return (
        <nav className="flex items-center gap-2 sm:gap-4">
            {/* Main Navigation */}
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
            
             {/* Mobile Navigation */}
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

             {/* Profile Dropdown */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
                >
                    {profile.avatar ? (
                        <img src={profile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <UserIcon className="w-6 h-6 text-gray-300" />
                    )}
                </button>
                {isMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-lg border border-slate-700 py-1 z-30">
                        <div className="px-4 py-3 border-b border-slate-700">
                            <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                            <p className="text-xs text-gray-400 truncate">{profile.email}</p>
                        </div>
                        <div className="py-1">
                            <button onClick={() => { setActiveView(View.Profile); setIsMenuOpen(false); }} className="w-full text-right flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 transition-colors">
                                <UserIcon className="w-5 h-5" />
                                <span>الملف الشخصي</span>
                            </button>
                            <button onClick={() => { setActiveView(View.Settings); setIsMenuOpen(false); }} className="w-full text-right flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 transition-colors">
                                <CogIcon className="w-5 h-5" />
                                <span>الإعدادات</span>
                            </button>
                        </div>
                        <div className="border-t border-slate-700"></div>
                        <div className="py-1">
                             <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-right flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors">
                                <LogoutIcon className="w-5 h-5" />
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </nav>
    );
};

export default Header;