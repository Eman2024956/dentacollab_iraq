'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  Settings,
  Save,
  CheckCircle2,
  Building,
  Phone,
  MapPin,
  Globe,
  Users,
  Award,
  Image as ImageIcon,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Database,
  Download,
  Upload,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
  AlertTriangle,
  HardDriveDownload,
  HardDriveUpload,
} from 'lucide-react';

export default function SettingsCMSPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'general' | 'about' | 'instructors' | 'graduates' | 'gallery' | 'backup'>('general');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Selection states for dynamic lists
  const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>([]);
  const [selectedGraduateIds, setSelectedGraduateIds] = useState<string[]>([]);
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<string[]>([]);

  // Backup & Restore states
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restorePreview, setRestorePreview] = useState<any | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Content state
  const [settings, setSettings] = useState({
    academyNameAr: 'أكاديمية DentaCollab لطب الأسنان الرقمي',
    academyNameEn: 'DentaCollab Digital Dentistry Academy',
    taglineAr: 'صمّم. خطّط. نفّذ.',
    taglineEn: 'Design. Plan. Execute.',
    contactWhatsApp: '+9647817828545',
    contactPhone: '+9647817828545',
    contactEmail: 'info@dentacollab.org',
    locationAddressAr: 'بغداد، العراق — المنصور، قرب ساحة الرواد',
    locationAddressEn: 'Baghdad, Iraq — Al-Mansour, near Al-Rowad Sq.',
    mapsUrl: 'https://maps.app.goo.gl/qJ7KMyB6dQEuxGQE7?g_st=ic',
    aboutVisionAr: 'أول أكاديمية ومختبر تدريبي تخصصي في العراق يقدّم تأهيلاً سريرياً وتطبيقاً فردياً على برمجيات Exocad و Exoplan وأحدث طابعات الراتنج ثلاثية الأبعاد.',
    aboutVisionEn: 'Iraq’s premier clinical training academy and digital lab offering hands-on workstation training on Exocad, Exoplan, and advanced 3D resin printing.',
  });

  const [instructorsList, setInstructorsList] = useState<any[]>([]);
  const [graduatesList, setGraduatesList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success) {
        if (data.settings) {
          setSettings({
            academyNameAr: data.settings.academyName?.ar || settings.academyNameAr,
            academyNameEn: data.settings.academyName?.en || settings.academyNameEn,
            taglineAr: data.settings.tagline?.ar || settings.taglineAr,
            taglineEn: data.settings.tagline?.en || settings.taglineEn,
            contactWhatsApp: data.settings.contactPhone || settings.contactWhatsApp,
            contactPhone: data.settings.contactPhone || settings.contactPhone,
            contactEmail: data.settings.contactEmail || settings.contactEmail,
            locationAddressAr: data.settings.academyLocationAddress?.ar || settings.locationAddressAr,
            locationAddressEn: data.settings.academyLocationAddress?.en || settings.locationAddressEn,
            mapsUrl: data.settings.academyLocationMapUrl || settings.mapsUrl,
            aboutVisionAr: data.settings.aboutVision?.ar || settings.aboutVisionAr,
            aboutVisionEn: data.settings.aboutVision?.en || settings.aboutVisionEn,
          });
        }
        if (data.instructors) setInstructorsList(data.instructors);
        if (data.graduates) setGraduatesList(data.graduates);
        if (data.gallery) setGalleryList(data.gallery);
      }
    } catch (e) {
      console.error('Error fetching CMS content:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        academyName: { ar: settings.academyNameAr, en: settings.academyNameEn },
        tagline: { ar: settings.taglineAr, en: settings.taglineEn },
        contactPhone: settings.contactPhone,
        contactWhatsApp: `https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}`,
        contactEmail: settings.contactEmail,
        academyLocationAddress: { ar: settings.locationAddressAr, en: settings.locationAddressEn },
        academyLocationMapUrl: settings.mapsUrl,
        aboutVision: { ar: settings.aboutVisionAr, en: settings.aboutVisionEn },
      };

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', data: payload }),
      });

      const resData = await res.json();
      if (resData.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Selection handlers
  const toggleSelectInstructor = (id: string) => {
    setSelectedInstructorIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectGraduate = (id: string) => {
    setSelectedGraduateIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectGallery = (id: string) => {
    setSelectedGalleryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Export handlers
  const handleExportInstructorsExcel = (onlySelected: boolean = false) => {
    const list = onlySelected
      ? instructorsList.filter((i) => selectedInstructorIds.includes(i.id))
      : instructorsList;

    exportToExcel(
      `dentacollab-instructors-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'name.ar', label: 'اسم المدرب (عربي)' },
        { key: 'name.en', label: 'Instructor Name (EN)' },
        { key: 'title.ar', label: 'المسمى الأكاديمي' },
        { key: 'bio.ar', label: 'نبذة عن الخبرة' },
        { key: 'role', label: 'الدور' },
      ],
      list
    );
  };

  const handleExportGraduatesExcel = (onlySelected: boolean = false) => {
    const list = onlySelected
      ? graduatesList.filter((g) => selectedGraduateIds.includes(g.id))
      : graduatesList;

    exportToExcel(
      `dentacollab-graduates-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'name.ar', label: 'اسم المتدرب / الخريج' },
        { key: 'course.ar', label: 'الدورة التدريبية' },
        { key: 'quote.ar', label: 'الرأي والتقييم' },
        { key: 'rating', label: 'التقييم (من 5)' },
      ],
      list
    );
  };

  const handleExportGalleryExcel = (onlySelected: boolean = false) => {
    const list = onlySelected
      ? galleryList.filter((g) => selectedGalleryIds.includes(g.id))
      : galleryList;

    exportToExcel(
      `dentacollab-gallery-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'title.ar', label: 'عنوان الألبوم / المعرض' },
        { key: 'description.ar', label: 'الوصف' },
        {
          key: 'images',
          label: 'الصور المرفقة',
          format: (v: string[]) => (Array.isArray(v) ? v.join(', ') : String(v)),
        },
      ],
      list
    );
  };

  const handleExportSettingsExcel = () => {
    const settingsRows = [
      { key: 'اسم الأكاديمية بالعربية', value: settings.academyNameAr },
      { key: 'Academy Name (EN)', value: settings.academyNameEn },
      { key: 'الشعار اللفظي', value: settings.taglineAr },
      { key: 'هاتف التواصل واتساب', value: settings.contactWhatsApp },
      { key: 'البريد الإلكتروني', value: settings.contactEmail },
      { key: 'العنوان الجغرافي', value: settings.locationAddressAr },
      { key: 'رابط خرائط جوجل', value: settings.mapsUrl },
      { key: 'رؤية الأكاديمية', value: settings.aboutVisionAr },
    ];

    exportToExcel(
      `dentacollab-academy-settings-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'key', label: 'المجال / البند' },
        { key: 'value', label: 'القيمة الحالية' },
      ],
      settingsRows
    );
  };

  // Backup & Restore Actions
  const handleDownloadBackup = async () => {
    setIsExportingBackup(true);
    try {
      const res = await fetch('/api/backup');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dentacollab-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert('فشل تصدير النسخة الاحتياطية.');
    } finally {
      setIsExportingBackup(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.collections) {
          const collectionsList = Object.keys(json.collections);
          let totalDocs = 0;
          collectionsList.forEach((col) => {
            if (Array.isArray(json.collections[col])) {
              totalDocs += json.collections[col].length;
            }
          });
          setRestorePreview({
            metadata: json.exportMetadata || {},
            collectionsCount: collectionsList.length,
            totalDocuments: totalDocs,
            collections: collectionsList,
            payload: json,
          });
          setRestoreStatus(null);
        } else {
          alert('الملف المحدد ليس نسخة احتياطية صالحة لـ DentaCollab.');
          setRestoreFile(null);
          setRestorePreview(null);
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف الـ JSON.');
        setRestoreFile(null);
        setRestorePreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = async () => {
    if (!restorePreview || !restorePreview.payload) return;

    if (
      !confirm(
        `هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم دمج وتحديث ${restorePreview.totalDocuments} وثيقة عبر ${restorePreview.collectionsCount} مجموعة في قاعدة بيانات dentacollab.`
      )
    ) {
      return;
    }

    setIsRestoringBackup(true);
    setRestoreStatus(null);
    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restorePreview.payload),
      });

      const data = await res.json();
      if (data.success) {
        setRestoreStatus({
          success: true,
          message: `تمت استعادة البيانات بنجاح: ${data.restoredDocsCount} وثيقة في ${data.restoredCollectionsCount} مجموعة!`,
        });
        setRestoreFile(null);
        setRestorePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchContent();
      } else {
        setRestoreStatus({
          success: false,
          message: data.error || 'فشلت عملية الاستعادة.',
        });
      }
    } catch (e: any) {
      console.error(e);
      setRestoreStatus({
        success: false,
        message: e.message || 'حدث خطأ غير متوقع أثناء استعادة البيانات.',
      });
    } finally {
      setIsRestoringBackup(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'إعدادات المنصة والمحتوى الديناميكي (CMS & Backup)' : 'Settings, CMS & Database Backup'}
          subtitle={isAr ? 'تعديل بيانات الأكاديمية، الخريجون، المدربون، النسخ الاحتياطي والاستعادة' : 'Configure academy details, CMS sections, full database backups & restoration'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          {saved && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ التعديلات بنجاح وتحديثها سحابياً وفي الموقع العام!</span>
            </div>
          )}

          {/* Navigation Tabs Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#19314F] pb-4 text-xs">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'general'
                  ? 'bg-[#1FB6D1] text-[#040B18] shadow'
                  : 'bg-[#081426] text-slate-300 hover:text-white border border-[#19314F]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>البيانات الأساسية</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'about'
                  ? 'bg-[#1FB6D1] text-[#040B18] shadow'
                  : 'bg-[#081426] text-slate-300 hover:text-white border border-[#19314F]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>الرؤية والهدف</span>
            </button>

            <button
              onClick={() => setActiveTab('instructors')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'instructors'
                  ? 'bg-[#1FB6D1] text-[#040B18] shadow'
                  : 'bg-[#081426] text-slate-300 hover:text-white border border-[#19314F]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>المدربون ({instructorsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('graduates')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'graduates'
                  ? 'bg-[#1FB6D1] text-[#040B18] shadow'
                  : 'bg-[#081426] text-slate-300 hover:text-white border border-[#19314F]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>الخريجون والتقييمات ({graduatesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-[#1FB6D1] text-[#040B18] shadow'
                  : 'bg-[#081426] text-slate-300 hover:text-white border border-[#19314F]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>معرض الأعمال ({galleryList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'backup'
                  ? 'bg-[#1FB6D1] text-[#040B18] shadow'
                  : 'bg-[#081426] text-amber-300 hover:text-white border border-amber-500/40'
              }`}
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span className="font-bold">النسخ الاحتياطي والاستعادة (Backup & Restore)</span>
            </button>

            <div className="mr-auto flex items-center gap-2">
              <button
                onClick={handleExportSettingsExcel}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs flex items-center gap-1.5 font-bold transition-colors"
                title="تصدير بيانات الإعدادات إلى Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>تصدير Excel</span>
              </button>

              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#081426] border border-[#1FB6D1]/40 text-[#1FB6D1] hover:bg-[#1FB6D1]/10 text-xs flex items-center gap-1.5"
              >
                <span>معاينة الموقع العام</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* TAB 1: General & Contact */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 space-y-6">
              <div className="pb-4 border-b border-[#19314F]/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">بيانات الأكاديمية الرسمية وقنوات التواصل</h3>
                  <p className="text-xs text-slate-400">تظهر في تذييل الموقع، صفحات الرئيسية وتواصل، ورأس التطبيق</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">اسم الأكاديمية (العربية)</label>
                  <input
                    type="text"
                    value={settings.academyNameAr}
                    onChange={(e) => setSettings({ ...settings, academyNameAr: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Academy Name (English)</label>
                  <input
                    type="text"
                    value={settings.academyNameEn}
                    onChange={(e) => setSettings({ ...settings, academyNameEn: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">الشعار اللفظي (العربية)</label>
                  <input
                    type="text"
                    value={settings.taglineAr}
                    onChange={(e) => setSettings({ ...settings, taglineAr: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Tagline (English)</label>
                  <input
                    type="text"
                    value={settings.taglineEn}
                    onChange={(e) => setSettings({ ...settings, taglineEn: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">رقم هاتف الواتساب المعتمد</label>
                  <input
                    type="text"
                    value={settings.contactWhatsApp}
                    onChange={(e) => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1FB6D1]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">البريد الإلكتروني الرسمي</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1FB6D1]"
                    dir="ltr"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1.5">العنوان الجغرافي التفصيلي (بغداد)</label>
                  <input
                    type="text"
                    value={settings.locationAddressAr}
                    onChange={(e) => setSettings({ ...settings, locationAddressAr: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1.5">رابط موقع الأكاديمية على Google Maps</label>
                  <input
                    type="url"
                    value={settings.mapsUrl}
                    onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1FB6D1]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#19314F]/60 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center gap-2 hover:bg-[#1FB6D1]/90 disabled:opacity-50 transition-colors shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'جارِ الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: About & Vision */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveGeneral} className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 space-y-6">
              <div className="pb-4 border-b border-[#19314F]/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">رسالة ورؤية أكاديمية DentaCollab</h3>
                  <p className="text-xs text-slate-400">تظهر في صفحة "عن الأكاديمية" والنبذة التعريفية الرئيسية</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">الرؤية والهدف (العربية)</label>
                  <textarea
                    rows={4}
                    value={settings.aboutVisionAr}
                    onChange={(e) => setSettings({ ...settings, aboutVisionAr: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl p-3 text-white focus:outline-none focus:border-[#1FB6D1] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Vision & Objective (English)</label>
                  <textarea
                    rows={4}
                    value={settings.aboutVisionEn}
                    onChange={(e) => setSettings({ ...settings, aboutVisionEn: e.target.value })}
                    className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl p-3 text-white focus:outline-none focus:border-[#1FB6D1] leading-relaxed"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#19314F]/60 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center gap-2 hover:bg-[#1FB6D1]/90 disabled:opacity-50 transition-colors shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'جارِ الحفظ...' : 'حفظ الرؤية'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Instructors */}
          {activeTab === 'instructors' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-base">الكادر التدريبي المعتمد (Instructors)</h3>
                    {selectedInstructorIds.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1FB6D1]/20 text-[#1FB6D1] text-[11px] font-bold border border-[#1FB6D1]/40">
                        تم تحديد {selectedInstructorIds.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">تظهر الملفات في صفحة "المدربون" وصفحات الدورات التدريبية المرتبطة</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (selectedInstructorIds.length === instructorsList.length) {
                        setSelectedInstructorIds([]);
                      } else {
                        setSelectedInstructorIds(instructorsList.map((i) => i.id));
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#081426] border border-[#19314F] hover:border-slate-400 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {selectedInstructorIds.length > 0 && selectedInstructorIds.length === instructorsList.length ? (
                      <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    <span>{selectedInstructorIds.length === instructorsList.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}</span>
                  </button>

                  {selectedInstructorIds.length > 0 && (
                    <button
                      onClick={() => setSelectedInstructorIds([])}
                      className="px-3 py-1.5 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>إلغاء التحديد ({selectedInstructorIds.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleExportInstructorsExcel(selectedInstructorIds.length > 0)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="تصدير المدربين إلى Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>تصدير Excel {selectedInstructorIds.length > 0 ? `(${selectedInstructorIds.length})` : '(الكل)'}</span>
                  </button>
                </div>
              </div>

              {/* Floating Selection Bar */}
              <SelectionActionBar
                selectedCount={selectedInstructorIds.length}
                totalCount={instructorsList.length}
                onClearSelection={() => setSelectedInstructorIds([])}
                onExportSelected={() => handleExportInstructorsExcel(true)}
                onSelectAll={() => setSelectedInstructorIds(instructorsList.map((i) => i.id))}
                isAllSelected={selectedInstructorIds.length === instructorsList.length && instructorsList.length > 0}
                itemLabel="مدرب معتمد"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instructorsList.map((inst) => {
                  const isSelected = selectedInstructorIds.includes(inst.id);
                  return (
                    <div
                      key={inst.id}
                      className={`border rounded-2xl p-5 space-y-3 transition-all ${
                        isSelected
                          ? 'bg-[#10243E] border-[#1FB6D1] ring-1 ring-[#1FB6D1]/50'
                          : 'bg-[#081426] border-[#19314F] hover:border-[#1FB6D1]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSelectInstructor(inst.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <h4 className="font-bold text-white text-sm">{inst.name?.ar || inst.name}</h4>
                        </div>
                        <span className="text-[11px] font-mono text-[#1FB6D1] px-2 py-0.5 rounded bg-[#101C38] border border-[#19314F]">
                          {inst.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium">{inst.title?.ar || inst.title}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-3">{inst.bio?.ar || inst.bio}</p>
                      {inst.credentials && (
                        <div className="pt-2 border-t border-[#19314F]/60 flex flex-wrap gap-1.5">
                          {inst.credentials.map((c: any, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-[#050E1B] text-[10px] text-slate-300 border border-[#19314F]">
                              {c.ar || c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Graduates */}
          {activeTab === 'graduates' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-base">آراء وتقييمات الخريجين (Graduates & Testimonials)</h3>
                    {selectedGraduateIds.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1FB6D1]/20 text-[#1FB6D1] text-[11px] font-bold border border-[#1FB6D1]/40">
                        تم تحديد {selectedGraduateIds.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">تظهر في صفحة "الخريجون" لتوثيق تجارب الأطباء والمتدربين</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (selectedGraduateIds.length === graduatesList.length) {
                        setSelectedGraduateIds([]);
                      } else {
                        setSelectedGraduateIds(graduatesList.map((g) => g.id));
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#081426] border border-[#19314F] hover:border-slate-400 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {selectedGraduateIds.length > 0 && selectedGraduateIds.length === graduatesList.length ? (
                      <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    <span>{selectedGraduateIds.length === graduatesList.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}</span>
                  </button>

                  {selectedGraduateIds.length > 0 && (
                    <button
                      onClick={() => setSelectedGraduateIds([])}
                      className="px-3 py-1.5 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>إلغاء التحديد ({selectedGraduateIds.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleExportGraduatesExcel(selectedGraduateIds.length > 0)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="تصدير الخريجين إلى Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>تصدير Excel {selectedGraduateIds.length > 0 ? `(${selectedGraduateIds.length})` : '(الكل)'}</span>
                  </button>
                </div>
              </div>

              {/* Floating Selection Bar */}
              <SelectionActionBar
                selectedCount={selectedGraduateIds.length}
                totalCount={graduatesList.length}
                onClearSelection={() => setSelectedGraduateIds([])}
                onExportSelected={() => handleExportGraduatesExcel(true)}
                onSelectAll={() => setSelectedGraduateIds(graduatesList.map((g) => g.id))}
                isAllSelected={selectedGraduateIds.length === graduatesList.length && graduatesList.length > 0}
                itemLabel="تقييم خريج"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {graduatesList.map((g) => {
                  const isSelected = selectedGraduateIds.includes(g.id);
                  return (
                    <div
                      key={g.id}
                      className={`border rounded-2xl p-5 space-y-3 flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-[#10243E] border-[#1FB6D1] ring-1 ring-[#1FB6D1]/50'
                          : 'bg-[#081426] border-[#19314F] hover:border-[#1FB6D1]/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSelectGraduate(g.id)}
                              className="text-slate-400 hover:text-white"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                            <span className="font-bold text-white text-xs">{g.name?.ar || g.name}</span>
                          </div>
                          <span className="text-amber-400 text-xs">★ {g.rating || 5}</span>
                        </div>
                        <div className="text-[11px] text-[#1FB6D1] mb-2">{g.course?.ar || g.course}</div>
                        <p className="text-xs text-slate-300 italic leading-relaxed">"{g.quote?.ar || g.quote}"</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Gallery */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-base">معرض الصور وسير العمل الرقمي (Gallery)</h3>
                    {selectedGalleryIds.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1FB6D1]/20 text-[#1FB6D1] text-[11px] font-bold border border-[#1FB6D1]/40">
                        تم تحديد {selectedGalleryIds.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">ألبومات مراحل العمل، حالات الزرعات، وطباعة النماذج ثلاثية الأبعاد</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (selectedGalleryIds.length === galleryList.length) {
                        setSelectedGalleryIds([]);
                      } else {
                        setSelectedGalleryIds(galleryList.map((gal) => gal.id));
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#081426] border border-[#19314F] hover:border-slate-400 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {selectedGalleryIds.length > 0 && selectedGalleryIds.length === galleryList.length ? (
                      <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    <span>{selectedGalleryIds.length === galleryList.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}</span>
                  </button>

                  {selectedGalleryIds.length > 0 && (
                    <button
                      onClick={() => setSelectedGalleryIds([])}
                      className="px-3 py-1.5 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>إلغاء التحديد ({selectedGalleryIds.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleExportGalleryExcel(selectedGalleryIds.length > 0)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="تصدير المعرض إلى Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>تصدير Excel {selectedGalleryIds.length > 0 ? `(${selectedGalleryIds.length})` : '(الكل)'}</span>
                  </button>
                </div>
              </div>

              {/* Floating Selection Bar */}
              <SelectionActionBar
                selectedCount={selectedGalleryIds.length}
                totalCount={galleryList.length}
                onClearSelection={() => setSelectedGalleryIds([])}
                onExportSelected={() => handleExportGalleryExcel(true)}
                onSelectAll={() => setSelectedGalleryIds(galleryList.map((gal) => gal.id))}
                isAllSelected={selectedGalleryIds.length === galleryList.length && galleryList.length > 0}
                itemLabel="ألبوم صور"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galleryList.map((gal) => {
                  const isSelected = selectedGalleryIds.includes(gal.id);
                  return (
                    <div
                      key={gal.id}
                      className={`border rounded-2xl p-5 space-y-3 transition-all ${
                        isSelected
                          ? 'bg-[#10243E] border-[#1FB6D1] ring-1 ring-[#1FB6D1]/50'
                          : 'bg-[#081426] border-[#19314F] hover:border-[#1FB6D1]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSelectGallery(gal.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <h4 className="font-bold text-white text-sm">{gal.title?.ar || gal.title}</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{gal.description?.ar || gal.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#19314F]/60">
                        {gal.images?.map((im: string, i: number) => (
                          <span key={i} className="px-2 py-1 rounded bg-[#050E1B] border border-[#19314F] text-[11px] font-mono text-[#1FB6D1]">
                            {im}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: Backup & Restore */}
          {activeTab === 'backup' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Status Alert */}
              {restoreStatus && (
                <div
                  className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
                    restoreStatus.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {restoreStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                  )}
                  <span className="font-semibold">{restoreStatus.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Backup Download Card */}
                <div className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                        <HardDriveDownload className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">تحميل نسخة احتياطية كاملة (Backup)</h4>
                        <p className="text-xs text-slate-400">تصدير snapshot كامل لجميع مجموعات البيانات بتنسيق JSON</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#050E1B] border border-[#19314F] space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>قاعدة البيانات المستهدفة:</span>
                        <span className="font-mono text-[#1FB6D1] font-bold">dentacollab (Named Database)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>المجموعات المشمولة:</span>
                        <span className="font-mono text-white">19 مجموعة (دورات، ورش، تسجيلات، طلاب، خدمات، محتوى)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الترميز:</span>
                        <span className="font-mono text-emerald-400">UTF-8 JSON متوافق مع الاستعادة</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#19314F]/60 flex items-center gap-3">
                    <button
                      onClick={handleDownloadBackup}
                      disabled={isExportingBackup}
                      className="px-5 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExportingBackup ? 'جارِ تجهيز النسخة...' : 'تحميل النسخة الاحتياطية (JSON)'}</span>
                    </button>

                    <button
                      onClick={handleExportSettingsExcel}
                      className="px-4 py-2.5 rounded-xl bg-[#101C38] border border-[#19314F] hover:border-slate-400 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>تصدير Excel</span>
                    </button>
                  </div>
                </div>

                {/* 2. Restore Card */}
                <div className="bg-[#081426] border border-[#19314F] rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <HardDriveUpload className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">استعادة البيانات (Restore)</h4>
                        <p className="text-xs text-slate-400">رفع واستعادة ملف JSON احتياطي إلى قاعدة بيانات dentacollab</p>
                      </div>
                    </div>

                    {/* File Dropzone / Picker */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-5 rounded-xl bg-[#050E1B] border-2 border-dashed border-[#19314F] hover:border-[#1FB6D1]/60 cursor-pointer transition-colors text-center space-y-2"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <div className="text-xs text-slate-200 font-semibold">
                        {restoreFile ? restoreFile.name : 'انقر لاختيار ملف النسخة الاحتياطية (.json)'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        يجب أن يكون الملف ناتجاً عن عملية التصدير السابقة للأكاديمية
                      </div>
                    </div>

                    {/* Preview details */}
                    {restorePreview && (
                      <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-1.5 animate-in fade-in duration-150">
                        <div className="font-bold text-purple-300 flex items-center justify-between">
                          <span>معاينة النسخة الاحتياطية:</span>
                          <span className="font-mono text-[11px]">{restorePreview.metadata?.exportedAt?.slice(0, 10) || 'تاريخ غير محدد'}</span>
                        </div>
                        <div className="text-slate-300 text-[11px]">
                          المجموعات: <span className="text-white font-mono font-bold">{restorePreview.collectionsCount}</span> | إجمالي الوثائق: <span className="text-white font-mono font-bold">{restorePreview.totalDocuments} وثيقة</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#19314F]/60 flex items-center justify-end gap-3">
                    {restoreFile && (
                      <button
                        onClick={() => {
                          setRestoreFile(null);
                          setRestorePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-3.5 py-2 rounded-xl border border-[#19314F] text-slate-400 hover:text-white text-xs"
                      >
                        إلغاء
                      </button>
                    )}

                    <button
                      onClick={handleExecuteRestore}
                      disabled={!restorePreview || isRestoringBackup}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-40 transition-colors"
                    >
                      <HardDriveUpload className="w-4 h-4" />
                      <span>{isRestoringBackup ? 'جارِ استعادة الوثائق...' : 'بدء عملية الاستعادة (Restore)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
