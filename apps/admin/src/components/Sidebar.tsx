'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Users,
  Award,
  CheckCircle,
  QrCode,
  Layers,
  Bell,
  MessageSquare,
  Settings,
  Shield,
  LogOut,
  Star,
  ImageIcon,
  Sliders,
} from 'lucide-react';

interface SidebarProps {
  lang: 'ar' | 'en';
}

export default function Sidebar({ lang = 'ar' }: SidebarProps) {
  const pathname = usePathname();
  const isAr = lang === 'ar';

  const menuItems = [
    { href: '/dashboard', label: isAr ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: isAr ? 'الدورات التدريبية' : 'Courses', icon: GraduationCap },
    { href: '/workshops', label: isAr ? 'الورش والندوات' : 'Workshops', icon: Calendar },
    { href: '/instructors', label: isAr ? 'الكادر التدريبي' : 'Instructors', icon: Award },
    { href: '/enrollments', label: isAr ? 'التسجيل والقبول' : 'Enrollments', icon: CheckCircle },
    { href: '/attendance', label: isAr ? 'تسجيل الحضور والـ QR' : 'Attendance & QR', icon: QrCode },
    { href: '/students', label: isAr ? 'الطلاب والمتدربون' : 'Students', icon: Users },
    { href: '/graduates', label: isAr ? 'الخريجون والتقييمات' : 'Graduates & Reviews', icon: Star },
    { href: '/gallery', label: isAr ? 'معرض الصور (Gallery)' : 'Gallery', icon: ImageIcon },
    { href: '/services', label: isAr ? 'الخدمات والاستشارات' : 'Services', icon: Layers },
    { href: '/banners', label: isAr ? 'البانر المتحرك (Slider)' : 'Slider Banner', icon: Sliders },
    { href: '/notifications', label: isAr ? 'مركز الإشعارات' : 'Notifications', icon: Bell },
    { href: '/support', label: isAr ? 'تذاكر الدعم' : 'Support Tickets', icon: MessageSquare },
    { href: '/audit-logs', label: isAr ? 'سجل العمليات' : 'Audit Logs', icon: Shield },
    { href: '/settings', label: isAr ? 'إعدادات الأكاديمية' : 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#081426] border-r border-[#19314F] flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#19314F] flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1FB6D1] to-[#101C38] flex items-center justify-center font-bold text-white shadow-lg">
          DC
        </div>
        <div>
          <h1 className="font-bold text-lg text-white leading-tight">DentaCollab</h1>
          <p className="text-xs text-[#1FB6D1] font-medium">لوحة الإدارة الأكاديمية</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#1FB6D1]/15 text-[#1FB6D1] border border-[#1FB6D1]/30 font-semibold'
                  : 'text-slate-300 hover:bg-[#101C38] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-[#19314F] bg-[#050E1B]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#101C38] border border-[#19314F] flex items-center justify-center text-xs font-semibold text-white">
              AD
            </div>
            <div className="text-xs">
              <div className="font-medium text-white">المشرف الأكاديمي</div>
              <div className="text-slate-400">admin@dentacollab.org</div>
            </div>
          </div>
          <Link href="/login" className="text-slate-400 hover:text-rose-400 p-1.5 transition-colors" title="تسجيل الخروج">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
