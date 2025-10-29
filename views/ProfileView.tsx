import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UserProfile } from '../types';
import { CameraIcon } from '../components/icons/CameraIcon';
import { UserCircleIcon } from '../components/icons/UserCircleIcon';

interface ProfileViewProps {
    profile: UserProfile;
    onSave: (profile: UserProfile) => void;
}

const countriesData = [
    { name: 'مصر', code: 'EG', phoneCode: '+20', phoneRegex: /^(10|11|12|15)\d{8}$/ },
    { name: 'السعودية', code: 'SA', phoneCode: '+966', phoneRegex: /^5\d{8}$/ },
    { name: 'الإمارات', code: 'AE', phoneCode: '+971', phoneRegex: /^(50|52|54|55|56|58)\d{7}$/ },
    { name: 'الكويت', code: 'KW', phoneCode: '+965', phoneRegex: /^[569]\d{7}$/ },
    { name: 'قطر', code: 'QA', phoneCode: '+974', phoneRegex: /^[34567]\d{7}$/ },
    { name: 'الأردن', code: 'JO', phoneCode: '+962' },
    { name: 'لبنان', code: 'LB', phoneCode: '+961' },
    { name: 'سوريا', code: 'SY', phoneCode: '+963' },
    { name: 'العراق', code: 'IQ', phoneCode: '+964' },
    { name: 'اليمن', code: 'YE', phoneCode: '+967' },
    { name: 'عمان', code: 'OM', phoneCode: '+968' },
    { name: 'البحرين', code: 'BH', phoneCode: '+973' },
    { name: 'فلسطين', code: 'PS', phoneCode: '+970' },
    { name: 'الجزائر', code: 'DZ', phoneCode: '+213' },
    { name: 'المغرب', code: 'MA', phoneCode: '+212' },
    { name: 'تونس', code: 'TN', phoneCode: '+216' },
    { name: 'ليبيا', code: 'LY', phoneCode: '+218' },
    { name: 'السودان', code: 'SD', phoneCode: '+249' },
    { name: 'تركيا', code: 'TR', phoneCode: '+90' },
    { name: 'الولايات المتحدة', code: 'US', phoneCode: '+1' },
    { name: 'المملكة المتحدة', code: 'GB', phoneCode: '+44' },
    { name: 'كندا', code: 'CA', phoneCode: '+1' },
    { name: 'ألمانيا', code: 'DE', phoneCode: '+49' },
    { name: 'فرنسا', code: 'FR', phoneCode: '+33' },
    { name: 'أستراليا', code: 'AU', phoneCode: '+61' },
    { name: 'اليابان', code: 'JP', phoneCode: '+81' },
    { name: 'الصين', code: 'CN', phoneCode: '+86' },
];


const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSave }) => {
    const [formData, setFormData] = useState<UserProfile>(profile);
    const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
    const [localPhoneNumber, setLocalPhoneNumber] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(profile);
        const initialCountry = countriesData.find(c => c.name === profile.country);
        if (initialCountry) {
            setSelectedCountryCode(initialCountry.code);
        }

        if (profile.phone) {
            const matchingCountry = countriesData.find(c => profile.phone.startsWith(c.phoneCode));
            if (matchingCountry) {
                if (!initialCountry) {
                     setSelectedCountryCode(matchingCountry.code);
                }
                setLocalPhoneNumber(profile.phone.substring(matchingCountry.phoneCode.length));
            } else {
                 setLocalPhoneNumber(profile.phone);
            }
        }
    }, [profile]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const selectedCountryData = useMemo(() => {
        return countriesData.find(c => c.code === selectedCountryCode);
    }, [selectedCountryCode]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountryCode = e.target.value;
        setSelectedCountryCode(newCountryCode);
        const countryName = countriesData.find(c => c.code === newCountryCode)?.name || '';
        setFormData(prev => ({ ...prev, country: countryName, city: '' }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.name.trim() || !formData.email.trim()) {
            alert('الرجاء ملء الحقول الأساسية: الاسم والبريد الإلكتروني.');
            return;
        }

        if(!emailRegex.test(formData.email)) {
            alert('الرجاء إدخال بريد إلكتروني صالح.');
            return;
        }

        let fullPhoneNumber = localPhoneNumber;
        if (selectedCountryData) {
            if (!localPhoneNumber.trim()) {
                alert('الرجاء إدخال رقم الهاتف.');
                return;
            }
            if (selectedCountryData.phoneRegex && !selectedCountryData.phoneRegex.test(localPhoneNumber)) {
                alert(`رقم الهاتف الذي أدخلته غير صالح لـ ${selectedCountryData.name}.`);
                return;
            }
            fullPhoneNumber = selectedCountryData.phoneCode + localPhoneNumber;
        } else if (localPhoneNumber.trim()) {
             alert('الرجاء اختيار دولة.');
            return;
        }

        onSave({ ...formData, phone: fullPhoneNumber });
        alert('تم حفظ بيانات الملف الشخصي بنجاح!');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">الملف الشخصي</h2>
            <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center">
                        <div className="relative">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="الصورة الشخصية" className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                                    <UserCircleIcon className="w-24 h-24 text-gray-500" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-2 shadow-lg transition-transform hover:scale-110"
                                title="تغيير الصورة الشخصية"
                            >
                                <CameraIcon className="w-5 h-5" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">الاسم (أساسي)</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">الدولة</label>
                            <select
                                id="country"
                                name="country"
                                value={selectedCountryCode}
                                onChange={handleCountryChange}
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                            >
                                <option value="">اختر الدولة</option>
                                {countriesData.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">رقم الهاتف (أساسي)</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-400 bg-slate-900 border border-l-0 border-slate-600 rounded-r-lg">
                                    {selectedCountryData?.phoneCode || '+??'}
                                </span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={localPhoneNumber}
                                    onChange={(e) => setLocalPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-l-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                                    required
                                    dir="ltr"
                                />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">المدينة</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="أدخل اسم المدينة"
                                disabled={!selectedCountryData}
                            />
                        </div>
                    </div>

                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-cyan-500 focus:border-cyan-500"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">
                            حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileView;