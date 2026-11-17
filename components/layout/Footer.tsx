'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, MessageSquare, Percent } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 mt-20">
      {/* 4 Minimal Value Props */}
      <div className="border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Безопасная сделка (Escrow)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Деньги фабрике перечисляются только после приемки партии в Казахстане.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">ИИ-перевод без барьера</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Пишите на родном языке — собеседник мгновенно видит точный перевод с терминами.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Фиксированная комиссия 5%</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Без скрытых наценок. Прямая цена от производителя текстиля.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Проверенные фабрики</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Денизли, Бурса, Стамбул с сертификатами качества OEKO-TEX и ISO.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-[10px]">
            TB
          </div>
          <span>
            <strong className="text-slate-800">{t.appName}</strong> © {new Date().getFullYear()} — Оптовый маркетплейс Турция ⇄ Казахстан
          </span>
        </div>

        <div className="flex items-center gap-5 font-medium text-slate-600">
          <Link href="/catalog" className="hover:text-slate-900 transition-colors">Каталог</Link>
          <Link href="/orders" className="hover:text-slate-900 transition-colors">Заказы</Link>
          <Link href="/chat" className="hover:text-slate-900 transition-colors">Сообщения</Link>
          <Link href="/dashboard/supplier" className="hover:text-slate-900 transition-colors">Фабрикам</Link>
          <Link href="/dashboard/admin" className="hover:text-slate-900 transition-colors">Админ</Link>
        </div>
      </div>
    </footer>
  );
}
