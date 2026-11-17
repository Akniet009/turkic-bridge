'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, MessageSquare, Percent } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-navy text-slate-300 border-t border-slate-800 mt-20">
      {/* Guarantees row */}
      <div className="border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Безопасная сделка (Escrow)</h4>
              <p className="text-xs text-slate-400 mt-1">Деньги переводятся фабрике только после приемки груза в РК.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Встроенный ИИ-переводчик</h4>
              <p className="text-xs text-slate-400 mt-1">Пишите на русском или казахском — турецкая фабрика видит на турецком.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Прозрачная комиссия 5%</h4>
              <p className="text-xs text-slate-400 mt-1">Никаких скрытых платежей и наценок посредников.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Проверенные фабрики</h4>
              <p className="text-xs text-slate-400 mt-1">Денизли, Бурса, Стамбул с сертификатами OEKO-TEX и ISO.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div>
          <span className="text-white font-bold">{t.appName}</span> © {new Date().getFullYear()} — Оптовый B2B-маркетплейс «Турция → Казахстан».
        </div>
        <div className="flex gap-6">
          <Link href="/catalog" className="hover:text-brand-accent transition-colors">Каталог</Link>
          <Link href="/orders" className="hover:text-brand-accent transition-colors">Заказы</Link>
          <Link href="/chat" className="hover:text-brand-accent transition-colors">Чат с фабриками</Link>
          <Link href="/dashboard/admin" className="hover:text-brand-accent transition-colors">Админ-панель</Link>
        </div>
      </div>
    </footer>
  );
}
