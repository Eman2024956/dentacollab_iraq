'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Award,
  RefreshCw,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
  Save,
  CheckCircle,
  ExternalLink,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  Phone,
  Mail,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';

interface Instructor {
  id: string;
  name: { ar: string; en: string };
  title: { ar: string; en: string };
  bio: { ar: string; en: string };
  image?: string;
  credentials: Array<{ ar: string; en: string }>;
  courses?: string[];
  phone?: string;
  email?: string;
  role?: string;
  order?: number;
  status?: string; // 'active' | 'draft'
  avatarImagePath?: string;
  publicationStatus?: string; // 'published' | 'draft'
}

const FIELD = 'w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] transition-colors';
const LABEL = 'block font-semibold text-slate-300 mb-1 text-xs';

export default function InstructorsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modals & In-Page Card Details
  const [selectedInstructorForDetails, setSelectedInstructorForDetails] = useState<Instructor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formBioAr, setFormBioAr] = useState('');
  const [formBioEn, setFormBioEn] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCredentialsInput, setFormCredentialsInput] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('مدرب معتمد');
  const [formOrder, setFormOrder] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'draft'>('active');

  /* ─── Fetch ─── */
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/instructors');
      const data = await res.json();
      if (data.success && data.instructors) {
        setInstructors(data.instructors);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInstructors(); }, []);

  /* ─── Helpers ─── */
  const isPublished = (inst: Instructor) =>
    (inst.publicationStatus || inst.status || 'active') !== 'draft';

  const showNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  /* ─── Open modals ─── */
  const openAddModal = () => {
    setEditingInstructor(null);
    setFormId(`dr-${Date.now().toString().slice(-5)}`);
    setFormNameAr('');
    setFormNameEn('');
    setFormTitleAr('مدرب طب الأسنان الرقمي');
    setFormTitleEn('Digital Dentistry Trainer');
    setFormBioAr('');
    setFormBioEn('');
    setFormImage('');
    setFormCredentialsInput('');
    setFormPhone('+964 781 782 8545');
    setFormEmail('trainer@dentacollab.org');
    setFormRole('مدرب معتمد');
    setFormOrder('');
    setFormStatus('active');
    setShowAddModal(true);
  };

  const openEditModal = (inst: Instructor) => {
    setEditingInstructor(inst);
    setFormId(inst.id);
    setFormNameAr(inst.name?.ar || '');
    setFormNameEn(inst.name?.en || '');
    setFormTitleAr(inst.title?.ar || '');
    setFormTitleEn(inst.title?.en || '');
    setFormBioAr(inst.bio?.ar || '');
    setFormBioEn(inst.bio?.en || '');
    setFormImage(inst.image || inst.avatarImagePath || '');
    setFormCredentialsInput(
      inst.credentials ? inst.credentials.map((c) => (typeof c === 'string' ? c : c.ar)).join(', ') : ''
    );
    setFormPhone(inst.phone || '');
    setFormEmail(inst.email || '');
    setFormRole(inst.role || 'مدرب معتمد');
    setFormOrder(String(inst.order || ''));
    setFormStatus(isPublished(inst) ? 'active' : 'draft');
    setShowAddModal(true);
  };

  /* ─── Save (POST / PUT) ─── */
  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr) return;

    setSubmitting(true);
    try {
      const credentialsArray = formCredentialsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((tag) => ({ ar: tag, en: tag }));

      const payload: Record<string, any> = {
        id: formId,
        name: { ar: formNameAr, en: formNameEn || formNameAr },
        title: { ar: formTitleAr, en: formTitleEn || formTitleAr },
        bio: { ar: formBioAr, en: formBioEn || formBioAr },
        image: formImage || 'dr-placeholder.png',
        avatarImagePath: formImage || 'dr-placeholder.png',
        credentials: credentialsArray,
        phone: formPhone,
        email: formEmail,
        role: formRole,
        order: formOrder ? Number(formOrder) : 99,
        status: formStatus,
        publicationStatus: formStatus === 'active' ? 'published' : 'draft',
      };

      const method = editingInstructor ? 'PUT' : 'POST';
      const res = await fetch('/api/instructors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        showNotice(
          editingInstructor
            ? `✅ تم تحديث بيانات المدرب ${formNameAr} سحابياً بنجاح`
            : `✅ تمت إضافة المدرب ${formNameAr} إلى قاعدة بيانات الأكاديمية`
        );
        fetchInstructors();
      } else {
        alert(data.error || 'فشلت عملية حفظ المدرب.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ المدرب.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Toggle publish/draft ─── */
  const handleToggleStatus = async (inst: Instructor) => {
    const newStatus = isPublished(inst) ? 'draft' : 'active';
    try {
      const res = await fetch('/api/instructors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: inst.id,
          status: newStatus,
          publicationStatus: newStatus === 'active' ? 'published' : 'draft',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(
          newStatus === 'active'
            ? `✅ تم نشر بيانات المدرب ${inst.name?.ar} على الموقع`
            : `🔕 تم إخفاء المدرب ${inst.name?.ar} من الموقع العام`
        );
        fetchInstructors();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /* ─── Delete ─── */
  const handleDeleteInstructor = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المدرب "${name}" نهائياً من قاعدة بيانات Firestore؟`)) return;

    try {
      const res = await fetch(`/api/instructors?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotice(`🗑️ تم حذف المدرب ${name} من قاعدة البيانات`);
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        fetchInstructors();
      }
    } catch (e) {
      console.error(e);
      alert('فشل حذف المدرب.');
    }
  };

  /* ─── Bulk delete ─── */
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`هل تريد حذف ${selectedIds.length} مدرب/ين؟ هذا الإجراء لا يمكن التراجع عنه.`)) return;
    for (const id of selectedIds) {
      await fetch(`/api/instructors?id=${id}`, { method: 'DELETE' });
    }
    showNotice(`🗑️ تم حذف ${selectedIds.length} مدرب من قاعدة البيانات`);
    setSelectedIds([]);
    fetchInstructors();
  };

  /* ─── Filter ─── */
  const filtered = instructors.filter((inst) => {
    const q = search.toLowerCase();
    const nameAr = inst.name?.ar?.toLowerCase() || '';
    const nameEn = inst.name?.en?.toLowerCase() || '';
    const titleAr = inst.title?.ar?.toLowerCase() || '';
    const matchSearch = !q || nameAr.includes(q) || nameEn.includes(q) || titleAr.includes(q);

    const pub = isPublished(inst);
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && pub) ||
      (filterStatus === 'draft' && !pub);

    return matchSearch && matchStatus;
  });

  /* ─── Selection ─── */
  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((i) => i.id));
  };
  const toggleSelectOne = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const clearSelection = () => setSelectedIds([]);

  /* ─── Excel ─── */
  const handleExportExcel = (onlySelected = false) => {
    const list = onlySelected ? filtered.filter((i) => selectedIds.includes(i.id)) : filtered;
    exportToExcel(
      `dentacollab-instructors-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'name.ar', label: 'اسم المدرب (عربي)' },
        { key: 'name.en', label: 'Instructor Name (EN)' },
        { key: 'title.ar', label: 'المسمى الأكاديمي' },
        { key: 'role', label: 'الدور في الأكاديمية' },
        { key: 'phone', label: 'رقم الهاتف' },
        { key: 'email', label: 'البريد الإلكتروني' },
        {
          key: 'credentials',
          label: 'الشهادات',
          format: (c: any[]) => Array.isArray(c) ? c.map((x) => x.ar || x).join(' | ') : '',
        },
        { key: 'status', label: 'الحالة' },
      ],
      list
    );
  };

  /* ─── Render ─── */
  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'إدارة الكادر التدريبي (Instructors)' : 'Instructors Management'}
          subtitle={isAr ? 'إضافة وتعديل وحذف المدربين — مزامنة فورية مع تطبيق الهاتف والموقع' : 'Add, edit, delete instructors — live sync with mobile app & public web'}
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

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم، التخصص، أو المسمى الأكاديمي..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#081426] border border-[#19314F] rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] transition-colors"
                />
              </div>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-[#081426] border border-[#19314F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1FB6D1]"
              >
                <option value="all">الكل</option>
                <option value="active">منشور ✅</option>
                <option value="draft">مسودة 🔕</option>
              </select>

              <button
                onClick={fetchInstructors}
                className="p-2 rounded-xl bg-[#081426] border border-[#19314F] text-slate-400 hover:text-white transition-colors"
                title="تحديث"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1FB6D1]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedIds.length > 0 && (
                <>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-2 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>إلغاء التحديد ({selectedIds.length})</span>
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف المحدد ({selectedIds.length})</span>
                  </button>
                </>
              )}

              <button
                onClick={() => handleExportExcel(selectedIds.length > 0)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : '(الكل)'}</span>
              </button>



              <button
                onClick={openAddModal}
                className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مدرب جديد</span>
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
            itemLabel="مدرب"
          />

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>إجمالي: <span className="text-white font-bold">{instructors.length}</span> مدرب</span>
            <span>منشور: <span className="text-emerald-400 font-bold">{instructors.filter(isPublished).length}</span></span>
            <span>مسودة: <span className="text-amber-400 font-bold">{instructors.filter((i) => !isPublished(i)).length}</span></span>
            {filtered.length !== instructors.length && (
              <span>نتائج الفلتر: <span className="text-[#1FB6D1] font-bold">{filtered.length}</span></span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin ml-2 text-[#1FB6D1]" />
              جاري تحميل بيانات الكادر التدريبي...
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
              <GraduationCap className="w-12 h-12 opacity-30" />
              <p className="text-sm">لا يوجد مدربون مطابقون للبحث أو الفلتر</p>
              <button
                onClick={openAddModal}
                className="px-4 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs"
              >
                إضافة أول مدرب
              </button>
            </div>
          )}

          {/* Instructor Cards Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((inst) => {
                const isSelected = selectedIds.includes(inst.id);
                const pub = isPublished(inst);

                return (
                  <div
                    key={inst.id}
                    className={`border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-[#10243E] border-[#1FB6D1] ring-1 ring-[#1FB6D1]/50'
                        : 'bg-[#081426] border-[#19314F] hover:border-[#1FB6D1]/40'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => toggleSelectOne(inst.id)}
                            className="text-slate-400 hover:text-white shrink-0"
                          >
                            {isSelected
                              ? <CheckSquare className="w-5 h-5 text-[#1FB6D1]" />
                              : <Square className="w-5 h-5" />
                            }
                          </button>

                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-xl bg-[#101C38] border border-[#19314F] overflow-hidden flex items-center justify-center font-bold text-white text-base shrink-0">
                            {(inst.image || inst.avatarImagePath || '').startsWith('http') ? (
                              <img src={inst.image || inst.avatarImagePath} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{inst.name?.ar ? inst.name.ar.slice(2, 4) : 'د.'}</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{inst.name?.ar}</h4>
                            <div className="text-[11px] text-slate-400 font-mono truncate" dir="ltr">
                              {inst.name?.en}
                            </div>
                          </div>
                        </div>

                        {/* Status badge + toggle */}
                        <button
                          onClick={() => handleToggleStatus(inst)}
                          title={pub ? 'انقر لإخفاء عن الموقع العام' : 'انقر للنشر على الموقع'}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 transition-colors ${
                            pub
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                          }`}
                        >
                          {pub
                            ? <><ToggleRight className="w-3 h-3" /> منشور</>
                            : <><ToggleLeft className="w-3 h-3" /> مسودة</>
                          }
                        </button>
                      </div>

                      {/* Title */}
                      <div className="text-xs text-[#1FB6D1] font-medium leading-snug">
                        {inst.title?.ar}
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {inst.bio?.ar}
                      </p>

                      {/* Credentials */}
                      {inst.credentials && inst.credentials.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#19314F]/60">
                          {inst.credentials.slice(0, 3).map((c, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[#050E1B] border border-[#19314F] text-[10px] text-slate-300"
                            >
                              {typeof c === 'string' ? c : (c.ar || c.en || '')}
                            </span>
                          ))}
                          {inst.credentials.length > 3 && (
                            <span className="px-2 py-0.5 rounded-md bg-[#050E1B] border border-[#19314F] text-[10px] text-slate-500">
                              +{inst.credentials.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-[#19314F]/60 flex items-center justify-between text-xs">
                      <div className="text-slate-500 font-mono text-[11px] truncate">
                        {inst.phone || inst.email || inst.role || '—'}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedInstructorForDetails(inst)}
                          className="px-2.5 py-1 rounded-lg bg-[#101C38] border border-[#1FB6D1]/30 text-[#1FB6D1] hover:bg-[#1FB6D1]/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="عرض بطاقة تفاصيل المدرب"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>البطاقة</span>
                        </button>

                        <button
                          onClick={() => openEditModal(inst)}
                          className="p-1.5 rounded-lg text-[#1FB6D1] hover:bg-[#101C38] transition-colors"
                          title="تعديل بيانات المدرب"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteInstructor(inst.id, inst.name?.ar)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="حذف المدرب نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════
          Add / Edit Instructor Modal
      ══════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#081426] border border-[#19314F] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#19314F] flex items-center justify-between sticky top-0 bg-[#081426] z-10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-[#1FB6D1]" />
                <span>{editingInstructor ? `تعديل: ${editingInstructor.name?.ar}` : 'إضافة مدرب أكاديمي جديد'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInstructor} className="p-6 space-y-5 text-xs">

              {/* Row 1: Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>اسم المدرب (بالعربية) *</label>
                  <input
                    required
                    type="text"
                    placeholder="د. عمار صالح الرديني"
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className={LABEL}>Instructor Name (English)</label>
                  <input
                    type="text"
                    placeholder="Dr. Ammar Saleh"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    className={FIELD}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 2: Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>المسمى الأكاديمي والتخصص (عربي) *</label>
                  <input
                    required
                    type="text"
                    placeholder="أخصائي جراحة الفم والزرعات — مدرب معتمد"
                    value={formTitleAr}
                    onChange={(e) => setFormTitleAr(e.target.value)}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className={LABEL}>Academic Title (English)</label>
                  <input
                    type="text"
                    placeholder="Oral Surgery & Implant Specialist"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    className={FIELD}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 3: Bio AR */}
              <div>
                <label className={LABEL}>السيرة المهنية والنبذة التعريفية (العربية)</label>
                <textarea
                  rows={3}
                  placeholder="طبيب واستشاري خبير في سير العمل الرقمي الشامل وتصميم الأدلة الجراحية الموجهة..."
                  value={formBioAr}
                  onChange={(e) => setFormBioAr(e.target.value)}
                  className={`${FIELD} leading-relaxed`}
                />
              </div>

              {/* Row 4: Bio EN */}
              <div>
                <label className={LABEL}>Professional Bio (English)</label>
                <textarea
                  rows={2}
                  placeholder="Clinical specialist with expertise in Exocad & guided surgery..."
                  value={formBioEn}
                  onChange={(e) => setFormBioEn(e.target.value)}
                  className={`${FIELD} leading-relaxed`}
                  dir="ltr"
                />
              </div>

              {/* Row 5: Role */}
              <div>
                <label className={LABEL}>الدور في الأكاديمية</label>
                <input
                  type="text"
                  placeholder="كبير المدربين / مدرب معتمد / مشرف المختبر"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className={FIELD}
                />
              </div>

              {/* Image Upload */}
              <ImageUploadInput
                value={formImage}
                onChange={setFormImage}
                folder="instructors"
                label="صورة المدرب"
                helperText="ارفع صورة الطبيب أو المدرب وستظهر فوراً في تطبيق الموبايل وبطاقة المدرب"
              />

              {/* Row 6: Credentials */}
              <div>
                <label className={LABEL}>الشهادات والاعتمادات (مفصولة بفواصل)</label>
                <input
                  type="text"
                  placeholder="التصميم الرقمي (Exocad), الجراحة الموجهة (Exoplan), الطباعة ثلاثية الأبعاد"
                  value={formCredentialsInput}
                  onChange={(e) => setFormCredentialsInput(e.target.value)}
                  className={FIELD}
                />
                <p className="mt-1 text-slate-500 text-[10px]">مثال: خبير Exocad, مدرب Exoplan, طباعة 3D</p>
              </div>

              {/* Row 7: Phone + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>هاتف التواصل / واتساب</label>
                  <input
                    type="text"
                    placeholder="+964 781 782 8545"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className={`${FIELD} font-mono`}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className={LABEL}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="trainer@dentacollab.org"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={`${FIELD} font-mono`}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 8: Order + Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>ترتيب الظهور (رقم)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    className={FIELD}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className={LABEL}>حالة النشر في الموقع العام</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'active' | 'draft')}
                    className={FIELD}
                  >
                    <option value="active">✅ منشور — يظهر للزوار والتطبيق</option>
                    <option value="draft">🔕 مسودة — مخفي من الموقع العام</option>
                  </select>
                </div>
              </div>

              {/* Sync note */}
              <div className="p-3 rounded-xl bg-[#0A1628] border border-[#1FB6D1]/20 text-[11px] text-slate-400">
                <span className="text-[#1FB6D1] font-bold">⚡ مزامنة فورية:</span>{' '}
                سيتم حفظ بيانات المدرب فوراً ومزامنتها سحابياً مع الموقع العام وتطبيق الهاتف.
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-[#19314F] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#19314F] text-slate-300 hover:text-white text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formNameAr}
                  className="px-6 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold flex items-center gap-2 hover:bg-[#1FB6D1]/90 disabled:opacity-50 shadow-lg text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'جارِ الحفظ...' : editingInstructor ? 'تحديث البيانات' : 'حفظ المدرب الجديد'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── INSTRUCTOR DETAILS CARD COMPONENT MODAL (IN PAGE - NO ROUTE REDIRECT) ─── */}
        {selectedInstructorForDetails && (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setSelectedInstructorForDetails(null)}
          >
            <div
              className="bg-[#081426] border border-[#19314F] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-[#0E2038] to-[#0A182C] border-b border-[#19314F] flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#101C38] border-2 border-[#1FB6D1]/40 overflow-hidden flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
                    {(selectedInstructorForDetails.image || selectedInstructorForDetails.avatarImagePath || '').startsWith('http') ? (
                      <img
                        src={selectedInstructorForDetails.image || selectedInstructorForDetails.avatarImagePath}
                        alt={selectedInstructorForDetails.name?.ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{selectedInstructorForDetails.name?.ar ? selectedInstructorForDetails.name.ar.slice(2, 4) : 'د.'}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1FB6D1]/15 text-[#1FB6D1] border border-[#1FB6D1]/30 text-xs font-bold">
                        {selectedInstructorForDetails.role || 'مدرب معتمد'}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isPublished(selectedInstructorForDetails)
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {isPublished(selectedInstructorForDetails) ? 'منشور في المنصة ✅' : 'مسودة غير منشورة 🔕'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#050E1B] text-slate-400 font-mono text-[11px] border border-[#19314F]">
                        معرف: {selectedInstructorForDetails.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {selectedInstructorForDetails.name?.ar}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono" dir="ltr">
                      {selectedInstructorForDetails.name?.en}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInstructorForDetails(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#101C38] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
                {/* Academic Title */}
                <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F]">
                  <div className="text-[11px] text-slate-400 mb-1">المسمى الأكاديمي والتخصص</div>
                  <div className="text-sm font-semibold text-[#1FB6D1]">
                    {selectedInstructorForDetails.title?.ar || 'مدرب طب الأسنان الرقمي'}
                  </div>
                  {selectedInstructorForDetails.title?.en && (
                    <div className="text-xs text-slate-400 font-mono mt-0.5" dir="ltr">
                      {selectedInstructorForDetails.title?.en}
                    </div>
                  )}
                </div>

                {/* Biography */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1FB6D1]" />
                    <span>النبذة الأكاديمية والسريرية</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F] text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedInstructorForDetails.bio?.ar || 'لا تتوفر نبذة سيرة ذاتية لهذا المدرب حالياً.'}
                  </div>
                </div>

                {/* Credentials */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>الشهادات والاعتمادات التخصصية</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedInstructorForDetails.credentials && selectedInstructorForDetails.credentials.length > 0 ? (
                      selectedInstructorForDetails.credentials.map((cred, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-[#0E2038] border border-[#1FB6D1]/30 text-white text-xs font-medium flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#1FB6D1]" />
                          <span>{typeof cred === 'string' ? cred : cred.ar || cred.en}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">لم يتم إدخال شهادات محددة</span>
                    )}
                  </div>
                </div>

                {/* Contact information */}
                <div className="p-4 rounded-2xl bg-[#050E1B] border border-[#19314F] space-y-3">
                  <div className="text-xs font-bold text-white">معلومات التواصل المباشر</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-[#1FB6D1] shrink-0" />
                      <span className="text-slate-500">الهاتف / واتساب:</span>
                      <span className="font-mono text-white" dir="ltr">
                        {selectedInstructorForDetails.phone || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-[#1FB6D1] shrink-0" />
                      <span className="text-slate-500">البريد:</span>
                      <span className="font-mono text-white truncate" dir="ltr">
                        {selectedInstructorForDetails.email || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#050E1B] border-t border-[#19314F] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const inst = selectedInstructorForDetails;
                    setSelectedInstructorForDetails(null);
                    openEditModal(inst);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#101C38] border border-[#1FB6D1]/40 text-[#1FB6D1] hover:bg-[#1FB6D1]/10 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل بيانات المدرب</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedInstructorForDetails(null)}
                  className="px-6 py-2 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>إغلاق البطاقة</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
