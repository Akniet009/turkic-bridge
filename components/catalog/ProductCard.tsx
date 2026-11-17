'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  Clock,
  Layers,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Box,
  Image as ImageIcon,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt, convertUsdToKzt } from '@/lib/currency';
import { getProduct3DConfig } from '@/lib/three/productMapping';
import { Product3DModal } from './Product3DModal';

const Textile3DViewer = dynamic(
  () => import('@/components/three/Textile3DViewer').then((m) => m.Textile3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#F3F2EE] animate-pulse flex items-center justify-center text-[11px] font-medium text-stone-500">
        Загрузка 3D-модели...
      </div>
    ),
  }
);

export function ProductCard({ product }: { product: Product }) {
  const { language, t } = useTranslation();
  const [is3D, setIs3D] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  const priceKzt = convertUsdToKzt(product.price_usd);
  const supplier = product.supplier;
  const threeConfig = getProduct3DConfig(product);

  return (
    <>
      <div className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between hover:border-stone-300">
        <div>
          {/* Photo / Interactive 3D Viewport Container */}
          <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-100">
            {is3D ? (
              <Textile3DViewer
                cardMode
                initialModel={threeConfig.model}
                initialWeave={threeConfig.weave}
                initialColorId={threeConfig.colorId}
                onExpand={() => setModalOpen(true)}
              />
            ) : (
              <Link href={`/products/${product.id}`} className="relative block w-full h-full">
                <Image
                  src={
                    product.images[0] ||
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent pointer-events-none" />

                {/* Top-left MOQ & Verified Pills */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                  <span className="font-mono bg-[#0F172A]/85 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
                    MOQ: {product.moq} {t.product.pcs}
                  </span>
                  {supplier?.verified && (
                    <span className="bg-white/95 text-emerald-800 border border-emerald-200/80 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Проверено</span>
                    </span>
                  )}
                </div>

                {/* Lead time pill */}
                <div className="absolute bottom-3 right-3 bg-white/95 text-stone-700 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-2xs flex items-center gap-1 pointer-events-none">
                  <Clock className="w-3 h-3 text-teal-600" />
                  <span>
                    {product.lead_time_days} {t.product.days}
                  </span>
                </div>
              </Link>
            )}

            {/* Direct [Фото | 3D] Toggle right on the picture */}
            <div className="absolute top-3 right-3 z-10 flex items-center bg-white/95 backdrop-blur-md p-0.5 rounded-full border border-stone-200/90 shadow-sm text-[10px] font-bold">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIs3D(false);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all ${
                  !is3D ? 'bg-[#0F172A] text-white' : 'text-stone-600 hover:text-[#0F172A]'
                }`}
                title="Обычное фото"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Фото</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIs3D(true);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all ${
                  is3D ? 'bg-teal-600 text-white shadow-2xs' : 'text-stone-700 hover:text-teal-700'
                }`}
                title="Смотреть в 3D с текстурой"
              >
                <Box className="w-3 h-3" />
                <span>3D</span>
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-5">
            {supplier && (
              <Link
                href={`/suppliers/${supplier.id}`}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#0F172A] font-medium mb-1.5"
              >
                <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                <span className="truncate max-w-[180px] font-semibold text-stone-700">
                  {supplier.factory_name}
                </span>
                <span className="text-stone-400">({supplier.city})</span>
              </Link>
            )}

            <Link
              href={`/products/${product.id}`}
              className="block group-hover:text-teal-700 transition-colors"
            >
              <h3 className="font-display font-bold text-[#0F172A] text-[15px] sm:text-base leading-snug line-clamp-2">
                {title}
              </h3>
            </Link>

            {(product.composition || product.density_gsm) && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-stone-600">
                <span className="inline-flex items-center gap-1 bg-[#F7F6F2] border border-stone-200/70 px-2 py-0.5 rounded-md truncate max-w-full">
                  <Layers className="w-3 h-3 text-teal-600 shrink-0" />
                  <span className="truncate">{product.composition}</span>
                </span>
                {product.density_gsm && (
                  <span className="font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                    {product.density_gsm} г/м²
                  </span>
                )}
              </div>
            )}

            <p className="mt-2.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">{desc}</p>
          </div>
        </div>

        {/* Pricing & Actions Footer */}
        <div className="p-5 pt-0">
          <div className="pt-3.5 border-t border-stone-100 flex items-baseline justify-between mb-3.5">
            <div>
              <div className="text-[10px] text-stone-500 font-medium">{t.product.unitPrice}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display tabular-nums text-xl font-extrabold text-[#0F172A]">
                  {formatUsd(product.price_usd)}
                </span>
                <span className="text-xs text-stone-400 font-normal">/ {t.product.pcs}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-stone-500 font-medium">В тенге:</div>
              <div className="font-mono tabular-nums text-xs font-semibold text-stone-700 bg-[#F7F6F2] px-2 py-0.5 rounded-md border border-stone-200/60">
                ~{formatKzt(priceKzt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/checkout/${product.id}`}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#0F172A] hover:bg-teal-700 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Заказать</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </Link>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-teal-500 hover:bg-teal-50/60 text-stone-600 hover:text-teal-700 transition-colors"
              title="Открыть 3D-модель крупно"
            >
              <Box className="w-4 h-4" />
            </button>

            <Link
              href={`/chat?productId=${product.id}&supplierId=${product.supplier_id}`}
              className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-[#0F172A] transition-colors"
              title="Чат с фабрикой (ИИ-перевод)"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {modalOpen && <Product3DModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  );
}
