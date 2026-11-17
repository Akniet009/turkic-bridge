'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  Search,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductCategory } from '@/lib/types';
import { CategoryVectorIcon, FlagIcon } from '@/components/ui/Icons';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [heroSearch, setHeroSearch] = useState('');
  const [products] = useState(() => AppStore.getProducts().slice(0, 6));
  const [suppliers] = useState(() => AppStore.getSuppliers());

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroSearch.trim();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog');
  };

  const categories: { id: ProductCategory; label: string; count: number; accent: string }[] = [
    { id: 'bedding', label: t.categories.bedding, count: 6, accent: 'text-teal-700 bg-teal-50/90 ring-teal-500/20' },
    { id: 'towels', label: t.categories.towels, count: 5, accent: 'text-sky-700 bg-sky-50/90 ring-sky-500/20' },
    { id: 'plaids', label: t.categories.plaids, count: 4, accent: 'text-amber-700 bg-amber-50/90 ring-amber-500/20' },
    { id: 'fabrics', label: t.categories.fabrics, count: 3, accent: 'text-indigo-700 bg-indigo-50/90 ring-indigo-500/20' },
    { id: 'apparel', label: t.categories.apparel, count: 2, accent: 'text-emerald-700 bg-emerald-50/90 ring-emerald-500/20' },
  ];

  const steps = [
    {
      num: '01',
      icon: SearchCheck,
      iconStyle: 'bg-stone-100 text-[#0F172A] ring-stone-200/80',
      title: 'Выбор товара и 3D-осмотр',
      desc: 'Сравнивайте фабричные цены, проверяйте сертификаты OEKO-TEX и вращайте 3D-модели тканей прямо в каталоге.',
    },
    {
      num: '02',
      icon: Languages,
      iconStyle: 'bg-teal-50 text-teal-700 ring-teal-500/20',
      title: 'Диалог с ИИ-переводом',
      desc: 'Пишите на русском или казахском — переводчик точно передаст плотность, размеры и цвета на турецкий.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      iconStyle: 'bg-sky-50 text-sky-700 ring-sky-500/20',
      title: 'Оплата через Эскроу',
      desc: 'Оплачивайте заказ в тенге. Деньги защищены на транзитном счете до успешного прибытия груза в Казахстан.',
    },
    {
      num: '04',
      icon: PackageCheck,
      iconStyle: 'bg-emerald-50 text-emerald-700 ring-emerald-500/20',
      title: 'Приемка и расчет',
      desc: 'После проверки качества партии в Алматы или Астане средства переводятся производителю в Турцию.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#F7F6F2] text-[#0F172A]">
      {/* ASYMMETRIC BENTO HERO */}
      <section className="relative overflow-hidden bg-white border-b border-stone-200/80 pt-10 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle ambient corner gradients */}
        <div className="absolute -top-32 -right-24 w-[520px] h-[520px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] bg-amber-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* LEFT COLUMN: Editorial Headline, Integrated Search & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F7F6F2] border border-stone-200/90 text-xs font-semibold text-stone-700 shadow-2xs">
              <span className="inline-flex items-center gap-1.5">
                <FlagIcon lang="tr" className="w-4 h-4" />
                <span>Денизли · Бурса · Стамбул</span>
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-teal-600" />
              <span className="inline-flex items-center gap-1.5">
                <FlagIcon lang="kk" className="w-4 h-4" />
                <span>Казахстан</span>
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#0F172A] leading-[1.06]">
              {t.heroTitle}
            </h1>

            <p className="text-base text-stone-600 max-w-xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Quick Catalog Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="flex items-center bg-[#F7F6F2] p-1.5 rounded-2xl border border-stone-200/90 focus-within:border-teal-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-500/10 transition-all max-w-xl shadow-2xs"
            >
              <Search className="w-4 h-4 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Искать сатин 300TC, махровые полотенца, пледы..."
                className="flex-1 bg-transparent px-3 py-2.5 text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold transition-colors shrink-0"
              >
                Найти оптом
              </button>
            </form>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/catalog"
                className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-card transition-all"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                <span>{t.buyerCTA}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/supplier"
                className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-white hover:bg-[#F7F6F2] text-[#0F172A] border border-stone-200 hover:border-stone-300 font-semibold text-sm transition-all"
              >
                <Factory className="w-4 h-4 text-teal-600 stroke-[2]" />
                <span>{t.supplierCTA}</span>
              </Link>
            </div>

            {/* Compact Metric Strip */}
            <div className="pt-4 grid grid-cols-3 gap-6 max-w-md border-t border-stone-100">
              <div>
                <div className="font-display tabular-nums text-2xl font-extrabold text-[#0F172A]">15+</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Позиций с 3D</div>
              </div>
              <div>
                <div className="font-display tabular-nums text-2xl font-extrabold text-teal-600">100%</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Escrow в тенге</div>
              </div>
              <div>
                <div className="font-display tabular-nums text-2xl font-extrabold text-[#0F172A]">5%</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Фикс-комиссия</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Visual Editorial Bento Card with Live Floating Widgets */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/12] bg-stone-100 border border-stone-200/90 shadow-elevated group">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
                alt="Турецкий домашний текстиль высшего качества"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/15 to-transparent" />

              {/* Bottom glass product bar inside hero image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/60 shadow-lg flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    <span>Denizli & Bursa</span>
                    <span>•</span>
                    <span>Прямая фабричная цена</span>
                  </div>
                  <div className="font-display font-bold text-[#0F172A] text-sm sm:text-base truncate mt-0.5">
                    Постельное белье, махра и пледы оптом
                  </div>
                </div>
                <Link
                  href="/catalog"
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <Box className="w-3.5 h-3.5 text-teal-400" />
                  <span>В каталог 3D</span>
                </Link>
              </div>
            </div>

            {/* Floating Escrow Safe Deal Card (Top Right) */}
            <div className="hidden sm:flex animate-float-slow absolute -top-4 -right-3 bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl border border-stone-200/90 shadow-elevated items-center gap-3 z-20">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 ring-1 ring-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Escrow-защита
                </div>
                <div className="font-mono tabular-nums text-sm font-extrabold text-[#0F172A]">825 356 ₸</div>
                <div className="text-[10px] text-stone-400">Оплата до приемки в РК</div>
              </div>
            </div>

            {/* Floating AI Translation Bubble (Top Left) */}
            <div className="hidden sm:block absolute top-5 -left-4 bg-[#0F172A]/95 backdrop-blur-xl text-white p-3.5 rounded-2xl border border-white/10 shadow-elevated max-w-[250px] z-20">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-400 mb-1">
                <Sparkles className="w-3 h-3" />
                <span>ИИ-перевод в реальном времени</span>
              </div>
              <div className="text-[11px] text-stone-300 leading-snug">
                🇹🇷 «300 TC saten hazır, sevk edebiliriz»
              </div>
              <div className="text-[11px] font-semibold text-white mt-1 pt-1 border-t border-white/10 leading-snug">
                🇷🇺 «Сатин 300ТС готов к отгрузке»
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BESPOKE VECTOR CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              Категории оптового текстиля
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Прямые цены от турецких производственных фабрик
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
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 hover:border-stone-300 shadow-2xs hover:shadow-card transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-xl ring-1 flex items-center justify-center transition-transform group-hover:scale-105 ${cat.accent}`}
                >
                  <CategoryVectorIcon category={cat.id} className="w-5 h-5" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h3 className="font-display text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-teal-700 transition-colors">
                  {cat.label}
                </h3>
                <span className="text-[11px] text-stone-500 font-medium mt-0.5 block">
                  {cat.count} позиций
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              Популярные товары недели
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-stone-500">
                Сертифицированный текстиль с расчетом в тенге
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
                <Box className="w-3 h-3 text-teal-600" />
                <span>Нажмите «3D» на картинке любого товара</span>
              </span>
            </div>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-stone-700 hover:text-[#0F172A] flex items-center gap-1"
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

      {/* 4-STEP WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-2xs">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/70 px-3 py-1 rounded-full">
              Прозрачный процесс
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              Как работает «Тюркский мост»
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              От осмотра фактуры в 3D и общения на родном языке до прибытия груза на ваш склад
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-5 rounded-2xl bg-[#F7F6F2]/80 border border-stone-200/70 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center ${step.iconStyle}`}
                    >
                      <Icon className="w-4.5 h-4.5 stroke-[2]" />
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-400">{step.num}</span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-[#0F172A]">{step.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FACTORY HUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              Производственные кластеры Турции
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Проверенные фабрики с сертификатами качества OEKO-TEX и ISO
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((s) => (
            <Link
              key={s.id}
              href={`/suppliers/${s.id}`}
              className="group bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 hover:border-stone-300 shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-semibold text-stone-800">{s.city}</span>
                  </div>
                  {s.verified && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Проверено</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-[#0F172A] group-hover:text-teal-700 transition-colors">
                  {s.factory_name}
                </h3>
                <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                  {s.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.certificates?.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-medium bg-[#F7F6F2] text-stone-600 px-2 py-0.5 rounded-md border border-stone-200/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-700 group-hover:text-[#0F172A]">
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
