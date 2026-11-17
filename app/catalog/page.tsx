'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, RotateCcw, MapPin, Box } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductCategory } from '@/lib/types';
import { CategoryVectorIcon } from '@/components/ui/Icons';

function CatalogContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [products] = useState(() => AppStore.getProducts());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [maxMoq, setMaxMoq] = useState<number>(200);
  const [maxPrice, setMaxPrice] = useState<number>(50);

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
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
    { id: 'all', label: 'Все фабрики' },
    { id: 'Денизли', label: 'Денизли' },
    { id: 'Бурса', label: 'Бурса' },
    { id: 'Стамбул', label: 'Стамбул' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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
  }, [products, selectedCategory, selectedCity, maxMoq, maxPrice, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setMaxMoq(200);
    setMaxPrice(50);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCity !== 'all' ||
    maxMoq < 200 ||
    maxPrice < 50 ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1120]">
            Оптовый каталог текстиля
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <p className="text-xs sm:text-sm text-slate-500">
              Прямые цены турецких фабрик в USD и тенге с защитой Escrow
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
              <Box className="w-3.5 h-3.5 text-teal-600" />
              <span>Нажмите «3D» на любой картинке товара</span>
            </span>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по сатину, махре, хлопку..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium placeholder:text-slate-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills with Custom Vector Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-[#0B1120] text-white shadow-card'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:text-[#0B1120] hover:border-slate-300'
              }`}
            >
              <CategoryVectorIcon
                category={cat.id}
                className={`w-4 h-4 ${active ? 'text-teal-400' : 'text-slate-400'}`}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Город:</span>
          </span>
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCity === city.id
                  ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-500/30'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 flex-wrap text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 font-medium">Макс. MOQ:</span>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={maxMoq}
              onChange={(e) => setMaxMoq(Number(e.target.value))}
              className="accent-[#0B1120] w-24 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="font-mono tabular-nums font-bold text-[#0B1120] min-w-[48px]">{maxMoq} шт</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-slate-500 font-medium">Цена до:</span>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-[#0B1120] w-24 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="font-mono tabular-nums font-bold text-[#0B1120] min-w-[36px]">${maxPrice}</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 ml-auto md:ml-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Найдено позиций:{' '}
          <strong className="font-mono tabular-nums text-[#0B1120]">{filteredProducts.length}</strong>
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-2xs">
          <p className="font-display text-sm font-bold text-slate-800">По вашим фильтрам ничего не найдено</p>
          <p className="text-xs text-slate-500">Попробуйте увеличить максимальный MOQ или сбросить фильтры</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#0B1120] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Показать все товары
          </button>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400 text-xs">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
