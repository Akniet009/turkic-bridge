'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Percent,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Factory,
  Building2,
  MapPin,
  Truck,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { ProductCard } from '@/components/catalog/ProductCard';
import { EscrowBadge, VerifiedBadge, CommissionBadge } from '@/components/ui/TrustBadges';
import { ProductCategory } from '@/lib/types';

export default function HomePage() {
  const { t } = useTranslation();
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
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-brand-navy to-brand-blue text-white pt-16 sm:pt-24 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background decorative grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00D4B2_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Top trust badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-brand-accent">
              <ShieldCheck className="w-4 h-4" />
              <span>Безопасная сделка (Escrow)</span>
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span>Встроенный ИИ-переводчик TR ⇄ RU ⇄ KK</span>
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white">Комиссия 5%</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Action Buttons: "Я покупатель" / "Я поставщик" */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <Link
              href="/catalog"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-brand-navy font-bold text-base shadow-lg shadow-brand-accent/25 transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5 text-brand-navy" />
              <span>{t.buyerCTA}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/supplier"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-base backdrop-blur-md transition-all"
            >
              <Factory className="w-5 h-5 text-brand-accent" />
              <span>{t.supplierCTA}</span>
            </Link>
          </div>

          {/* Key metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-accent">15+</div>
              <div className="text-xs text-slate-300 mt-0.5">Оптовых позиций в каталоге</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">3</div>
              <div className="text-xs text-slate-300 mt-0.5">Крупных текстильных центра (TR)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-accent">100%</div>
              <div className="text-xs text-slate-300 mt-0.5">Escrow-защита платежа в ₸</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">0%</div>
              <div className="text-xs text-slate-300 mt-0.5">Языковой барьер (ИИ перевод)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Популярные категории текстиля
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Прямые цены от фабрик Денизли, Бурсы и Стамбула</p>
            </div>
            <Link
              href="/catalog"
              className="text-xs sm:text-sm font-semibold text-brand-blue hover:text-brand-navy flex items-center gap-1"
            >
              <span>Смотреть все</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.id}`}
                className="group flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-cyan-50/40 hover:border-brand-accent transition-all text-center"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-brand-navy">
                  {cat.label}
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  от фабрик TR
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <EscrowBadge />
              <CommissionBadge />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Хиты оптовых поставок из Турции
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Цены указаны в USD с автоматическим пересчетом в тенге. Гарантия безопасной сделки.
            </p>
          </div>

          <Link
            href="/catalog"
            className="flex items-center gap-1.5 text-sm font-bold text-brand-navy hover:text-brand-blue bg-white border border-slate-300 hover:border-brand-navy py-2 px-4 rounded-xl transition-all shadow-sm"
          >
            <span>В каталог товаров</span>
            <ArrowRight className="w-4 h-4 text-brand-accent" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* TURKISH FACTORIES SPOTLIGHT */}
      <section className="bg-slate-100/80 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-navy/5 px-3 py-1 rounded-full">
              Производственные хабы Турции
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Проверенные фабрики-партнеры
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Мы верифицируем регистрационные документы, производственные мощности и международные сертификаты каждой фабрики.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center font-bold text-lg border border-slate-200">
                      <Building2 className="w-6 h-6 text-brand-blue" />
                    </div>
                    {sup.verified && <VerifiedBadge />}
                  </div>

                  <Link href={`/suppliers/${sup.id}`} className="hover:text-brand-blue transition-colors">
                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                      {sup.factory_name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                    <span>{sup.city}, Türkiye</span>
                    <span className="text-slate-300">•</span>
                    <span>с {sup.founded_year} г.</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {sup.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sup.certificates.map((cert) => (
                      <span
                        key={cert}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600">
                    ★ {sup.rating} Рейтинг
                  </span>

                  <Link
                    href={`/suppliers/${sup.id}`}
                    className="text-xs font-bold text-brand-navy hover:text-brand-blue flex items-center gap-1"
                  >
                    <span>Профиль фабрики</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Как «Тюркский мост» защищает сделку
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Простая и надежная схема работы для казахстанского оптового покупателя
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-accent font-extrabold text-base flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Прямой каталог фабрик</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Выбирайте готовые позиции или заказывайте производство под своим брендом по фабричной себестоимости.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-accent font-extrabold text-base flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Чат с ИИ-переводчиком</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Обсуждайте плотность ткани, бирки и сроки на русском/казахском. Фабрика в Турции мгновенно читает на турецком.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-accent font-extrabold text-base flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Оплата через Escrow</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Оплачивайте в тенге по фиксированному курсу. Деньги замораживаются на безопасном счете и защищены платформой.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
            <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-accent font-extrabold text-base flex items-center justify-center mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Приемка партии в РК</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              После проверки качества и приемки партии на вашем складе в Казахстане деньги перечисляются производителю.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
