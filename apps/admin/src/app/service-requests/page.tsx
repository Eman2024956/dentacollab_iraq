'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Layers, CheckCircle2, Clock, MessageSquare, Phone, ArrowUpRight } from 'lucide-react';

export default function ServiceRequestsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [requests, setRequests] = useState([
    {
      id: 'req_01',
      studentName: 'د. علي حسين السعدي',
      phone: '+964 781 782 8545',
      service: 'تخطيط الزرعات وتصميم الأدلة الجراحية (Exoplan)',
      preferredContact: 'whatsapp',
      status: 'under_review',
      description: 'حالة زراعة لثلاث زرعات في الفك السفلي الخلفي، تم إرفاق ملف الـ CBCT للمراجعة وتحديد قطر الأكمام.',
      date: 'اليوم، ١١:١٥ ص',
      quotedPrice: '١٢٠,٠٠٠ د.ع',
    },
    {
      id: 'req_02',
      studentName: 'د. سارة عادل الراوي',
      phone: '+964 770 123 4567',
      service: 'خدمات التصميم الرقمي واستشارات Exocad',
      preferredContact: 'whatsapp',
      status: 'quoted',
      description: 'تصميم ابتسامة كاملة لـ ٦ وحدات أمامية علوية مجهزة بملفات المسح داخل الفم STL.',
      date: 'أمس، ٠٣:٤٠ م',
      quotedPrice: '٨٠,٠٠٠ د.ع',
    },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'طلبات الخدمات والاستشارات الرقمية' : 'Service Requests Pipeline'}
          subtitle={isAr ? 'مراجعة طلبات الأطباء، إرسال عروض الأسعار، ومتابعة مراحل التنفيذ' : 'Review incoming requests, issue quotes, and track case progress'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl overflow-hidden p-6">
            <h3 className="text-base font-bold text-white mb-1">الطلبات الواردة من تطبيق الطلاب</h3>
            <p className="text-xs text-slate-400 mb-6">يتم استقبال الطلبات وتوثيقها في فايربيس مع إمكانية تحديث السعر والحالة</p>

            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-[#050E1B] border border-[#19314F] hover:border-[#1FB6D1]/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{req.studentName}</span>
                        <span className="text-xs font-mono text-slate-400">({req.phone})</span>
                      </div>
                      <div className="text-xs text-[#1FB6D1] font-semibold mt-0.5">{req.service}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'under_review' && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                          قيد المراجعة الفنية
                        </span>
                      )}
                      {req.status === 'quoted' && (
                        <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
                          تم إرسال العرض ({req.quotedPrice})
                        </span>
                      )}
                      {req.status === 'accepted' && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                          مقبول وجارِ التنفيذ
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#101C38] p-3 rounded-xl border border-[#19314F]/60">
                    {req.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#19314F]/60 text-xs text-slate-400">
                    <div>توقيت الطلب: {req.date}</div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 font-semibold hover:bg-emerald-600/30 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>مراسلة واتساب</span>
                      </a>

                      {req.status === 'under_review' && (
                        <button
                          onClick={() => updateStatus(req.id, 'quoted')}
                          className="px-3 py-1.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold hover:bg-[#1FB6D1]/90 transition-colors"
                        >
                          تحديد السعر وإرسال العرض
                        </button>
                      )}

                      {req.status === 'quoted' && (
                        <button
                          onClick={() => updateStatus(req.id, 'accepted')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 text-[#040B18] font-bold hover:bg-emerald-500/90 transition-colors"
                        >
                          تأكيد قبول الحالة وبدء التنفيذ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
