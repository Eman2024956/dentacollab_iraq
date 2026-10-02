'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { QrCode, CheckCircle, AlertTriangle, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export default function AttendancePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [passToken, setPassToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    studentName?: string;
    course?: string;
    message?: string;
    time?: string;
  } | null>(null);

  const isAr = lang === 'ar';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passToken.trim()) return;

    setLoading(true);
    setScanResult(null);

    // Simulate / call recordAttendance
    setTimeout(() => {
      setLoading(false);
      if (passToken.includes('invalid')) {
        setScanResult({
          success: false,
          message: 'بطاقة الدخول غير صالحة أو منتهية الصلاحية / Invalid or expired pass token',
        });
      } else {
        setScanResult({
          success: true,
          studentName: 'د. علي حسين السعدي',
          course: 'أساسيات طب الأسنان الرقمي (Exocad)',
          message: 'تم تسجيل الحضور وتأكيد الهوية بنجاح ✅',
          time: new Date().toLocaleTimeString('ar-IQ'),
        });
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'تسجيل الحضور وبطاقات الـ QR' : 'Attendance & QR Pass Check-in'}
          subtitle={isAr ? 'تدقيق البطاقات الرقمية المشفرة وتأكيد حضور المتدربين للمختبر العملي' : 'Verify student QR passes and record in-person attendance'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-8 flex-1 overflow-y-auto max-w-4xl">
          {/* Scanner Card */}
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#19314F]">
              <div className="w-10 h-10 rounded-xl bg-[#1FB6D1]/15 text-[#1FB6D1] flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">التحقق من بطاقة الدخول (Entry Pass Token)</h3>
                <p className="text-xs text-slate-400">امسح رمز QR عبر كاميرا الجهاز أو أدخل رمز المرور اليدوي</p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  رمز التحقق المشفر / Pass Token
                </label>
                <input
                  type="text"
                  placeholder="مثال: dc_pass_dXNlcl8xMjM0... أو امسح الباركود"
                  value={passToken}
                  onChange={(e) => setPassToken(e.target.value)}
                  className="w-full bg-[#101C38] border border-[#19314F] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#1FB6D1] transition-colors"
                  dir="ltr"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  <span>تأكيد الحضور وتسجيل الدخول</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPassToken('dc_pass_demo_ali_saadi_2026')}
                  className="px-4 py-2.5 rounded-xl bg-[#101C38] border border-[#19314F] text-slate-300 text-xs hover:border-[#1FB6D1] transition-colors"
                >
                  تجربة رمز صالح
                </button>
              </div>
            </form>

            {/* Scan Result Alert */}
            {scanResult && (
              <div
                className={`mt-6 p-5 rounded-2xl border ${
                  scanResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {scanResult.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-sm text-white">{scanResult.message}</div>
                    {scanResult.success && (
                      <div className="mt-2 space-y-1 text-xs">
                        <div>
                          <span className="text-slate-400">الطالب / المتدرب: </span>
                          <span className="font-semibold text-white">{scanResult.studentName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">الدورة التدريبية: </span>
                          <span className="font-semibold text-white">{scanResult.course}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">توقيت التسجيل: </span>
                          <span className="font-mono text-slate-300">{scanResult.time}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
