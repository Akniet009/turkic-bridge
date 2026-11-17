'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, MessageSquare, Percent } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { BrandLogoMark } from '@/components/ui/Icons';

export function Footer() {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Безопасная сделка (Escrow)',
      desc: 'Деньги фабрике перечисляются только после приемки партии в Казахстане.',
    },
    {
      icon: MessageSquare,
      title: 'ИИ-перевод без барьера',
      desc: 'Пишите на родном языке — собеседник сразу видит точный перевод с терминами.',
    },
    {
      icon: Percent,
      title: 'Фиксированная комиссия 5%',
      desc: 'Прозрачное ценообразование и прямые отгрузки от производителей текстиля.',
    },
    {
      icon: Truck,
      title: 'Проверенные фабрики',
      desc: 'Денизли, Бурса и Стамбул с сертификатами качества OEKO-TEX и ISO.',
    },
  ];

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 mt-20">
      {/* Guarantees */}
      <div className="border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50/80 ring-1 ring-teal-500/20 text-teal-700 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-[#0B1120]">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2.5">
          <BrandLogoMark className="w-7 h-7" />
          <span>
            <strong className="font-display text-[#0B1120]">{t.appName}</strong> © {new Date().getFullYear()} — Оптовый B2B-маркетплейс Турция ⇄ Казахстан
          </span>
        </div>

        <div className="flex items-center gap-5 font-medium text-slate-600">
          <Link href="/catalog" className="hover:text-[#0B1120] transition-colors">Каталог</Link>
          <Link href="/orders" className="hover:text-[#0B1120] transition-colors">Заказы</Link>
          <Link href="/chat" className="hover:text-[#0B1120] transition-colors">Сообщения</Link>
          <Link href="/dashboard/supplier" className="hover:text-[#0B1120] transition-colors">Фабрикам</Link>
          <Link href="/dashboard/admin" className="hover:text-[#0B1120] transition-colors">Админ</Link>
        </div>
      </div>
    </footer>
  );
}
