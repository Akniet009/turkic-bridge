'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Factory,
  MapPin,
  CheckCircle2,
  Languages,
  SearchCheck,
  PackageCheck,
  Box,
  ArrowLeftRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductCategory } from '@/lib/types';
import { CategoryVectorIcon, FlagIcon } from '@/components/ui/Icons';

export default function HomePage() {
  const { t } = useTranslation();
  const [products] = useState(() => AppStore.getProducts().slice(0, 6));
  const [suppliers] = useState(() => AppStore.getSuppliers());

  const categories: { id: ProductCategory; label: string; count: number; accent: string }[] = [
    { id: 'bedding', label: t.categories.bedding, count: 6, accent: 'text-teal-700 bg-teal-50/80 ring-teal-500/20' },
    { id: 'towels', label: t.categories.towels, count: 5, accent: 'text-sky-700 bg-sky-50/80 ring-sky-500/20' },
    { id: 'plaids', label: t.categories.plaids, count: 4, accent: 'text-amber-700 bg-amber-50/80 ring-amber-500/20' },
    { id: 'fabrics', label: t.categories.fabrics, count: 3, accent: 'text-indigo-700 bg-indigo-50/80 ring-indigo-500/20' },
    { id: 'apparel', label: t.categories.apparel, count: 2, accent: 'text-emerald-700 bg-emerald-50/80 ring-emerald-500/20' },
  ];

  const steps = [
    {
      num: '01',
      icon: SearchCheck,
      iconStyle: 'bg-slate-100 text-[#0B1120] ring-slate-200/80',
      title: 'Выбор товара и 3D-осмотр',
      desc: 'Сравнивайте цены турецких фабрик, проверяйте сертификаты OEKO-TEX и просматривайте фактуры на 3D-моделях в каталоге.',
    },
    {
      num: '02',
      icon: Languages,
      iconStyle: 'bg-teal-50 text-teal-700 ring-teal-500/20',
      title: 'Диалог с ИИ-переводом',
      desc: 'Пишите на русском или казахском — встроенный переводчик точно передаст плотность, цвета и размеры на турецкий.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      iconStyle: 'bg-sky-50 text-sky-700 ring-sky-500/20',
      title: 'Оплата через Эскроу',
      desc: 'Оплачивайте заказ в тенге. Деньги заморожены на защищенном счете до успешного прибытия груза в Казахстан.',
    },
    {
      num: '04',
      icon: PackageCheck,
      iconStyle: 'bg-emerald-50 text-emerald-700 ring-emerald-500/20',
      title: 'Приемка и расчет',
      desc: 'Вы проверяете качество партии в Алматы или Астане, подтверждаете приемку — фабрика получает оплату.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#F9FAFB] text-[#0B1120]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-14 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70 bg-white">
        {/* Subtle Architectural Mesh Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-gradient-to-b from-teal-50/70 via-slate-50/40 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Crisp SVG Country Pair Tag */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="inline-flex items-center gap-1.5">
              <FlagIcon lang="tr" className="w-4 h-4" />
              <span>Турция</span>
            </span>
            <ArrowLeftRight className="w-3.5 h-3.5 text-teal-600" />
            <span className="inline-flex items-center gap-1.5">
              <FlagIcon lang="kk" className="w-4 h-4" />
              <span>Казахстан</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-teal-700 font-bold">Оптовый B2B-мост</span>
          </div>

          {/* Display Headline */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#0B1120] leading-[1.08]">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Primary CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
            <Link
              href="/catalog"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#0B1120] hover:bg-slate-800 text-white font-semibold text-sm shadow-card transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4 text-teal-400 stroke-[2]" />
              <span>{t.buyerCTA}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/supplier"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-semibold text-sm shadow-2xs transition-all"
            >
              <Factory className="w-4 h-4 text-teal-600 stroke-[2]" />
              <span>{t.supplierCTA}</span>
            </Link>
          </div>

          {/* 4 Tabular Metric Pillars */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-slate-100 text-center">
            <div>
              <div className="font-display tabular-nums text-2xl sm:text-3xl font-extrabold text-[#0B1120]">15+</div>
              <div className="text-xs text-slate-500 mt-0.5">Позиций с 3D-осмотром</div>
            </div>
            <div>
              <div className="font-display tabular-nums text-2xl sm:text-3xl font-extrabold text-[#0B1120]">3</div>
              <div className="text-xs text-slate-500 mt-0.5">Хаба (Денизли, Бурса, Стамбул)</div>
            </div>
            <div>
              <div className="font-display tabular-nums text-2xl sm:text-3xl font-extrabold text-teal-600">100%</div>
              <div className="text-xs text-slate-500 mt-0.5">Escrow-защита в ₸</div>
            </div>
            <div>
              <div className="font-display tabular-nums text-2xl sm:text-3xl font-extrabold text-[#0B1120]">5%</div>
              <div className="text-xs text-slate-500 mt-0.5">Прозрачная комиссия</div>
            </div>
          </div>
        </div>
      </section>

      {/* BESPOKE SVG CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1120]">
              Категории оптового текстиля
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Прямой доступ к турецким производственным мощностям
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Весь каталог</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-card transition-all flex flex-col justify-between gap-4"
            >
              <div
                className={`w-11 h-11 rounded-xl ring-1 flex items-center justify-center transition-transform group-hover:scale-105 ${cat.accent}`}
              >
                <CategoryVectorIcon category={cat.id} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xs sm:text-sm font-bold text-[#0B1120] group-hover:text-teal-700 transition-colors">
                  {cat.label}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                  {cat.count} фабричных позиций
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS (WITH DIRECT 3D INSPECTION ON EACH CARD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1120]">
              Популярные товары недели
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-slate-500">
                Сертифицированный текстиль с расчетом в тенге
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/70 px-2.5 py-0.5 rounded-full">
                <Box className="w-3 h-3 text-teal-600" />
                <span>Нажмите «3D» на карточке товара</span>
              </span>
            </div>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-slate-700 hover:text-[#0B1120] flex items-center gap-1"
          >
            <span>Смотреть все</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-2xs">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/70 px-3 py-1 rounded-full">
              Прозрачный процесс
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1120]">
              Как работает «Тюркский мост»
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              От первого сообщения на родном языке до прибытия груза на ваш склад в Казахстане
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-5 rounded-2xl bg-[#F9FAFB] border border-slate-200/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center ${step.iconStyle}`}
                    >
                      <Icon className="w-4.5 h-4.5 stroke-[2]" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">{step.num}</span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-[#0B1120]">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FACTORY HUBS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1120]">
              Производственные кластеры Турции
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Прямые контракты с проверенными фабриками текстильной индустрии
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((s) => (
            <Link
              key={s.id}
              href={`/suppliers/${s.id}`}
              className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:border-slate-300 shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-semibold text-slate-800">{s.city}</span>
                  </div>
                  {s.verified && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Проверено</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-[#0B1120] group-hover:text-teal-700 transition-colors">
                  {s.factory_name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {s.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.certificates?.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-[#0B1120]">
                <span>Каталог фабрики</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
