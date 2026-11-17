'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  Factory,
  Shield,
  Menu,
  X,
  ChevronDown,
  Check,
  Store,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { Language, UserRole } from '@/lib/types';
import { AppStore } from '@/lib/store';
import { BrandLogoMark, FlagIcon } from '@/components/ui/Icons';

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

  const navLinks: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { href: '/catalog', label: t.nav.catalog, icon: Store },
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
    buyer: {
      title: 'Покупатель (РК)',
      dot: 'bg-emerald-500',
      pill: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80',
    },
    supplier: {
      title: 'Фабрика (TR)',
      dot: 'bg-teal-500',
      pill: 'bg-teal-50/90 text-teal-900 border-teal-200/80',
    },
    admin: {
      title: 'Администратор',
      dot: 'bg-indigo-500',
      pill: 'bg-indigo-50/90 text-indigo-900 border-indigo-200/80',
    },
  };

  const activeRole = roleLabels[currentUser.role] || roleLabels.buyer;

  return (
    <header className="sticky top-0 z-50 bg-[#F7F6F2]/85 backdrop-blur-xl border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <BrandLogoMark className="w-9 h-9 group-hover:scale-[1.04] transition-transform" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-[#0F172A] tracking-tight text-base sm:text-[17px]">
                  {language === 'tr' ? 'Türk Köprüsü' : language === 'kk' ? 'Түркі көпірі' : 'Тюркский мост'}
                </span>
                <span className="font-mono bg-[#0F172A] text-teal-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  B2B
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium hidden sm:block tracking-wide">
                Прямой экспорт текстиля • TR ⇄ KZ
              </span>
            </div>
          </Link>

          {/* Center Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 p-1 rounded-full border border-stone-200/80 shadow-2xs">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#0F172A] text-white shadow-2xs'
                      : 'text-stone-600 hover:text-[#0F172A] hover:bg-stone-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 stroke-[2] ${active ? 'text-teal-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Compact FX + Language + Role */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Compact Escrow + FX Chip */}
            <div
              className="hidden xl:flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-full border border-stone-200/80 text-[11px] font-mono tabular-nums text-stone-600 shadow-2xs"
              title="Безопасная сделка Escrow 5% • Фиксированный курс USD/KZT"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-stone-400">$1 =</span>
              <strong className="text-[#0F172A]">502.50 ₸</strong>
            </div>

            {/* Language Segmented Pill */}
            <div className="flex items-center bg-white p-0.5 rounded-full border border-stone-200/80 text-[11px] font-bold shadow-2xs">
              {(['ru', 'tr', 'kk'] as Language[]).map((lng) => {
                const isSelected = language === lng;
                return (
                  <button
                    key={lng}
                    onClick={() => setLanguage(lng)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full uppercase transition-all ${
                      isSelected
                        ? 'bg-[#0F172A] text-white'
                        : 'text-stone-500 hover:text-[#0F172A]'
                    }`}
                    title={lng === 'ru' ? 'Русский' : lng === 'tr' ? 'Türkçe' : 'Қазақша'}
                  >
                    <FlagIcon lang={lng} className="w-3.5 h-3.5" />
                    <span>{lng}</span>
                  </button>
                );
              })}
            </div>

            {/* Role Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-2xs hover:shadow-xs ${activeRole.pill}`}
              >
                <span className={`w-2 h-2 rounded-full ${activeRole.dot}`} />
                <span>{activeRole.title}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-68 bg-white rounded-2xl shadow-elevated border border-stone-200/90 py-1.5 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-stone-100">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                      Переключить режим работы
                    </div>
                    <div className="font-bold text-[#0F172A] mt-0.5 truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {currentUser.company} ({currentUser.city})
                    </div>
                  </div>

                  <button
                    onClick={() => handleRoleChange('buyer')}
                    className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex items-center justify-between text-stone-700"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A]">Покупатель (Казахстан)</div>
                      <div className="text-[11px] text-stone-500">ТОО «SilkWay Home KZ», Алматы</div>
                    </div>
                    {currentUser.role === 'buyer' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('supplier')}
                    className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex items-center justify-between text-stone-700"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A]">Фабрика (Турция)</div>
                      <div className="text-[11px] text-stone-500">Denizli Pamuk Tekstil, Денизли</div>
                    </div>
                    {currentUser.role === 'supplier' && <Check className="w-4 h-4 text-teal-600" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex items-center justify-between text-stone-700"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A]">Администратор платформы</div>
                      <div className="text-[11px] text-stone-500">Верификация и аудит комиссии 5%</div>
                    </div>
                    {currentUser.role === 'admin' && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#0F172A]"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-100"
                >
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Язык:</span>
            <div className="flex gap-1.5 text-xs font-bold">
              {(['ru', 'tr', 'kk'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg uppercase ${
                    language === lng ? 'bg-[#0F172A] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <FlagIcon lang={lng} className="w-3.5 h-3.5" />
                  <span>{lng}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-semibold text-stone-500 mb-2">Роль:</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              <button
                onClick={() => handleRoleChange('buyer')}
                className={`py-2 px-2 rounded-xl text-center ${
                  currentUser.role === 'buyer' ? 'bg-[#0F172A] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                Покупатель
              </button>
              <button
                onClick={() => handleRoleChange('supplier')}
                className={`py-2 px-2 rounded-xl text-center ${
                  currentUser.role === 'supplier' ? 'bg-[#0F172A] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                Фабрика
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-2 rounded-xl text-center ${
                  currentUser.role === 'admin' ? 'bg-[#0F172A] text-white' : 'bg-stone-100 text-stone-700'
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
