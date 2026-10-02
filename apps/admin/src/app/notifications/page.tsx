'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Bell, Send, CheckCircle2, Users, Smartphone, Clock } from 'lucide-react';

export default function NotificationsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [targetAudience, setTargetAudience] = useState('all_students');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const isAr = lang === 'ar';

  const [errorMessage, setErrorMessage] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSentSuccess(false);
    setErrorMessage('');

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr,
          titleEn,
          bodyAr,
          bodyEn,
          topic: targetAudience === 'all_students' ? 'all_customers' : targetAudience,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال الإشعار');
      }

      setSentSuccess(true);
      setTitleAr('');
      setTitleEn('');
      setBodyAr('');
      setBodyEn('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال الإشعار');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'مركز الإشعارات والتنبيهات' : 'Push Notification Center'}
          subtitle={isAr ? 'إرسال إشعارات FCM الفورية وصندوق البريد الداخلي للمتدربين' : 'Send bilingual FCM pushes and in-app inbox announcements'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-8 flex-1 overflow-y-auto max-w-4xl">
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#19314F]">
              <div className="w-10 h-10 rounded-xl bg-[#1FB6D1]/15 text-[#1FB6D1] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">إنشاء إشعار عام أو موجه</h3>
                <p className="text-xs text-slate-400">يدعم العرض ثنائي اللغة (عربي / إنكليزي) مع الحفظ في صندوق الوارد Durable Inbox</p>
              </div>
            </div>

            {sentSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تم إرسال الإشعار بنجاح عبر FCM إلى قناة المشتركين وحفظه في صندوق الوارد ✅</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-5">
              {/* Audience selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  الجمهور المستهدف / Target Audience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'all_students', label: 'جميع الطلاب المسجلين' },
                    { id: 'exocad_cohort', label: 'دفعة تشرين الأول (Exocad)' },
                    { id: 'exoplan_cohort', label: 'دفعة تشرين الأول (Exoplan)' },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setTargetAudience(aud.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-right transition-colors ${
                        targetAudience === aud.id
                          ? 'border-[#1FB6D1] bg-[#1FB6D1]/10 text-white'
                          : 'border-[#19314F] bg-[#101C38] text-slate-400 hover:text-white'
                      }`}
                    >
                      {aud.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arabic Inputs */}
              <div className="p-4 rounded-xl bg-[#050E1B] border border-[#19314F] space-y-3">
                <h4 className="text-xs font-bold text-[#1FB6D1]">المحتوى باللغة العربية (RTL)</h4>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="عنوان الإشعار (مثال: تذكير بموعد الجلسة العملية غداً)"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full bg-[#101C38] border border-[#19314F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder="نص الإشعار التفصيلي..."
                    value={bodyAr}
                    onChange={(e) => setBodyAr(e.target.value)}
                    className="w-full bg-[#101C38] border border-[#19314F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>
              </div>

              {/* English Inputs */}
              <div className="p-4 rounded-xl bg-[#050E1B] border border-[#19314F] space-y-3" dir="ltr">
                <h4 className="text-xs font-bold text-[#1FB6D1]">English Content (LTR)</h4>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Notification Title (e.g. Session Reminder: Lab Starts Tomorrow)"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-[#101C38] border border-[#19314F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Notification body message..."
                    value={bodyEn}
                    onChange={(e) => setBodyEn(e.target.value)}
                    className="w-full bg-[#101C38] border border-[#19314F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'جارِ الإرسال...' : 'إرسال الإشعار لجميع الأجهزة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
