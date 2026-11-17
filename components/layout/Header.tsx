'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe2,
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  Factory,
  Shield,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { Language, UserRole } from '@/lib/types';
import { AppStore } from '@/lib/store';

export function Header() {
  const { language, setLanguage, t } = useTranslation();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(AppStore.getCurrentUser());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const handleUserChange = () => {
      setCurrentUser(AppStore.getCurrentUser());
    };
    window.addEventListener('tb_user_change', handleUserChange);
    return () => window.removeEventListener('tb_user_change', handleUserChange);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    const updated = AppStore.switchRole(role);
    setCurrentUser(updated);
    setRoleDropdownOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('tb_user_change'));
    }
  };

  const navLinks: { href: string; label: string; icon: any }[] = [
    { href: '/catalog', label: t.nav.catalog, icon: ShoppingBag },
    { href: '/showroom', label: '3D Студия', icon: Sparkles },
    { href: '/orders', label: t.nav.orders, icon: ShoppingBag },
    { href: '/chat', label: t.nav.chat, icon: MessageSquare },
  ];

  if (currentUser.role === 'supplier' || currentUser.role === 'admin') {
    navLinks.push({
      href: '/dashboard/supplier',
      label: t.nav.supplierCabinet,
      icon: Factory,
    });
  }

  if (currentUser.role === 'admin') {
    navLinks.push({
      href: '/dashboard/admin',
      label: t.nav.adminPanel,
      icon: Shield,
    });
  }

  const roleLabels = {
    buyer: { title: 'Покупатель (РК)', badge: 'Магазин', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    supplier: { title: 'Фабрика (TR)', badge: 'Поставщик', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    admin: { title: 'Администратор', badge: 'Платформа', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top micro-bar: Minimalist status strip */}
      <div className="bg-slate-50/80 border-b border-slate-100 text-[11px] text-slate-500 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Эскроу-защита 100%</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>ИИ-перевод TR ⇄ RU ⇄ KK</span>
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline text-slate-600">Комиссия сервиса 5%</span>
          </div>

          <div className="flex items-center gap-3 font-medium">
            <span className="text-slate-600">
              USD / KZT: <strong className="text-slate-900 font-semibold">502.50 ₸</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-sm tracking-wide shadow-xs group-hover:bg-slate-800 transition-colors">
              TB
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  {language === 'tr' ? 'Türk Köprüsü' : language === 'kk' ? 'Түркі көпірі' : 'Тюркский мост'}
                </span>
                <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  B2B
                </span>
              </div>
              <span className="text-[10px] text-slate-600 font-medium hidden sm:block">
                Турция ⇄ Казахстан • Оптовый текстиль
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language switch + Role pill */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Minimalist Segmented Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold text-slate-600">
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'ru' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'hover:text-slate-900'
                }`}
                title="Русский"
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'tr' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'hover:text-slate-900'
                }`}
                title="Türkçe"
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('kk')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'kk' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'hover:text-slate-900'
                }`}
                title="Қазақша"
              >
                KK
              </button>
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-xs hover:border-slate-300 ${
                  roleLabels[currentUser.role]?.color || 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>{roleLabels[currentUser.role]?.title}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Переключить активную роль</div>
                    <div className="font-semibold text-slate-800 mt-0.5 truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.company} ({currentUser.city})</div>
                  </div>

                  <button
                    onClick={() => handleRoleChange('buyer')}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Покупатель (Казахстан)</div>
                      <div className="text-[11px] text-slate-500">Магазин Silk Trade KZ (Алматы)</div>
                    </div>
                    {currentUser.role === 'buyer' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('supplier')}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Фабрика (Турция)</div>
                      <div className="text-[11px] text-slate-500">Denizli Pamuk Tekstil (Денизли)</div>
                    </div>
                    {currentUser.role === 'supplier' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Администратор платформы</div>
                      <div className="text-[11px] text-slate-500">Модерация фабрик и комиссия 5%</div>
                    </div>
                    {currentUser.role === 'admin' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Язык интерфейса:</span>
            <div className="flex gap-1 text-xs font-bold">
              {(['ru', 'tr', 'kk'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`px-2.5 py-1 rounded-md uppercase ${
                    language === lng ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-500 mb-1.5">Текущая роль:</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
              <button
                onClick={() => handleRoleChange('buyer')}
                className={`py-1.5 px-2 rounded-lg text-center ${
                  currentUser.role === 'buyer' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Покупатель
              </button>
              <button
                onClick={() => handleRoleChange('supplier')}
                className={`py-1.5 px-2 rounded-lg text-center ${
                  currentUser.role === 'supplier' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Фабрика
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`py-1.5 px-2 rounded-lg text-center ${
                  currentUser.role === 'admin' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Админ
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
