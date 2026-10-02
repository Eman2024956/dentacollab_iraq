'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SelectionActionBar from '@/components/SelectionActionBar';
import { exportToExcel } from '@/lib/export-excel';
import {
  Shield,
  Clock,
  UserCheck,
  Key,
  Database,
  BellRing,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
} from 'lucide-react';

export default function AuditLogsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const logs = [
    {
      id: 'audit_01',
      actor: 'admin@dentacollab.org',
      role: 'super_admin',
      action: 'FCM_BROADCAST_SENT',
      collection: 'publicNotifications',
      target: 'topic:all_customers',
      details: 'إرسال إشعار عام لجميع المتدربين المسجلين في بغداد',
      time: 'اليوم، ١١:٤٥ ص',
    },
    {
      id: 'audit_02',
      actor: 'admin@dentacollab.org',
      role: 'super_admin',
      action: 'DATA_INJECTION_SEED',
      collection: 'courses, workshops, services',
      target: 'project:dentacollab-iraq',
      details: 'حقن وتحديث البيانات التدريبية لدورات تشرين الأول ونماذج الخدمات',
      time: 'اليوم، ١١:٣٧ ص',
    },
    {
      id: 'audit_03',
      actor: 'admin@dentacollab.org',
      role: 'super_admin',
      action: 'QR_PASS_VERIFIED',
      collection: 'attendance',
      target: 'dc_pass_ali_saadi_exocad_2026',
      details: 'تسجيل وتأكيد حضور د. علي حسين السعدي في دورة Exocad',
      time: 'اليوم، ١٠:٣٠ ص',
    },
    {
      id: 'audit_04',
      actor: 'admin@dentacollab.org',
      role: 'super_admin',
      action: 'BOOTSTRAP_SUPER_ADMIN',
      collection: 'staffMemberships',
      target: 'admin_super_dentacollab',
      details: 'منح صلاحيات المشرف العام وحقن claims في فايربيس',
      time: 'اليوم، ٠٩:٠٠ ص',
    },
  ];

  const toggleSelectAll = () => {
    if (selectedIds.length === logs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(logs.map((l) => l.id));
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
      ? logs.filter((l) => selectedIds.includes(l.id))
      : logs;

    exportToExcel(
      `dentacollab-audit-logs-${new Date().toISOString().slice(0, 10)}`,
      [
        { key: 'action', label: 'نوع العملية' },
        { key: 'actor', label: 'المشرف المسؤول' },
        { key: 'role', label: 'مستوى الصلاحية' },
        { key: 'details', label: 'تفاصيل العملية' },
        { key: 'target', label: 'الهدف' },
        { key: 'collection', label: 'المجموعة (Collection)' },
        { key: 'time', label: 'الوقت والتاريخ' },
      ],
      listToExport
    );
  };

  return (
    <div className="flex min-h-screen bg-[#040B18]">
      <Sidebar lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAr ? 'سجل العمليات والأمان (Audit Logs)' : 'Security & Audit Logs'}
          subtitle={isAr ? 'سجل غير قابل للتعديل يوثق العمليات الإدارية الحساسة وإرسال الإشعارات' : 'Immutable audit trail of privileged administrative and messaging actions'}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        />

        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Top Bar Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white">العمليات الموثقة حديثاً</h3>
                {selectedIds.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1FB6D1]/20 text-[#1FB6D1] text-[11px] font-bold border border-[#1FB6D1]/40">
                    تم تحديد {selectedIds.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">يتم توثيق كل عملية صادرة من المشرفين في فايربيس مع الوقت والمعرف</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={toggleSelectAll}
                className="px-3 py-2 rounded-xl bg-[#081426] border border-[#19314F] hover:border-slate-400 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
              >
                {selectedIds.length > 0 && selectedIds.length === logs.length ? (
                  <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>{selectedIds.length === logs.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}</span>
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
                title="تصدير سجل الأمان إلى Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : '(الكل)'}</span>
              </button>
            </div>
          </div>

          {/* Floating Selection Bar */}
          <SelectionActionBar
            selectedCount={selectedIds.length}
            totalCount={logs.length}
            onClearSelection={clearSelection}
            onExportSelected={() => handleExportExcel(true)}
            onSelectAll={toggleSelectAll}
            isAllSelected={selectedIds.length === logs.length && logs.length > 0}
            itemLabel="سجل أمان"
          />

          <div className="bg-[#081426] border border-[#19314F] rounded-2xl overflow-hidden p-6">
            <div className="space-y-3">
              {logs.map((log) => {
                const isSelected = selectedIds.includes(log.id);
                return (
                  <div
                    key={log.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isSelected
                        ? 'bg-[#1FB6D1]/15 border-[#1FB6D1]'
                        : 'bg-[#050E1B] border-[#19314F] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleSelectOne(log.id)}
                        className="text-slate-400 hover:text-white mt-2"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#1FB6D1]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      <div className="p-2.5 rounded-xl bg-[#101C38] border border-[#19314F] text-[#1FB6D1] shrink-0 mt-0.5">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{log.action}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1FB6D1]/10 text-[#1FB6D1] font-mono">
                            {log.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 mt-1">{log.details}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Target: {log.target} | Collection: {log.collection}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400 font-mono">{log.time}</div>
                      <div className="text-[11px] text-slate-500">{log.actor}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
