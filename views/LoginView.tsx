import React, { useState } from 'react';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

interface LoginViewProps {
    onLogin: (user: { name: string; email: string; avatar?: string }) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const mockLogin = (email: string) => {
        setIsSubmitting(true);
        setError('');
        setTimeout(() => {
            const mockUser = {
                name: 'معتز عادل',
                email: email,
                avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8yOS8yM3EVR9UAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAABFElEQVR4nO3bQQ2AQBQEwZ3A/c1J3A2cxA38+A4ggZ4ke+1kEuBneAFAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCAAAECBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCBAQCAq5sAASsATp+xHJ4AAAAASUVORK5CYII='
            };
            onLogin(mockUser);
        }, 1500);
    };

    const handleGoogleLogin = () => {
        mockLogin('mo3taz.3adel@gmail.com');
    };

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
            return;
        }
        mockLogin(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
                <h2 className="text-3xl font-bold text-center text-white mb-6">تسجيل الدخول إلى محفظتك</h2>
                
                <button 
                    onClick={handleGoogleLogin} 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg shadow-md transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-70 disabled:cursor-wait"
                >
                    <GoogleIcon />
                    <span>تسجيل الدخول باستخدام جوجل</span>
                </button>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-slate-600" />
                    <span className="px-4 text-gray-400 text-sm">أو</span>
                    <hr className="flex-grow border-slate-600" />
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="you@example.com" 
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••" 
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500" 
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-cyan-700 disabled:cursor-wait"
                    >
                        {isSubmitting ? (
                            <>
                                <SpinnerIcon />
                                <span>جاري التحقق...</span>
                            </>
                        ) : 'تسجيل الدخول'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    ليس لديك حساب؟ <a href="#" className="font-semibold text-cyan-400 hover:underline">سجل الآن</a>
                </p>
            </div>
             <footer className="absolute bottom-0 text-center py-4 text-gray-500 text-sm">
                هذا التطبيق من تطوير <a href="https://www.facebook.com/moutaz.adel" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">معتز عادل</a>
            </footer>
        </div>
    );
};

export default LoginView;
