'use client';

import React, { useState, useRef } from 'react';
import {
  Upload, X, Loader2, Image as ImageIcon, CheckCircle,
  Plus, Trash2, ArrowLeft, ArrowRight, Eye, AlertCircle,
} from 'lucide-react';

interface BatchImageUploadInputProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

export default function BatchImageUploadInput({
  images,
  onChange,
  folder = 'gallery',
  label = 'صور الدفعة (Batch Images)',
  helperText = 'يمكنك اختيار عدة صور في وقت واحد ليتم رفعها تلقائياً إلى خادم التخزين السحابي للأكاديمية',
}: BatchImageUploadInputProps) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [previewZoomImage, setPreviewZoomImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setUploadTotal(files.length);
    setUploadingCount(0);
    setError(null);
    setSuccessNotice(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          console.warn(`Failed to upload ${file.name}:`, data.error);
        }
      } catch (err: any) {
        console.error(`Error uploading ${file.name}:`, err);
      } finally {
        setUploadingCount((prev) => prev + 1);
      }
    }

    if (uploadedUrls.length > 0) {
      const updated = [...images, ...uploadedUrls];
      onChange(updated);
      setSuccessNotice(`✅ تم بنجاح رفع ${uploadedUrls.length} من أصل ${files.length} صورة إلى الدفعة`);
      setTimeout(() => setSuccessNotice(null), 4000);
    } else {
      setError('فشل رفع الصور المحددة، يرجى التحقق من الاتصال وإعادة المحاولة');
    }

    setUploadTotal(0);
    setUploadingCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const copy = [...images];
    const item = copy.splice(fromIdx, 1)[0];
    copy.splice(toIdx, 0, item);
    onChange(copy);
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setManualUrl('');
  };

  const handleClearAll = () => {
    if (images.length === 0) return;
    if (confirm('هل أنت متأكد من حذف جميع الصور من هذه الدفعة؟')) {
      onChange([]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block font-semibold text-slate-200 text-xs">
            {label}
            {images.length > 0 && (
              <span className="mr-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1FB6D1]/20 text-[#1FB6D1] border border-[#1FB6D1]/30">
                {images.length} صور في الدفعة
              </span>
            )}
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
        </div>

        {images.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>تفريغ الدفعة</span>
          </button>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          isDragOver
            ? 'border-[#1FB6D1] bg-[#1FB6D1]/10'
            : 'border-[#19314F] hover:border-[#1FB6D1]/60 bg-[#050E1B]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploadTotal > 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <Loader2 className="w-8 h-8 text-[#1FB6D1] animate-spin" />
            <div className="text-xs font-bold text-white">
              جاري رفع الصور للدفعة: {uploadingCount} من {uploadTotal}...
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#14B8A6] to-[#1FB6D1] transition-all duration-300"
                style={{ width: `${(uploadingCount / uploadTotal) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#081426] border border-[#19314F] flex items-center justify-center text-[#1FB6D1] group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-200">
              انقر لاختيار مجموعة صور (Batch Selection) أو اسحب الصور إلى هنا
            </div>
            <p className="text-[11px] text-slate-500">
              يدعم رفع عدة صور معاً (PNG, JPG, WebP) بحجم أقصى 10 ميغابايت لكل صورة
            </p>
          </div>
        )}
      </div>

      {/* Success / Error notices */}
      {successNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Manual URL input fallback */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="أو أضف رابط صورة مباشر (URL)..."
          className="flex-1 bg-[#050E1B] border border-[#19314F] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#1FB6D1] transition-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddManualUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          disabled={!manualUrl.trim()}
          className="px-3 py-2 rounded-xl text-xs font-bold bg-[#1FB6D1]/20 hover:bg-[#1FB6D1]/30 text-[#1FB6D1] border border-[#1FB6D1]/40 disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة رابط</span>
        </button>
      </div>

      {/* Live Thumbnails Grid with Reorder & Delete */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-semibold text-slate-400">
            معاينة صور الألبوم وترتيبها ({images.length} صورة):
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-72 overflow-y-auto p-2 rounded-2xl bg-[#030914] border border-[#19314F]">
            {images.map((imgUrl, index) => (
              <div
                key={`${imgUrl}-${index}`}
                className="group relative rounded-xl overflow-hidden bg-[#081426] border border-[#19314F] aspect-square flex items-center justify-center"
              >
                <img
                  src={imgUrl}
                  alt={`Batch Item ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />

                {/* Index badge */}
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold backdrop-blur-sm pointer-events-none">
                  #{index + 1}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-between p-2 transition-opacity">
                  <div className="w-full flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPreviewZoomImage(imgUrl)}
                      className="p-1 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                      title="معاينة كبيرة"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition-colors"
                      title="حذف من الدفعة"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveImage(index, index - 1)}
                      className="text-white hover:text-[#1FB6D1] disabled:opacity-30 transition-colors"
                      title="تقديم"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-300 font-mono">{index + 1}</span>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => handleMoveImage(index, index + 1)}
                      className="text-white hover:text-[#1FB6D1] disabled:opacity-30 transition-colors"
                      title="تأخير"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Preview Modal */}
      {previewZoomImage && (
        <div
          onClick={() => setPreviewZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-[#081426] border border-[#19314F] rounded-2xl overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setPreviewZoomImage(null)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 text-white hover:bg-black transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewZoomImage}
              alt="Zoom Preview"
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
