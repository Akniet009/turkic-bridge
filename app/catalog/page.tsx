'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductCategory } from '@/lib/types';

export default function CatalogPage() {
  const { t } = useTranslation();
  const [products] = useState(() => AppStore.getProducts());

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [maxMoq, setMaxMoq] = useState<number>(200);
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
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
      // Category match
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // City match
      if (selectedCity !== 'all' && p.supplier?.city !== selectedCity) {
        return false;
      }
      // MOQ match
      if (p.moq > maxMoq) {
        return false;
      }
      // Price match
      if (p.price_usd > maxPrice) {
        return false;
      }
      // Search query
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
      {/* Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Оптовый каталог текстиля
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Прямые цены от турецких фабрик с расчетом партии в тенге и защитой Escrow
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по сатину, махре, хлопку..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Category Pills Bar (Horizontal scroll on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* City Filters + Range Sliders + Reset */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* City Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Город:</span>
          </span>
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCity === city.id
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        {/* MOQ & Price Sliders */}
        <div className="flex items-center gap-6 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Макс. MOQ:</span>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={maxMoq}
              onChange={(e) => setMaxMoq(Number(e.target.value))}
              className="accent-slate-900 w-24 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="font-bold text-slate-800 min-w-[45px]">{maxMoq} шт</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Цена до:</span>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-slate-900 w-24 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="font-bold text-slate-800 min-w-[35px]">${maxPrice}</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 ml-auto md:ml-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Сбросить</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Найдено позиций: <strong className="text-slate-900">{filteredProducts.length}</strong>
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">По вашим фильтрам ничего не найдено</p>
          <p className="text-xs text-slate-400">Попробуйте увеличить максимальный MOQ или сбросить фильтры</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Показать все товары
          </button>
        </div>
      )}
    </div>
  );
}
