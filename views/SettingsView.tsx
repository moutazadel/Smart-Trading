import React, { useRef, useState } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

interface SettingsViewProps {
    onExport: () => void;
    onImport: (fileContent: string) => void;
    notificationsEnabled: boolean;
    onToggleNotifications: () => void;
    notificationPermission: NotificationPermission;
    onRequestNotificationPermission: () => void;
    onResetData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
    onExport, 
    onImport,
    notificationsEnabled,
    onToggleNotifications,
    notificationPermission,
    onRequestNotificationPermission,
    onResetData
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const input = event.target;
        if (!file) return;

        setIsImporting(true);

        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    onImport(text);
                }
            } finally {
                setIsImporting(false);
                if (input) input.value = '';
            }
        };

        reader.onerror = () => {
            try {
                alert('فشل في قراءة الملف.');
            } finally {
                setIsImporting(false);
                if (input) input.value = '';
            }
        };
        
        reader.readAsText(file);
    };

    const renderPermissionStatus = () => {
        switch (notificationPermission) {
            case 'granted':
                return <span className="text-sm text-green-400">الحالة: مسموح به</span>;
            case 'denied':
                return <span className="text-sm text-red-400">الحالة: محظور (غيّره من إعدادات المتصفح)</span>;
            default:
                return <span className="text-sm text-yellow-400">الحالة: يتطلب الإذن</span>;
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">الإعدادات</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Export Card */}
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
                    <h3 className="text-2xl font-semibold text-white mb-3">تصدير البيانات</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        قم بإنشاء نسخة احتياطية من جميع المحافظ والمصروفات الخاصة بك في ملف واحد. احتفظ بهذا الملف في مكان آمن لاستعادته لاحقًا.
                    </p>
                    <button
                        onClick={onExport}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        تصدير ملف النسخ الاحتياطي
                    </button>
                </div>

                {/* Import Card */}
                <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
                    <h3 className="text-2xl font-semibold text-white mb-3">استيراد البيانات</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        استعد بياناتك من ملف نسخ احتياطي. <strong className="text-yellow-400">تحذير:</strong> سيؤدي هذا إلى الكتابة فوق جميع بياناتك الحالية بشكل دائم.
                    </p>
                    <button
                        onClick={handleImportClick}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:bg-amber-700 disabled:cursor-wait"
                        disabled={isImporting}
                    >
                        {isImporting ? (
                            <>
                                <SpinnerIcon />
                                <span>جاري الاستيراد...</span>
                            </>
                        ) : (
                            'استيراد من ملف'
                        )}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden"
                    />
                </div>
            </div>

            {/* API Key Settings */}
             <div className="max-w-3xl mx-auto mt-8">
                 <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold text-white mb-3 text-center">بيانات السوق الحية</h3>
                     <p className="text-gray-400 text-center">
                        يتم توفير بيانات أسعار الأسهم الحية بواسطة <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Finnhub</a>.
                        لتمكين هذه الميزة، يرجى إضافة مفتاح API المجاني الخاص بك في ملف <code>services/marketApi.ts</code>. بدون المفتاح، لن يتم عرض البيانات الحية في تفاصيل المحفظة.
                    </p>
                </div>
            </div>

            {/* Notification Settings */}
             <div className="max-w-3xl mx-auto mt-8">
                 <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold text-white mb-3 text-center">إعدادات الإشعارات</h3>
                     <p className="text-gray-400 mb-6 text-center">
                        تلقي إشعارات حول أداء المحفظة، مثل الوصول للأهداف أو الصفقات الهامة.
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg">
                             <label className="flex items-center cursor-pointer">
                                <span className="text-lg font-medium text-white mr-3">تفعيل الإشعارات</span>
                                <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={notificationsEnabled} onChange={onToggleNotifications} />
                                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${notificationsEnabled ? 'transform translate-x-full bg-cyan-400' : ''}`}></div>
                                </div>
                            </label>
                        </div>

                         {renderPermissionStatus()}
                        
                        {notificationPermission === 'default' && (
                             <button
                                onClick={onRequestNotificationPermission}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors"
                            >
                                طلب إذن الإشعارات
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Reset App Data */}
            <div className="max-w-3xl mx-auto mt-8">
                <div className="bg-red-900/50 border border-red-700 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold text-red-300 mb-3 text-center">إعادة تعيين التطبيق</h3>
                    <p className="text-gray-300 mb-6 text-center">
                        سيؤدي هذا الإجراء إلى حذف جميع بياناتك نهائيًا، بما في ذلك جميع المحافظ والصفقات والمصروفات. لا يمكن التراجع عن هذا الإجراء.
                    </p>
                    <button
                        onClick={onResetData}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        حذف جميع البيانات وإعادة التعيين
                    </button>
                </div>
            </div>

        </div>
    );
};

export default SettingsView;