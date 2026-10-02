'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  Users,
  Search,
  Phone,
  Mail,
  Award,
  CheckCircle,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
  RefreshCw,
  BookOpen,
  MapPin,
} from 'lucide-react';

interface Student {
  uid: string;
  displayName?: string;
  name?: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  city?: string;
  profession?: string;
  role?: string;
  enrolledCourses?: string[];
  attendanceRate?: string;
  status?: string;
  createdAt?: string;
}

export default function StudentsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);

  /* ─── Fetch from API ─── */
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success && data.students) {
        setStudents(data.students);
      } else {
        setStudents([]);
      }
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const getName = (st: Student) => st.displayName || st.name || '—';
  const getPhone = (st: Student) => st.phoneNumber || st.phone || '—';

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      getName(s).toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      getPhone(s).includes(search) ||
      (s.city || '').includes(search) ||
      (s.profession || '').includes(search)
    );
  });

  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.length === filteredStudents.length ? [] : filteredStudents.map((s) => s.uid));
  const toggleSelectOne = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const clearSelection = () => setSelectedIds([]);

  const handleExportExcel = (onlySelected = false) => {
    const list = onlySelected ? filteredStudents.filter((s) => selectedIds.includes(s.uid)) : filteredStudents;
    exportToExcel(
      `dentacollab-students-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'displayName', label: 'اسم الطبيب / المتدرب', format: (_, row: any) => row.displayName || row.name || '' },
        { key: 'profession', label: 'التخصص' },
        { key: 'city', label: 'المدينة / المحافظة' },
        { key: 'phoneNumber', label: 'رقم الهاتف', format: (_, row: any) => row.phoneNumber || row.phone || '' },
        { key: 'email', label: 'البريد الإلكتروني' },
        {
          key: 'enrolledCourses',
          label: 'الدورات المسجلة',
          format: (v: any) => Array.isArray(v) ? v.join(' | ') : String(v || ''),
        },
        { key: 'attendanceRate', label: 'نسبة الحضور' },
        { key: 'status', label: 'الحالة' },
      ],
      list
    );
  };

  /* ─── Initials ─── */
  const initials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 3) return parts[1].charAt(0) + parts[2].charAt(0);
    return name.slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'الطلاب والمتدربون' : 'Students & Trainees Directory'}
          subtitle={isAr ? 'سجل الأطباء والمتدربين في دورات وورش عمل أكاديمية DentaCollab' : 'Trainee roster and enrolled dental professionals'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">

          {/* Search + Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم، البريد، الهاتف، التخصص..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#081426] border border-[#19314F] rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                />
              </div>
              <button
                onClick={fetchStudents}
                className="p-2.5 rounded-xl bg-[#081426] border border-[#19314F] text-slate-400 hover:text-white"
                title="تحديث"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1FB6D1]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  إلغاء التحديد ({selectedIds.length})
                </button>
              )}
              <button
                onClick={() => handleExportExcel(selectedIds.length > 0)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : '(الكل)'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>الإجمالي: <span className="text-white font-bold">{students.length}</span> متدرب</span>
            <span>نشط: <span className="text-emerald-400 font-bold">{students.filter((s) => (s.status || 'active') === 'active').length}</span></span>
            {filteredStudents.length !== students.length && (
              <span>نتائج البحث: <span className="text-[#1FB6D1] font-bold">{filteredStudents.length}</span></span>
            )}
          </div>

          {/* Floating Selection Bar */}
          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={filteredStudents.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExportExcel(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
            itemLabel="طبيب / متدرب"
          />

          {/* Table */}
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#050E1B] border-b border-[#19314F] text-slate-400">
                    <th className="p-4 w-10 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-white"
                        title={selectedIds.length === filteredStudents.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                      >
                        {selectedIds.length > 0 && selectedIds.length === filteredStudents.length
                          ? <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                          : <Square className="w-4 h-4" />
                        }
                      </button>
                    </th>
                    <th className="p-4 font-semibold">المتدرب</th>
                    <th className="p-4 font-semibold">التخصص والمدينة</th>
                    <th className="p-4 font-semibold">بيانات التواصل</th>
                    <th className="p-4 font-semibold">الدورات المسجلة</th>
                    <th className="p-4 font-semibold">الحضور</th>
                    <th className="p-4 font-semibold text-center">الملف الشخصي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19314F]/60">
                  {loading && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <RefreshCw className="w-4 h-4 animate-spin inline ml-2 text-[#1FB6D1]" />
                        جاري التحميل...
                      </td>
                    </tr>
                  )}
                  {!loading && filteredStudents.map((st) => {
                    const isSelected = selectedIds.includes(st.uid);
                    return (
                      <tr
                        key={st.uid}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-[#1FB6D1]/10 border-l-2 border-l-[#1FB6D1]'
                            : 'hover:bg-[#101C38]/40'
                        }`}
                      >
                        <td className="p-4 text-center">
                          <button onClick={() => toggleSelectOne(st.uid)} className="text-slate-400 hover:text-white">
                            {isSelected
                              ? <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                              : <Square className="w-4 h-4" />
                            }
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1FB6D1]/30 to-[#1FB6D1]/10 border border-[#1FB6D1]/30 flex items-center justify-center font-bold text-white text-xs shrink-0">
                              {initials(getName(st))}
                            </div>
                            <div>
                              <div className="font-bold text-white">{getName(st)}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{st.uid}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-200 font-medium">{st.profession}</div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {st.city}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-slate-300 font-mono" dir="ltr">
                            <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                            {getPhone(st)}
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                            <Mail className="w-3 h-3 shrink-0" />
                            {st.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {(st.enrolledCourses || []).slice(0, 2).map((c, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-[#101C38] border border-[#19314F] text-[#1FB6D1] font-semibold text-[10px] truncate max-w-[180px]"
                              >
                                {c}
                              </span>
                            ))}
                            {(st.enrolledCourses || []).length > 2 && (
                              <span className="text-[10px] text-slate-500">+{(st.enrolledCourses || []).length - 2} أخرى</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${
                            (st.attendanceRate || '').includes('١٠٠') ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {st.attendanceRate || '—'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setProfileStudent(st)}
                            className="px-3 py-1.5 rounded-lg bg-[#101C38] border border-[#19314F] text-slate-300 hover:text-white hover:border-[#1FB6D1] transition-colors text-[11px] font-semibold flex items-center gap-1 mx-auto"
                          >
                            <Award className="w-3 h-3" />
                            عرض الملف
                          </button>
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

      {/* ══════════════════════════════════════════════
          Student Profile Modal
      ══════════════════════════════════════════════ */}
      {profileStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[#19314F] flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1FB6D1]/40 to-[#1FB6D1]/10 border border-[#1FB6D1]/30 flex items-center justify-center font-bold text-white text-lg">
                  {initials(getName(profileStudent))}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{getName(profileStudent)}</h3>
                  <div className="text-xs text-[#1FB6D1] mt-0.5">{profileStudent.profession}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {profileStudent.city}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setProfileStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#050E1B] border border-[#19314F]">
                  <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> رقم الهاتف
                  </div>
                  <div className="text-white font-mono text-xs" dir="ltr">{getPhone(profileStudent)}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#050E1B] border border-[#19314F]">
                  <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> البريد الإلكتروني
                  </div>
                  <div className="text-white text-xs truncate" dir="ltr">{profileStudent.email}</div>
                </div>
              </div>

              {/* Courses enrolled */}
              <div className="p-4 rounded-xl bg-[#050E1B] border border-[#19314F]">
                <div className="text-[10px] text-slate-500 mb-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> الدورات المسجلة
                </div>
                {(profileStudent.enrolledCourses || []).length === 0
                  ? <span className="text-slate-600 text-xs">لا توجد دورات مسجلة</span>
                  : (
                    <div className="flex flex-col gap-2">
                      {(profileStudent.enrolledCourses || []).map((c, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#1FB6D1] font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          {c}
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>

              {/* Attendance + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#050E1B] border border-[#19314F]">
                  <div className="text-[10px] text-slate-500 mb-1">نسبة الحضور</div>
                  <div className={`font-bold text-sm ${(profileStudent.attendanceRate || '').includes('١٠٠') ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {profileStudent.attendanceRate || '—'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#050E1B] border border-[#19314F]">
                  <div className="text-[10px] text-slate-500 mb-1">حالة الحساب</div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    {profileStudent.status === 'active' ? 'نشط ✓' : profileStudent.status || 'نشط'}
                  </span>
                </div>
              </div>

              {/* UID */}
              <div className="text-[10px] text-slate-600 font-mono text-center">
                User ID: {profileStudent.uid}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[#19314F] flex items-center justify-between gap-3">
              <a
                href={`https://wa.me/${getPhone(profileStudent).replace(/[\s+]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                واتساب / اتصال
              </a>
              <button
                onClick={() => setProfileStudent(null)}
                className="px-4 py-2 rounded-xl border border-[#19314F] text-slate-300 hover:text-white text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
