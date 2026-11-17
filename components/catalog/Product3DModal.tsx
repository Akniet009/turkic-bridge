'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { X, ArrowRight, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt, convertUsdToKzt } from '@/lib/currency';
import { getProduct3DConfig } from '@/lib/three/productMapping';

const Textile3DViewer = dynamic(
  () => import('@/components/three/Textile3DViewer').then((m) => m.Textile3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-xs text-slate-400">
        Загрузка 3D-модели и текстуры...
      </div>
    ),
  }
);

interface Product3DModalProps {
  product: Product | null;
  onClose: () => void;
}

export function Product3DModal({ product, onClose }: Product3DModalProps) {
  const { language, t } = useTranslation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product || typeof document === 'undefined') return null;

  const title =
    language === 'tr'
      ? product.title_tr
      : language === 'kk' && product.title_kk
      ? product.title_kk
      : product.title_ru;

  const config = getProduct3DConfig(product);
  const priceKzt = convertUsdToKzt(product.price_usd);

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
              {product.supplier && (
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {product.supplier.factory_name} ({product.supplier.city})
                </span>
              )}
              {product.supplier?.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Проверено
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 truncate">{title}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
            title="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Full Interactive 3D Viewer */}
        <div className="p-4 sm:p-5 bg-slate-50/50">
          <Textile3DViewer
            initialModel={config.model}
            initialWeave={config.weave}
            initialColorId={config.colorId}
          />
        </div>

        {/* Bottom Action Footer */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-slate-400 block">Цена за единицу</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-950">{formatUsd(product.price_usd)}</span>
                <span className="text-xs font-semibold text-slate-500">(~{formatKzt(priceKzt)})</span>
              </div>
            </div>
            <div className="hidden sm:block pl-6 border-l border-slate-200">
              <span className="text-[11px] text-slate-400 block">Мин. партия</span>
              <span className="text-sm font-bold text-slate-900">
                {product.moq} {t.product.pcs}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/chat?productId=${product.id}&supplierId=${product.supplier_id}`}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Написать фабрике</span>
            </Link>
            <Link
              href={`/checkout/${product.id}`}
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
