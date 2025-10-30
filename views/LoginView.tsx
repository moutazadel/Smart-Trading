
import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

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

// Fix: Declare 'google' on the Window object to resolve TypeScript errors for the Google Sign-In SDK.
declare global {
    interface Window {
        google: any;
    }
}

const LoginView: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // This effect will run once the component is mounted
    useEffect(() => {
        if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
                client_id: '483439422637-h6n0tta8mv5hbhjhs5scu76d8e8h9mht.apps.googleusercontent.com',
                callback: handleGoogleCredentialResponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                { theme: 'outline', size: 'large', type: 'standard', text: 'continue_with', locale: 'ar' }
            );
        }
    }, []);

    const handleGoogleCredentialResponse = async (response: any) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Create a Google credential with the token.
            const credential = GoogleAuthProvider.credential(response.credential);

            // Sign in with Firebase.
            await signInWithCredential(auth, credential);
            
            // The onAuthStateChanged listener in App.tsx will handle the rest.
        } catch (error) {
            console.error("Firebase Authentication Error:", error);
            setError("حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.");
            setIsSubmitting(false);
        }
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
                    <>
                        <div id="google-signin-button" className="flex justify-center transition-transform hover:scale-105"></div>
                        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
                    </>
                )}
            </div>
             <footer className="absolute bottom-0 text-center py-4 text-gray-500 text-sm">
                هذا التطبيق من تطوير <a href="https://www.facebook.com/moutaz.adel" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">معتز عادل</a>
            </footer>
        </div>
    );
};

export default LoginView;
