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
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Photo with badges */}
      <Link href={`/products/${product.id}`} className="relative block h-56 sm:h-64 overflow-hidden bg-slate-100">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-brand-navy/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
            MOQ: {product.moq} {t.product.pcs}
          </span>
          {supplier?.verified && (
            <span className="bg-emerald-500 text-white text-[11px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3 h-3" />
              <span>Проверено</span>
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 bg-white/95 text-brand-navy text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm shadow-sm flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{product.lead_time_days} {t.product.days}</span>
        </div>
      </Link>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Supplier Info */}
          {supplier && (
            <Link
              href={`/suppliers/${supplier.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-navy font-medium mb-1.5"
            >
              <MapPin className="w-3 h-3 text-brand-accent shrink-0" />
              <span className="truncate max-w-[200px] font-semibold text-slate-700">{supplier.factory_name}</span>
              <span className="text-slate-400">({supplier.city})</span>
            </Link>
          )}

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block group-hover:text-brand-blue transition-colors">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Composition & density */}
          {(product.composition || product.density_gsm) && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {product.composition} {product.density_gsm ? `• ${product.density_gsm} г/м²` : ''}
              </span>
            </div>
          )}

          {/* Short description */}
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                {t.product.unitPrice}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-brand-navy">
                  {formatUsd(product.price_usd)}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  ≈ {formatKzt(priceKzt)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                Партия от
              </span>
              <span className="text-sm font-bold text-slate-700">
                {formatUsd(product.price_usd * product.moq)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/chat?supplierId=${product.supplier_id}&productId=${product.id}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 hover:border-brand-navy text-slate-700 hover:text-brand-navy text-xs font-semibold transition-all bg-white hover:bg-slate-50"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-blue" />
              <span>{t.product.chatWithSupplier.split(' ')[0]}</span>
            </Link>

            <Link
              href={`/checkout/${product.id}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-bold transition-all shadow-sm hover:shadow"
            >
              <span>{t.product.orderNow.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-accent" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
