'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  MapPin,
  Building2,
  CheckCircle2,
  Info,
  Layers,
  Lock,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Product, DeliveryAddress } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt, calculateOrderSummary, DEFAULT_USD_KZT_RATE } from '@/lib/currency';
import { EscrowBadge, CommissionBadge } from '@/components/ui/TrustBadges';

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useTranslation();

  const productId = Array.isArray(params.productId) ? params.productId[0] : (params.productId as string);
  const initialQty = parseInt(searchParams.get('qty') || '0', 10);

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(50);
  const [currentUser] = useState(() => AppStore.getCurrentUser());

  // Delivery Form
  const [address, setAddress] = useState<DeliveryAddress>({
    city: 'Алматы',
    street: 'ул. Жибек Жолы, 135',
    building: 'Склад №4',
    postal_code: '050000',
    recipient_name: currentUser.name || 'Асель Муканова',
    recipient_phone: currentUser.phone || '+7 701 555 1234',
  });
  const [notes, setNotes] = useState('Требуется фирменная упаковка и индивидуальный штрихкод ЕАС.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      const p = AppStore.getProductById(productId);
      setProduct(p);
      if (p) {
        setQuantity(initialQty > p.moq ? initialQty : p.moq);
      }
    }
  }, [productId, initialQty]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Товар не найден</h2>
        <Link href="/catalog" className="inline-block py-2.5 px-5 bg-[#0B1120] text-white rounded-xl text-sm font-semibold">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const title =
    language === 'tr'
      ? product.title_tr
      : language === 'kk' && product.title_kk
        ? product.title_kk
        : product.title_ru;

  const subtotalUsd = product.price_usd * quantity;
  const deliveryUsd = 120.0; // Flat estimate
  const summary = calculateOrderSummary(subtotalUsd, deliveryUsd, DEFAULT_USD_KZT_RATE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const order = AppStore.createOrder({
        buyerId: currentUser.id,
        supplierId: product.supplier_id,
        productId: product.id,
        quantity: quantity,
        deliveryAddress: address,
        notes: notes,
      });

      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      alert(err.message || 'Ошибка создания заказа');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-2 mb-2.5">
          <EscrowBadge />
          <CommissionBadge />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1120]">
          Оформление оптовой безопасной сделки
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Прямой заказ на фабрике {product.supplier?.factory_name} ({product.supplier?.city}, Турция) с защитой платежа в Казахстане.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex gap-4 shadow-2xs">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
              <Image
                src={product.images[0]}
                alt={title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">
                {product.supplier?.factory_name} ({product.supplier?.city})
              </span>
              <h3 className="font-display font-bold text-[#0B1120] text-sm truncate mt-0.5">{title}</h3>
              <div className="text-xs text-slate-500 mt-1">
                Цена за единицу: <strong className="font-mono text-[#0B1120]">{formatUsd(product.price_usd)}</strong>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Количество:</span>
                <input
                  type="number"
                  min={product.moq}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                  className="font-mono tabular-nums w-24 px-2.5 py-1 text-sm font-bold border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-slate-400">(Мин. {product.moq} шт)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-[#0B1120] text-base">
                Адрес доставки в Казахстане
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Город назначения *</label>
                <select
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  required
                >
                  <option value="Алматы">Алматы</option>
                  <option value="Астана">Астана</option>
                  <option value="Шымкент">Шымкент</option>
                  <option value="Караганда">Караганда</option>
                  <option value="Актобе">Актобе</option>
                  <option value="Атырау">Атырау</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Почтовый индекс</label>
                <input
                  type="text"
                  value={address.postal_code || ''}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                  placeholder="050000"
                  className="font-mono w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1.5">Улица, номер дома/офиса/склада *</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="ул. Жибек Жолы, 135"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">ФИО контактного лица *</label>
                <input
                  type="text"
                  value={address.recipient_name}
                  onChange={(e) => setAddress({ ...address, recipient_name: e.target.value })}
                  placeholder="Имя получателя"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Телефон получателя *</label>
                <input
                  type="tel"
                  value={address.recipient_phone}
                  onChange={(e) => setAddress({ ...address, recipient_phone: e.target.value })}
                  placeholder="+7 (7XX) XXX-XX-XX"
                  className="font-mono w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1.5">Комментарий к заказу</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Инструкции по маркировке, упаковке или разгрузке..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-5">
            <h2 className="font-display font-bold text-[#0B1120] text-base pb-3 border-b border-slate-100">
              Сводка безопасной сделки
            </h2>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Партия товара ({quantity} шт × {formatUsd(product.price_usd)}):</span>
                <span className="font-mono tabular-nums font-bold text-[#0B1120]">{formatUsd(summary.subtotalUsd)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <div className="flex items-center gap-1">
                  <span>Комиссия платформы (5%):</span>
                  <span className="text-[10px] text-slate-400" title="Включает арбитраж, перевод и защиту Escrow">ⓘ</span>
                </div>
                <span className="font-mono tabular-nums font-bold text-[#0B1120]">{formatUsd(summary.commissionUsd)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Международная логистика (Турция → РК):</span>
                <span className="font-mono tabular-nums font-bold text-[#0B1120]">{formatUsd(summary.deliveryUsd)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-800">Итого в валюте (USD):</span>
                <span className="font-display tabular-nums text-xl font-extrabold text-[#0B1120]">{formatUsd(summary.totalUsd)}</span>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/70 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-800">К оплате в тенге (KZT):</span>
                  <span className="font-display tabular-nums text-2xl font-black text-teal-800">{formatKzt(summary.totalKzt)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Фиксированный курс: <strong className="font-mono text-slate-700">1 USD = {summary.fxRate} ₸</strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0B1120]">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>Эскроу-протокол «Тюркский мост»</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Средства в тенге замораживаются на защищенном транзитном счете. Фабрика получает деньги только после того, как вы подтвердите получение и качество партии в Казахстане.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#0B1120] hover:bg-slate-800 text-white font-semibold text-sm shadow-2xs transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Создание заказа...' : 'Создать заказ и перейти к оплате'}</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-12 text-center text-slate-400">Загрузка оформления заказа...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
