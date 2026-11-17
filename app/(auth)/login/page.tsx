'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShoppingBag, Factory } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { BrandLogoMark } from '@/components/ui/Icons';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    AppStore.switchRole(role);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('tb_user_change'));
    }
    if (role === 'supplier') {
      router.push('/dashboard/supplier');
    } else {
      router.push('/catalog');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-elevated max-w-md w-full p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2.5">
          <div className="flex justify-center">
            <BrandLogoMark className="w-12 h-12" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#0B1120]">Вход на платформу</h1>
          <p className="text-xs text-slate-500">
            Оптовый B2B-маркетплейс «{t.appName}» (Турция ⇄ Казахстан)
          </p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'buyer' ? 'bg-white text-[#0B1120] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${role === 'buyer' ? 'text-teal-600' : 'text-slate-400'}`} />
            <span>Покупатель (РК)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('supplier')}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'supplier' ? 'bg-white text-[#0B1120] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Factory className={`w-4 h-4 ${role === 'supplier' ? 'text-teal-600' : 'text-slate-400'}`} />
            <span>Фабрика (Турция)</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Рабочий Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@silkway.kz"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Пароль</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-200/70 rounded-xl text-[11px] text-teal-900">
            <strong>Быстрый вход:</strong> Для демонстрации MVP введите любые данные или переключайте роли в шапке сайта.
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#0B1120] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2"
          >
            <span>Войти как {role === 'buyer' ? 'Покупатель' : 'Фабрика'}</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Нет аккаунта?{' '}
          <Link href="/register" className="font-semibold text-[#0B1120] hover:text-teal-700 hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}
