import React, { useState } from 'react';
import { X, Printer, CreditCard, CheckCircle, Smartphone } from 'lucide-react';

interface PaymentData {
  plateNumber: string;
  entryTime: Date;
  exitTime: Date;
  durationMinutes: number;
  ratePerMinute: number;
  totalCost: number;
  slotLabel: string;
}

interface PaymentModalProps {
  data: PaymentData;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ data, onConfirm, onCancel }) => {
  const [step, setStep] = useState<'INVOICE' | 'PROCESSING' | 'SUCCESS'>('INVOICE');

  const handlePay = () => {
    setStep('PROCESSING');
    // Simulate API call or user processing time
    setTimeout(() => {
      setStep('SUCCESS');
    }, 2000);
  };

  const handleFinalize = () => {
    onConfirm();
  };

  if (step === 'SUCCESS') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">تم السداد بنجاح</h2>
          <p className="text-slate-500 mb-8">تم فتح البوابة إلكترونياً. شكراً لاستخدامكم SmartPark.</p>
          <button 
            onClick={handleFinalize}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
          >
            إتمام وخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <CreditCard size={24} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">بوابة السداد الإلكتروني</h2>
              <p className="text-slate-400 text-xs">SmartPark Payment Gateway</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Invoice Details */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>
            
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="text-sm text-slate-500">رقم اللوحة</div>
                <div className="text-2xl font-bold font-mono text-slate-800">{data.plateNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">رقم الموقف</div>
                <div className="text-xl font-bold text-slate-800">{data.slotLabel}</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">وقت الدخول:</span>
                <span className="font-medium font-mono">{data.entryTime.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">وقت الخروج:</span>
                <span className="font-medium font-mono">{data.exitTime.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المدة المستغرقة:</span>
                <span className="font-medium">{data.durationMinutes} دقيقة</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">سعر الدقيقة:</span>
                <span className="font-medium">{data.ratePerMinute} ج.س</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-slate-300 flex justify-between items-end">
              <span className="font-bold text-slate-700">المبلغ الإجمالي</span>
              <span className="text-3xl font-bold text-emerald-600">{data.totalCost} ج.س</span>
            </div>
          </div>

          {/* Payment Method - Bankak */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Smartphone size={18} className="text-red-600" />
              الدفع عبر تطبيق بنكك
            </h3>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-sm text-red-800 mb-1">رقم الحساب للتحويل</div>
                <div className="text-xl font-bold font-mono text-slate-900 tracking-wider">2450193</div>
                <div className="text-xs text-red-600 mt-1">باسم: شركة المواقف الذكية</div>
              </div>
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Bank_of_Khartoum_Logo.jpg/220px-Bank_of_Khartoum_Logo.jpg" alt="BOK" className="h-12 w-12 object-contain rounded-full bg-white p-1 shadow-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={handlePay}
              disabled={step === 'PROCESSING'}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              {step === 'PROCESSING' ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  جاري التحقق...
                </>
              ) : (
                'تأكيد السداد وفتح البوابة'
              )}
            </button>
            <button className="px-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
              <Printer size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};