'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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
  Box,
  Image as ImageIcon,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt, convertUsdToKzt, calculateOrderSummary } from '@/lib/currency';
import { EscrowBadge, VerifiedBadge, CommissionBadge } from '@/components/ui/TrustBadges';
import { getProduct3DConfig } from '@/lib/three/productMapping';

const Textile3DViewer = dynamic(
  () => import('@/components/three/Textile3DViewer').then((m) => m.Textile3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] rounded-2xl border border-slate-200 bg-slate-100 animate-pulse flex items-center justify-center text-xs text-slate-400">
        Загрузка 3D-модели...
      </div>
    ),
  }
);

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useTranslation();

  const productId = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(50);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');

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

  const desc =
    language === 'tr'
      ? product.description_tr
      : language === 'kk' && product.description_kk
      ? product.description_kk
      : product.description_ru;

  const supplier = product.supplier;
  const subtotalUsd = product.price_usd * orderQuantity;
  const summary = calculateOrderSummary(subtotalUsd, 120.0);
  const threeConfig = getProduct3DConfig(product);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0B1120]">Главная</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-[#0B1120]">Каталог</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT: Photo Gallery + 3D Preview Toggle */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('photo')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'photo' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Фотографии</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === '3d' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-teal-500" />
              <span>Смотреть в 3D</span>
            </button>
          </div>

          {viewMode === '3d' ? (
            <Textile3DViewer
              compact
              initialModel={threeConfig.model}
              initialWeave={threeConfig.weave}
              initialColorId={threeConfig.colorId}
            />
          ) : (
            <>
              <div
                onClick={() => setViewMode('3d')}
                className="group/img relative h-80 sm:h-[480px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer"
                title="Нажмите, чтобы посмотреть этот товар в 3D"
              >
                <Image
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover/img:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    MOQ: {product.moq} шт
                  </span>
                  {supplier?.verified && <VerifiedBadge />}
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold px-3.5 py-2 rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all">
                  <Box className="w-4 h-4 text-teal-400" />
                  <span>Открыть картинку в 3D</span>
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
                        activeImageIdx === i ? 'border-slate-900 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`thumb-${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Detailed Specifications and Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-6 mt-6 shadow-2xs">
            <h3 className="font-display text-lg font-bold text-[#0B1120]">Описание и характеристики ткани</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-[#F9FAFB] p-3.5 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 block mb-1">Состав материала</span>
                <strong className="text-[#0B1120] text-sm font-semibold">{product.composition || '100% Эгейский хлопок'}</strong>
              </div>
              <div className="bg-[#F9FAFB] p-3.5 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 block mb-1">Плотность полотна</span>
                <strong className="font-mono tabular-nums text-[#0B1120] text-sm font-semibold">{product.density_gsm ? `${product.density_gsm} г/м²` : 'Высокая плотность'}</strong>
              </div>
              <div className="bg-[#F9FAFB] p-3.5 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 block mb-1">Срок производства</span>
                <strong className="font-mono tabular-nums text-[#0B1120] text-sm font-semibold">{product.lead_time_days} дней</strong>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Ordering & Supplier Box (Sticky) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-card space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <EscrowBadge />
                <CommissionBadge />
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1120] leading-snug">
                {title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-slate-200/80 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Оптовая цена за единицу
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-display tabular-nums text-3xl font-extrabold text-[#0B1120]">
                    {formatUsd(product.price_usd)}
                  </span>
                  <span className="font-mono tabular-nums text-sm font-semibold text-slate-500">
                    ≈ {formatKzt(convertUsdToKzt(product.price_usd))}
                  </span>
                </div>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold px-2.5 py-0.5 rounded-full">
                Прямая цена
              </span>
            </div>

            {/* Quantity Selector / Calculator */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">Количество для заказа:</label>
                <span className="text-slate-500">Минимум: <strong className="font-mono text-[#0B1120]">{product.moq} шт</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={product.moq}
                  step={5}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                  className="font-mono tabular-nums w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-[#0B1120] focus:outline-none focus:ring-2 focus:ring-teal-500 text-center text-lg bg-white"
                />
              </div>

              {/* Live estimation summary */}
              <div className="pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Стоимость партии ({orderQuantity} шт):</span>
                  <span className="font-mono tabular-nums font-bold text-[#0B1120]">{formatUsd(subtotalUsd)}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Комиссия платформы (5%):</span>
                  <span className="font-mono tabular-nums">{formatUsd(summary.commissionUsd)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200/80 text-sm font-bold text-[#0B1120]">
                  <span>Итого в тенге:</span>
                  <span className="font-mono tabular-nums text-base text-teal-700">{formatKzt(summary.totalKzt)}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-1">
              <Link
                href={`/checkout/${product.id}?qty=${orderQuantity}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#0B1120] hover:bg-slate-800 text-white font-semibold text-sm shadow-2xs transition-all"
              >
                <span>Оформить безопасную сделку</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </Link>

              <Link
                href={`/chat?supplierId=${product.supplier_id}&productId=${product.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>Написать поставщику в чат</span>
              </Link>
            </div>

            {/* Escrow Guarantee Note */}
            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/70 flex items-start gap-3 text-xs text-teal-950">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Гарантия возврата 100%:</strong> Деньги блокируются на эскроу-счете и поступают фабрике только после приемки партии в Казахстане.
              </p>
            </div>
          </div>

          {/* Supplier Profile Card */}
          {supplier && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Производитель
                  </span>
                  <Link href={`/suppliers/${supplier.id}`} className="font-display font-bold text-base text-[#0B1120] hover:text-teal-700 block mt-0.5 transition-colors">
                    {supplier.factory_name}
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>{supplier.city}, Türkiye</span>
                  </div>
                </div>
                {supplier.verified && <VerifiedBadge />}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {supplier.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700">★ {supplier.rating} Рейтинг</span>
                <Link href={`/suppliers/${supplier.id}`} className="text-xs font-semibold text-[#0B1120] hover:text-teal-700 flex items-center gap-1 transition-colors">
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
