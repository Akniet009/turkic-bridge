'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Award,
  MessageSquare,
  Package,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Supplier, Product } from '@/lib/types';
import { ProductCard } from '@/components/catalog/ProductCard';
import { VerifiedBadge, EscrowBadge } from '@/components/ui/TrustBadges';

export default function SupplierProfilePage() {
  const params = useParams();
  const supplierId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [supplier, setSupplier] = useState<Supplier | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (supplierId) {
      const sup = AppStore.getSupplierById(supplierId);
      setSupplier(sup);
      const allProds = AppStore.getProducts();
      setProducts(allProds.filter((p) => p.supplier_id === supplierId));
    }
  }, [supplierId]);

  if (!supplier) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#0B1120]">Фабрика не найдена</h2>
        <Link
          href="/catalog"
          className="inline-block py-2.5 px-5 bg-[#0B1120] text-white rounded-xl text-sm font-semibold"
        >
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Factory Banner & Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card">
        <div className="relative h-48 sm:h-64 w-full bg-[#0B1120]">
          <Image
            src={
              supplier.banner_url ||
              'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=80'
            }
            alt={supplier.factory_name}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <EscrowBadge />
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-6 pt-5 relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="-mt-14 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shadow-elevated border border-slate-200 flex items-center justify-center shrink-0 relative z-10">
              <Building2 className="w-9 h-9 sm:w-11 sm:h-11 text-[#0B1120] stroke-[1.75]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {supplier.verified && <VerifiedBadge />}
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                  ★ {supplier.rating}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1120]">
                {supplier.factory_name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-slate-700 font-semibold">{supplier.city}, Türkiye</span>
                </span>
                {supplier.founded_year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Основана в {supplier.founded_year} г.</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{products.length}</span> позиций в каталоге
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/chat?supplierId=${supplier.id}`}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#0B1120] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-2xs transition-all shrink-0"
          >
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <span>Написать фабрике в чат</span>
          </Link>
        </div>

        {/* Factory Description & Certificates */}
        <div className="px-6 sm:px-8 pb-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              О производственном предприятии
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{supplier.description}</p>
            {supplier.address && (
              <p className="text-xs text-slate-500 pt-1">
                <strong className="text-slate-700">Адрес производства:</strong> {supplier.address}
              </p>
            )}
          </div>

          <div className="space-y-3 bg-[#F9FAFB] p-4 rounded-2xl border border-slate-200/70">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Сертификаты качества</span>
            </h3>
            <div className="space-y-2">
              {supplier.certificates.map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Factory Products */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1120]">
            Каталог продукции фабрики ({products.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Нажмите «3D» на любой карточке для осмотра фактуры ткани в объёме
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
