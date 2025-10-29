import React from 'react';
import { ExpenseCategory } from '../types';

// Import all category icons
import { Squares2X2Icon } from './icons/Squares2X2Icon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { RestaurantIcon } from './icons/RestaurantIcon';
import { TruckIcon } from './icons/TruckIcon';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { TicketIcon } from './icons/TicketIcon';
import { HomeIcon } from './icons/HomeIcon';
import { HeartIcon } from './icons/HeartIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { ArrowsRightLeftIcon } from './icons/ArrowsRightLeftIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { GiftIcon } from './icons/GiftIcon';
import { HandThumbUpIcon } from './icons/HandThumbUpIcon';
import { TagIcon } from './icons/TagIcon';

interface ExpenseCategoryFilterProps {
    selectedCategory: ExpenseCategory | 'الكل';
    onSelectCategory: (category: ExpenseCategory | 'الكل') => void;
}

const categoryIcons: { [key in ExpenseCategory | 'الكل']: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'الكل': Squares2X2Icon,
    'بقالة': ShoppingCartIcon,
    'تسوق': ShoppingBagIcon,
    'مطاعم': RestaurantIcon,
    'مواصلات': TruckIcon,
    'سفر': GlobeAltIcon,
    'ترفيه': TicketIcon,
    'مرافق': HomeIcon,
    'خدمات صحية': HeartIcon,
    'خدمات': WrenchScrewdriverIcon,
    'تحويلات': ArrowsRightLeftIcon,
    'سحب نقدي': BanknotesIcon,
    'هدايا': GiftIcon,
    'تبرعات': HandThumbUpIcon,
    'أخرى': TagIcon,
};

const categories: (ExpenseCategory | 'الكل')[] = ['الكل', 'بقالة', 'تسوق', 'مطاعم', 'مواصلات', 'سفر', 'ترفيه', 'مرافق', 'خدمات صحية', 'خدمات', 'تحويلات', 'سحب نقدي', 'هدايا', 'تبرعات', 'أخرى'];

const ExpenseCategoryFilter: React.FC<ExpenseCategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="bg-gray-800/50 p-3 rounded-xl">
             <h3 className="text-lg font-semibold text-white mb-3 px-2">التصنيفات</h3>
             <div className="flex flex-wrap gap-2">
                {categories.map(category => {
                    const Icon = categoryIcons[category];
                    const isSelected = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            title={category}
                            className={`flex flex-col items-center justify-center text-center p-2 rounded-lg w-20 h-20 transition-all duration-200
                                ${isSelected ? 'bg-cyan-500 text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}
                            `}
                        >
                            <Icon className="w-8 h-8 mb-1" />
                            <span className="text-xs font-medium">{category}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ExpenseCategoryFilter;