
import React from 'react';
import { SubscriptionPlan } from '../types';

interface SubscriptionCardProps {
    plan: SubscriptionPlan;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ plan }) => {
    return (
        <div className={`border border-gray-700 rounded-xl p-6 flex flex-col ${plan.color} backdrop-blur-sm shadow-lg`}>
            <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-center mb-6 text-cyan-400">{plan.price}</p>
            <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => alert(`تم اختيار ${plan.name}`)}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-auto"
            >
                اشترك الآن
            </button>
        </div>
    );
};

export default SubscriptionCard;
