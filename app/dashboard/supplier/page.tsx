'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Factory,
  Package,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Truck,
  Building2,
  DollarSign,
  Layers,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Product, Order, OrderStatus, ProductCategory } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt } from '@/lib/currency';
import { getStatusBadge } from '@/components/orders/StatusBadge';

export default function SupplierDashboardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'new-product'>('orders');

  const [currentUser] = useState(() => AppStore.getCurrentUser());
  const [supplier, setSupplier] = useState(AppStore.getSuppliers()[0]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Form states for new product
  const [titleTr, setTitleTr] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [titleKk, setTitleKk] = useState('');
  const [descTr, setDescTr] = useState('');
  const [descRu, setDescRu] = useState('');
  const [descKk, setDescKk] = useState('');
  const [category, setCategory] = useState<ProductCategory>('bedding');
  const [priceUsd, setPriceUsd] = useState(18.5);
  const [moq, setMoq] = useState(50);
  const [leadTime, setLeadTime] = useState(12);
  const [composition, setComposition] = useState('100% Эгейский хлопок');
  const [densityGsm, setDensityGsm] = useState(145);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const refreshData = () => {
    const sup = AppStore.getSuppliers()[0];
    setSupplier(sup);
    const allProds = AppStore.getProducts();
    setProducts(allProds.filter((p) => p.supplier_id === sup.id));
    const allOrders = AppStore.getOrders();
    setOrders(allOrders.filter((o) => o.supplier_id === sup.id));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    AppStore.updateOrderStatus(orderId, newStatus, `Статус изменен фабрикой: ${newStatus}`);
    refreshData();
  };

  // AI Auto-translate for title and description
  const handleAutoTranslate = async () => {
    if (!titleTr && !titleRu) {
      alert('Введите хотя бы название на турецком или русском языке для перевода');
      return;
    }
    setIsTranslating(true);
    try {
      const baseTitle = titleTr || titleRu;
      const baseDesc = descTr || descRu;

      // Translate title to RU and KK if input was TR
      if (titleTr) {
        const resRu = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: baseTitle, sourceLang: 'tr', targetLang: 'ru' }),
        });
        const dRu = await resRu.json();
        if (dRu.translatedText) setTitleRu(dRu.translatedText);

        const resKk = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: baseTitle, sourceLang: 'tr', targetLang: 'kk' }),
        });
        const dKk = await resKk.json();
        if (dKk.translatedText) setTitleKk(dKk.translatedText);
      }

      // Translate description
      if (descTr) {
        const resDescRu = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: baseDesc, sourceLang: 'tr', targetLang: 'ru' }),
        });
        const dDescRu = await resDescRu.json();
        if (dDescRu.translatedText) setDescRu(dDescRu.translatedText);

        const resDescKk = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: baseDesc, sourceLang: 'tr', targetLang: 'kk' }),
        });
        const dDescKk = await resDescKk.json();
        if (dDescKk.translatedText) setDescKk(dDescKk.translatedText);
      }

      setSuccessToast('Тексты успешно переведены на русский и казахский языки с помощью ИИ!');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      console.error('Translation failed', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    AppStore.addProduct({
      supplier_id: supplier.id,
      title_tr: titleTr || titleRu,
      title_ru: titleRu || titleTr,
      title_kk: titleKk || titleRu,
      description_tr: descTr || descRu,
      description_ru: descRu || descTr,
      description_kk: descKk || descRu,
      category,
      price_usd: Number(priceUsd),
      moq: Number(moq),
      lead_time_days: Number(leadTime),
      composition,
      density_gsm: Number(densityGsm),
      images: [imageUrl],
      in_stock: true,
    });

    setSuccessToast('Товар успешно добавлен и опубликован в общем каталоге!');
    setTimeout(() => setSuccessToast(''), 4000);
    refreshData();
    setActiveTab('products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1120] text-white flex items-center justify-center shadow-card shrink-0">
            <Factory className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                Верифицированная фабрика
              </span>
              <span className="font-mono text-[11px] text-slate-400">ID: {supplier.id.slice(0, 8)}</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1120] mt-1">
              Кабинет производителя: {supplier.factory_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{supplier.city}, Türkiye • Управление товарами и заказами в РК</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 rounded-lg transition-all ${
              activeTab === 'orders' ? 'bg-white text-[#0B1120] shadow-2xs' : 'text-slate-600 hover:text-[#0B1120]'
            }`}
          >
            Входящие заказы ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 rounded-lg transition-all ${
              activeTab === 'products' ? 'bg-white text-[#0B1120] shadow-2xs' : 'text-slate-600 hover:text-[#0B1120]'
            }`}
          >
            Товары ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('new-product')}
            className={`py-2 px-4 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'new-product' ? 'bg-[#0B1120] text-white shadow-2xs' : 'text-slate-600 hover:text-[#0B1120]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            <span>Добавить товар</span>
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* TAB 1: INCOMING ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
            <h2 className="font-display text-lg font-extrabold text-[#0B1120]">Поступившие оптовые заявки из Казахстана</h2>
            <span className="text-xs text-slate-400">Комиссия сервиса 5% удерживается автоматически при выплате</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center text-slate-400 text-xs">
              Входящих заказов пока нет.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-bold text-sm sm:text-base text-[#0B1120]">{order.order_number}</span>
                    {getStatusBadge(order.status, t.orders.statuses[order.status] || order.status)}
                    <span className="text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700">
                    Покупатель: <strong>{order.buyer?.company || order.buyer?.name}</strong> (г. {order.delivery_address.city}, Казахстан)
                  </div>

                  <div className="text-xs text-slate-500">
                    Позиция: <strong className="font-mono text-[#0B1120]">{order.items?.[0]?.quantity} шт</strong> • {order.items?.[0]?.product?.title_ru}
                  </div>
                </div>

                {/* Status Switcher for Supplier */}
                <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="md:text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Сумма заказа:</span>
                    <span className="font-display tabular-nums text-lg font-black text-[#0B1120]">{formatUsd(order.total_usd)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'new' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'accepted_by_supplier')}
                        className="py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
                      >
                        Принять заказ ✓
                      </button>
                    )}
                    {order.status === 'paid_in_escrow' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'in_production')}
                        className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                      >
                        Запустить пошив →
                      </button>
                    )}
                    {order.status === 'in_production' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'shipped')}
                        className="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
                      >
                        Отгрузить в РК →
                      </button>
                    )}

                    <Link
                      href={`/orders/${order.id}`}
                      className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      Детали заказа
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MY PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="font-display text-lg font-extrabold text-[#0B1120]">Товары фабрики ({products.length})</h2>
            <button
              onClick={() => setActiveTab('new-product')}
              className="py-2 px-4 rounded-xl bg-[#0B1120] text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>Добавить новый товар</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-2xs">
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                  <Image src={p.images[0]} alt={p.title_ru} fill className="object-cover" />
                  <span className="font-mono absolute top-2.5 left-2.5 bg-[#0B1120]/85 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    MOQ: {p.moq} шт
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-[#0B1120] text-sm truncate">{p.title_ru}</h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{p.title_tr}</p>
                </div>

                <div className="flex justify-between items-baseline pt-2.5 border-t border-slate-100">
                  <span className="font-display tabular-nums text-lg font-extrabold text-[#0B1120]">{formatUsd(p.price_usd)}</span>
                  <span className="font-mono text-xs text-slate-500">{p.lead_time_days} дн. пошив</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW PRODUCT WITH AI AUTO-TRANSLATE */}
      {activeTab === 'new-product' && (
        <form onSubmit={handleCreateProduct} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-display text-lg font-extrabold text-[#0B1120]">Добавление оптовой позиции</h2>
              <p className="text-xs text-slate-500 mt-0.5">Заполните поля на турецком или русском — ИИ автоматически сделает перевод на 3 языка</p>
            </div>

            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={isTranslating}
              className="py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs flex items-center gap-1.5 transition-all border border-teal-200/80 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>{isTranslating ? 'Переводим через ИИ...' : 'Автоперевод на 3 языка (TR/RU/KK)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Название на турецком (TR) *</label>
              <input
                type="text"
                value={titleTr}
                onChange={(e) => setTitleTr(e.target.value)}
                placeholder="Örn: %100 Pamuk Saten Nevresim"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Название на русском (RU) *</label>
              <input
                type="text"
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
                placeholder="Напр: Сатиновое постельное белье"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Название на казахском (KK)</label>
              <input
                type="text"
                value={titleKk}
                onChange={(e) => setTitleKk(e.target.value)}
                placeholder="Мысалы: Сатин төсек-орын жиынтығы"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Категория</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="bedding">Постельное бельё</option>
                  <option value="towels">Махровые полотенца</option>
                  <option value="plaids">Пледы и покрывала</option>
                  <option value="fabrics">Ткани рулонами</option>
                  <option value="apparel">Домашняя одежда</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Цена за ед. (USD) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(parseFloat(e.target.value) || 1)}
                  className="font-mono w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Мин. заказ (MOQ шт) *</label>
                <input
                  type="number"
                  min="1"
                  value={moq}
                  onChange={(e) => setMoq(parseInt(e.target.value) || 1)}
                  className="font-mono w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Срок производства (дн) *</label>
                <input
                  type="number"
                  min="1"
                  value={leadTime}
                  onChange={(e) => setLeadTime(parseInt(e.target.value) || 1)}
                  className="font-mono w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Состав ткани</label>
              <input
                type="text"
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                placeholder="100% Эгейский хлопок, Сатин 300TC"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Плотность (г/м²)</label>
              <input
                type="number"
                value={densityGsm}
                onChange={(e) => setDensityGsm(parseInt(e.target.value) || 100)}
                placeholder="550"
                className="font-mono w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">URL фотографии образца</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1.5">Описание на турецком (TR)</label>
              <textarea
                rows={2}
                value={descTr}
                onChange={(e) => setDescTr(e.target.value)}
                placeholder="Ürün özellikleri, iplik kalitesi ve ambalaj bilgileri..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1.5">Описание на русском (RU)</label>
              <textarea
                rows={2}
                value={descRu}
                onChange={(e) => setDescRu(e.target.value)}
                placeholder="Характеристики ткани, устойчивость к стиркам, сертификаты..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className="py-2.5 px-5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#0B1120] hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-all"
            >
              Сохранить и опубликовать в каталоге
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
