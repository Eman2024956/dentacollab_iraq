'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  GraduationCap, Plus, Edit2, Trash2, Star, Search,
  RefreshCw, FileSpreadsheet, CheckSquare, Square, X,
  Save, CheckCircle, ToggleLeft, ToggleRight, Quote,
} from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';

interface Graduate {
  id: string;
  name: { ar: string; en: string };
  city?: string;
  profession?: string;
  courseId?: string;
  courseTitle?: { ar: string; en: string };
  quote?: { ar: string; en: string };
  rating?: number;
  graduationDate?: string;
  image?: string;
  status?: string;
}

const FIELD = 'w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] transition-colors';
const LABEL = 'block font-semibold text-slate-300 mb-1 text-xs';

export default function GraduatesPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Graduate | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [fNameAr, setFNameAr] = useState('');
  const [fNameEn, setFNameEn] = useState('');
  const [fCity, setFCity] = useState('');
  const [fProfession, setFProfession] = useState('');
  const [fCourseId, setFCourseId] = useState('');
  const [fCourseTitleAr, setFCourseTitleAr] = useState('');
  const [fCourseTitleEn, setFCourseTitleEn] = useState('');
  const [fQuoteAr, setFQuoteAr] = useState('');
  const [fQuoteEn, setFQuoteEn] = useState('');
  const [fRating, setFRating] = useState(5);
  const [fGraduationDate, setFGraduationDate] = useState('');
  const [fImage, setFImage] = useState('');
  const [fStatus, setFStatus] = useState('published');

  const showNotice = (msg: string) => { setSuccessNotice(msg); setTimeout(() => setSuccessNotice(null), 4000); };

  const fetchGraduates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/graduates');
      const data = await res.json();
      if (data.success && data.graduates) setGraduates(data.graduates);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGraduates(); }, []);

  const openAdd = () => {
    setEditing(null);
    setFNameAr(''); setFNameEn(''); setFCity(''); setFProfession('');
    setFCourseId(''); setFCourseTitleAr(''); setFCourseTitleEn('');
    setFQuoteAr(''); setFQuoteEn(''); setFRating(5);
    setFGraduationDate(new Date().toISOString().slice(0, 10));
    setFImage(''); setFStatus('published');
    setShowModal(true);
  };

  const openEdit = (g: Graduate) => {
    setEditing(g);
    setFNameAr(g.name?.ar || ''); setFNameEn(g.name?.en || '');
    setFCity(g.city || ''); setFProfession(g.profession || '');
    setFCourseId(g.courseId || '');
    setFCourseTitleAr(g.courseTitle?.ar || ''); setFCourseTitleEn(g.courseTitle?.en || '');
    setFQuoteAr(g.quote?.ar || ''); setFQuoteEn(g.quote?.en || '');
    setFRating(g.rating || 5);
    setFGraduationDate(g.graduationDate || '');
    setFImage(g.image || ''); setFStatus(g.status || 'published');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fNameAr) return;
    setSubmitting(true);
    try {
      const payload: Record<string, any> = {
        nameAr: fNameAr, nameEn: fNameEn, city: fCity, profession: fProfession,
        courseId: fCourseId, courseTitleAr: fCourseTitleAr, courseTitleEn: fCourseTitleEn,
        quoteAr: fQuoteAr, quoteEn: fQuoteEn, rating: fRating,
        graduationDate: fGraduationDate, image: fImage, status: fStatus,
      };
      if (editing) payload.id = editing.id;
      const res = await fetch('/api/graduates', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        showNotice(editing ? `✅ تم تحديث بيانات الخريج ${fNameAr}` : `✅ تمت إضافة الخريج ${fNameAr} بنجاح`);
        fetchGraduates();
      } else { alert(data.error || 'فشلت العملية'); }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const handleToggle = async (g: Graduate) => {
    const newStatus = (g.status === 'published') ? 'draft' : 'published';
    const res = await fetch('/api/graduates', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: g.id, status: newStatus }) });
    const data = await res.json();
    if (data.success) { showNotice(newStatus === 'published' ? `✅ نُشرت شهادة ${g.name?.ar}` : `🔕 أُخفيت شهادة ${g.name?.ar}`); fetchGraduates(); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل تريد حذف شهادة "${name}" نهائياً؟`)) return;
    const res = await fetch(`/api/graduates?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) { showNotice(`🗑️ تم حذف شهادة ${name}`); setSelectedIds((p) => p.filter((i) => i !== id)); fetchGraduates(); }
  };

  const filtered = graduates.filter((g) => {
    const q = search.toLowerCase();
    const match = !q || g.name?.ar?.toLowerCase().includes(q) || g.name?.en?.toLowerCase().includes(q) || (g.city || '').toLowerCase().includes(q) || (g.profession || '').toLowerCase().includes(q);
    const statusMatch = filterStatus === 'all' || g.status === filterStatus;
    return match && statusMatch;
  });

  const toggleSelectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((g) => g.id));
  const toggleSelectOne = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
  const clearSelection = () => setSelectedIds([]);

  const handleExport = (onlySelected = false) => {
    const list = onlySelected ? filtered.filter((g) => selectedIds.includes(g.id)) : filtered;
    exportToExcel(`dentacollab-graduates-${new Date().toISOString().slice(0, 10)}`, [
      { key: 'name.ar', label: 'اسم الخريج (عربي)' },
      { key: 'city', label: 'المدينة' },
      { key: 'profession', label: 'التخصص' },
      { key: 'courseTitle.ar', label: 'الدورة المكتملة' },
      { key: 'rating', label: 'التقييم (من 5)' },
      { key: 'graduationDate', label: 'تاريخ التخرج' },
      { key: 'quote.ar', label: 'شهادة الخريج' },
      { key: 'status', label: 'الحالة' },
    ], list);
  };

  const StarRow = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />
      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'آراء وتقييمات الخريجين' : 'Graduates & Testimonials'}
          subtitle={isAr ? 'إدارة شهادات وتقييمات خريجي أكاديمية DentaCollab — مزامنة فورية مع الموقع والتطبيق' : 'Manage graduate testimonials and ratings — live sync with website & app'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          {successNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" /><span>{successNotice}</span>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم، المدينة، التخصص..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#081426] border border-[#19314F] rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-[#081426] border border-[#19314F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1FB6D1]">
                <option value="all">الكل</option>
                <option value="published">منشور ✅</option>
                <option value="draft">مسودة 🔕</option>
              </select>
              <button onClick={fetchGraduates} className="p-2 rounded-xl bg-[#081426] border border-[#19314F] text-slate-400 hover:text-white">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1FB6D1]' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedIds.length > 0 && (
                <button onClick={clearSelection} className="px-3 py-2 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> إلغاء ({selectedIds.length})
                </button>
              )}
              <button onClick={() => handleExport(selectedIds.length > 0)} className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" /> Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : '(الكل)'}
              </button>
              <button onClick={openAdd} className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center gap-2 shadow-lg">
                <Plus className="w-4 h-4" /> إضافة خريج
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>الإجمالي: <span className="text-white font-bold">{graduates.length}</span></span>
            <span>منشور: <span className="text-emerald-400 font-bold">{graduates.filter((g) => g.status === 'published').length}</span></span>
            <span>متوسط التقييم: <span className="text-amber-400 font-bold">{graduates.length ? (graduates.reduce((s, g) => s + (g.rating || 5), 0) / graduates.length).toFixed(1) : '—'} ⭐</span></span>
          </div>

          <SelectionActionBar
            selectedCount={selectedIds.length} totalCount={filtered.length}
            onClearSelection={clearSelection} onExportSelected={() => handleExport(true)}
            onSelectAll={toggleSelectAll} isAllSelected={selectedIds.length === filtered.length && filtered.length > 0}
            itemLabel="خريج"
          />

          {loading && <div className="flex items-center justify-center py-20 text-slate-400 text-sm"><RefreshCw className="w-5 h-5 animate-spin ml-2 text-[#1FB6D1]" />جاري التحميل...</div>}

          {/* Cards Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((g) => {
                const isSelected = selectedIds.includes(g.id);
                return (
                  <div key={g.id} className={`border rounded-2xl p-5 flex flex-col gap-3 transition-all ${isSelected ? 'bg-[#10243E] border-[#1FB6D1] ring-1 ring-[#1FB6D1]/50' : 'bg-[#081426] border-[#19314F] hover:border-[#1FB6D1]/40'}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleSelectOne(g.id)} className="text-slate-400 hover:text-white shrink-0">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-[#1FB6D1]" /> : <Square className="w-4 h-4" />}
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1FB6D1]/30 to-[#1FB6D1]/10 border border-[#1FB6D1]/30 flex items-center justify-center font-bold text-white text-sm shrink-0 overflow-hidden">
                          {g.image ? (
                            <img src={g.image} alt={g.name?.ar} className="w-full h-full object-cover" />
                          ) : (
                            (g.name?.ar || '').slice(2, 4) || 'خر'
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{g.name?.ar}</div>
                          <div className="text-[10px] text-slate-400">{g.profession} — {g.city}</div>
                        </div>
                      </div>
                      <button onClick={() => handleToggle(g)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 transition-colors ${g.status === 'published' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:text-rose-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-emerald-500/10 hover:text-emerald-400'}`}>
                        {g.status === 'published' ? <><ToggleRight className="w-3 h-3" />منشور</> : <><ToggleLeft className="w-3 h-3" />مسودة</>}
                      </button>
                    </div>

                    {/* Course */}
                    <div className="px-2.5 py-1 rounded-lg bg-[#101C38] border border-[#19314F] text-[#1FB6D1] text-[10px] font-semibold truncate">
                      {g.courseTitle?.ar || g.courseId}
                    </div>

                    {/* Stars */}
                    <StarRow rating={g.rating || 5} />

                    {/* Quote */}
                    <div className="relative">
                      <Quote className="w-4 h-4 text-[#1FB6D1]/30 absolute -top-1 -right-1" />
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 pr-4">
                        {g.quote?.ar}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-[#19314F]/60 flex items-center justify-between">
                      <div className="text-[10px] text-slate-500">{g.graduationDate}</div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg text-[#1FB6D1] hover:bg-[#101C38] transition-colors" title="تعديل">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(g.id, g.name?.ar)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors" title="حذف">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!loading && filtered.length === 0 && (
                <div className="col-span-3 flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                  <GraduationCap className="w-12 h-12 opacity-30" />
                  <p className="text-sm">لا توجد شهادات خريجين بعد</p>
                  <button onClick={openAdd} className="px-4 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs">إضافة أول خريج</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#19314F] flex items-center justify-between sticky top-0 bg-[#081426] z-10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#1FB6D1]" />
                {editing ? `تعديل: ${editing.name?.ar}` : 'إضافة شهادة خريج جديد'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div><label className={LABEL}>اسم الخريج (عربي) *</label>
                  <input required type="text" placeholder="د. علي حسين السعدي" value={fNameAr} onChange={(e) => setFNameAr(e.target.value)} className={FIELD} /></div>
                <div><label className={LABEL}>Graduate Name (English)</label>
                  <input type="text" placeholder="Dr. Ali Hussain" value={fNameEn} onChange={(e) => setFNameEn(e.target.value)} className={FIELD} dir="ltr" /></div>
              </div>

              {/* City + Profession */}
              <div className="grid grid-cols-2 gap-4">
                <div><label className={LABEL}>المدينة / المحافظة</label>
                  <input type="text" placeholder="بغداد" value={fCity} onChange={(e) => setFCity(e.target.value)} className={FIELD} /></div>
                <div><label className={LABEL}>التخصص المهني</label>
                  <input type="text" placeholder="طبيب أسنان عام" value={fProfession} onChange={(e) => setFProfession(e.target.value)} className={FIELD} /></div>
              </div>

              {/* Course */}
              <div className="grid grid-cols-2 gap-4">
                <div><label className={LABEL}>معرف الدورة (slug)</label>
                  <input type="text" placeholder="digital-dentistry-foundations" value={fCourseId} onChange={(e) => setFCourseId(e.target.value)} className={`${FIELD} font-mono`} dir="ltr" /></div>
                <div><label className={LABEL}>اسم الدورة المكتملة (عربي)</label>
                  <input type="text" placeholder="أساسيات طب الأسنان الرقمي (Exocad)" value={fCourseTitleAr} onChange={(e) => setFCourseTitleAr(e.target.value)} className={FIELD} /></div>
              </div>

              <div><label className={LABEL}>Course Title (English)</label>
                <input type="text" placeholder="Digital Dentistry Foundations (Exocad)" value={fCourseTitleEn} onChange={(e) => setFCourseTitleEn(e.target.value)} className={FIELD} dir="ltr" /></div>

              {/* Quote AR */}
              <div><label className={LABEL}>شهادة وتقييم الخريج (عربي) *</label>
                <textarea required rows={3} placeholder="غيّرت الدورة أسلوب عملي بشكل جذري..." value={fQuoteAr} onChange={(e) => setFQuoteAr(e.target.value)} className={`${FIELD} leading-relaxed`} /></div>

              {/* Quote EN */}
              <div><label className={LABEL}>Graduate Testimonial (English)</label>
                <textarea rows={2} placeholder="The course radically changed how I work..." value={fQuoteEn} onChange={(e) => setFQuoteEn(e.target.value)} className={`${FIELD} leading-relaxed`} dir="ltr" /></div>

              {/* Rating + Date + Status */}
              <div className="grid grid-cols-3 gap-4">
                <div><label className={LABEL}>التقييم (من 1 إلى 5)</label>
                  <select value={fRating} onChange={(e) => setFRating(Number(e.target.value))} className={FIELD}>
                    {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ⭐</option>)}
                  </select></div>
                <div><label className={LABEL}>تاريخ التخرج</label>
                  <input type="date" value={fGraduationDate} onChange={(e) => setFGraduationDate(e.target.value)} className={FIELD} dir="ltr" /></div>
                <div><label className={LABEL}>حالة النشر</label>
                  <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={FIELD}>
                    <option value="published">✅ منشور</option>
                    <option value="draft">🔕 مسودة</option>
                  </select></div>
              </div>

              {/* Graduate Photo Upload */}
              <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F]">
                <ImageUploadInput
                  value={fImage}
                  onChange={setFImage}
                  folder="graduates"
                  label="صورة الخريج الشخصية"
                  helperText="ارفع صورة الطبيب أو الخريج بصيغة PNG أو JPG أو WebP ليتم مزامنتها مع تطبيق الهاتف فورياً."
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0A1628] border border-[#1FB6D1]/20 text-[11px] text-slate-400">
                <span className="text-[#1FB6D1] font-bold">⚡ مزامنة فورية:</span> يُحفظ السجل سحابياً ويُزامن مع الموقع وتطبيق الهاتف فورياً.
              </div>

              <div className="pt-4 border-t border-[#19314F] flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-[#19314F] text-slate-300 hover:text-white text-xs">إلغاء</button>
                <button type="submit" disabled={submitting || !fNameAr} className="px-6 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold flex items-center gap-2 hover:bg-[#1FB6D1]/90 disabled:opacity-50 text-xs">
                  <Save className="w-4 h-4" />
                  {submitting ? 'جارِ الحفظ...' : editing ? 'تحديث الشهادة' : 'حفظ الشهادة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
