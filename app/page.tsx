'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Factory,
  Building2,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
  Percent,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductCategory } from '@/lib/types';

export default function HomePage() {
  const { language, t } = useTranslation();
  const [products] = useState(() => AppStore.getProducts().slice(0, 6));
  const [suppliers] = useState(() => AppStore.getSuppliers());

  const categories = [
    { id: 'bedding' as ProductCategory, label: t.categories.bedding, icon: '🛏️', count: 6 },
    { id: 'towels' as ProductCategory, label: t.categories.towels, icon: '🧖', count: 5 },
    { id: 'plaids' as ProductCategory, label: t.categories.plaids, icon: '🧶', count: 4 },
    { id: 'fabrics' as ProductCategory, label: t.categories.fabrics, icon: '🧵', count: 3 },
    { id: 'apparel' as ProductCategory, label: t.categories.apparel, icon: '👘', count: 2 },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#FAFAFA] text-slate-900">
      {/* HERO SECTION - Minimalist, Airy & Trustworthy */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 bg-white">
        {/* Subtle ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-50/40 via-slate-50/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Minimalist Top Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Оптовый B2B-мост</span>
            <span className="text-slate-400">•</span>
            <span className="text-teal-700 font-bold">Турция ⇄ Казахстан</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/catalog"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4 text-teal-400" />
              <span>{t.buyerCTA}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/supplier"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80 font-semibold text-sm shadow-2xs transition-all"
            >
              <Factory className="w-4 h-4 text-teal-600" />
              <span>{t.supplierCTA}</span>
            </Link>
          </div>

          {/* 4 Clean Stats */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-slate-100 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">15+</div>
              <div className="text-xs text-slate-500 mt-0.5">Позиций в каталоге</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">3</div>
              <div className="text-xs text-slate-500 mt-0.5">Хаба (Денизли, Бурса, Стамбул)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">100%</div>
              <div className="text-xs text-slate-500 mt-0.5">Escrow-защита в ₸</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">5%</div>
              <div className="text-xs text-slate-500 mt-0.5">Прозрачная комиссия</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES PILLS - Minimalist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              Категории оптового текстиля
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
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
              className="group bg-white p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {cat.label}
                </h3>
                <span className="text-[11px] text-slate-600 font-medium">{cat.count} фабричных позиций</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              Популярные товары недели
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Сертифицированный текстиль с указанием минимальной партии (MOQ)
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1"
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

      {/* HOW IT WORKS - 4 Minimalist Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
              Прозрачный процесс
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Как работает «Тюркский мост»
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              От первого сообщения на родном языке до прибытия груза на ваш склад в Казахстане
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Выбор товара и фабрики</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Сравнивайте оптовые цены турецких фабрик, проверяйте сертификаты OEKO-TEX и минимальный объем (MOQ).
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Диалог с ИИ-переводом</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Пишите на русском или казахском — встроенный переводчик точно передаст плотность, цвета и размеры на турецкий.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Оплата через Эскроу</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Оплачивайте заказ в тенге. Деньги заморожены на защищенном счете до успешного прибытия груза в Казахстан.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900">Приемка и расчет</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Вы проверяете качество партии в Алматы или Астане, подтверждаете приемку — фабрика получает оплату.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FACTORY HUBS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              Производственные кластеры Турции
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Прямые контакты с проверенными фабриками текстильной индустрии
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((s) => (
            <Link
              key={s.id}
              href={`/suppliers/${s.id}`}
              className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-semibold text-slate-800">{s.city}</span>
                  </div>
                  {s.verified && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Проверено</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                  {s.factory_name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {s.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.certificates?.map((c) => (
                    <span key={c} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-slate-950">
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
