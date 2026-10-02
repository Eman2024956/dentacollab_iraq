'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  Calendar,
  Plus,
  Edit2,
  Users,
  MapPin,
  Sparkles,
  Clock,
  X,
  Save,
  RefreshCw,
  CheckCircle,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function WorkshopsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // New Workshop form state
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newVenue, setNewVenue] = useState('مختبر الأكاديمية — بغداد، المنصور');
  const [newDate, setNewDate] = useState('الجمعة، ٢٤ تشرين الأول ٢٠٢٦');
  const [newTime, setNewTime] = useState('٩:٠٠ ص - ٤:٠٠ م');
  const [newMaxCapacity, setNewMaxCapacity] = useState(15);
  const [newPriceMinorUnits, setNewPriceMinorUnits] = useState(150000);
  const [newInstructor, setNewInstructor] = useState('د. عمار صالح');

  const isAr = lang === 'ar';

  const isPublished = (w: any) =>
    (w.status || w.publicationStatus || 'published') !== 'draft' &&
    (w.status || w.publicationStatus) !== 'hidden';

  const handleToggleWorkshopStatus = async (workshop: any) => {
    const nextStatus = isPublished(workshop) ? 'draft' : 'published';
    const workshopId = workshop.id || workshop.slug;

    // Optimistic update
    setWorkshops((prev) =>
      prev.map((w) =>
        (w.id === workshopId || w.slug === workshopId)
          ? { ...w, status: nextStatus, publicationStatus: nextStatus }
          : w
      )
    );

    try {
      const res = await fetch('/api/workshops', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: workshopId,
          status: nextStatus,
          publicationStatus: nextStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNotice(
          nextStatus === 'published'
            ? `✅ تم إظهار ونشر ورشة "${workshop.titleAr || workshop.title}" في تطبيق الموبايل والموقع بنجاح`
            : `🔕 تم إخفاء ورشة "${workshop.titleAr || workshop.title}" عن تطبيق الموبايل والموقع فورياً`
        );
        setTimeout(() => setSuccessNotice(null), 4000);
      } else {
        alert(data.error || 'فشل تغيير حالة ظهور ورشة العمل');
        fetchWorkshops();
      }
    } catch (err) {
      console.error(err);
      fetchWorkshops();
    }
  };

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workshops');
      const data = await res.json();
      if (data.success && data.workshops) {
        setWorkshops(data.workshops);
      } else {
        setWorkshops([]);
      }
    } catch (e) {
      console.error(e);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleAddWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr: newTitleAr,
          titleEn: newTitleEn,
          venue: newVenue,
          date: newDate,
          time: newTime,
          maxCapacity: newMaxCapacity,
          priceMinorUnits: newPriceMinorUnits,
          instructor: newInstructor,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل في إضافة الورشة');
      }

      setSuccessNotice('تم حفظ ورشة العمل ونشرها سحابياً بنجاح!');
      setShowAddModal(false);
      setNewTitleAr('');
      setNewTitleEn('');
      await fetchWorkshops();

      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === workshops.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(workshops.map((w) => w.id || w.slug));
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
      ? workshops.filter((w) => selectedIds.includes(w.id || w.slug))
      : workshops;

    exportToExcel(
      `dentacollab-workshops-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'titleAr', label: 'عنوان الورشة التدريبية (عربي)' },
        { key: 'titleEn', label: 'Workshop Title (EN)' },
        { key: 'date', label: 'التاريخ' },
        { key: 'time', label: 'الوقت' },
        { key: 'venue', label: 'مكان الانعقاد' },
        { key: 'instructor', label: 'المدرب المشرف' },
        { key: 'price', label: 'رسوم التسجيل' },
        { key: 'maxCapacity', label: 'السعة الإجمالية' },
        { key: 'reservedSeats', label: 'المقاعد المحجوزة' },
      ],
      listToExport
    );
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'الورش والندوات التخصصية' : 'Specialized Workshops & Seminars'}
          subtitle={isAr ? 'إدارة ورش العمل المكثفة وجلسات التدريب العملي في بغداد' : 'Manage intensive hands-on workshops and practical sessions in Baghdad'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          {successNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white">الورش المقررة لشهر تشرين الأول</h3>
                {selectedIds.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1FB6D1]/20 text-[#1FB6D1] text-[11px] font-bold border border-[#1FB6D1]/40">
                    تم تحديد {selectedIds.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">تدريب مكثف بيوم واحد مع تطبيق عملي فردي على الأجهزة والمحطات الرقمية</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={toggleSelectAll}
                className="px-3 py-2 rounded-xl bg-[#081426] border border-[#19314F] hover:border-slate-400 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                title="تحديد كل الورش"
              >
                {selectedIds.length > 0 && selectedIds.length === workshops.length ? (
                  <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>{selectedIds.length === workshops.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}</span>
              </button>

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
                title="تصدير الورش إلى Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
              </button>

              <button
                onClick={fetchWorkshops}
                className="p-2.5 rounded-xl bg-[#081426] border border-[#19314F] text-slate-300 hover:text-white transition-colors"
                title="تحديث الورش"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1FB6D1]' : ''}`} />
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1FB6D1]/90 transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة ورشة عمل جديدة</span>
              </button>
            </div>
          </div>

          {/* Floating Selection Bar */}
          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={workshops.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExportExcel(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === workshops.length && workshops.length > 0}
            itemLabel="ورشة تدريبية"
          />

          {/* Workshops Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshops.map((w) => {
              const wid = w.id || w.slug;
              const isSelected = selectedIds.includes(wid);
              return (
                <div
                  key={wid}
                  className={`border rounded-2xl p-6 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#10243E] border-[#1FB6D1] ring-1 ring-[#1FB6D1]/50'
                      : 'bg-[#081426] border-[#19314F] hover:border-[#1FB6D1]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSelectOne(wid)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#1FB6D1]" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                        <span className="px-2.5 py-1 rounded-full bg-[#1FB6D1]/15 text-[#1FB6D1] font-bold text-xs border border-[#1FB6D1]/30">
                          ورشة تدريبية مكثفة
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleWorkshopStatus(w)}
                          title={isPublished(w) ? 'انقر لإخفاء الورشة عن التطبيق والموقع' : 'انقر لإظهار ونشر الورشة في التطبيق والموقع'}
                          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold transition-all ${
                            isPublished(w)
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                          }`}
                        >
                          {isPublished(w) ? (
                            <>
                              <ToggleRight className="w-3.5 h-3.5" />
                              <span>منشورة ✅</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-3.5 h-3.5" />
                              <span>مخفية 🔕</span>
                            </>
                          )}
                        </button>
                        <span className="text-xs font-semibold text-emerald-400 font-mono">
                          {w.price}
                        </span>
                      </div>
                    </div>

                  <h4 className="text-base font-bold text-white mb-1">{w.titleAr}</h4>
                  <p className="text-xs text-slate-400 font-mono mb-4" dir="ltr">{w.titleEn}</p>

                  <div className="space-y-2 text-xs text-slate-300 bg-[#050E1B] p-4 rounded-xl border border-[#19314F]/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1FB6D1]" />
                      <span>{w.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{w.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{w.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>المدرب المعتمد: {w.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#19314F]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-300">
                      محجوز <span className="text-white font-bold font-mono">{w.reservedSeats || 0}</span> من <span className="font-mono">{w.maxCapacity || 15}</span> مقعد
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`إدارة مقاعد ورشة: ${w.titleAr}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#101C38] hover:bg-[#1FB6D1]/20 text-[#1FB6D1] text-xs font-semibold border border-[#19314F] hover:border-[#1FB6D1]/40 transition-colors"
                  >
                    إدارة المقاعد
                  </button>
                </div>
              </div>
            );
          })}
          </div>

          {/* Add Workshop Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="bg-[#081426] border border-[#19314F] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-[#19314F] flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1FB6D1]" />
                    <span>إضافة ورشة عمل تدريبية جديدة</span>
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddWorkshop} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      عنوان الورشة (بالعربية) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: ورشة معايرة طابعات الراتنج ثلاثية الأبعاد"
                      value={newTitleAr}
                      onChange={(e) => setNewTitleAr(e.target.value)}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      عنوان الورشة (بالإنكليزية)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3D Dental Resin Printer Calibration Workshop"
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1]"
                      dir="ltr"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        تاريخ الانعقاد
                      </label>
                      <input
                        type="text"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        الوقت الزمني
                      </label>
                      <input
                        type="text"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        الرسوم (IQD)
                      </label>
                      <input
                        type="number"
                        step="25000"
                        value={newPriceMinorUnits}
                        onChange={(e) => setNewPriceMinorUnits(Number(e.target.value))}
                        className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1FB6D1]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        أقصى عدد مقاعد
                      </label>
                      <input
                        type="number"
                        value={newMaxCapacity}
                        onChange={(e) => setNewMaxCapacity(Number(e.target.value))}
                        className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1FB6D1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      مكان الانعقاد في بغداد
                    </label>
                    <input
                      type="text"
                      value={newVenue}
                      onChange={(e) => setNewVenue(e.target.value)}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      المدرب المسؤول
                    </label>
                    <input
                      type="text"
                      value={newInstructor}
                      onChange={(e) => setNewInstructor(e.target.value)}
                      className="w-full bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1FB6D1]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#19314F] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-3.5 py-2 rounded-xl border border-[#19314F] text-slate-300 hover:text-white"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold flex items-center gap-1.5 hover:bg-[#1FB6D1]/90 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{submitting ? 'جارِ الحفظ...' : 'حفظ الورشة'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
