'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  GraduationCap,
  ArrowRight,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Clock,
  Layers,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import ImageUploadInput from '@/components/ImageUploadInput';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [course, setCourse] = useState<any>({
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
    category: 'Exocad',
    level: 'basic',
    priceMinorUnits: 450000,
    publicationStatus: 'published',
  });

  const [modules, setModules] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);

  useEffect(() => {
    async function loadCourse() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/courses/${slug}`);
        const data = await res.json();
        if (data.success && data.course) {
          setCourse(data.course);
          setModules(data.modules || []);
          setCohorts(data.cohorts || []);
        } else {
          setNotice({ type: 'error', text: data.error || 'تعذر تحميل بيانات الدورة' });
        }
      } catch (err: any) {
        setNotice({ type: 'error', text: err.message || 'خطأ في الاتصال' });
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/courses/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل في حفظ التعديلات');
      }

      setNotice({ type: 'success', text: 'تم حفظ وتحديث تفاصيل الدورة سحابياً بنجاح!' });
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'حدث خطأ' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={course?.title?.ar || 'تفاصيل الدورة التدريبية'}
          subtitle={isAr ? `تعديل وإدارة محتوى الدورة في الموقع وتطبيق الهاتف (${slug})` : `Edit course details & modules for public web and app`}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto max-w-5xl">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/courses"
                className="px-3 py-1.5 rounded-xl bg-[#081426] border border-[#19314F] text-slate-300 hover:text-white text-xs flex items-center gap-2 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة لقائمة الدورات</span>
              </Link>

              <span className="px-2.5 py-1 rounded-lg bg-[#101C38] border border-[#19314F] text-[#1FB6D1] font-mono text-xs">
                {slug}
              </span>
            </div>

            <a
              href={`http://localhost:5173/courses/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#081426] border border-[#1FB6D1]/40 text-[#1FB6D1] hover:bg-[#1FB6D1]/10 text-xs flex items-center gap-2 transition-colors"
            >
              <span>معاينة في الموقع العام (localhost:5173)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {notice && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
                notice.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {notice.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{notice.text}</span>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              جارِ تحميل بيانات الدورة...
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Course Info Card */}
              <div className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 space-y-4">
                <div className="border-b border-[#19314F]/60 pb-3 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#1FB6D1]" />
                    <span>البيانات الأساسية للدورة</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">تنعكس التعديلات فورياً في الموقع وتطبيق الهاتف</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      عنوان الدورة (العربية) *
                    </label>
                    <input
                      type="text"
                      required
                      value={course?.title?.ar || ''}
                      onChange={(e) => setCourse({ ...course, title: { ...course.title, ar: e.target.value } })}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Course Title (English)
                    </label>
                    <input
                      type="text"
                      value={course?.title?.en || ''}
                      onChange={(e) => setCourse({ ...course, title: { ...course.title, en: e.target.value } })}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      المسار والتقنية
                    </label>
                    <select
                      value={course?.category || 'Exocad'}
                      onChange={(e) => setCourse({ ...course, category: e.target.value })}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    >
                      <option value="Exocad">Exocad (التصميم الرقمي)</option>
                      <option value="Exoplan">Exoplan (الجراحة الموجهة)</option>
                      <option value="3D Printing">3D Printing (الطباعة ثلاثية الأبعاد)</option>
                      <option value="Intraoral Scanning">Intraoral Scanning (المسح الفموي)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      المستوى
                    </label>
                    <select
                      value={course?.level || 'basic'}
                      onChange={(e) => setCourse({ ...course, level: e.target.value })}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    >
                      <option value="basic">مبتدئ / أساسي</option>
                      <option value="intermediate">متوسط</option>
                      <option value="advanced">متقدم</option>
                      <option value="all_levels">جميع المستويات</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      الرسوم المعتمدة (دينار عراقي IQD)
                    </label>
                    <input
                      type="number"
                      step="25000"
                      value={course?.priceMinorUnits || 450000}
                      onChange={(e) => setCourse({ ...course, priceMinorUnits: Number(e.target.value) })}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1FB6D1]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      حالة النشر
                    </label>
                    <select
                      value={course?.publicationStatus || 'published'}
                      onChange={(e) => setCourse({ ...course, publicationStatus: e.target.value })}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    >
                      <option value="published">منشورة ومفعلة</option>
                      <option value="draft">مسودة داخلية</option>
                      <option value="archived">مؤرشفة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 text-xs">
                    الوصف التفصيلي للدورة (بالعربية)
                  </label>
                  <textarea
                    rows={3}
                    value={course?.description?.ar || ''}
                    onChange={(e) => setCourse({ ...course, description: { ...course.description, ar: e.target.value } })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 text-xs">
                    Course Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={course?.description?.en || ''}
                    onChange={(e) => setCourse({ ...course, description: { ...course.description, en: e.target.value } })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1FB6D1]"
                    dir="ltr"
                  />
                </div>

                {/* Course Image Upload */}
                <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F]">
                  <ImageUploadInput
                    value={course?.image || course?.imageUrl || ''}
                    onChange={(url) => setCourse({ ...course, image: url, imageUrl: url })}
                    folder="courses"
                    label="صورة غلاف الدورة التدريبية"
                    helperText="ارفع صورة عالية الدقة للغلاف، وستنعكس في تطبيق الموبايل وبانر الدورة فورياً."
                  />
                </div>
              </div>

              {/* Modules breakdown */}
              <div className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 space-y-4">
                <div className="border-b border-[#19314F]/60 pb-3 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#1FB6D1]" />
                    <span>الوحدات والدروس التعليمية المعتمدة ({modules.length} وحدات)</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {modules.map((m, idx) => (
                    <div key={m.id || idx} className="p-4 rounded-xl bg-[#050E1B] border border-[#19314F] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1FB6D1]">
                          الوحدة {idx + 1}: {m.title?.ar || m.title || 'وحدة تعليمية'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                          {m.title?.en}
                        </span>
                      </div>
                      {m.lessons && (
                        <div className="space-y-1 pt-2 border-t border-[#19314F]/40">
                          {m.lessons.map((les: any, lIdx: number) => (
                            <div key={les.id || lIdx} className="text-[11px] text-slate-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1FB6D1]" />
                              <span>{les.title?.ar || les.title}</span>
                              <span className="text-slate-500 font-mono" dir="ltr">({les.title?.en})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  href="/courses"
                  className="px-4 py-2.5 rounded-xl border border-[#19314F] text-slate-300 hover:text-white text-xs transition-colors"
                >
                  إلغاء
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'جارِ الحفظ...' : 'حفظ ونشر التعديلات'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
