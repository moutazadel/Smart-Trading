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
    profile: UserProfile | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, profile, onLogout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Main navigation items, excluding Profile and Settings
    const navItems = [
        { id: View.Portfolios, label: "جميع المحافظ", icon: <WalletIcon /> },
        { id: View.Comparison, label: "مقارنة", icon: <ScaleIcon /> },
        { id: View.Expenses, label: "المصروفات", icon: <ChartIcon /> },
        { id: View.Subscriptions, label: "الاشتراكات", icon: <GroupIcon /> },
    ];
    
    // Effect to handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const ProfileButtonContent = () => (
        <>
            {profile?.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
                <UserIcon className="w-6 h-6" />
            )}
            <span className="hidden md:inline">{profile?.name || 'الملف الشخصي'}</span>
            <svg className={`w-4 h-4 ml-1 transition-transform hidden md:inline ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </>
    );

    return (
        <div className="flex items-center gap-2">
            <nav className="hidden md:flex bg-gray-900 rounded-full p-1 items-center">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-2 ${
                            activeView === item.id ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>
             <nav className="flex md:hidden bg-gray-900 rounded-full p-1 items-center justify-around">
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
            </nav>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold p-2 rounded-full transition-colors"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    {profile?.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <UserIcon className="w-6 h-6" />
                    )}
                     <span className="hidden md:inline pr-2">{profile?.name || 'الملف الشخصي'}</span>
                </button>

                {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl z-20 border border-slate-700">
                        <div className="p-2">
                             <div className="px-2 py-2 mb-1 border-b border-slate-700">
                                <p className="font-semibold text-white truncate">{profile?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
                             </div>
                             <button
                                onClick={() => { setActiveView(View.Profile); setDropdownOpen(false); }}
                                className="w-full text-right flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-slate-700 rounded-md"
                            >
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <span>الملف الشخصي</span>
                            </button>
                            <button
                                onClick={() => { setActiveView(View.Settings); setDropdownOpen(false); }}
                                className="w-full text-right flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-slate-700 rounded-md"
                            >
                                <CogIcon className="w-5 h-5 text-gray-400"/>
                                <span>الإعدادات</span>
                            </button>
                            <div className="border-t border-slate-700 my-1"></div>
                            <button
                                onClick={onLogout}
                                className="w-full text-right flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 rounded-md"
                            >
                                <LogoutIcon className="w-5 h-5"/>
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;