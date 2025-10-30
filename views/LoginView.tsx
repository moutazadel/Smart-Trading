

import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { auth } from '../firebaseConfig';
// Fix: Import the firebase compat library to use v8 auth methods and providers, instead of v9 modular functions.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Fix: Declare 'google' on the Window object to resolve TypeScript errors for the Google Sign-In SDK.
declare global {
    interface Window {
        google: any;
    }
}

const LoginView: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            // Fix: Use the GoogleAuthProvider from the v8 compat firebase object.
            const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
            // Sign in with Firebase.
            // Fix: Use the signInWithCredential method from the v8 compat auth object.
            await auth.signInWithCredential(credential);
            // The onAuthStateChanged listener in App.tsx will handle the rest.
        } catch (error) {
            console.error("Firebase Google Auth Error:", error);
            setError("حدث خطأ أثناء تسجيل الدخول عبر جوجل. الرجاء المحاولة مرة أخرى.");
            setIsSubmitting(false);
        }
    };
    
    const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (isLoginView) {
                // Sign in logic
                // Fix: Use the signInWithEmailAndPassword method from the v8 compat auth object.
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                // Sign up logic
                // Fix: Use the createUserWithEmailAndPassword method from the v8 compat auth object.
                await auth.createUserWithEmailAndPassword(email, password);
            }
            // onAuthStateChanged in App.tsx will handle successful login/signup
        } catch (err: any) {
             switch (err.code) {
                case 'auth/user-not-found':
                    setError('هذا الحساب غير موجود. هل تريد إنشاء حساب جديد؟');
                    break;
                case 'auth/wrong-password':
                    setError('كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.');
                    break;
                case 'auth/email-already-in-use':
                    setError('هذا البريد الإلكتروني مستخدم بالفعل. هل تريد تسجيل الدخول؟');
                    break;
                case 'auth/invalid-email':
                     setError('صيغة البريد الإلكتروني غير صحيحة.');
                     break;
                case 'auth/weak-password':
                    setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
                    break;
                default:
                    setError('حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.');
                    break;
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                    {isLoginView ? 'مرحباً بعودتك!' : 'إنشاء حساب جديد'}
                </h2>
                <p className="text-gray-400 mb-8">
                    {isLoginView ? 'سجل الدخول للمتابعة إلى محفظتك الذكية.' : 'املأ البيانات التالية للبدء.'}
                </p>
                
                <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                     <div>
                        <input 
                            type="email" 
                            placeholder="البريد الإلكتروني"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 text-right"
                            required
                        />
                     </div>
                     <div>
                        <input 
                            type="password" 
                            placeholder="كلمة المرور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 text-right"
                            required
                        />
                     </div>
                     <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-cyan-700 disabled:cursor-wait"
                    >
                         {isSubmitting ? <SpinnerIcon /> : null}
                         {isLoginView ? 'تسجيل الدخول' : 'إنشاء حساب'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button onClick={() => setIsLoginView(!isLoginView)} className="text-sm text-cyan-400 hover:underline">
                        {isLoginView ? 'ليس لديك حساب؟ أنشئ واحداً' : 'لديك حساب بالفعل؟ سجل الدخول'}
                    </button>
                </div>

                <div className="relative my-6">
                    <hr className="border-slate-600"/>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 px-2 text-gray-400 text-sm">أو</span>
                </div>

                {isSubmitting && !email ? (
                     <div className="flex items-center justify-center gap-3 text-white py-3">
                        <SpinnerIcon className="w-6 h-6" />
                        <span>جاري تسجيل الدخول...</span>
                    </div>
                ) : (
                    <div id="google-signin-button" className="flex justify-center transition-transform hover:scale-105"></div>
                )}
                
                {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
            </div>
             <footer className="absolute bottom-0 text-center py-4 text-gray-500 text-sm">
                هذا التطبيق من تطوير <a href="https://www.facebook.com/moutaz.adel" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">معتز عادل</a>
            </footer>
        </div>
    );
};

export default LoginView;