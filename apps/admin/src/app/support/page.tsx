'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  User,
  MessageCircle,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
} from 'lucide-react';

export default function SupportPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  const [activeTicketId, setActiveTicketId] = useState('ticket_1');
  const [replyText, setReplyText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const tickets = [
    {
      id: 'ticket_1',
      studentName: 'د. علي حسين السعدي',
      subject: 'استفسار عن متطلبات حاسوب Exocad للجلسة الثانية',
      category: 'مناهج تدريبية',
      status: 'open',
      statusLabel: 'مفتوحة للمتابعة',
      date: 'اليوم، ١١:٣٠ ص',
      messages: [
        {
          sender: 'د. علي حسين السعدي',
          isStaff: false,
          time: '١١:٣٠ ص',
          content: 'السلام عليكم دكتور، هل أحتاج لجلب اللابتوب الخاص بي معي للجلسة القادمة، أم أن جميع محطات العمل في المختبر مجهزة بـ Exocad مع التراخيص؟',
        },
        {
          sender: 'فريق دعم DentaCollab',
          isStaff: true,
          time: '١١:٤٥ ص',
          content: 'وعليكم السلام دكتور علي. جميع مقاعد المختبر في بغداد مجهزة بحواسيب Workstation متوافقة بالكامل وتراخيص Exocad نشطة، جلب لابتوبك اختياري لحفظ مشاريعك الشخصية فقط.',
        },
      ],
    },
    {
      id: 'ticket_2',
      studentName: 'د. فاطمة مهدي',
      subject: 'طلب تمديد فترة تحميل ملفات الـ STL التوضيحية',
      category: 'شهادات وملفات',
      status: 'resolved',
      statusLabel: 'تم الحل',
      date: 'أمس، ٠٢:١٥ م',
      messages: [
        {
          sender: 'د. فاطمة مهدي',
          isStaff: false,
          time: '٠٢:١٥ م',
          content: 'أرجو إعادة إرسال رابط تحميل حالات الجراحة الموجهة التجريبية.',
        },
      ],
    },
    {
      id: 'ticket_3',
      studentName: 'د. سرمد عبد الكريم',
      subject: 'معايرة راتنج طابعة Formlabs 3B+',
      category: 'دعم تقني',
      status: 'open',
      statusLabel: 'مفتوحة للمتابعة',
      date: 'اليوم، ٠٩:٠٠ ص',
      messages: [
        {
          sender: 'د. سرمد عبد الكريم',
          isStaff: false,
          time: '٠٩:٠٠ ص',
          content: 'هل يتوفر ملف إعدادات الطباعة لراتنج Surgical Guide في حساب المتدربين؟',
        },
      ],
    },
  ];

  const currentTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const toggleSelectAll = () => {
    if (selectedIds.length === tickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tickets.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleExportExcel = (onlySelected: boolean = false) => {
    const listToExport = onlySelected
      ? tickets.filter((t) => selectedIds.includes(t.id))
      : tickets;

    exportToExcel(
      `dentacollab-support-tickets-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'studentName', label: 'اسم الطالب / الطبيب' },
        { key: 'subject', label: 'موضوع التذكرة' },
        { key: 'category', label: 'التصنيف' },
        { key: 'statusLabel', label: 'الحالة' },
        { key: 'date', label: 'تاريخ الإنشاء' },
      ],
      listToExport
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    currentTicket.messages.push({
      sender: 'فريق دعم DentaCollab',
      isStaff: true,
      time: 'الآن',
      content: replyText,
    });

    setReplyText('');
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'تذاكر الدعم الفني والاستفسارات' : 'Support Tickets & Inquiries'}
          subtitle={isAr ? 'الرد على استفسارات الطلاب ومتابعة حالات التدريب' : 'Resolve student questions and manage technical inquiries'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-4 flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Top toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAll}
                className="px-3 py-1.5 rounded-xl bg-[#081426] border border-[#19314F] hover:border-slate-400 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
              >
                {selectedIds.length > 0 && selectedIds.length === tickets.length ? (
                  <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>{selectedIds.length === tickets.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}</span>
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="px-3 py-1.5 rounded-xl bg-[#101C38] border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>إلغاء التحديد ({selectedIds.length})</span>
                </button>
              )}
            </div>

            <button
              onClick={() => handleExportExcel(selectedIds.length > 0)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="تصدير التذاكر إلى Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : '(الكل)'}</span>
            </button>
          </div>

          {/* Floating Selection Bar */}
          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={tickets.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExportExcel(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === tickets.length && tickets.length > 0}
            itemLabel="تذكرة دعم"
          />

          <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden">
            {/* Tickets List */}
            <div className="w-full md:w-80 bg-[#081426] border border-[#19314F] rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-slate-400">صندوق التذاكر</h3>
                <span className="text-[11px] text-slate-500 font-mono">{tickets.length} تذكرة</span>
              </div>

              {tickets.map((t) => {
                const isSelected = selectedIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1FB6D1] bg-[#1FB6D1]/15'
                        : activeTicketId === t.id
                        ? 'border-[#1FB6D1] bg-[#1FB6D1]/10'
                        : 'border-[#19314F] bg-[#050E1B] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleSelectOne(t.id, e)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <span className="font-bold text-white text-xs">{t.studentName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{t.date}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium truncate mb-2">{t.subject}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#101C38] text-[#1FB6D1] border border-[#19314F]">
                        {t.category}
                      </span>
                      <span className={`text-[10px] ${t.status === 'resolved' ? 'text-slate-400' : 'text-emerald-400'}`}>
                        {t.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ticket Conversation */}
            <div className="flex-1 bg-[#081426] border border-[#19314F] rounded-2xl flex flex-col min-h-0 overflow-hidden">
              <div className="p-4 border-b border-[#19314F] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{currentTicket.subject}</h4>
                  <p className="text-xs text-slate-400">{currentTicket.studentName} — {currentTicket.category}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  {currentTicket.statusLabel}
                </span>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {currentTicket.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl max-w-xl text-xs leading-relaxed ${
                      m.isStaff
                        ? 'mr-auto bg-[#101C38] border border-[#19314F] text-slate-200'
                        : 'ml-auto bg-[#050E1B] border border-[#1FB6D1]/30 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold text-[#1FB6D1]">
                      <span>{m.sender}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{m.time}</span>
                    </div>
                    <p>{m.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendReply} className="p-4 border-t border-[#19314F] bg-[#050E1B] flex gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب ردك الأكاديمي على الطالب..."
                  className="flex-1 bg-[#101C38] border border-[#19314F] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1FB6D1]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1FB6D1] text-[#040B18] font-bold text-xs flex items-center gap-1.5 hover:bg-[#1FB6D1]/90 transition-colors shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
