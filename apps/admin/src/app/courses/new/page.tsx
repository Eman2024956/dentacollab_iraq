'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  GraduationCap,
  ArrowRight,
  Save,
  Layers,
  Sparkles,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageUploadInput from '@/components/ImageUploadInput';

export default function NewCoursePage() {
  const router = useRouter();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    category: 'Exocad',
    level: 'basic',
    priceMinorUnits: 450000,
    descriptionAr: '',
    descriptionEn: '',
    cohortTitle: '',
    venueName: 'مقر أكاديمية DentaCollab — بغداد، المنصور',
    maxCapacity: 12,
    image: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr) {
      setMessage({ type: 'error', text: 'يرجى كتابة عنوان الدورة بالعربية' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل في حفظ الدورة');
      }

      setMessage({ type: 'success', text: 'تم إنشاء الدورة التدريبية وحفظها سحابياً بنجاح!' });
      setTimeout(() => {
        router.push('/courses');
      }, 1200);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء حفظ الدورة' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'إضافة دورة تدريبية جديدة' : 'Add New Course'}
          subtitle={isAr ? 'تسجيل برنامج تدريبي جديد في الأكاديمية وربطه بدفعة أولية' : 'Create a new training course program and schedule its initial cohort'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto max-w-4xl">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="px-3 py-1.5 rounded-xl bg-[#081426] border border-[#19314F] text-slate-300 hover:text-white hover:border-[#1FB6D1] text-xs flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لقائمة الدورات</span>
            </Link>
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 space-y-6">
            <div className="border-b border-[#19314F]/60 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1FB6D1]" />
                <span>البيانات الأساسية للدورة</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تظهر هذه التفاصيل في تطبيق الهاتف المحمول والموقع التعريفي للأكاديمية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  عنوان الدورة (بالعربية) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دبلوم تصميم الابتسامة الرقمية وتركيبات Exocad"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Course Title (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Digital Smile Design & Advanced Exocad"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  المسار والتقنية
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#1FB6D1]"
                >
                  <option value="Exocad">برمجيات Exocad لتصميم التركيبات</option>
                  <option value="Exoplan">برمجيات Exoplan للجراحة الموجهة</option>
                  <option value="3D Printing">تقنيات الطباعة ثلاثية الأبعاد</option>
                  <option value="Intraoral Scanning">المسح الفموي الرقمي (Intraoral)</option>
                  <option value="Digital Photography">التصوير السريري الرقمي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  المستوى التدريبي
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#1FB6D1]"
                >
                  <option value="basic">مبتدئ / أساسي</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">متقدم / استشاري</option>
                  <option value="all_levels">جميع المستويات</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  السعر المعتمد (دينار عراقي IQD) *
                </label>
                <input
                  type="number"
                  required
                  step="50000"
                  value={formData.priceMinorUnits}
                  onChange={(e) => setFormData({ ...formData, priceMinorUnits: Number(e.target.value) })}
                  className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#1FB6D1] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  الحد الأقصى للمقاعد في الدفعة
                </label>
                <input
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                  className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#1FB6D1] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                نبذة تفصيلية عن الدورة (بالعربية)
              </label>
              <textarea
                rows={3}
                placeholder="تفاصيل المحاور التعليمية، التطبيق العملي، ومخرجات الدورة السريرية..."
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
              />
            </div>

            {/* Course Cover Image */}
            <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F]">
              <ImageUploadInput
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url, imageUrl: url }))}
                folder="courses"
                label="صورة غلاف الدورة التدريبية"
                helperText="ارفع صورة عالية الدقة لغلاف الدورة، ستظهر في بطاقات تطبيق الموبايل وبانر تفاصيل الدورة فورياً."
              />
            </div>

            <div className="pt-4 border-t border-[#19314F]/60 flex items-center justify-end gap-3">
              <Link
                href="/courses"
                className="px-4 py-2.5 rounded-xl border border-[#19314F] text-slate-300 hover:text-white text-xs transition-colors"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'جارِ الحفظ...' : 'حفظ ونشر الدورة في الأكاديمية'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
