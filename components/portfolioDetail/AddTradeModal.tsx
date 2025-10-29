import React, { useState } from 'react';
import { Trade } from '../../types';

interface AddTradeModalProps {
    currency: string;
    onClose: () => void;
    onAdd: (tradeData: Omit<Trade, 'id' | 'portfolioId' | 'status' | 'openDate' | 'closeDate' | 'closePrice' | 'outcome'>) => void;
}

const stockList = [
  { code: 'COMI', name: 'البنك التجاري الدولي (مصر)' },
  { code: 'EAST', name: 'الشرقية - ايسترن كومباني' },
  { code: 'TMGH', name: 'مجموعة طلعت مصطفى القابضة' },
  { code: 'ETEL', name: 'المصرية للاتصالات' },
  { code: 'MFPC', name: 'مصر لإنتاج الأسمدة - موبكو' },
  { code: 'EGAL', name: 'مصر للالومنيوم' },
  { code: 'ABUK', name: 'ابو قير للأسمدة والصناعات الكيماوية' },
  { code: 'ORAS', name: 'اوراسكوم كونستراكشون بي إل سي' },
  { code: 'EMFD', name: 'إعمار مصر للتنمية' },
  { code: 'EFIH', name: 'اي فاينانس للاستثمارات المالية والرقمية' },
  { code: 'FWRY', name: 'فوري لتكنولوجيا البنوك والمدفوعات الإلكترونية' },
  { code: 'HRHO', name: 'المجموعة المالية هيرميس القابضة' },
  { code: 'BTFH', name: 'بلتون القابضة' },
  { code: 'JUFO', name: 'جهينة للصناعات الغذائية' },
  { code: 'ADIB', name: 'مصرف أبو ظبي الإسلامي - مصر' },
  { code: 'EKHO', name: 'القابضة المصرية الكويتية (دولار)' },
  { code: 'EKHOA', name: 'القابضة المصرية الكويتية (جنيه)' },
  { code: 'ORHD', name: 'اوراسكوم للتنمية مصر' },
  { code: 'GBCO', name: 'جي بي كوربوريشن' },
  { code: 'CIEB', name: 'بنك كريدي أجريكول مصر' },
  { code: 'PHDC', name: 'بالم هيلز للتعمير' },
  { code: 'ARCC', name: 'العربية للأسمنت' },
  { code: 'SKPC', name: 'سيدي كرير للبتروكيماويات' },
  { code: 'ORWE', name: 'النساجون الشرقيون للسجاد' },
  { code: 'ISPH', name: 'ابن سينا فارما' },
  { code: 'RAYA', name: 'راية القابضة للاستثمارات المالية' },
  { code: 'MASR', name: 'مدينة مصر للإسكان والتعمير' },
  { code: 'AMOC', name: 'الإسكندرية للزيوت المعدنية' },
  { code: 'MCQE', name: 'مصر للأسمنت - قنا' },
  { code: 'RMDA', name: 'راميدا - الصناعات الدوائية والتشخيصية' },
  { code: 'CCAP', name: 'القلعة للاستشارات المالية' },
];

const AddTradeModal: React.FC<AddTradeModalProps> = ({ currency, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        stockName: '',
        purchasePrice: '',
        tradeValue: '',
        stopLoss: '',
        takeProfit: '',
        notes: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const stockName = formData.stockName.trim().toUpperCase();
        const purchasePrice = parseFloat(formData.purchasePrice);
        const tradeValue = parseFloat(formData.tradeValue);
        const stopLoss = parseFloat(formData.stopLoss);
        const takeProfit = parseFloat(formData.takeProfit);

        if (!stockName || isNaN(purchasePrice) || isNaN(tradeValue) || isNaN(stopLoss) || isNaN(takeProfit)) {
            alert('يرجى ملء جميع الحقول المطلوبة بأرقام صحيحة، باستثناء الملاحظات.');
            return;
        }

        if (purchasePrice <= 0 || tradeValue <= 0 || stopLoss <= 0 || takeProfit <= 0) {
            alert('يجب أن تكون القيم الرقمية أكبر من صفر.');
            return;
        }

        const tradeData = {
            stockName,
            purchasePrice,
            tradeValue,
            stopLoss,
            takeProfit,
            notes: formData.notes.trim(),
        };

        onAdd(tradeData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">فتح صفقة جديدة</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-300">اسم السهم</label>
                        <input 
                            type="text" 
                            name="stockName" 
                            value={formData.stockName} 
                            onChange={handleInputChange} 
                            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" 
                            placeholder="مثال: CIB, TMGH, FWRY"
                            list="stock-list"
                        />
                        <datalist id="stock-list">
                            {stockList.map(stock => (
                                <option key={stock.code} value={stock.code}>
                                    {stock.name}
                                </option>
                            ))}
                        </datalist>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm text-gray-300">سعر الشراء</label>
                            <input type="number" step="any" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" placeholder="150.5"/>
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">قيمة الصفقة ({currency})</label>
                            <input type="number" step="any" name="tradeValue" value={formData.tradeValue} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" placeholder="1000"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm text-gray-300">سعر البيع (TP)</label>
                            <input type="number" step="any" name="takeProfit" value={formData.takeProfit} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" placeholder="160"/>
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">وقف الخسارة (SL)</label>
                            <input type="number" step="any" name="stopLoss" value={formData.stopLoss} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" placeholder="145"/>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-300">ملاحظات (اختياري)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" placeholder="سبب الدخول, الاستراتيجية..."></textarea>
                    </div>
                    <div className="flex justify-between gap-4 pt-4">
                        <button type="submit" className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors">فتح الصفقة</button>
                        <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTradeModal;