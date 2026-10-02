'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ImageUploadInput from '@/components/ImageUploadInput';
import {
  Sliders,
  Eye,
  EyeOff,
  Sparkles,
  Play,
  Pause,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  RefreshCw,
  Image as ImageIcon,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  image?: string;
  actionType: 'courses' | 'workshops' | 'services' | 'none';
  actionText: string;
  order?: number;
}

export default function BannerSettingsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Settings
  const [isVisible, setIsVisible] = useState(true);
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [animationInterval, setAnimationInterval] = useState(4);
  const [slides, setSlides] = useState<BannerSlide[]>([]);

  // Preview active index
  const [previewIndex, setPreviewIndex] = useState(0);

  // Slide modal
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [formTag, setFormTag] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formActionType, setFormActionType] = useState<'courses' | 'workshops' | 'services' | 'none'>('courses');
  const [formActionText, setFormActionText] = useState('استكشف الدورات');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banner-settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setIsVisible(data.settings.isVisible !== undefined ? data.settings.isVisible : true);
        setEnableAnimation(data.settings.enableAnimation !== undefined ? data.settings.enableAnimation : true);
        setAnimationInterval(data.settings.animationIntervalSeconds || 4);
        setSlides(data.settings.slides || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Auto-slide preview if animation enabled
  useEffect(() => {
    if (!enableAnimation || slides.length <= 1) return;
    const interval = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % slides.length);
    }, animationInterval * 1000);
    return () => clearInterval(interval);
  }, [enableAnimation, animationInterval, slides.length]);

  const handleSaveSettings = async (customOverrides?: Partial<{ isVisible: boolean; enableAnimation: boolean; slides: BannerSlide[] }>) => {
    setSaving(true);
    try {
      const payload = {
        isVisible: customOverrides?.isVisible !== undefined ? customOverrides.isVisible : isVisible,
        enableAnimation: customOverrides?.enableAnimation !== undefined ? customOverrides.enableAnimation : enableAnimation,
        animationIntervalSeconds: animationInterval,
        slides: customOverrides?.slides || slides,
      };

      const res = await fetch('/api/banner-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotice('✅ تم حفظ إعدادات البانر ومزامنته مع تطبيق الهاتف فورياً');
        setTimeout(() => setSuccessNotice(null), 4000);
      } else {
        alert(data.error || 'فشل حفظ الإعدادات');
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const openAddSlide = () => {
    setEditingSlide(null);
    setFormTag('التدريب الميداني المعتمد');
    setFormTitle('');
    setFormDescription('');
    setFormImage('');
    setFormActionType('courses');
    setFormActionText('استكشف الدورات');
    setShowSlideModal(true);
  };

  const openEditSlide = (slide: BannerSlide) => {
    setEditingSlide(slide);
    setFormTag(slide.tag || '');
    setFormTitle(slide.title || '');
    setFormDescription(slide.description || '');
    setFormImage(slide.image || '');
    setFormActionType(slide.actionType || 'courses');
    setFormActionText(slide.actionText || 'استكشف الدورات');
    setShowSlideModal(true);
  };

  const handleSaveSlideForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('عنوان الشريحة مطلوب');
      return;
    }

    let updatedList: BannerSlide[];
    if (editingSlide) {
      updatedList = slides.map((s) =>
        s.id === editingSlide.id
          ? {
              ...s,
              tag: formTag,
              title: formTitle,
              description: formDescription,
              image: formImage,
              actionType: formActionType,
              actionText: formActionText,
            }
          : s
      );
    } else {
      const newSlide: BannerSlide = {
        id: `slide_${Date.now()}`,
        tag: formTag,
        title: formTitle,
        description: formDescription,
        image: formImage,
        actionType: formActionType,
        actionText: formActionText,
        order: slides.length + 1,
      };
      updatedList = [...slides, newSlide];
    }

    setSlides(updatedList);
    setShowSlideModal(false);
    handleSaveSettings({ slides: updatedList });
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('يجب أن تحتوي الأكاديمية على شريحة واحدة على الأقل في البانر');
      return;
    }
    if (!confirm('هل أنت متأكد من حذف هذه الشريحة؟')) return;
    const updated = slides.filter((s) => s.id !== id);
    setSlides(updated);
    if (previewIndex >= updated.length) setPreviewIndex(0);
    handleSaveSettings({ slides: updated });
  };

  const currentPreviewSlide = slides[previewIndex] || slides[0] || {
    tag: 'التدريب الميداني المعتمد',
    title: 'صمّم. خطّط. نفّذ.',
    description: 'برامج تدريبية تخصصية في التصميم الرقمي عبر Exocad...',
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'إعدادات البانر المتحرك (Slider Banner)' : 'Hero Slider Banner Settings'}
          subtitle={isAr ? 'التحكم بظهور البانر، تفعيل الحركة التلقائية، وتعديل شرائح الواجهة الرئيسية للتطبيق' : 'Manage mobile home slider visibility, animation toggle, and banner slides'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-8 flex-1 overflow-y-auto max-w-6xl">
          {/* Success notice */}
          {successNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Top Control Bar with 2 Required Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Toggle 1: Hide or View */}
            <div className="p-5 rounded-2xl bg-[#081426] border border-[#19314F] flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">حالة ظهور البانر في التطبيق</span>
                <span className={`p-1.5 rounded-lg ${isVisible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  {isVisible ? 'ظاهر ومعروض في الموبايل' : 'مخفي تماماً عن الموبايل'}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  تحكم فوري بإظهار أو إخفاء قسم البانر بالكامل عن واجهة مستخدمي تطبيق الهاتف.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !isVisible;
                  setIsVisible(nextVal);
                  handleSaveSettings({ isVisible: nextVal });
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                  isVisible
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                }`}
              >
                {isVisible ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>انقر لإخفاء البانر (Hide Banner) 🔕</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>انقر لإظهار البانر (Show Banner) ✅</span>
                  </>
                )}
              </button>
            </div>

            {/* Toggle 2: Disable / Enable Animation */}
            <div className="p-5 rounded-2xl bg-[#081426] border border-[#19314F] flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">حركة التمرير التلقائي (Animation)</span>
                <span className={`p-1.5 rounded-lg ${enableAnimation ? 'bg-[#1FB6D1]/15 text-[#1FB6D1]' : 'bg-slate-800 text-slate-400'}`}>
                  {enableAnimation ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  {enableAnimation ? 'الحركة التلقائية مفعلة' : 'الحركة معطلة (تمرير يدوي)'}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  عند تفعيلها، ينتقل السلايدر تلقائياً بين الشرائح بحركات ناعمة. عند التعطيل، يتوقف التمرير الآلي.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !enableAnimation;
                  setEnableAnimation(nextVal);
                  handleSaveSettings({ enableAnimation: nextVal });
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                  enableAnimation
                    ? 'bg-[#1FB6D1]/15 border-[#1FB6D1]/30 text-[#1FB6D1] hover:bg-slate-800 hover:text-slate-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-[#1FB6D1]/15 hover:text-[#1FB6D1]'
                }`}
              >
                {enableAnimation ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>تعطيل الحركة (Disable Animation) ⏸️</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>تفعيل الحركة (Enable Animation) ⚡️</span>
                  </>
                )}
              </button>
            </div>

            {/* Animation Speed Selector */}
            <div className="p-5 rounded-2xl bg-[#081426] border border-[#19314F] flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">سرعة التبديل بين الشرائح</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  كل {animationInterval} ثوانٍ
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  المدة الزمنية الفاصلة بين كل شريحة والأخرى أثناء التمرير التلقائي في تطبيق الهاتف.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {[3, 4, 5, 7].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      setAnimationInterval(sec);
                      handleSaveSettings();
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-colors ${
                      animationInterval === sec
                        ? 'bg-[#1FB6D1] text-[#040B18]'
                        : 'bg-[#050E1B] border border-[#19314F] text-slate-300 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Mobile Simulation Preview */}
          <div className="p-6 rounded-3xl bg-[#081426] border border-[#19314F] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#1FB6D1]" />
                <span>معاينة حية لشكل البانر في تطبيق الهاتف (Live Mobile Preview)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  شريحة {previewIndex + 1} من {slides.length}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                  className="p-1.5 rounded-lg bg-[#050E1B] border border-[#19314F] text-slate-300 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev + 1) % slides.length)}
                  className="p-1.5 rounded-lg bg-[#050E1B] border border-[#19314F] text-slate-300 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Banner Box */}
            <div className="relative rounded-3xl overflow-hidden p-7 shadow-2xl bg-gradient-to-br from-[#0FA5BA] to-[#0A8094] border border-white/20 transition-all duration-500">
              {!isVisible && (
                <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <EyeOff className="w-8 h-8 text-amber-400 mb-2" />
                  <span className="text-sm font-bold text-white">البانر مخفي حالياً في تطبيق الهاتف</span>
                  <span className="text-xs text-slate-400 mt-1">قم بتفعيل زر "إظهار البانر" أعلاه لجعله مرئياً للمستخدمين</span>
                </div>
              )}

              <div className="relative z-10 space-y-3 max-w-xl text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold">
                  {currentPreviewSlide.tag || 'التدريب الميداني المعتمد'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {currentPreviewSlide.title || 'صمّم. خطّط. نفّذ.'}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  {currentPreviewSlide.description || 'برامج تدريبية تخصصية في التصميم الرقمي عبر Exocad، وتخطيط الزرعات Exoplan، والطباعة ثلاثية الأبعاد بأحدث المعدات في بغداد.'}
                </p>

                {currentPreviewSlide.actionText && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#0A8094] font-bold text-xs shadow-md">
                      <span>{currentPreviewSlide.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </span>
                  </div>
                )}
              </div>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-6 flex items-center gap-1.5 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPreviewIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      previewIndex === i ? 'w-6 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Slides List & Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">إدارة شرائح البانر (Banner Slides)</h3>
                <p className="text-xs text-slate-400 mt-0.5">يمكنك إضافة، تعديل وحذف الشرائح المعروضة داخل السلايدر.</p>
              </div>
              <button
                type="button"
                onClick={openAddSlide}
                className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة شريحة جديدة للبانر</span>
              </button>
            </div>

            {/* Slides Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {slides.map((s, idx) => (
                <div
                  key={s.id || idx}
                  className="p-5 rounded-2xl bg-[#081426] border border-[#19314F] hover:border-[#1FB6D1]/40 flex flex-col justify-between space-y-4 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#1FB6D1]/15 text-[#1FB6D1] text-[10px] font-bold">
                        {s.tag || 'شارة الشريحة'}
                      </span>
                      <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug">{s.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{s.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#19314F] flex items-center justify-between">
                    <span className="text-[11px] text-[#1FB6D1] font-semibold">
                      زر: {s.actionText || 'عرض المزيد'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditSlide(s)}
                        className="p-2 rounded-xl bg-[#101C38] border border-[#19314F] text-slate-300 hover:text-white hover:border-[#1FB6D1] transition-colors"
                        title="تعديل الشريحة"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(s.id)}
                        className="p-2 rounded-xl bg-[#101C38] border border-[#19314F] text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                        title="حذف الشريحة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add / Edit Slide Modal */}
        {showSlideModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div
              className="bg-[#081426] border border-[#19314F] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 bg-gradient-to-r from-[#0E2038] to-[#0A182C] border-b border-[#19314F] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#1FB6D1]" />
                  <h3 className="font-bold text-white text-base">
                    {editingSlide ? 'تعديل شريحة البانر' : 'إضافة شريحة جديدة للبانر'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSlideModal(false)}
                  className="p-2 rounded-xl bg-[#101C38] text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveSlideForm} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">شارة البانر العلوية (Tag Badge)</label>
                  <input
                    type="text"
                    required
                    placeholder="التدريب الميداني المعتمد"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">العنوان الرئيسي للشريحة (Title) *</label>
                  <input
                    type="text"
                    required
                    placeholder="صمّم. خطّط. نفّذ."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">النص التوضيحي (Description) *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="برامج تدريبية تخصصية في التصميم الرقمي عبر Exocad..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">وجهة النقر (Action Target)</label>
                    <select
                      value={formActionType}
                      onChange={(e: any) => setFormActionType(e.target.value)}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    >
                      <option value="courses">شاشة الدورات التدريبية</option>
                      <option value="workshops">شاشة ورش العمل</option>
                      <option value="services">شاشة خدمات المختبر</option>
                      <option value="none">بدون انتقال</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">نص زر الشريحة</label>
                    <input
                      type="text"
                      placeholder="استكشف الدورات"
                      value={formActionText}
                      onChange={(e) => setFormActionText(e.target.value)}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#050E1B] border border-[#19314F]">
                  <ImageUploadInput
                    value={formImage}
                    onChange={setFormImage}
                    folder="banners"
                    label="صورة أو رسمة توضيحية للشريحة (اختياري)"
                    helperText="يمكنك رفع صورة عالية الدقة أو تركها خالية للاكتفاء بالتدرج اللوني الجمالي للأكاديمية."
                  />
                </div>

                <div className="pt-4 border-t border-[#19314F] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSlideModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#19314F] text-slate-300 hover:text-white"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold flex items-center gap-2 hover:bg-[#1FB6D1]/90 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingSlide ? 'حفظ تعديلات الشريحة' : 'إضافة الشريحة'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
