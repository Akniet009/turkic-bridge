'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, RotateCcw, MapPin, Box, ArrowUpDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductCategory } from '@/lib/types';
import { CategoryVectorIcon } from '@/components/ui/Icons';

type SortOption = 'default' | 'price_asc' | 'moq_asc' | 'lead_asc';

function CatalogContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [products] = useState(() => AppStore.getProducts());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [maxMoq, setMaxMoq] = useState<number>(200);
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  useEffect(() => {
    const catParam = searchParams.get('category');
    const qParam = searchParams.get('q');
    if (catParam) setSelectedCategory(catParam);
    if (qParam) setSearchQuery(qParam);
  }, [searchParams]);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.categories.all },
    { id: 'bedding', label: t.categories.bedding },
    { id: 'towels', label: t.categories.towels },
    { id: 'plaids', label: t.categories.plaids },
    { id: 'fabrics', label: t.categories.fabrics },
    { id: 'apparel', label: t.categories.apparel },
  ];

  const cities = [
    { id: 'all', label: 'Все города' },
    { id: 'Денизли', label: 'Денизли' },
    { id: 'Бурса', label: 'Бурса' },
    { id: 'Стамбул', label: 'Стамбул' },
  ];

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedCity !== 'all' && p.supplier?.city !== selectedCity) return false;
      if (p.moq > maxMoq) return false;
      if (p.price_usd > maxPrice) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle =
          p.title_ru.toLowerCase().includes(q) ||
          p.title_tr.toLowerCase().includes(q) ||
          (p.title_kk && p.title_kk.toLowerCase().includes(q));
        const matchDesc =
          p.description_ru.toLowerCase().includes(q) ||
          p.description_tr.toLowerCase().includes(q);
        const matchComp = p.composition && p.composition.toLowerCase().includes(q);
        const matchSupplier = p.supplier && p.supplier.factory_name.toLowerCase().includes(q);

        return matchTitle || matchDesc || matchComp || matchSupplier;
      }

      return true;
    });

    if (sortBy === 'price_asc') {
      return [...filtered].sort((a, b) => a.price_usd - b.price_usd);
    }
    if (sortBy === 'moq_asc') {
      return [...filtered].sort((a, b) => a.moq - b.moq);
    }
    if (sortBy === 'lead_asc') {
      return [...filtered].sort((a, b) => a.lead_time_days - b.lead_time_days);
    }
    return filtered;
  }, [products, selectedCategory, selectedCity, maxMoq, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setMaxMoq(200);
    setMaxPrice(50);
    setSortBy('default');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCity !== 'all' ||
    maxMoq < 200 ||
    maxPrice < 50 ||
    searchQuery.trim().length > 0;

  return (
    <div className="bg-[#F7F6F2] min-h-screen pb-20">
      {/* Crisp Architectural Catalog Banner */}
      <div className="bg-white border-b border-stone-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full mb-2.5">
              <Box className="w-3.5 h-3.5 text-teal-600" />
              <span>Нажмите «3D» на любой картинке товара для осмотра фактуры</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0F172A]">
              Оптовый каталог текстиля
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Прямые фабричные цены из Денизли, Бурсы и Стамбула с защитой оплаты в тенге
            </p>
          </div>

          <div className="relative w-full md:w-88">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по сатину, махре, хлопку..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200/90 bg-[#F7F6F2] focus:bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium placeholder:text-stone-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filters & Products Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Category Filter Pills with Custom Vector Icons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#0F172A] text-white shadow-card'
                    : 'bg-white border border-stone-200/80 text-stone-600 hover:text-[#0F172A] hover:border-stone-300'
                }`}
              >
                <CategoryVectorIcon
                  category={cat.id}
                  className={`w-4 h-4 ${active ? 'text-teal-400' : 'text-stone-400'}`}
                />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* City, Range Sliders & Sort Controls */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-stone-400 mr-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Фабрики:</span>
            </span>
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCity === city.id
                    ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-500/30'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-[#0F172A]'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">MOQ до:</span>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={maxMoq}
                onChange={(e) => setMaxMoq(Number(e.target.value))}
                className="accent-[#0F172A] w-20 sm:w-24 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
              <span className="font-mono tabular-nums font-bold text-[#0F172A] min-w-[44px]">{maxMoq} шт</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">До:</span>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[#0F172A] w-20 sm:w-24 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
              <span className="font-mono tabular-nums font-bold text-[#0F172A] min-w-[34px]">${maxPrice}</span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-semibold text-[#0F172A] focus:outline-none cursor-pointer"
              >
                <option value="default">Рекомендуемые</option>
                <option value="price_asc">Сначала дешевле</option>
                <option value="moq_asc">Меньше MOQ</option>
                <option value="lead_asc">Быстрее пошив</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сбросить</span>
              </button>
            )}
          </div>
        </div>

        {/* Count Row */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>
            Показано товаров:{' '}
            <strong className="font-mono tabular-nums text-[#0F172A]">{filteredProducts.length}</strong>
          </span>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-14 text-center space-y-3 shadow-2xs">
            <p className="font-display text-base font-bold text-[#0F172A]">По вашим фильтрам ничего не найдено</p>
            <p className="text-xs text-stone-500">Попробуйте расширить диапазон MOQ, цены или очистить поиск</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Показать весь каталог
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-stone-400 text-xs">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
