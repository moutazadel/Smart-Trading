
import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

// This is a simple function to decode the JWT token from Google
// In a real app, you would use a library like 'jwt-decode'
function jwtDecode<T>(token: string): T {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload) as T;
    } catch (e) {
        console.error("Failed to decode JWT", e);
        return {} as T;
    }
}

interface GoogleJwtPayload {
    name: string;
    email: string;
    picture: string;
}

interface LoginViewProps {
    onLogin: (user: { name: string; email: string; avatar?: string }) => void;
}

// Fix: Declare 'google' on the Window object to resolve TypeScript errors for the Google Sign-In SDK.
declare global {
    interface Window {
        google: any;
    }
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // This effect will run once the component is mounted
    useEffect(() => {
        // Check if the google object is available
        if (window.google) {
            window.google.accounts.id.initialize({
                // =================================================================
                // === تم وضع الـ CLIENT ID الخاص بك هنا ===
                // =================================================================
                client_id: '483439422637-h6n0tta8mv5hbhjhs5scu76d8e8h9mht.apps.googleusercontent.com',
                callback: handleGoogleCredentialResponse
            });

            // Render the Google Sign-In button
            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                { theme: 'outline', size: 'large', type: 'standard', text: 'continue_with', locale: 'ar' }
            );
        }
    }, []);

    const handleGoogleCredentialResponse = (response: any) => {
        setIsSubmitting(true);
        const userObject = jwtDecode<GoogleJwtPayload>(response.credential);
        
        const userProfile = {
            name: userObject.name,
            email: userObject.email,
            avatar: userObject.picture
        };

        onLogin(userProfile);
    };
    
    // This is still a mock function for email/password login
    const mockEmailLogin = () => {
        setIsSubmitting(true);
        setError('');
        setTimeout(() => {
            onLogin({ name: email.split('@')[0], email: email });
             setIsSubmitting(false);
        }, 1500);
    };


    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
            return;
        }
        mockEmailLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
                <h2 className="text-3xl font-bold text-center text-white mb-6">تسجيل الدخول إلى محفظتك</h2>
                
                {/* This div will hold the official Google button */}
                <div id="google-signin-button" className="flex justify-center mb-4 transition-transform hover:scale-105"></div>


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