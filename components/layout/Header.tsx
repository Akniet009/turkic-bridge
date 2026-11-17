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
  UserCheck,
  ChevronDown,
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
    setCurrentUser(AppStore.getCurrentUser());
  }, []);

  const handleRoleChange = (role: UserRole) => {
    const updated = AppStore.switchRole(role);
    setCurrentUser(updated);
    setRoleDropdownOpen(false);
    // Reload page state
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('tb_user_change'));
    }
  };

  const navLinks: { href: string; label: string; icon: any }[] = [
    { href: '/catalog', label: t.nav.catalog, icon: ShoppingBag },
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner: Escrow guarantee & live FX */}
      <div className="bg-brand-navy text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
            <span className="hidden sm:inline">
              {language === 'ru' && 'Безопасная сделка: средства в Эскроу до прибытия груза в Казахстан'}
              {language === 'tr' && 'Güvenli Ticaret: Ödemeniz Kazakistan’a teslimata kadar Escrow güvencesinde'}
              {language === 'kk' && 'Қауіпсіз мәміле: жүк Қазақстанға жеткенше қаржы Эскроуда сақталады'}
            </span>
            <span className="sm:hidden font-medium">Безопасная сделка 100% (Escrow)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300">
              USD/KZT: <strong className="text-brand-accent">502.50 ₸</strong>
            </span>
            <span className="hidden md:inline-block bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded text-[11px] font-semibold">
              Комиссия 5%
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-navy to-brand-blue flex items-center justify-center text-brand-accent shadow-md shadow-brand-navy/20">
              <span className="font-extrabold text-xl tracking-wider">TB</span>
            </div>
            <div>
              <span className="text-lg font-bold text-brand-navy tracking-tight block leading-tight">
                {t.appName}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block">
                B2B TR ⇄ KZ
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-navy/5 text-brand-navy font-semibold'
                      : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language & Role Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['ru', 'tr', 'kk'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                    language === lng
                      ? 'bg-white text-brand-navy shadow-sm'
                      : 'text-slate-500 hover:text-brand-navy'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>

            {/* Role Switcher Pill for MVP demonstration */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 transition-colors border border-slate-200"
              >
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-slate-500">Роль:</span>
                <span className="font-semibold text-brand-navy">
                  {currentUser.role === 'buyer' && '🛒 Покупатель (РК)'}
                  {currentUser.role === 'supplier' && '🏭 Фабрика (Турция)'}
                  {currentUser.role === 'admin' && '🛡️ Админ'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Переключить демо-роль
                  </div>
                  <button
                    onClick={() => handleRoleChange('buyer')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'buyer' ? 'bg-cyan-50/50 font-bold text-brand-navy' : ''
                    }`}
                  >
                    <div>
                      <div className="font-semibold">Покупатель (Казахстан)</div>
                      <div className="text-[11px] text-slate-500">Асель Муканова, Алматы</div>
                    </div>
                    {currentUser.role === 'buyer' && <UserCheck className="w-4 h-4 text-brand-accent" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('supplier')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'supplier' ? 'bg-cyan-50/50 font-bold text-brand-navy' : ''
                    }`}
                  >
                    <div>
                      <div className="font-semibold">Поставщик (Турция)</div>
                      <div className="text-[11px] text-slate-500">Mehmet Demir, Денизли</div>
                    </div>
                    {currentUser.role === 'supplier' && <UserCheck className="w-4 h-4 text-brand-accent" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'admin' ? 'bg-cyan-50/50 font-bold text-brand-navy' : ''
                    }`}
                  >
                    <div>
                      <div className="font-semibold">Администратор платформы</div>
                      <div className="text-[11px] text-slate-500">Ерлан Садыков, Алматы</div>
                    </div>
                    {currentUser.role === 'admin' && <UserCheck className="w-4 h-4 text-brand-accent" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Язык интерфейса:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['ru', 'tr', 'kk'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => {
                    setLanguage(lng);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
                    language === lng ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <link.icon className="w-5 h-5 text-brand-navy" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Role Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-500 mb-2">Активная роль (демо):</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => {
                  handleRoleChange('buyer');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center rounded-lg border font-semibold ${
                  currentUser.role === 'buyer'
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Покупатель
              </button>
              <button
                onClick={() => {
                  handleRoleChange('supplier');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center rounded-lg border font-semibold ${
                  currentUser.role === 'supplier'
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Фабрика
              </button>
              <button
                onClick={() => {
                  handleRoleChange('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center rounded-lg border font-semibold ${
                  currentUser.role === 'admin'
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
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
