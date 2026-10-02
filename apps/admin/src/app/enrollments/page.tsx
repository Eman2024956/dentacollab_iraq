'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  CheckCircle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  QrCode,
  UserCheck,
  Clock,
  XCircle,
  X,
  Save,
  FileSpreadsheet,
  CheckSquare,
  Square,
} from 'lucide-react';

export default function EnrollmentsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // New Enrollment Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('+964 7');
  const [newCourseTitle, setNewCourseTitle] = useState('أساسيات طب الأسنان الرقمي وتصميم التركيبات');
  const [newAmountPaid, setNewAmountPaid] = useState('450,000 د.ع');
  const [newPaymentStatus, setNewPaymentStatus] = useState('paid');

  const isAr = lang === 'ar';

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enrollments');
      const data = await res.json();
      if (data.success && data.enrollments && data.enrollments.length > 0) {
        setEnrollments(data.enrollments);
      } else {
        setEnrollments([
          {
            id: 'enr_ali_saadi_01',
            studentName: 'د. علي حسين السعدي',
            studentEmail: 'ali.saadi@example.com',
            studentPhone: '+964 781 782 8545',
            courseTitle: 'أساسيات طب الأسنان الرقمي وتصميم التركيبات',
            cohortId: 'دفعة تشرين الأول ٢٠٢٦',
            status: 'enrolled',
            paymentStatus: 'paid',
            amountPaid: '450,000 د.ع',
            passToken: 'dc_pass_ali_saadi_exocad_2026',
          },
          {
            id: 'enr_demo_02',
            studentName: 'د. مريم الخفاجي',
            studentEmail: 'maryam.k@example.com',
            studentPhone: '+964 770 123 4567',
            courseTitle: 'تخطيط الزرعات والدليل الجراحي الرقمي',
            cohortId: 'دفعة تشرين الأول ٢٠٢٦',
            status: 'enrolled',
            paymentStatus: 'paid',
            amountPaid: '650,000 د.ع',
            passToken: 'dc_pass_maryam_exoplan_2026',
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: newStudentName,
          studentEmail: newStudentEmail,
          studentPhone: newStudentPhone,
          courseTitle: newCourseTitle,
          amountPaid: newAmountPaid,
          paymentStatus: newPaymentStatus,
          status: 'enrolled',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل في حفظ التسجيل');
      }

      setShowAddModal(false);
      setNewStudentName('');
      setNewStudentEmail('');
      await fetchEnrollments();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ التسجيل');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/enrollments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = enrollments.filter((e) => {
    const matchesSearch =
      e.studentName.toLowerCase().includes(search.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      (e.studentPhone && e.studentPhone.includes(search));
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((e) => e.id));
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
      ? filtered.filter((e) => selectedIds.includes(e.id))
      : filtered;

    exportToExcel(
      `dentacollab-enrollments-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'studentName', label: 'اسم المتدرب / الطبيب' },
        { key: 'studentEmail', label: 'البريد الإلكتروني' },
        { key: 'studentPhone', label: 'رقم الهاتف' },
        { key: 'courseTitle', label: 'الدورة التدريبية' },
        { key: 'cohortId', label: 'الدفعة' },
        { key: 'amountPaid', label: 'المبلغ المدفوع' },
        { key: 'paymentStatus', label: 'حالة الدفع' },
        { key: 'passToken', label: 'رمز بطاقة QR' },
        { key: 'status', label: 'حالة التسجيل' },
      ],
      listToExport
    );
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'التسجيل والقبول الأكاديمي' : 'Enrollments & Admissions'}
          subtitle={isAr ? 'إدارة تسجيل الطلاب، تأكيد المقاعد، وتوليد بطاقات الدخول الرقمية' : 'Manage student registrations, cohort seat allocation, and digital QR passes'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الدورة أو رقم الهاتف..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#081426] border border-[#19314F] rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#081426] border border-[#19314F] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#1FB6D1]"
              >
                <option value="all">كل الحالات</option>
                <option value="enrolled">مقبول ومثبت</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>

              <button
                onClick={fetchEnrollments}
                className="p-2 rounded-xl bg-[#081426] border border-[#19314F] text-slate-400 hover:text-white transition-colors"
                title="تحديث"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1FB6D1]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>إلغاء التحديد ({selectedIds.length})</span>
                </button>
              )}

              <button
                onClick={() => handleExportExcel(selectedIds.length > 0)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="تصدير التسجيلات إلى Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1FB6D1]/90 transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>تسجيل طالب جديد</span>
              </button>
            </div>
          </div>

          {/* Floating Selection Bar */}
          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={filtered.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExportExcel(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === filtered.length && filtered.length > 0}
            itemLabel="طلب تسجيل"
          />

          {/* Enrollments Table */}
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#050E1B] border-b border-[#19314F] text-slate-400">
                    <th className="p-4 w-10 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-white transition-colors"
                        title={selectedIds.length === filtered.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                      >
                        {selectedIds.length > 0 && selectedIds.length === filtered.length ? (
                          <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4 font-semibold">الطبيب / الطالب</th>
                    <th className="p-4 font-semibold">الدورة المسجل بها</th>
                    <th className="p-4 font-semibold">الدفعة التدريبية</th>
                    <th className="p-4 font-semibold">رمز بطاقة الدخول (QR Pass)</th>
                    <th className="p-4 font-semibold">حالة الدفع</th>
                    <th className="p-4 font-semibold">حالة التسجيل</th>
                    <th className="p-4 font-semibold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19314F]/60">
                  {filtered.map((enr) => {
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
                        <td className="p-4 text-center">
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
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{enr.studentName}</div>
                        <div className="text-slate-400 text-[11px] font-mono mt-0.5" dir="ltr">
                          {enr.studentPhone} {enr.studentEmail ? `• ${enr.studentEmail}` : ''}
                        </div>
                      </td>
                      <td className="p-4 text-white font-medium">{enr.courseTitle}</td>
                      <td className="p-4 text-slate-300">{enr.cohortId}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#1FB6D1] bg-[#050E1B] px-2.5 py-1 rounded-lg border border-[#19314F] w-fit" dir="ltr">
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{enr.passToken}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            enr.paymentStatus === 'paid'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          {enr.paymentStatus === 'paid' ? `مدفوع (${enr.amountPaid})` : 'قيد السداد'}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={enr.status}
                          onChange={(e) => handleUpdateStatus(enr.id, e.target.value)}
                          className="bg-[#050E1B] border border-[#19314F] rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-[#1FB6D1]"
                        >
                          <option value="enrolled">مقبول ومثبت</option>
                          <option value="completed">أتم الدورة</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => alert(`بطاقة الدخول للطالب: ${enr.studentName}\nالرمز: ${enr.passToken}`)}
                          className="px-2.5 py-1 rounded-lg bg-[#101C38] hover:bg-[#1FB6D1]/20 text-[#1FB6D1] border border-[#19314F] text-[11px]"
                        >
                          عرض QR
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Enrollment Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="bg-[#081426] border border-[#19314F] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-[#19314F] flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#1FB6D1]" />
                    <span>تسجيل طالب جديد وتأكيد المقعد</span>
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateEnrollment} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      اسم الطبيب / الطالب *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: د. حسنين رحيم الكعبي"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        رقم الهاتف (واتساب) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1FB6D1]"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        placeholder="doctor@example.com"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      الدورة المراد التسجيل بها
                    </label>
                    <select
                      value={newCourseTitle}
                      onChange={(e) => setNewCourseTitle(e.target.value)}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    >
                      <option value="أساسيات طب الأسنان الرقمي وتصميم التركيبات">أساسيات طب الأسنان الرقمي وتصميم التركيبات (Exocad)</option>
                      <option value="تخطيط الزرعات والدليل الجراحي الرقمي">تخطيط الزرعات والدليل الجراحي الرقمي (Exoplan)</option>
                      <option value="الطباعة ثلاثية الأبعاد لطب الأسنان">الطباعة ثلاثية الأبعاد لطب الأسنان (3D Printing)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        المبلغ المسدد
                      </label>
                      <input
                        type="text"
                        value={newAmountPaid}
                        onChange={(e) => setNewAmountPaid(e.target.value)}
                        className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1FB6D1]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        حالة الدفع
                      </label>
                      <select
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                        className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                      >
                        <option value="paid">مسدد بالكامل</option>
                        <option value="pending">دفعة أولى / قيد السداد</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#19314F] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-3.5 py-2 rounded-xl border border-[#19314F] text-slate-300 hover:text-white"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold flex items-center gap-1.5 hover:bg-[#1FB6D1]/90 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{submitting ? 'جارِ التسجيل...' : 'تثبيت التسجيل وإصدار البطاقة'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
