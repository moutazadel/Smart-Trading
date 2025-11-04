import React, { useState } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { auth } from '../firebaseConfig';
import 'firebase/compat/auth';

const LoginView: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEmailSubmitting(true);
        setError(null);

        try {
            if (isLoginView) {
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                await auth.createUserWithEmailAndPassword(email, password);
            }
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
            setIsEmailSubmitting(false);
        }
    };

    const isSubmitting = isEmailSubmitting;

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
                         {isEmailSubmitting ? <SpinnerIcon /> : null}
                         {isLoginView ? 'تسجيل الدخول' : 'إنشاء حساب'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={() => setIsLoginView(!isLoginView)} className="text-sm text-cyan-400 hover:underline">
                        {isLoginView ? 'ليس لديك حساب؟ أنشئ واحداً' : 'لديك حساب بالفعل؟ سجل الدخول'}
                    </button>
                </div>
                
                {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
            </div>
             <footer className="absolute bottom-0 text-center py-4 text-gray-400 text-sm">
                هذا التطبيق من تطوير <a href="https://www.facebook.com/moutaz.adel" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">معتز عادل</a>
            </footer>
        </div>
    );
};

export default LoginView;