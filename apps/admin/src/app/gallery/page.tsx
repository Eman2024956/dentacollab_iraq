'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import BatchImageUploadInput from '@/components/BatchImageUploadInput';
import { exportToExcel } from '@/lib/export-excel';
import {
  Image as ImageIcon, Plus, Edit2, Trash2, Search, RefreshCw,
  FileSpreadsheet, CheckSquare, Square, X, Save, CheckCircle,
  ToggleLeft, ToggleRight, Grid3X3, SortAsc, Eye, Layers,
} from 'lucide-react';

interface GalleryAlbum {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  images: string[];
  category?: string;
  order?: number;
  status?: string;
}

const FIELD = 'w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] transition-colors';
const LABEL = 'block font-semibold text-slate-300 mb-1 text-xs';

const CATEGORIES = ['سير العمل', 'التقنيات الرقمية', 'ورش عمل', 'قبل وبعد', 'المختبر الرقمي', 'فعاليات', 'عام'];

export default function GalleryPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GalleryAlbum | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [fTitleAr, setFTitleAr] = useState('');
  const [fTitleEn, setFTitleEn] = useState('');
  const [fDescAr, setFDescAr] = useState('');
  const [fDescEn, setFDescEn] = useState('');
  const [fImages, setFImages] = useState<string[]>([]);
  const [fCategory, setFCategory] = useState('سير العمل');
  const [fOrder, setFOrder] = useState('');
  const [fStatus, setFStatus] = useState('published');

  // Lightbox Preview
  const [previewAlbum, setPreviewAlbum] = useState<GalleryAlbum | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const showNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success && data.gallery) setAlbums(data.gallery);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFTitleAr('');
    setFTitleEn('');
    setFDescAr('');
    setFDescEn('');
    setFImages([]);
    setFCategory('سير العمل');
    setFOrder('');
    setFStatus('published');
    setShowModal(true);
  };

  const openEdit = (a: GalleryAlbum) => {
    setEditing(a);
    setFTitleAr(a.title?.ar || '');
    setFTitleEn(a.title?.en || '');
    setFDescAr(a.description?.ar || '');
    setFDescEn(a.description?.en || '');
    setFImages(a.images || []);
    setFCategory(a.category || 'سير العمل');
    setFOrder(String(a.order || ''));
    setFStatus(a.status || 'published');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitleAr) return;
    setSubmitting(true);
    try {
      const payload: Record<string, any> = {
        titleAr: fTitleAr,
        titleEn: fTitleEn,
        descriptionAr: fDescAr,
        descriptionEn: fDescEn,
        images: fImages,
        category: fCategory,
        order: fOrder ? Number(fOrder) : 99,
        status: fStatus,
      };
      if (editing) payload.id = editing.id;
      const res = await fetch('/api/gallery', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        showNotice(editing ? `✅ تم تحديث الألبوم "${fTitleAr}" بنجاح` : `✅ تمت إضافة الألبوم "${fTitleAr}" مع الصور`);
        fetchAlbums();
      } else {
        alert(data.error || 'فشلت العملية');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (a: GalleryAlbum) => {
    const newStatus = a.status === 'published' ? 'draft' : 'published';
    const res = await fetch('/api/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: a.id, status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      showNotice(newStatus === 'published' ? `✅ نُشر الألبوم "${a.title?.ar}"` : `🔕 أُخفي الألبوم "${a.title?.ar}"`);
      fetchAlbums();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الألبوم "${name}" وجميع صوره؟`)) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAlbums((prev) => prev.filter((a) => a.id !== id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        showNotice(`🗑️ تم حذف الألبوم "${name}"`);
      } else {
        alert(data.error || 'فشل حذف الألبوم');
      }
    } catch (e: any) {
      alert('خطأ أثناء الحذف: ' + e.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedIds.length} ألبومات محددة وجميع صورها؟`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?ids=${selectedIds.join(',')}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAlbums((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
        setSelectedIds([]);
        showNotice(`🗑️ تم حذف ${selectedIds.length} ألبومات بنجاح`);
      } else {
        alert(data.error || 'فشل حذف الألبومات');
      }
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (albums.length === 0) return;
    if (!confirm('⚠️ تحذير: هل أنت متأكد من مسح جميع ألبومات معرض الصور بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gallery?clearAll=true', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAlbums([]);
        setSelectedIds([]);
        showNotice('🗑️ تم مسح كامل ألبومات المعرض من قاعدة البيانات بنجاح');
      } else {
        alert(data.error || 'فشل مسح المعرض');
      }
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map((a) => a.id));
  };

  const clearSelection = () => setSelectedIds([]);

  const handleExport = (selectedOnly = false) => {
    const target = selectedOnly ? albums.filter((a) => selectedIds.includes(a.id)) : albums;
    exportToExcel(
      `dentacollab-gallery-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'id', label: 'المعرف' },
        { key: 'titleAr', label: 'العنوان (عربي)' },
        { key: 'titleEn', label: 'العنوان (إنجليزي)' },
        { key: 'category', label: 'التصنيف' },
        { key: 'imagesCount', label: 'عدد الصور' },
        { key: 'order', label: 'الترتيب' },
        { key: 'status', label: 'الحالة' },
      ],
      target.map((a) => ({
        id: a.id,
        titleAr: a.title?.ar || '',
        titleEn: a.title?.en || '',
        category: a.category || '',
        imagesCount: a.images?.length || 0,
        order: a.order || 99,
        status: a.status === 'published' ? 'منشور' : 'مسودة',
      }))
    );
  };

  const filtered = albums.filter((a) => {
    const matchSearch =
      (a.title?.ar || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.title?.en || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.category || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const catColor: Record<string, string> = {
    'سير العمل': 'text-[#1FB6D1] bg-[#1FB6D1]/10 border-[#1FB6D1]/30',
    'التقنيات الرقمية': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    'ورش عمل': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'قبل وبعد': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'المختبر الرقمي': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    'فعاليات': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    'عام': 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  const resolveImage = (img: string) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `/images/${img}`;
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'معرض الصور والأعمال الرقمية (Gallery)' : 'Digital Gallery & Lab Albums'}
          subtitle={isAr ? 'إدارة دفعات الصور التخصصية، سير العمل الرقمي، وتحديثها فورياً في تطبيق الموبايل' : 'Manage batch photo albums, digital dentistry workflow galleries, and real-time mobile sync'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto max-w-7xl">
          {/* Notification */}
          {successNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="البحث في الألبومات والتصنيفات..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#081426] border border-[#19314F] rounded-xl pr-9 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] transition-colors"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-[#081426] border border-[#19314F] rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-[#1FB6D1]"
              >
                <option value="all">كل الحالات</option>
                <option value="published">منشور فقط</option>
                <option value="draft">مسودة فقط</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              {selectedIds.length > 0 && (
                <>
                  <button onClick={handleBulkDelete} className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" /> حذف المحدد ({selectedIds.length})
                  </button>
                  <button onClick={clearSelection} className="px-3 py-2 rounded-xl bg-[#101C38] border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> إلغاء
                  </button>
                </>
              )}
              {albums.length > 0 && (
                <button onClick={handleClearAll} className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors" title="مسح جميع الألبومات من المعرض">
                  <Trash2 className="w-3.5 h-3.5" /> مسح المعرض بالكامل
                </button>
              )}
              <button onClick={() => handleExport(selectedIds.length > 0)} className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" /> Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : '(الكل)'}
              </button>
              <button onClick={openAdd} className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center gap-2 shadow-lg transition-all">
                <Plus className="w-4 h-4" /> إضافة ألبوم جديد
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-xs text-slate-400 bg-[#081426] border border-[#19314F] px-4 py-3 rounded-2xl">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1FB6D1]" />
              الإجمالي: <strong className="text-white">{albums.length}</strong> ألبوم
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              المنشور: <strong className="text-emerald-400">{albums.filter((a) => a.status === 'published').length}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#1FB6D1]" />
              إجمالي الصور المرفوعة: <strong className="text-[#1FB6D1]">{albums.reduce((s, a) => s + (a.images?.length || 0), 0)}</strong> صورة
            </span>
          </div>

          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={filtered.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExport(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === filtered.length && filtered.length > 0}
            itemLabel="ألبوم"
          />

          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin ml-2 text-[#1FB6D1]" />
              جاري مزامنة معرض الصور سحابياً...
            </div>
          )}

          {/* Albums Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a) => {
                const isSelected = selectedIds.includes(a.id);
                const cc = catColor[a.category || ''] || 'text-slate-400 bg-slate-500/10 border-slate-500/30';
                const imageCount = a.images?.length || 0;

                return (
                  <div
                    key={a.id}
                    className={`border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#10243E] border-[#1FB6D1] ring-1 ring-[#1FB6D1]/50'
                        : 'bg-[#081426] border-[#19314F] hover:border-[#1FB6D1]/40'
                    }`}
                  >
                    <div>
                      {/* Image Preview Strip (Batch Grid Preview) */}
                      <div
                        onClick={() => {
                          if (imageCount > 0) {
                            setPreviewAlbum(a);
                            setActivePreviewIndex(0);
                          }
                        }}
                        className="h-28 bg-[#050E1B] p-2 flex gap-1.5 cursor-pointer relative group border-b border-[#19314F]"
                      >
                        {imageCount > 0 ? (
                          <>
                            {a.images.slice(0, 4).map((img, idx) => (
                              <div
                                key={idx}
                                className="flex-1 rounded-xl bg-[#101C38] border border-[#19314F] overflow-hidden relative"
                              >
                                <img
                                  src={resolveImage(img)}
                                  alt=""
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                {idx === 3 && imageCount > 4 && (
                                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white font-bold text-xs backdrop-blur-xs">
                                    +{imageCount - 4}
                                  </div>
                                )}
                              </div>
                            ))}
                            {/* Hover overlay hint */}
                            <div className="absolute inset-0 bg-[#040B18]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#1FB6D1] text-xs font-bold gap-1.5 transition-opacity">
                              <Eye className="w-4 h-4" />
                              <span>استعراض دفعة الصور ({imageCount})</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 rounded-xl bg-[#101C38] border border-[#19314F] flex flex-col items-center justify-center text-slate-500 text-xs gap-1">
                            <ImageIcon className="w-6 h-6 opacity-40" />
                            <span>لا توجد صور في هذه الدفعة</span>
                          </div>
                        )}

                        {/* Badge for image count */}
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold border border-white/10 backdrop-blur-sm pointer-events-none">
                          {imageCount} {imageCount === 1 ? 'صورة' : 'صور'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSelectOne(a.id)}
                              className="text-slate-400 hover:text-white shrink-0 mt-0.5"
                            >
                              {isSelected ? <CheckSquare className="w-4 h-4 text-[#1FB6D1]" /> : <Square className="w-4 h-4" />}
                            </button>
                            <div>
                              <div className="font-bold text-white text-sm leading-tight">{a.title?.ar}</div>
                              {a.title?.en && <div className="text-slate-400 text-xs mt-0.5">{a.title.en}</div>}
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${cc}`}>
                            {a.category || 'عام'}
                          </span>
                        </div>

                        {a.description?.ar && (
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{a.description.ar}</p>
                        )}
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="px-4 py-3 border-t border-[#19314F] flex items-center justify-between bg-[#061020]/50 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(a)}
                          className={`flex items-center gap-1 font-semibold text-[11px] transition-colors ${
                            a.status === 'published' ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'
                          }`}
                        >
                          {a.status === 'published' ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5" />}
                          <span>{a.status === 'published' ? 'منشور' : 'مسودة'}</span>
                        </button>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 text-[10px]">الترتيب: {a.order || 99}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="تعديل الألبوم والدفعة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.title?.ar || '')}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="حذف الألبوم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="col-span-3 flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                  <Grid3X3 className="w-12 h-12 opacity-30" />
                  <p className="text-sm">لا توجد ألبومات تطابق شروط البحث</p>
                  <button onClick={openAdd} className="px-4 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs">
                    إضافة ألبوم جديد
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Album Modal with Batch Images Upload */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#19314F] flex items-center justify-between sticky top-0 bg-[#081426] z-10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#1FB6D1]" />
                {editing ? `تعديل ألبوم: ${editing.title?.ar}` : 'إضافة ألبوم صور جديد (Batch Upload)'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {/* Titles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>عنوان الألبوم (عربي) *</label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: سير العمل الرقمي الكامل"
                    value={fTitleAr}
                    onChange={(e) => setFTitleAr(e.target.value)}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className={LABEL}>Album Title (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Digital Workflow"
                    value={fTitleEn}
                    onChange={(e) => setFTitleEn(e.target.value)}
                    className={FIELD}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className={LABEL}>وصف الألبوم (عربي)</label>
                <textarea
                  rows={2}
                  placeholder="وصف تفصيلي لموضوع هذا الألبوم والمعدات المستخدمة..."
                  value={fDescAr}
                  onChange={(e) => setFDescAr(e.target.value)}
                  className={FIELD}
                />
              </div>

              {/* Category + Order + Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={LABEL}>التصنيف</label>
                  <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className={FIELD}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>ترتيب الظهور</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={fOrder}
                    onChange={(e) => setFOrder(e.target.value)}
                    className={FIELD}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className={LABEL}>حالة النشر</label>
                  <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={FIELD}>
                    <option value="published">✅ منشور ومعروض</option>
                    <option value="draft">🔕 مسودة مخفية</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Batch Images Upload Input */}
              <div className="pt-2 border-t border-[#19314F]">
                <BatchImageUploadInput
                  images={fImages}
                  onChange={setFImages}
                  folder="gallery"
                  label="صور دفعة الألبوم (Dynamic Batch Images)"
                  helperText="اختر عدة صور دفعة واحدة ليتم رفعها تلقائياً إلى الخادم السحابي ومزامنتها لحظياً مع التطبيق"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0A1628] border border-[#1FB6D1]/20 text-[11px] text-slate-400">
                <span className="text-[#1FB6D1] font-bold">⚡ تزامن فوري:</span> عند الحفظ، يُحدث الألبوم سحابياً ويظهر مباشرة في قسم المعرض في تطبيق الموبايل.
              </div>

              <div className="pt-4 border-t border-[#19314F] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#19314F] text-slate-300 hover:text-white text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting || !fTitleAr}
                  className="px-6 py-2 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold flex items-center gap-2 disabled:opacity-50 text-xs shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'جارِ رفع البيانات...' : editing ? 'تحديث الدفعة' : 'حفظ ونشر الألبوم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Album Lightbox Preview Modal */}
      {previewAlbum && (
        <div
          onClick={() => setPreviewAlbum(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#081426] border border-[#19314F] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#19314F] flex items-center justify-between bg-[#050E1B]">
              <div>
                <h4 className="font-bold text-white text-sm">{previewAlbum.title?.ar}</h4>
                <p className="text-slate-400 text-xs">
                  صورة {activePreviewIndex + 1} من {previewAlbum.images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAlbum(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="h-[60vh] bg-black flex items-center justify-center p-4 relative">
              {previewAlbum.images[activePreviewIndex] && (
                <img
                  src={resolveImage(previewAlbum.images[activePreviewIndex])}
                  alt={`Preview ${activePreviewIndex + 1}`}
                  className="max-h-full max-w-full object-contain mx-auto"
                />
              )}
            </div>

            {/* Bottom Thumbnail Strip */}
            <div className="p-3 bg-[#050E1B] border-t border-[#19314F] flex gap-2 overflow-x-auto">
              {previewAlbum.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    idx === activePreviewIndex ? 'border-[#1FB6D1] scale-105' : 'border-[#19314F] opacity-60'
                  }`}
                >
                  <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
