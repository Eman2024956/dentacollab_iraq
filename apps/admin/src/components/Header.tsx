'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Bell, ShieldCheck, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  lang: 'ar' | 'en';
  onToggleLang?: () => void;
}

export default function Header({ title, subtitle, lang, onToggleLang }: HeaderProps) {
  const isAr = lang === 'ar';
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 bg-[#081426]/90 backdrop-blur border-b border-[#19314F] px-8 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>dentacollab-iraq</span>
        </div>

        {/* Clear Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#19314F] bg-[#101C38] text-xs font-medium text-slate-200 hover:border-[#1FB6D1] transition-all shadow-sm"
          title={isDark ? 'التبديل إلى الوضع النهاري (Light Mode)' : 'التبديل إلى الوضع الليلي (Dark Mode)'}
        >
          {mounted ? (
            isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
                <span className="hidden md:inline text-amber-400 font-semibold">نهاري</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#1FB6D1] animate-in spin-in-180 duration-300" />
                <span className="hidden md:inline text-[#1FB6D1] font-semibold">ليلي</span>
              </>
            )
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#101C38] transition-colors"
          title="الإشعارات"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1FB6D1]"></span>
        </button>

        {/* Language switch */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#19314F] bg-[#101C38] text-xs font-semibold text-slate-200 hover:border-[#1FB6D1] transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-[#1FB6D1]" />
          <span>{isAr ? 'English' : 'العربية'}</span>
        </button>
      </div>
    </header>
  );
}
