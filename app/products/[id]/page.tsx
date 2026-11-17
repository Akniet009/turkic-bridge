'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  Layers,
  MessageSquare,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Building2,
  Calendar,
  Share2,
  Percent,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt, convertUsdToKzt, calculateOrderSummary } from '@/lib/currency';
import { EscrowBadge, VerifiedBadge, CommissionBadge } from '@/components/ui/TrustBadges';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useTranslation();

  const productId = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(50);

  useEffect(() => {
    if (productId) {
      const found = AppStore.getProductById(productId);
      setProduct(found);
      if (found) {
        setOrderQuantity(found.moq);
      }
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Товар не найден</h2>
        <Link href="/catalog" className="inline-block py-2 px-5 bg-brand-navy text-white rounded-xl text-sm font-semibold">
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

  const desc =
    language === 'tr'
      ? product.description_tr
      : language === 'kk' && product.description_kk
      ? product.description_kk
      : product.description_ru;

  const supplier = product.supplier;
  const subtotalUsd = product.price_usd * orderQuantity;
  const summary = calculateOrderSummary(subtotalUsd, 120.0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-navy">Главная</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-brand-navy">Каталог</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT: Photo Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-80 sm:h-[480px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src={product.images[activeImageIdx] || product.images[0]}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-brand-navy/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                MOQ: {product.moq} шт
              </span>
              {supplier?.verified && <VerifiedBadge />}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIdx === i ? 'border-brand-navy scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`thumb-${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Specifications and Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900">Описание и характеристики ткани</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Состав материала</span>
                <strong className="text-slate-800 text-sm">{product.composition || '100% Эгейский хлопок'}</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Плотность полотна</span>
                <strong className="text-slate-800 text-sm">{product.density_gsm ? `${product.density_gsm} г/м²` : 'Высокая плотность'}</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Срок производства партии</span>
                <strong className="text-slate-800 text-sm">{product.lead_time_days} рабочих дней</strong>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Ordering & Supplier Box (Sticky) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-lg space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <EscrowBadge />
                <CommissionBadge />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Оптовая цена за единицу:
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-brand-navy">
                    {formatUsd(product.price_usd)}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    ≈ {formatKzt(convertUsdToKzt(product.price_usd))}
                  </span>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-md">
                Фабричная цена
              </span>
            </div>

            {/* Quantity Selector / Calculator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">Количество для заказа:</label>
                <span className="text-slate-500">Минимум: <strong>{product.moq} шт</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={product.moq}
                  step={5}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent text-center text-lg"
                />
              </div>

              {/* Live estimation summary */}
              <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Стоимость партии ({orderQuantity} шт):</span>
                  <span className="font-bold text-slate-900">{formatUsd(subtotalUsd)}</span>
                </div>
                <div className="flex justify-between text-brand-navy font-semibold">
                  <span>Комиссия платформы (5%):</span>
                  <span>{formatUsd(summary.commissionUsd)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Итого к оплате (в тенге):</span>
                  <span className="text-brand-navy text-base">{formatKzt(summary.totalKzt)}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <Link
                href={`/checkout/${product.id}?qty=${orderQuantity}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Оформить безопасную сделку</span>
                <ArrowRight className="w-4 h-4 text-brand-accent" />
              </Link>

              <Link
                href={`/chat?supplierId=${product.supplier_id}&productId=${product.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate-300 hover:border-brand-navy text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-brand-blue" />
                <span>Написать поставщику в чат (с ИИ-переводом)</span>
              </Link>
            </div>

            {/* Escrow Guarantee Note */}
            <div className="p-3.5 rounded-xl bg-cyan-50/50 border border-cyan-100 flex items-start gap-3 text-xs text-cyan-900">
              <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
              <p>
                <strong>Гарантия возврата 100%:</strong> Деньги блокируются на эскроу-счете и будут отправлены фабрике в Турцию только после того, как вы подтвердите качество и приемку партии в Казахстане.
              </p>
            </div>
          </div>

          {/* Supplier Profile Card */}
          {supplier && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Производитель
                  </span>
                  <Link href={`/suppliers/${supplier.id}`} className="font-extrabold text-base text-slate-900 hover:text-brand-blue block mt-0.5">
                    {supplier.factory_name}
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{supplier.city}, Türkiye</span>
                  </div>
                </div>
                {supplier.verified && <VerifiedBadge />}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {supplier.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">★ {supplier.rating} Оценка надежности</span>
                <Link href={`/suppliers/${supplier.id}`} className="text-xs font-bold text-brand-navy hover:text-brand-blue flex items-center gap-1">
                  <span>Все товары фабрики</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
