'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductCategory } from '@/lib/types';
import { EscrowBadge, CommissionBadge } from '@/components/ui/TrustBadges';

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

  const cities = ['all', 'Денизли', 'Бурса', 'Стамбул'];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <EscrowBadge />
            <CommissionBadge />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Оптовый каталог турецкого текстиля
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Прямые цены от фабрик Денизли, Бурсы и Стамбула в USD с расчетом в тенге.
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="md:hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white font-semibold text-xs text-slate-700 shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-navy" />
          <span>Фильтры каталога</span>
        </button>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* SIDEBAR FILTERS (Desktop + Mobile drawer) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-24`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter className="w-4 h-4 text-brand-navy" />
              <span>Параметры отбора</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-brand-navy flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить</span>
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Поиск
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или ткани..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Категория
            </label>
            <div className="space-y-1.5">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.id
                      ? 'bg-brand-navy text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* City / Hub */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Город фабрики в Турции
            </label>
            <div className="space-y-1.5">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                    selectedCity === city
                      ? 'bg-brand-navy text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span>{city === 'all' ? 'Все города' : city}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MOQ Slider */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Макс. MOQ</span>
              <span className="font-bold text-brand-navy">до {maxMoq} шт</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="10"
              value={maxMoq}
              onChange={(e) => setMaxMoq(Number(e.target.value))}
              className="w-full accent-brand-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>20 шт</span>
              <span>200 шт</span>
            </div>
          </div>

          {/* Price USD Slider */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Цена за единицу</span>
              <span className="font-bold text-brand-navy">до ${maxPrice}</span>
            </div>
            <input
              type="range"
              min="3"
              max="50"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$3</span>
              <span>$50</span>
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 bg-white px-4 py-3 rounded-xl border border-slate-200">
            <span>
              Найдено товаров: <strong className="text-slate-900">{filteredProducts.length}</strong>
            </span>
            <span>Курс: 1 USD = 502.50 ₸</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="font-bold text-slate-800 text-lg">По вашим фильтрам ничего не найдено</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Попробуйте увеличить значение MOQ, изменить категорию или очистить поисковый запрос.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 py-2 px-4 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-blue"
              >
                Сбросить все фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
