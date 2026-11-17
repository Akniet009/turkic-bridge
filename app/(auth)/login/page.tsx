'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, ShoppingBag, Factory } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';

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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-navy text-brand-accent flex items-center justify-center font-extrabold text-xl mx-auto">
            TB
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Вход на платформу</h1>
          <p className="text-xs text-slate-500">
            Оптовый маркетплейс «Тюркский мост» (Турция ⇄ Казахстан)
          </p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'buyer'
                ? 'bg-white text-brand-navy shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-brand-accent" />
            <span>Покупатель (РК)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('supplier')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'supplier'
                ? 'bg-white text-brand-navy shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Factory className="w-4 h-4 text-brand-accent" />
            <span>Фабрика (Турция)</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Рабочий Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@silkway.kz"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Пароль</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          <div className="p-3 bg-cyan-50/70 border border-cyan-100 rounded-xl text-[11px] text-cyan-900">
            <strong>Быстрый вход:</strong> Для демонстрации MVP введите любые данные или переключайте роли в шапке сайта.
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Войти как {role === 'buyer' ? 'Покупатель' : 'Фабрика'}</span>
            <ArrowRight className="w-4 h-4 text-brand-accent" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Нет аккаунта?{' '}
          <Link href="/register" className="font-bold text-brand-navy hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}
