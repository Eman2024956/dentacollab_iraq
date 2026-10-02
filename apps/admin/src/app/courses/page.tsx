'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  Image as ImageIcon,
  Save,
  Check,
  Trash2,
  BookOpen,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import ImageUploadInput from '@/components/ImageUploadInput';

export default function CoursesPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<any | null>(null);
  const [detailsImage, setDetailsImage] = useState('');
  const [savingImage, setSavingImage] = useState(false);
  const [detailsSyllabus, setDetailsSyllabus] = useState<any[]>([]);
  const [savingSyllabus, setSavingSyllabus] = useState(false);
  const [syllabusViewTab, setSyllabusViewTab] = useState<'preview' | 'editor'>('preview');
  const [newOutcomeInput, setNewOutcomeInput] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const isAr = lang === 'ar';

  const defaultExoplanSyllabus = [
    {
      id: 'module_01',
      order: '01',
      title: 'المنهاج التدريبي — المستوى الأساسي للخريجين',
      lessonsCount: '10 درس',
      description: 'مسار عملي كامل من استيراد البيانات حتى طباعة الدليل الجراحي.',
      outcomes: [
        'إكمال تخطيط زرعات أساسي في Exoplan',
        'تصميم دليل جراحي قابل للطباعة',
        'تطبيق مسار الطباعة في Chitbox',
      ],
      lessons: [
        {
          title: 'مقدمة عن برنامج Exoplan',
          description: 'التعرف على الواجهة، الأدوات الأساسية، وسير العمل في البرنامج.',
          mode: 'نظري',
          tags: ['Project setup', 'Workflow overview', 'Interface'],
        },
        {
          title: 'تحميل ومحاذاة ملفات DICOM و STL',
          description: 'استيراد بيانات CBCT والمسح الفموي وتحقيق محاذاة دقيقة.',
          mode: 'عملي',
          tags: ['Alignment', 'STL import', 'DICOM import'],
        },
        {
          title: 'رسم وتحديد مسار العصب وتقسيم الجيوب الأنفية',
          description: 'بناء خريطة أمان تشريحية قبل وضع الزرعات.',
          mode: 'عملي',
          tags: ['Sinus segmentation', 'Nerve canal tracing', 'Safety mapping'],
        },
        {
          title: 'تخطيط الزرعات (الزرعات المنفردة والجسور)',
          description: 'اختيار الزرعة وتخطيط الحالات المنفردة وحالات الجسور.',
          mode: 'عملي',
          tags: ['Implant library', 'Bridge planning', 'Single implant'],
        },
      ],
    },
  ];

  const openCourseDetails = (c: any) => {
    setSelectedCourseForDetails(c);
    setDetailsImage(c.image || c.imageUrl || '');
    if (c.syllabus && Array.isArray(c.syllabus) && c.syllabus.length > 0) {
      setDetailsSyllabus(JSON.parse(JSON.stringify(c.syllabus)));
    } else {
      setDetailsSyllabus(JSON.parse(JSON.stringify(defaultExoplanSyllabus)));
    }
  };

  const handleSaveCourseSyllabus = async () => {
    if (!selectedCourseForDetails) return;
    setSavingSyllabus(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCourseForDetails.id || selectedCourseForDetails.slug,
          syllabus: detailsSyllabus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotice('✅ تم حفظ وتحديث المنهاج التدريبي والدروس سحابياً وفي تطبيق الهاتف بنجاح');
        setTimeout(() => setSuccessNotice(null), 4000);
        setSelectedCourseForDetails((prev: any) =>
          prev ? { ...prev, syllabus: detailsSyllabus } : null
        );
        setCourses((prev) =>
          prev.map((c) =>
            (c.id === selectedCourseForDetails.id || c.slug === selectedCourseForDetails.slug)
              ? { ...c, syllabus: detailsSyllabus }
              : c
          )
        );
      } else {
        alert(data.error || 'فشل حفظ المنهاج');
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء حفظ المنهاج');
    } finally {
      setSavingSyllabus(false);
    }
  };

  const isPublished = (c: any) =>
    (c.status || c.publicationStatus || 'published') !== 'draft' &&
    (c.status || c.publicationStatus) !== 'hidden';

  const handleSaveCourseImage = async () => {
    if (!selectedCourseForDetails) return;
    setSavingImage(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCourseForDetails.id || selectedCourseForDetails.slug,
          image: detailsImage,
          imageUrl: detailsImage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotice('✅ تم حفظ وتحديث صورة غلاف الدورة سحابياً وفي تطبيق الهاتف بنجاح');
        setTimeout(() => setSuccessNotice(null), 4000);
        setSelectedCourseForDetails((prev: any) =>
          prev ? { ...prev, image: detailsImage, imageUrl: detailsImage } : null
        );
        setCourses((prev) =>
          prev.map((c) =>
            (c.id === selectedCourseForDetails.id || c.slug === selectedCourseForDetails.slug)
              ? { ...c, image: detailsImage, imageUrl: detailsImage }
              : c
          )
        );
      } else {
        alert(data.error || 'فشل تحديث صورة الدورة');
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء حفظ الصورة');
    } finally {
      setSavingImage(false);
    }
  };

  const handleToggleCourseStatus = async (course: any) => {
    const nextStatus = isPublished(course) ? 'draft' : 'published';
    const courseId = course.id || course.slug;

    // Optimistic update
    setCourses((prev) =>
      prev.map((c) =>
        (c.id === courseId || c.slug === courseId)
          ? { ...c, status: nextStatus, publicationStatus: nextStatus }
          : c
      )
    );

    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: courseId,
          status: nextStatus,
          publicationStatus: nextStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotice(
          nextStatus === 'published'
            ? `✅ تم إظهار ونشر دورة "${course.titleAr || course.title}" في تطبيق الموبايل والموقع بنجاح`
            : `🔕 تم إخفاء دورة "${course.titleAr || course.title}" عن تطبيق الموبايل والموقع فورياً`
        );
        setTimeout(() => setSuccessNotice(null), 4000);
      } else {
        alert(data.error || 'فشل تغيير حالة ظهور الدورة');
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
      fetchCourses();
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success && data.courses) {
        setCourses(data.courses);
      } else {
        setCourses([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      (c.titleAr && c.titleAr.toLowerCase().includes(search.toLowerCase())) ||
      (c.titleEn && c.titleEn.toLowerCase().includes(search.toLowerCase())) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCourses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCourses.map((c) => c.id || c.slug));
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
      ? filteredCourses.filter((c) => selectedIds.includes(c.id || c.slug))
      : filteredCourses;

    exportToExcel(
      `dentacollab-courses-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'titleAr', label: 'اسم الدورة (بالعربية)' },
        { key: 'titleEn', label: 'Course Title (EN)' },
        { key: 'category', label: 'المسار / البرنامج' },
        { key: 'level', label: 'المستوى' },
        { key: 'price', label: 'السعر المعتمد' },
        { key: 'cohortsCount', label: 'عدد الدفعات' },
        { key: 'totalEnrolled', label: 'الطلاب المسجلون' },
        { key: 'status', label: 'الحالة' },
      ],
      listToExport
    );
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'إدارة الدورات التدريبية' : 'Course Management'}
          subtitle={isAr ? 'تعريف البرامج، الوحدات التعليمية، وتعيين الدفعات المجدولة' : 'Manage course definitions, modules, and schedule cohorts'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Success notice */}
          {successNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  placeholder="ابحث عن دورة أو تقنية (Exocad, Exoplan)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#081426] border border-[#19314F] rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] transition-colors"
                />
              </div>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-[#081426] border border-[#19314F] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#1FB6D1]"
              >
                <option value="all">كل المستويات</option>
                <option value="basic">أساسي</option>
                <option value="advanced">متقدم</option>
              </select>

              <button
                onClick={fetchCourses}
                className="p-2 rounded-xl bg-[#081426] border border-[#19314F] text-slate-400 hover:text-white transition-colors"
                title="تحديث البيانات"
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
                title="تصدير الدورات إلى Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
              </button>

              <Link
                href="/courses/new"
                className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة دورة جديدة</span>
              </Link>
            </div>
          </div>

          {/* Floating Selection Bar */}
          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={filteredCourses.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExportExcel(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === filteredCourses.length && filteredCourses.length > 0}
            itemLabel="دورة تدريبية"
          />

          {/* Courses Table */}
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#050E1B] border-b border-[#19314F] text-slate-400">
                    <th className="p-4 w-10 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-white transition-colors"
                        title={selectedIds.length === filteredCourses.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                      >
                        {selectedIds.length > 0 && selectedIds.length === filteredCourses.length ? (
                          <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4 font-semibold">الدورة التدريبية</th>
                    <th className="p-4 font-semibold">المسار / التقنية</th>
                    <th className="p-4 font-semibold">المستوى</th>
                    <th className="p-4 font-semibold">السعر المعتمد</th>
                    <th className="p-4 font-semibold">الدفعات النشطة</th>
                    <th className="p-4 font-semibold">المسجلون</th>
                    <th className="p-4 font-semibold">الحالة</th>
                    <th className="p-4 font-semibold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19314F]/60">
                  {filteredCourses.map((c) => {
                    const cid = c.id || c.slug;
                    const isSelected = selectedIds.includes(cid);
                    return (
                      <tr
                        key={cid}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-[#1FB6D1]/10 border-l-2 border-l-[#1FB6D1]'
                            : 'hover:bg-[#101C38]/40'
                        }`}
                      >
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleSelectOne(cid)}
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
                          <button
                            type="button"
                            onClick={() => openCourseDetails(c)}
                            className="text-right hover:text-[#1FB6D1] transition-colors flex items-center gap-3 group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-[#081426] border border-[#19314F] overflow-hidden shrink-0 flex items-center justify-center">
                              {c.image || c.imageUrl ? (
                                <img
                                  src={c.image || c.imageUrl}
                                  alt={c.titleAr}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <GraduationCap className="w-5 h-5 text-[#1FB6D1]" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm group-hover:text-[#1FB6D1] transition-colors flex items-center gap-1.5">
                                <span>{c.titleAr}</span>
                                <span className="text-[10px] text-[#1FB6D1] opacity-0 group-hover:opacity-100 transition-opacity bg-[#1FB6D1]/10 px-1.5 py-0.5 rounded">
                                  عرض وتعديل
                                </span>
                              </div>
                              <div className="text-slate-400 text-[11px] font-mono mt-0.5" dir="ltr">{c.titleEn}</div>
                            </div>
                          </button>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg bg-[#101C38] border border-[#19314F] text-[#1FB6D1] font-semibold text-[11px]">
                            {c.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">{c.level}</td>
                        <td className="p-4 font-mono font-semibold text-white">{c.price}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#050E1B] border border-[#19314F] text-slate-300 font-mono">
                            {c.cohortsCount || 1} دفعة
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[#1FB6D1] font-bold font-mono">{c.totalEnrolled || 8} طالب</span>
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleCourseStatus(c)}
                            title={isPublished(c) ? 'انقر لإخفاء الدورة عن التطبيق والموقع' : 'انقر لإظهار ونشر الدورة في التطبيق والموقع'}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold transition-all ${
                              isPublished(c)
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                            }`}
                          >
                            {isPublished(c) ? (
                              <>
                                <ToggleRight className="w-3.5 h-3.5" />
                                <span>ظاهرة في التطبيق ✅</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-3.5 h-3.5" />
                                <span>مخفية 🔕</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => openCourseDetails(c)}
                              className="px-3 py-1.5 rounded-lg bg-[#101C38] border border-[#1FB6D1]/40 text-[#1FB6D1] hover:bg-[#1FB6D1]/10 hover:border-[#1FB6D1] transition-colors flex items-center gap-1.5 text-xs font-semibold"
                              title="عرض بطاقة وتفاصيل الدورة"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>عرض وتعديل</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── COURSE DETAILS CARD COMPONENT MODAL (IN PAGE - NO ROUTE REDIRECT) ─── */}
        {selectedCourseForDetails && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div
              className="bg-[#081426] border border-[#19314F] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card Header */}
              <div className="p-6 bg-gradient-to-r from-[#0E2038] to-[#0A182C] border-b border-[#19314F] flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#1FB6D1]/15 text-[#1FB6D1] border border-[#1FB6D1]/30 text-xs font-bold">
                      {selectedCourseForDetails.category || 'طب الأسنان الرقمي'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleToggleCourseStatus(selectedCourseForDetails);
                        setSelectedCourseForDetails((prev: any) =>
                          prev
                            ? {
                                ...prev,
                                status: isPublished(prev) ? 'draft' : 'published',
                                publicationStatus: isPublished(prev) ? 'draft' : 'published',
                              }
                            : null
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                        isPublished(selectedCourseForDetails)
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                      }`}
                    >
                      {isPublished(selectedCourseForDetails) ? (
                        <>
                          <ToggleRight className="w-3.5 h-3.5" />
                          <span>ظاهرة في التطبيق ✅</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5" />
                          <span>مخفية عن التطبيق 🔕</span>
                        </>
                      )}
                    </button>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                      معرف: {selectedCourseForDetails.slug || selectedCourseForDetails.id}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {selectedCourseForDetails.titleAr}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono" dir="ltr">
                    {selectedCourseForDetails.titleEn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourseForDetails(null)}
                  className="p-2 rounded-xl bg-[#101C38] border border-[#19314F] text-slate-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition-colors"
                  title="إغلاق البطاقة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Card Body & Metrics */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F]">
                    <div className="text-[11px] text-slate-400">السعر المعتمد</div>
                    <div className="text-sm font-bold text-white font-mono mt-1">
                      {selectedCourseForDetails.price || '٤٥٠,٠٠٠ د.ع'}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F]">
                    <div className="text-[11px] text-slate-400">الدفعات النشطة</div>
                    <div className="text-sm font-bold text-[#1FB6D1] font-mono mt-1">
                      {selectedCourseForDetails.cohortsCount || 1} دفعة
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F]">
                    <div className="text-[11px] text-slate-400">الطلاب المسجلين</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
                      {selectedCourseForDetails.totalEnrolled || 8} طالب
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F]">
                    <div className="text-[11px] text-slate-400">حالة النشر</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      مفعلة بالموقع
                    </div>
                  </div>
                </div>

                {/* Course Cover Image (Cloud Storage Upload & Live Preview) */}
                <div className="p-5 rounded-2xl bg-[#050E1B] border border-[#19314F] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <ImageIcon className="w-4 h-4 text-[#1FB6D1]" />
                      <span>صورة غلاف الدورة</span>
                    </div>
                    {detailsImage !== (selectedCourseForDetails.image || selectedCourseForDetails.imageUrl || '') && (
                      <button
                        type="button"
                        onClick={handleSaveCourseImage}
                        disabled={savingImage}
                        className="px-3.5 py-1.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#1FB6D1]/90 transition-all disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingImage ? 'جارِ الحفظ...' : 'حفظ الصورة سحابياً'}</span>
                      </button>
                    )}
                  </div>

                  <ImageUploadInput
                    value={detailsImage}
                    onChange={(url) => setDetailsImage(url)}
                    folder="courses"
                    label=""
                    helperText="ارفع صورة عالية الدقة لغلاف الدورة، ستظهر في بطاقات تطبيق الموبايل وبانر تفاصيل الدورة فورياً."
                  />

                  {detailsImage !== (selectedCourseForDetails.image || selectedCourseForDetails.imageUrl || '') && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveCourseImage}
                        disabled={savingImage}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-[#1FB6D1]/90 transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingImage ? 'جارِ الحفظ...' : 'تأكيد وحفظ صورة الغلاف الجديدة'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* ================= DYNAMIC COURSE SYLLABUS & BATCH LESSONS ================= */}
                <div className="p-5 rounded-2xl bg-[#050E1B] border border-[#19314F] space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#19314F]/60 pb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#1FB6D1]" />
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          المنهاج التدريبي والوحدات التعليمية (Dynamic Syllabus & Batch Lessons)
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          إدارة دفعات الوحدات، مخرجات التعلم، والدروس التدريبية اللحظية لتطبيق الهاتف
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Tabs Switcher */}
                      <div className="flex items-center bg-[#081426] p-1 rounded-xl border border-[#19314F] text-xs">
                        <button
                          type="button"
                          onClick={() => setSyllabusViewTab('preview')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                            syllabusViewTab === 'preview'
                              ? 'bg-[#1FB6D1] text-[#040B18] shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          معاينة شاشة التطبيق
                        </button>
                        <button
                          type="button"
                          onClick={() => setSyllabusViewTab('editor')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                            syllabusViewTab === 'editor'
                              ? 'bg-[#1FB6D1] text-[#040B18] shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          تعديل الدفعة والدروس
                        </button>
                      </div>

                      {/* Save Syllabus Button */}
                      <button
                        type="button"
                        onClick={handleSaveCourseSyllabus}
                        disabled={savingSyllabus}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow disabled:opacity-50 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingSyllabus ? 'جارِ الحفظ...' : 'حفظ المنهاج سحابياً'}</span>
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: LIVE PREVIEW (MATCHING SCREENSHOT IDENTICALLY) */}
                  {syllabusViewTab === 'preview' && (
                    <div className="space-y-6 bg-[#040B18] p-5 rounded-2xl border border-[#19314F]/80">
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-[#19314F]/40">
                        <span>معاينة تفاعلية حية لشاشة تفاصيل الدورة والمنهاج في تطبيق الموبايل:</span>
                        <span className="text-[#1FB6D1] font-mono">Mobile App Layout Preview</span>
                      </div>

                      {detailsSyllabus.map((module: any, mIdx: number) => (
                        <div
                          key={module.id || mIdx}
                          className="bg-white text-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6 relative overflow-hidden"
                          dir="rtl"
                        >
                          {/* Close X icon representation */}
                          <div className="flex justify-between items-start">
                            <span className="text-cyan-500 text-lg font-bold cursor-pointer">✕</span>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <h3 className="text-lg font-black text-slate-900">
                                  {module.title || 'المنهاج التدريبي — المستوى الأساسي للخريجين'}
                                </h3>
                                <p className="text-xs text-slate-500 font-bold mt-0.5">
                                  {module.lessonsCount || `${module.lessons?.length || 0} درس`}
                                </p>
                              </div>
                              <div className="w-12 h-12 rounded-full bg-[#0E1B2E] text-white flex items-center justify-center font-black text-base shadow-md">
                                {module.order || `0${mIdx + 1}`}
                              </div>
                            </div>
                          </div>

                          {/* Track Quote Description */}
                          {module.description && (
                            <div className="border-r-4 border-cyan-500 pr-3 text-xs font-semibold text-slate-600 leading-relaxed">
                              {module.description}
                            </div>
                          )}

                          {/* Learning Outcomes Box */}
                          {module.outcomes && module.outcomes.length > 0 && (
                            <div className="bg-[#F0FDFE] border border-cyan-100 rounded-2xl p-4 space-y-3">
                              <div className="text-xs font-bold text-cyan-700">
                                مخرجات الوحدة
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {module.outcomes.map((outcome: string, oIdx: number) => (
                                  <div
                                    key={oIdx}
                                    className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-sm flex items-center gap-1.5"
                                  >
                                    <span className="text-cyan-600 font-black">✓</span>
                                    <span>{outcome}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Lessons Cards List */}
                          <div className="space-y-3 pt-1">
                            {module.lessons && module.lessons.map((lesson: any, lIdx: number) => (
                              <div
                                key={lIdx}
                                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2.5"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-cyan-600 text-sm">◉</span>
                                  <h4 className="font-bold text-sm text-slate-900">
                                    {lesson.title}
                                  </h4>
                                </div>

                                {lesson.description && (
                                  <p className="text-xs text-slate-600 leading-relaxed pr-5">
                                    {lesson.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-2 pr-5 pt-1">
                                  {/* Training Mode Pill */}
                                  <span className="px-3 py-1 rounded-full bg-[#E0F7FA] text-[#00838F] text-[10.5px] font-bold">
                                    نمط التدريب: {lesson.mode || 'عملي'}
                                  </span>

                                  {/* Topic Tags */}
                                  {lesson.tags && lesson.tags.map((tag: string, tIdx: number) => (
                                    <span
                                      key={tIdx}
                                      className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10.5px] font-medium"
                                      dir="ltr"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: BATCH EDITOR */}
                  {syllabusViewTab === 'editor' && (
                    <div className="space-y-6">
                      {detailsSyllabus.map((module: any, mIdx: number) => (
                        <div
                          key={module.id || mIdx}
                          className="p-5 rounded-2xl bg-[#081426] border border-[#19314F] space-y-5"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-[#19314F]/60">
                            <span className="text-xs font-bold text-[#1FB6D1] flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#1FB6D1] text-[#040B18] flex items-center justify-center font-bold text-xs">
                                {module.order || mIdx + 1}
                              </span>
                              <span>الوحدة التدريبية رقم {mIdx + 1}</span>
                            </span>

                            {detailsSyllabus.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('هل أنت متأكد من حذف هذه الوحدة التدريبية؟')) {
                                    setDetailsSyllabus((prev) => prev.filter((_, idx) => idx !== mIdx));
                                  }
                                }}
                                className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف الوحدة</span>
                              </button>
                            )}
                          </div>

                          {/* Module Header Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block text-slate-300 font-semibold mb-1">رقم/رمز الوحدة</label>
                              <input
                                type="text"
                                value={module.order || `0${mIdx + 1}`}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setDetailsSyllabus((prev) =>
                                    prev.map((m, idx) => idx === mIdx ? { ...m, order: val } : m)
                                  );
                                }}
                                className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl p-2.5 text-white"
                                placeholder="01"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-slate-300 font-semibold mb-1">عنوان الوحدة التدريبية</label>
                              <input
                                type="text"
                                value={module.title || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setDetailsSyllabus((prev) =>
                                    prev.map((m, idx) => idx === mIdx ? { ...m, title: val } : m)
                                  );
                                }}
                                className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl p-2.5 text-white font-bold"
                                placeholder="المنهاج التدريبي — المستوى الأساسي للخريجين"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block text-slate-300 font-semibold mb-1">عدد الدروس</label>
                              <input
                                type="text"
                                value={module.lessonsCount || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setDetailsSyllabus((prev) =>
                                    prev.map((m, idx) => idx === mIdx ? { ...m, lessonsCount: val } : m)
                                  );
                                }}
                                className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl p-2.5 text-white"
                                placeholder="10 درس"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-slate-300 font-semibold mb-1">وصف ومسار الوحدة التدريبية</label>
                              <input
                                type="text"
                                value={module.description || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setDetailsSyllabus((prev) =>
                                    prev.map((m, idx) => idx === mIdx ? { ...m, description: val } : m)
                                  );
                                }}
                                className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl p-2.5 text-white"
                                placeholder="مسار عملي كامل من استيراد البيانات حتى طباعة الدليل الجراحي."
                              />
                            </div>
                          </div>

                          {/* OUTCOMES BATCH SECTION */}
                          <div className="p-4 rounded-xl bg-[#050E1B] border border-[#19314F] space-y-3">
                            <label className="block font-bold text-xs text-[#1FB6D1]">
                              مخرجات الوحدة (Learning Outcomes)
                            </label>

                            <div className="flex flex-wrap gap-2">
                              {(module.outcomes || []).map((outcome: string, oIdx: number) => (
                                <span
                                  key={oIdx}
                                  className="px-3 py-1.5 rounded-full bg-[#101C38] border border-[#1FB6D1]/30 text-white text-xs flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5 text-[#1FB6D1]" />
                                  <span>{outcome}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDetailsSyllabus((prev) =>
                                        prev.map((m, idx) =>
                                          idx === mIdx
                                            ? { ...m, outcomes: m.outcomes.filter((_: any, i: number) => i !== oIdx) }
                                            : m
                                        )
                                      );
                                    }}
                                    className="hover:text-rose-400 mr-1"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>

                            {/* Add Outcome Input */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newOutcomeInput}
                                onChange={(e) => setNewOutcomeInput(e.target.value)}
                                placeholder="أضف مخرج تعليمي جديد (مثال: تصميم دليل جراحي قابل للطباعة)..."
                                className="flex-1 bg-[#081426] border border-[#19314F] rounded-xl px-3 py-2 text-xs text-white"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (!newOutcomeInput.trim()) return;
                                    setDetailsSyllabus((prev) =>
                                      prev.map((m, idx) =>
                                        idx === mIdx
                                          ? { ...m, outcomes: [...(m.outcomes || []), newOutcomeInput.trim()] }
                                          : m
                                      )
                                    );
                                    setNewOutcomeInput('');
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!newOutcomeInput.trim()) return;
                                  setDetailsSyllabus((prev) =>
                                    prev.map((m, idx) =>
                                      idx === mIdx
                                        ? { ...m, outcomes: [...(m.outcomes || []), newOutcomeInput.trim()] }
                                        : m
                                    )
                                  );
                                  setNewOutcomeInput('');
                                }}
                                className="px-3.5 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs"
                              >
                                + إضافة مخرج
                              </button>
                            </div>
                          </div>

                          {/* LESSONS BATCH SECTION */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-xs text-white">
                                الدروس التدريبية ({module.lessons?.length || 0} درس)
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  const newLesson = {
                                    title: 'درس جديد',
                                    description: 'محاور ومحتوى هذا الدرس التدريبي...',
                                    mode: 'عملي',
                                    tags: ['Workflow', 'Practical'],
                                  };
                                  setDetailsSyllabus((prev) =>
                                    prev.map((m, idx) =>
                                      idx === mIdx
                                        ? { ...m, lessons: [...(m.lessons || []), newLesson] }
                                        : m
                                    )
                                  );
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#1FB6D1]/10 border border-[#1FB6D1]/30 text-[#1FB6D1] hover:bg-[#1FB6D1]/20 text-xs font-bold flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>إضافة درس</span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {(module.lessons || []).map((lesson: any, lIdx: number) => (
                                <div
                                  key={lIdx}
                                  className="p-4 rounded-xl bg-[#050E1B] border border-[#19314F] space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white flex items-center gap-2">
                                      <span className="text-[#1FB6D1]">◉</span>
                                      <span>الدرس {lIdx + 1}</span>
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDetailsSyllabus((prev) =>
                                          prev.map((m, idx) =>
                                            idx === mIdx
                                              ? { ...m, lessons: m.lessons.filter((_: any, i: number) => i !== lIdx) }
                                              : m
                                          )
                                        );
                                      }}
                                      className="text-rose-400 hover:text-rose-300 p-1"
                                      title="حذف هذا الدرس"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                    <div className="sm:col-span-2">
                                      <label className="block text-slate-400 text-[11px] mb-1">عنوان الدرس</label>
                                      <input
                                        type="text"
                                        value={lesson.title || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setDetailsSyllabus((prev) =>
                                            prev.map((m, idx) =>
                                              idx === mIdx
                                                ? {
                                                    ...m,
                                                    lessons: m.lessons.map((l: any, i: number) =>
                                                      i === lIdx ? { ...l, title: val } : l
                                                    ),
                                                  }
                                                : m
                                            )
                                          );
                                        }}
                                        className="w-full bg-[#081426] border border-[#19314F] rounded-xl p-2 text-white font-bold"
                                        placeholder="مقدمة عن برنامج Exoplan"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-slate-400 text-[11px] mb-1">نمط التدريب</label>
                                      <select
                                        value={lesson.mode || 'عملي'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setDetailsSyllabus((prev) =>
                                            prev.map((m, idx) =>
                                              idx === mIdx
                                                ? {
                                                    ...m,
                                                    lessons: m.lessons.map((l: any, i: number) =>
                                                      i === lIdx ? { ...l, mode: val } : l
                                                    ),
                                                  }
                                                : m
                                            )
                                          );
                                        }}
                                        className="w-full bg-[#081426] border border-[#19314F] rounded-xl p-2 text-white"
                                      >
                                        <option value="عملي">عملي</option>
                                        <option value="نظري">نظري</option>
                                        <option value="تطبيقي مباشر">تطبيقي مباشر</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="text-xs">
                                    <label className="block text-slate-400 text-[11px] mb-1">وصف ومحاور الدرس</label>
                                    <textarea
                                      rows={2}
                                      value={lesson.description || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setDetailsSyllabus((prev) =>
                                          prev.map((m, idx) =>
                                            idx === mIdx
                                              ? {
                                                  ...m,
                                                  lessons: m.lessons.map((l: any, i: number) =>
                                                    i === lIdx ? { ...l, description: val } : l
                                                  ),
                                                }
                                              : m
                                          )
                                        );
                                      }}
                                      className="w-full bg-[#081426] border border-[#19314F] rounded-xl p-2 text-white"
                                      placeholder="التعرف على الواجهة، الأدوات الأساسية، وسير العمل في البرنامج."
                                    />
                                  </div>

                                  <div className="text-xs">
                                    <label className="block text-slate-400 text-[11px] mb-1">
                                      الكلمات المفتاحية والمحاور (مفصولة بفواصل)
                                    </label>
                                    <input
                                      type="text"
                                      value={(lesson.tags || []).join(', ')}
                                      onChange={(e) => {
                                        const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                                        setDetailsSyllabus((prev) =>
                                          prev.map((m, idx) =>
                                            idx === mIdx
                                              ? {
                                                  ...m,
                                                  lessons: m.lessons.map((l: any, i: number) =>
                                                    i === lIdx ? { ...l, tags } : l
                                                  ),
                                                }
                                              : m
                                          )
                                        );
                                      }}
                                      className="w-full bg-[#081426] border border-[#19314F] rounded-xl p-2 text-white font-mono text-xs"
                                      placeholder="Project setup, Workflow overview, Interface"
                                      dir="ltr"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add new module button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newModIdx = detailsSyllabus.length + 1;
                          const newMod = {
                            id: `module_0${newModIdx}`,
                            order: `0${newModIdx}`,
                            title: `الوحدة التدريبية 0${newModIdx}`,
                            lessonsCount: '4 دروس',
                            description: 'مسار تدريبي متقدم على التطبيقات الرقمية.',
                            outcomes: ['إتقان خطوات العمل المتقدمة'],
                            lessons: [
                              {
                                title: 'مدخل إلى الوحدة',
                                description: 'شرح المحاور والمتطلبات التقنية.',
                                mode: 'نظري',
                                tags: ['Introduction'],
                              },
                            ],
                          };
                          setDetailsSyllabus((prev) => [...prev, newMod]);
                        }}
                        className="w-full py-3 rounded-xl border border-dashed border-[#1FB6D1]/40 text-[#1FB6D1] hover:bg-[#1FB6D1]/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة وحدة تدريبية جديدة إلى الدفعة</span>
                      </button>

                      {/* Submit Syllabus Changes */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleSaveCourseSyllabus}
                          disabled={savingSyllabus}
                          className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center gap-2 shadow-lg hover:bg-[#1FB6D1]/90 disabled:opacity-50 transition-all"
                        >
                          <Save className="w-4 h-4" />
                          <span>{savingSyllabus ? 'جارِ الحفظ السحابي...' : 'تأكيد وحفظ المنهاج والدروس في التطبيق'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Practical Lab & Schedule Info */}
                <div className="p-5 rounded-2xl bg-[#050E1B] border border-[#19314F] space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Calendar className="w-4 h-4 text-[#1FB6D1]" />
                    <span>مقر التدريب والجدول الزمني</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">المكان:</span>
                      <span className="font-semibold text-white">مختبر DentaCollab الرقمي — بغداد، المنصور</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">المواعيد:</span>
                      <span className="font-semibold text-white">الخميس والجمعة (٩:٠٠ ص - ٢:٠٠ م)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">الشهادة:</span>
                      <span className="font-semibold text-emerald-400">شهادة تدريب سريري معتمدة + كود QR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">البرمجية:</span>
                      <span className="font-semibold text-[#1FB6D1] font-mono">{selectedCourseForDetails.category} Professional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#050E1B] border-t border-[#19314F] flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCourseForDetails(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>إغلاق البطاقة</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
