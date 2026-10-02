'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  GraduationCap,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Layers,
  Calendar,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isAr = lang === 'ar';

  const stats = [
    {
      title: isAr ? 'إجمالي الدورات النشطة' : 'Active Courses',
      value: '3',
      sub: isAr ? 'دورات معتمدة منشورة' : 'Published verified courses',
      icon: GraduationCap,
      color: 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30',
    },
    {
      title: isAr ? 'الدفعات التدريبية المفتوحة' : 'Open Cohorts',
      value: '2',
      sub: isAr ? 'دفعة تشرين الأول قيد التسجيل' : 'October cohorts enrolling',
      icon: Calendar,
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
    },
    {
      title: isAr ? 'المقاعد المحجوزة' : 'Enrolled Students',
      value: '8 / 24',
      sub: isAr ? 'نسبة إشغال ٣٣٪' : '33% occupancy rate',
      icon: Users,
      color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
    },
    {
      title: isAr ? 'طلبات التسجيل الجديدة' : 'Pending Requests',
      value: '4',
      sub: isAr ? 'تتطلب مراجعة أو تأكيد' : 'Requires admin review',
      icon: Clock,
      color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    },
  ];

  const recentEnrollments = [
    {
      id: 'enr_1',
      studentName: 'د. علي حسين السعدي',
      course: 'أساسيات طب الأسنان الرقمي (Exocad)',
      cohort: 'دفعة تشرين الأول ٢٠٢٦',
      status: 'confirmed',
      statusLabel: 'مؤكد ومقبول',
      date: 'اليوم، ١٠:٣٠ ص',
    },
    {
      id: 'enr_2',
      studentName: 'د. فاطمة مهدي الرديني',
      course: 'تخطيط الزرعات والدليل الجراحي (Exoplan)',
      cohort: 'دفعة تشرين الأول ٢٠٢٦',
      status: 'confirmed',
      statusLabel: 'مؤكد ومقبول',
      date: 'أمس، ٠٤:١٥ م',
    },
    {
      id: 'enr_3',
      studentName: 'د. سرمد عبد الكريم',
      course: 'أساسيات طب الأسنان الرقمي (Exocad)',
      cohort: 'دفعة تشرين الأول ٢٠٢٦',
      status: 'waitlisted',
      statusLabel: 'قائمة الانتظار',
      date: 'منذ يومين',
    },
    {
      id: 'enr_4',
      studentName: 'د. نور محمد الخفاجي',
      course: 'الطباعة ثلاثية الأبعاد لطب الأسنان',
      cohort: 'دفعة تشرين الثاني ٢٠٢٦',
      status: 'requested',
      statusLabel: 'قيد المراجعة',
      date: 'منذ ٣ أيام',
    },
  ];

  const toggleSelectAll = () => {
    if (selectedIds.length === recentEnrollments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recentEnrollments.map((e) => e.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleExportExcel = (onlySelected: boolean = false) => {
    const listToExport = onlySelected
      ? recentEnrollments.filter((e) => selectedIds.includes(e.id))
      : recentEnrollments;

    exportToExcel(
      `dentacollab-recent-enrollments-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'studentName', label: 'اسم الطالب / الطبيب' },
        { key: 'course', label: 'الدورة التدريبية' },
        { key: 'cohort', label: 'الدفعة' },
        { key: 'statusLabel', label: 'حالة التسجيل' },
        { key: 'date', label: 'تاريخ التسجيل' },
      ],
      listToExport
    );
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'لوحة المتابعة الأكاديمية' : 'Academic Dashboard'}
          subtitle={isAr ? 'نظرة شاملة على التسجيل والدورات والورش المقامة في بغداد' : 'Comprehensive overview of Baghdad academy courses & enrollments'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#101C38] via-[#081426] to-[#040B18] border border-[#19314F] rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1FB6D1]">
                <Sparkles className="w-4 h-4" />
                <span>أكاديمية DentaCollab لطب الأسنان الرقمي — بغداد</span>
              </div>
              <h3 className="text-xl font-bold text-white">صمّم. خطّط. نفّذ.</h3>
              <p className="text-sm text-slate-400 max-w-xl">
                متابعة مباشرة لعمليات تسجيل الطلاب، تدقيق بطاقات الحضور الرقمية عبر الـ QR، وإدارة المحتوى والبرامج التدريبية العملية.
              </p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <Link
                href="/courses/new"
                className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-sm hover:bg-[#1FB6D1]/90 transition-colors shadow-lg"
              >
                + إضافة دورة جديدة
              </Link>
              <Link
                href="/attendance"
                className="px-4 py-2.5 rounded-xl bg-[#101C38] border border-[#19314F] text-slate-200 font-semibold text-sm hover:border-[#1FB6D1] transition-colors"
              >
                مسح بطاقة QR
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-[#081426] border border-[#19314F] rounded-2xl p-5 hover:border-[#1FB6D1]/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">{stat.title}</span>
                    <div className={`p-2 rounded-xl border bg-gradient-to-br ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Floating Selection Bar */}
          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={recentEnrollments.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExportExcel(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === recentEnrollments.length}
            itemLabel="طلب تسجيل"
          />

          {/* Recent Enrollments Table */}
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-white">أحدث طلبات التسجيل</h4>
                  {selectedIds.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1FB6D1]/20 text-[#1FB6D1] text-[11px] font-bold border border-[#1FB6D1]/40">
                      تم تحديد {selectedIds.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">آخر المقاعد المحجوزة وقوائم الانتظار الفعلية</p>
              </div>

              <div className="flex items-center gap-2">
                {selectedIds.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1.5 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="إلغاء التحديد"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>إلغاء التحديد (Clear)</span>
                  </button>
                )}

                <button
                  onClick={() => handleExportExcel(selectedIds.length > 0)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="تصدير جدول التسجيل إلى Excel"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : '(الكل)'}</span>
                </button>

                <Link
                  href="/enrollments"
                  className="text-xs text-[#1FB6D1] hover:underline flex items-center gap-1 font-semibold px-2 py-1"
                >
                  <span>عرض الكل</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#19314F] text-slate-400 pb-3">
                    <th className="pb-3 pr-2 w-10 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-white transition-colors"
                        title={selectedIds.length === recentEnrollments.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                      >
                        {selectedIds.length === recentEnrollments.length ? (
                          <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="pb-3 font-semibold">اسم الطالب / الطبيب</th>
                    <th className="pb-3 font-semibold">الدورة التدريبية</th>
                    <th className="pb-3 font-semibold">الدفعة</th>
                    <th className="pb-3 font-semibold">حالة التسجيل</th>
                    <th className="pb-3 font-semibold">التاريخ</th>
                    <th className="pb-3 font-semibold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19314F]/60">
                  {recentEnrollments.map((enr) => {
                    const isSelected = selectedIds.includes(enr.id);
                    return (
                      <tr
                        key={enr.id}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-[#1FB6D1]/10 border-l-2 border-l-[#1FB6D1]'
                            : 'hover:bg-[#101C38]/40'
                        }`}
                      >
                        <td className="py-3.5 pr-2 text-center">
                          <button
                            onClick={() => toggleSelectOne(enr.id)}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 font-bold text-white">{enr.studentName}</td>
                        <td className="py-3.5 text-slate-300">{enr.course}</td>
                        <td className="py-3.5 text-slate-400">{enr.cohort}</td>
                        <td className="py-3.5">
                          {enr.status === 'confirmed' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                              مؤكد ومقبول
                            </span>
                          )}
                          {enr.status === 'waitlisted' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
                              قائمة الانتظار
                            </span>
                          )}
                          {enr.status === 'requested' && (
                            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-semibold">
                              قيد المراجعة
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-400">{enr.date}</td>
                        <td className="py-3.5 text-center">
                          <Link
                            href={`/enrollments`}
                            className="px-3 py-1 rounded-lg bg-[#101C38] border border-[#19314F] text-slate-300 hover:text-white hover:border-[#1FB6D1] transition-colors"
                          >
                            التفاصيل
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
