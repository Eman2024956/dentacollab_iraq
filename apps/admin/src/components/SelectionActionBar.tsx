'use client';

import React from 'react';
import { X, CheckSquare, Download, FileSpreadsheet, Trash2, Check } from 'lucide-react';

interface SelectionActionBarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onExportSelected: () => void;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
  itemLabel?: string;
  extraActions?: React.ReactNode;
}

export default function SelectionActionBar({
  selectedCount,
  totalCount,
  onClearSelection,
  onExportSelected,
  onSelectAll,
  isAllSelected,
  itemLabel = 'عنصر',
  extraActions,
}: SelectionActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-4 z-40 my-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="bg-[#081426]/95 backdrop-blur-md border border-[#1FB6D1]/40 shadow-xl shadow-black/40 rounded-2xl p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Info & Counts */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1FB6D1]/20 border border-[#1FB6D1]/40 flex items-center justify-center text-[#1FB6D1]">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>تم تحديد</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1FB6D1] text-[#040B18] font-mono text-[11px] font-extrabold">
                {selectedCount}
              </span>
              <span>من أصل {totalCount} {itemLabel}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              يمكنك تصدير العناصر المحددة أو تطبيق الإجراءات الجماعية
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onSelectAll && !isAllSelected && (
            <button
              onClick={onSelectAll}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-[#101C38] border border-[#19314F] hover:border-slate-400 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-[#1FB6D1]" />
              <span>تحديد الكل ({totalCount})</span>
            </button>
          )}

          <button
            onClick={onExportSelected}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            title="تصدير الصفوف المحددة إلى ملف Excel مع ترميز UTF-8 للغة العربية"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>تصدير Excel ({selectedCount})</span>
          </button>

          {extraActions}

          <button
            onClick={onClearSelection}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 font-semibold transition-colors flex items-center gap-1.5"
            title="إلغاء تحديد كافة الصفوف"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>إلغاء التحديد (Clear)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
