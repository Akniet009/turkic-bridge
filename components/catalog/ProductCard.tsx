'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Layers, MessageSquare, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt, convertUsdToKzt } from '@/lib/currency';

export function ProductCard({ product }: { product: Product }) {
  const { language, t } = useTranslation();

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

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:border-slate-300">
      <div>
        {/* Photo Container */}
        <Link href={`/products/${product.id}`} className="relative block h-52 sm:h-56 overflow-hidden bg-slate-100">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />

          {/* Minimalist Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="bg-slate-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-2xs">
              MOQ: {product.moq} {t.product.pcs}
            </span>
            {supplier?.verified && (
              <span className="bg-white/90 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Проверено</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 bg-white/90 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md shadow-2xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{product.lead_time_days} {t.product.days}</span>
          </div>
        </Link>

        {/* Info */}
        <div className="p-4 sm:p-5">
          {supplier && (
            <Link
              href={`/suppliers/${supplier.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-1.5"
            >
              <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
              <span className="truncate max-w-[180px] font-semibold text-slate-700">{supplier.factory_name}</span>
              <span className="text-slate-400">({supplier.city})</span>
            </Link>
          )}

          <Link href={`/products/${product.id}`} className="block group-hover:text-teal-700 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
              {title}
            </h3>
          </Link>

          {(product.composition || product.density_gsm) && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {product.composition} {product.density_gsm ? `• ${product.density_gsm} г/м²` : ''}
              </span>
            </div>
          )}

          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[10px] text-slate-600 font-medium">{t.product.unitPrice}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-950">
                {formatUsd(product.price_usd)}
              </span>
              <span className="text-xs text-slate-400 font-normal">/ {t.product.pcs}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-600 font-medium">В тенге:</div>
            <div className="text-xs font-semibold text-slate-700">
              ~{formatKzt(priceKzt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/checkout/${product.id}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Заказать</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
          </Link>

          <Link
            href={`/chat?productId=${product.id}&supplierId=${product.supplier_id}`}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
            title="Чат с фабрикой (ИИ-перевод)"
          >
            <MessageSquare className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
