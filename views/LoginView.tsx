
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This effect will run once the component is mounted
    useEffect(() => {
        // Check if the google object is available
        if (window.google) {
            /*
             * ==============================================================================
             * ملاحظة هامة للمطور: خطأ "origin_mismatch"
             * ==============================================================================
             * إذا واجهت خطأ "Error 400: origin_mismatch" عند محاولة تسجيل الدخول،
             * فهذا يعني أن عنوان URL الذي يعمل عليه تطبيقك حاليًا غير مسموح به
             * في إعدادات Google Cloud Console.
             *
             * لحل هذه المشكلة، اتبع الخطوات التالية:
             * 1. انسخ عنوان URL الكامل من شريط عنوان المتصفح (مثل: https://....aistudio.google.com).
             * 2. اذهب إلى Google Cloud Console: https://console.cloud.google.com/
             * 3. انتقل إلى "APIs & Services" > "Credentials".
             * 4. ابحث عن "OAuth 2.0 Client ID" الذي تستخدمه (الذي يبدأ بـ '483439...').
             * 5. انقر على اسم الـ Client ID لتعديله.
             * 6. في قسم "Authorized JavaScript origins"، انقر على "ADD URI".
             * 7. الصق عنوان URL الذي نسخته في الخطوة 1.
             * 8. انقر على "Save".
             *
             * قد يستغرق تطبيق التغييرات بضع دقائق. بعد ذلك، يجب أن يعمل تسجيل الدخول بنجاح.
             * ==============================================================================
             */
            window.google.accounts.id.initialize({
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">مرحباً بك في المحفظة الذكية</h2>
                <p className="text-gray-400 mb-8">سجل الدخول أو أنشئ حسابًا جديدًا باستخدام جوجل للبدء.</p>
                
                {isSubmitting ? (
                     <div className="flex items-center justify-center gap-3 text-white py-3">
                        <SpinnerIcon className="w-6 h-6" />
                        <span>جاري تسجيل الدخول...</span>
                    </div>
                ) : (
                    <div id="google-signin-button" className="flex justify-center transition-transform hover:scale-105"></div>
                )}
            </div>
             <footer className="absolute bottom-0 text-center py-4 text-gray-500 text-sm">
                هذا التطبيق من تطوير <a href="https://www.facebook.com/moutaz.adel" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">معتز عادل</a>
            </footer>
        </div>
    );
};

export default LoginView;