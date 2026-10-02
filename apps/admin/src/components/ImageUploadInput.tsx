'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

export default function ImageUploadInput({
  value,
  onChange,
  folder = 'uploads',
  label = 'صورة العنصر السحابية',
  helperText = 'ارفع صورة بصيغة PNG أو JPG أو WebP (الحد الأقصى 10 ميغابايت)',
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل رفع الصورة إلى خادم التخزين');
      }

      onChange(data.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء الرفع');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block font-semibold text-slate-300 text-xs">{label}</label>}

      <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#050E1B] border border-[#19314F]">
        {/* Preview thumbnail */}
        <div className="w-16 h-16 rounded-xl bg-[#081426] border border-[#19314F] overflow-hidden flex items-center justify-center shrink-0 relative group">
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
                title="إزالة الصورة"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-600" />
          )}
        </div>

        {/* Upload Controls & URL */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-[#101C38] border border-[#1FB6D1]/40 text-[#1FB6D1] hover:bg-[#1FB6D1]/10 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري رفع الصورة سحابياً...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع صورة من الجهاز</span>
                </>
              )}
            </button>

            {uploadSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                تم الرفع بنجاح!
              </span>
            )}
          </div>

          <input
            type="text"
            dir="ltr"
            placeholder="أو ألصق رابط الصورة مباشرة https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#081426] border border-[#19314F] rounded-xl px-3 py-1.5 text-slate-300 text-[11px] font-mono focus:outline-none focus:border-[#1FB6D1] transition-colors"
          />

          {error && <p className="text-[11px] text-rose-400">{error}</p>}
          {!error && helperText && <p className="text-[10px] text-slate-500">{helperText}</p>}
        </div>
      </div>
    </div>
  );
}
