'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(
        err.code === 'auth/invalid-credential'
          ? 'بيانات الدخول غير صحيحة / Invalid email or password'
          : err.message || 'فشل تسجيل الدخول'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040B18] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1FB6D1]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#101C38] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#081426] border border-[#19314F] rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#1FB6D1] to-[#101C38] flex items-center justify-center font-bold text-xl text-white shadow-xl">
            DC
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">تسجيل دخول الإدارة</h1>
          <p className="text-sm text-slate-400 mt-1">DentaCollab Digital Dentistry Academy</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              البريد الإلكتروني / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dentacollab.org"
                className="w-full bg-[#101C38] border border-[#19314F] rounded-xl pr-10 pl-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#1FB6D1] transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              كلمة المرور / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#101C38] border border-[#19314F] rounded-xl pr-10 pl-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#1FB6D1] transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#1FB6D1] hover:bg-[#1FB6D1]/90 text-[#040B18] font-bold text-sm transition-all shadow-lg hover:shadow-[#1FB6D1]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#040B18] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#19314F] text-center">
          <p className="text-xs text-slate-500">
            مخصص للكادر التعليمي والإداري فقط. لتهيئة المشرف الأول استخدم السكريبت المرفق:
            <code className="block mt-1 text-[11px] text-[#1FB6D1] font-mono">scripts/bootstrap-admin.ts</code>
          </p>
        </div>
      </div>
    </div>
  );
}
