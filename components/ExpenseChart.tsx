import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseChartProps {
    savingsBalance: number;
    totalExpenses: number;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ savingsBalance, totalExpenses }) => {
    const data = [
        { name: 'المدخرات المتبقية', value: Math.max(0, savingsBalance) },
        { name: 'إجمالي المصروفات', value: totalExpenses },
    ];
    const COLORS = ['#22d3ee', '#f87171'];

    if (savingsBalance <= 0 && totalExpenses <= 0) {
        return <div className="text-center text-gray-400">لا توجد بيانات لعرضها.</div>
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            borderColor: '#374151',
                            borderRadius: '0.5rem',
                        }}
                        formatter={(value: number) => [value.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', numberingSystem: 'arab' } as any), 'المبلغ']}
                    />
                    <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseChart;