'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Box, ShieldCheck } from 'lucide-react';
import { Textile3DViewer } from '@/components/three/Textile3DViewer';

export default function ShowroomPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/70 px-2.5 py-0.5 rounded-full mb-2">
            <Box className="w-3.5 h-3.5" />
            <span>Интерактивный 3D-шоурум</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            3D-студия турецких тканей и мебели
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Оцените переплетение нитей, рельеф букле, перелив бархата и драпировку сатина на готовых изделиях перед заказом оптовой партии.
          </p>
        </div>

        <Link
          href="/catalog"
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all w-fit shadow-2xs"
        >
          <span>Выбрать ткань в каталоге</span>
          <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
        </Link>
      </div>

      <Textile3DViewer initialModel="sofa" initialWeave="velvet" initialColorId="emerald" />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Все представленные фактуры производятся фабриками Денизли и Бурсы с возможностью отгрузки образцов и оптовых рулонов в Казахстан.
          </span>
        </div>
        <Link
          href="/chat"
          className="text-teal-700 hover:text-teal-800 font-bold whitespace-nowrap flex items-center gap-1"
        >
          <span>Запросить живые образцы</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
