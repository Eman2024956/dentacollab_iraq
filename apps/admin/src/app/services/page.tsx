'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  RefreshCw,
  X,
  Save,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
  ImageIcon,
} from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';

interface Service {
  id: string;
  slug?: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  descriptionAr?: string;
  category: string;
  priceMode: string;
  rawPriceMode?: string;
  turnaround: string;
  status: string;
  featured?: boolean;
  imageUrl?: string;
  image?: string;
}

const FIELD = 'w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] transition-colors';
const LABEL = 'block font-semibold text-slate-300 mb-1 text-xs';

const CATEGORIES = [
  'التصميم الرقمي',
  'زرعات موجهة',
  'طباعة 3D',
  'فحص ومطابقة',
  'استشارات',
  'تدريب وتعليم',
];

export default function AdminServicesPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [fTitleAr, setFTitleAr] = useState('');
  const [fTitleEn, setFTitleEn] = useState('');
  const [fCategory, setFCategory] = useState('التصميم الرقمي');
  const [fSummaryAr, setFSummaryAr] = useState('');
  const [fDescriptionAr, setFDescriptionAr] = useState('');
  const [fPriceMode, setFPriceMode] = useState('quote');
  const [fPriceText, setFPriceText] = useState('تسعير مخصص / Quote');
  const [fTurnaroundAr, setFTurnaroundAr] = useState('٢٤ - ٤٨ ساعة');
  const [fStatus, setFStatus] = useState('published');
  const [fImageUrl, setFImageUrl] = useState('');

  const showNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  /* ─── Fetch ─── */
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success && data.services) setServices(data.services);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  /* ─── Open modals ─── */
  const openAddModal = () => {
    setEditingService(null);
    setFTitleAr(''); setFTitleEn(''); setFCategory('التصميم الرقمي');
    setFSummaryAr(''); setFDescriptionAr('');
    setFPriceMode('quote'); setFPriceText('تسعير مخصص / Quote');
    setFTurnaroundAr('٢٤ - ٤٨ ساعة'); setFStatus('published');
    setFImageUrl('');
    setShowModal(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setFTitleAr(s.titleAr);
    setFTitleEn(s.titleEn);
    setFCategory(s.category);
    setFSummaryAr(s.summaryAr || '');
    setFDescriptionAr(s.descriptionAr || '');
    setFPriceMode(s.rawPriceMode || 'quote');
    setFPriceText(s.priceMode || 'تسعير مخصص / Quote');
    setFTurnaroundAr(s.turnaround || '٢٤ - ٤٨ ساعة');
    setFStatus(s.status === 'published' || s.status === 'active' ? 'published' : 'draft');
    setFImageUrl(s.imageUrl || s.image || '');
    setShowModal(true);
  };

  /* ─── Save (POST / PUT) ─── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitleAr) return;
    setSubmitting(true);

    try {
      const payload: Record<string, any> = {
        titleAr: fTitleAr,
        titleEn: fTitleEn,
        category: fCategory,
        summaryAr: fSummaryAr,
        descriptionAr: fDescriptionAr,
        priceMode: fPriceMode,
        priceText: fPriceText,
        turnaroundAr: fTurnaroundAr,
        status: fStatus,
        imageUrl: fImageUrl,
        image: fImageUrl,
      };

      if (editingService) payload.id = editingService.id;

      const method = editingService ? 'PUT' : 'POST';
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        showNotice(
          editingService
            ? `✅ تم تحديث الخدمة "${fTitleAr}" سحابياً بنجاح`
            : `✅ تمت إضافة الخدمة "${fTitleAr}" إلى دليل الأكاديمية`
        );
        fetchServices();
      } else {
        alert(data.error || 'فشلت العملية');
      }
    } catch (err) {
      console.error(err); alert('حدث خطأ أثناء الحفظ.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Toggle status ─── */
  const handleToggleStatus = async (s: Service) => {
    const newStatus = (s.status === 'published' || s.status === 'active') ? 'draft' : 'published';
    const res = await fetch('/api/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id, status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      showNotice(newStatus === 'published' ? `✅ تم نشر الخدمة "${s.titleAr}"` : `🔕 تم إخفاء الخدمة "${s.titleAr}"`);
      fetchServices();
    }
  };

  /* ─── Delete ─── */
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل تريد حذف الخدمة "${title}" نهائياً من قاعدة البيانات؟`)) return;
    const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showNotice(`🗑️ تم حذف الخدمة "${title}"`);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      fetchServices();
    }
  };

  /* ─── Bulk delete ─── */
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`هل تريد حذف ${selectedIds.length} خدمة؟`)) return;
    const res = await fetch('/api/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    const data = await res.json();
    if (data.success) {
      showNotice(`🗑️ تم حذف ${selectedIds.length} خدمة`);
      setSelectedIds([]);
      fetchServices();
    }
  };

  /* ─── Selection ─── */
  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.length === services.length ? [] : services.map((s) => s.id));
  const toggleSelectOne = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const clearSelection = () => setSelectedIds([]);

  /* ─── Excel ─── */
  const handleExportExcel = (onlySelected = false) => {
    const list = onlySelected ? services.filter((s) => selectedIds.includes(s.id)) : services;
    exportToExcel(`dentacollab-services-${new Date().toISOString().slice(0, 10)}`, [
      { key: 'titleAr', label: 'اسم الخدمة (عربي)' },
      { key: 'titleEn', label: 'Service Title (EN)' },
      { key: 'category', label: 'التصنيف' },
      { key: 'priceMode', label: 'التسعير' },
      { key: 'turnaround', label: 'مدة التنفيذ' },
      { key: 'status', label: 'الحالة' },
    ], list);
  };

  const isPublished = (s: Service) => s.status === 'published' || s.status === 'active';

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'دليل الخدمات والاستشارات الرقمية' : 'Services & Consultation Catalog'}
          subtitle={isAr ? 'إضافة وتعديل وحذف خدمات الأكاديمية — مزامنة فورية مع تطبيق الهاتف والموقع' : 'Add, edit, delete services — live sync with mobile app & public web'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">

          {/* Notice */}
          {successNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                الخدمات الرقمية للأكاديمية
                {selectedIds.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1FB6D1]/20 text-[#1FB6D1] text-[11px] font-bold border border-[#1FB6D1]/40">
                    محدد: {selectedIds.length}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">يستطيع الأطباء تقديم طلبات الاستشارة عبر التطبيق وموقع الأكاديمية</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedIds.length > 0 && (
                <>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-2 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    إلغاء ({selectedIds.length})
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف ({selectedIds.length})
                  </button>
                </>
              )}

              <button
                onClick={() => handleExportExcel(selectedIds.length > 0)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : '(الكل)'}
              </button>

              <button
                onClick={fetchServices}
                className="p-2.5 rounded-xl bg-[#081426] border border-[#19314F] text-slate-300 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1FB6D1]' : ''}`} />
              </button>

              <button
                onClick={openAddModal}
                className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center gap-2 hover:bg-[#1FB6D1]/90 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                إضافة خدمة جديدة
              </button>
            </div>
          </div>

          {/* Floating selection bar */}
          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={services.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExportExcel(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === services.length && services.length > 0}
            itemLabel="خدمة رقمية"
          />

          {/* Table */}
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#050E1B] border-b border-[#19314F] text-slate-400">
                    <th className="p-4 w-10 text-center">
                      <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                        {selectedIds.length > 0 && selectedIds.length === services.length
                          ? <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                          : <Square className="w-4 h-4" />
                        }
                      </button>
                    </th>
                    <th className="p-4 font-semibold">الخدمة الرقمية</th>
                    <th className="p-4 font-semibold">التصنيف</th>
                    <th className="p-4 font-semibold">التسعير</th>
                    <th className="p-4 font-semibold">مدة التنفيذ</th>
                    <th className="p-4 font-semibold">الحالة</th>
                    <th className="p-4 font-semibold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19314F]/60">
                  {loading && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <RefreshCw className="w-5 h-5 animate-spin inline ml-2 text-[#1FB6D1]" />
                        جاري التحميل...
                      </td>
                    </tr>
                  )}
                  {!loading && services.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        لا توجد خدمات بعد. انقر على "إضافة خدمة جديدة" للبدء.
                      </td>
                    </tr>
                  )}
                  {services.map((s) => {
                    const sid = s.id;
                    const isSelected = selectedIds.includes(sid);
                    const pub = isPublished(s);
                    return (
                      <tr
                        key={sid}
                        className={`transition-colors ${
                          isSelected ? 'bg-[#1FB6D1]/10 border-l-2 border-l-[#1FB6D1]' : 'hover:bg-[#101C38]/40'
                        }`}
                      >
                        <td className="p-4 text-center">
                          <button onClick={() => toggleSelectOne(sid)} className="text-slate-400 hover:text-white">
                            {isSelected
                              ? <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                              : <Square className="w-4 h-4" />
                            }
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#101C38] border border-[#19314F] overflow-hidden flex items-center justify-center shrink-0">
                              {(s.imageUrl || s.image) ? (
                                <img src={s.imageUrl || s.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-slate-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{s.titleAr}</div>
                              <div className="text-slate-400 text-[11px] font-mono mt-0.5" dir="ltr">{s.titleEn}</div>
                              {s.summaryAr && (
                                <div className="text-slate-500 text-[10px] mt-1 line-clamp-1">{s.summaryAr}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg bg-[#101C38] border border-[#19314F] text-[#1FB6D1] font-semibold text-[11px]">
                            {s.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-200 font-semibold">{s.priceMode}</td>
                        <td className="p-4 text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {s.turnaround}
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(s)}
                            title={pub ? 'انقر لإخفاء الخدمة' : 'انقر للنشر'}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-colors ${
                              pub
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                            }`}
                          >
                            {pub
                              ? <><ToggleRight className="w-3 h-3" /> مفعلة</>
                              : <><ToggleLeft className="w-3 h-3" /> مسودة</>
                            }
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-1.5 rounded-lg text-[#1FB6D1] hover:bg-[#101C38] transition-colors"
                              title="تعديل"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id, s.titleAr)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
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
      </main>

      {/* ══════════════════════════════════════════════
          Add / Edit Service Modal
      ══════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#19314F] flex items-center justify-between sticky top-0 bg-[#081426] z-10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1FB6D1]" />
                <span>{editingService ? `تعديل: ${editingService.titleAr}` : 'إضافة خدمة رقمية جديدة'}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">

              {/* Title AR */}
              <div>
                <label className={LABEL}>اسم الخدمة (بالعربية) *</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: خدمة تصميم التيجان والجسور الرقمية"
                  value={fTitleAr}
                  onChange={(e) => setFTitleAr(e.target.value)}
                  className={FIELD}
                />
              </div>

              {/* Title EN */}
              <div>
                <label className={LABEL}>Service Name (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Digital Crown & Bridge Design"
                  value={fTitleEn}
                  onChange={(e) => setFTitleEn(e.target.value)}
                  className={FIELD}
                  dir="ltr"
                />
              </div>

              {/* Summary AR */}
              <div>
                <label className={LABEL}>ملخص الخدمة ومخرجاتها</label>
                <textarea
                  rows={2}
                  placeholder="وصف مختصر للخدمة يظهر في بطاقة التطبيق والموقع..."
                  value={fSummaryAr}
                  onChange={(e) => setFSummaryAr(e.target.value)}
                  className={FIELD}
                />
              </div>

              {/* Description AR */}
              <div>
                <label className={LABEL}>وصف تفصيلي للخدمة</label>
                <textarea
                  rows={2}
                  placeholder="تفاصيل إضافية، المتطلبات، والمخرجات المتوقعة..."
                  value={fDescriptionAr}
                  onChange={(e) => setFDescriptionAr(e.target.value)}
                  className={FIELD}
                />
              </div>

              {/* Cover Image Upload */}
              <ImageUploadInput
                value={fImageUrl}
                onChange={setFImageUrl}
                folder="services"
                label="صورة غلاف الخدمة"
                helperText="ارفع صورة لتظهر كغلاف رسمي للخدمة في تطبيق الموبايل وموقع الأكاديمية"
              />

              {/* Category + Turnaround */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>التصنيف</label>
                  <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className={FIELD}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>مدة التنفيذ التقديرية</label>
                  <input
                    type="text"
                    value={fTurnaroundAr}
                    onChange={(e) => setFTurnaroundAr(e.target.value)}
                    className={FIELD}
                    placeholder="٢٤ - ٤٨ ساعة"
                  />
                </div>
              </div>

              {/* Price mode + custom price text */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>طريقة التسعير</label>
                  <select
                    value={fPriceMode}
                    onChange={(e) => {
                      setFPriceMode(e.target.value);
                      if (e.target.value === 'quote') setFPriceText('تسعير مخصص / Quote');
                      else if (e.target.value === 'fixed') setFPriceText('سعر ثابت');
                      else setFPriceText('يبدأ من ...');
                    }}
                    className={FIELD}
                  >
                    <option value="quote">تسعير مخصص بحسب الحالة (Quote)</option>
                    <option value="fixed">سعر ثابت</option>
                    <option value="starting_from">يبدأ من مبلغ محدد</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>نص السعر (يظهر للمستخدم)</label>
                  <input
                    type="text"
                    value={fPriceText}
                    onChange={(e) => setFPriceText(e.target.value)}
                    className={FIELD}
                    placeholder="مثال: يبدأ من ٣٥,٠٠٠ د.ع"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={LABEL}>حالة النشر</label>
                <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={FIELD}>
                  <option value="published">✅ منشورة — تظهر في التطبيق والموقع</option>
                  <option value="draft">🔕 مسودة — مخفية من الزوار</option>
                </select>
              </div>

              {/* Sync note */}
              <div className="p-3 rounded-xl bg-[#0A1628] border border-[#1FB6D1]/20 text-[11px] text-slate-400">
                <span className="text-[#1FB6D1] font-bold">⚡ مزامنة فورية:</span>{' '}
                يُحفظ التغيير سحابياً ويُزامن فورياً مع التطبيق والموقع.
              </div>

              <div className="pt-3 border-t border-[#19314F] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#19314F] text-slate-300 hover:text-white text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting || !fTitleAr}
                  className="px-5 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold flex items-center gap-1.5 hover:bg-[#1FB6D1]/90 disabled:opacity-50 text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'جارِ الحفظ...' : editingService ? 'تحديث الخدمة' : 'حفظ الخدمة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
