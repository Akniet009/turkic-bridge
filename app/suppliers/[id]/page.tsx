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
  ShieldCheck,
  Award,
  MessageSquare,
  ArrowRight,
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
        <h2 className="text-2xl font-bold text-slate-800">Фабрика не найдена</h2>
        <Link href="/catalog" className="inline-block py-2 px-5 bg-brand-navy text-white rounded-xl text-sm font-semibold">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Factory Banner & Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="relative h-48 sm:h-72 w-full bg-slate-900">
          <Image
            src={supplier.banner_url || 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=80'}
            alt={supplier.factory_name}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <EscrowBadge />
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="p-6 sm:p-8 -mt-12 sm:-mt-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 flex items-center justify-center shrink-0">
              <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-brand-navy" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                {supplier.verified && <VerifiedBadge />}
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  ★ {supplier.rating} Надежность
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {supplier.factory_name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  {supplier.city}, Türkiye
                </span>
                {supplier.founded_year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Основана в {supplier.founded_year} г.
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  {products.length} позиций в каталоге
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/chat?supplierId=${supplier.id}`}
              className="flex items-center gap-2 py-3 px-5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4 text-brand-accent" />
              <span>Написать фабрике в чат</span>
            </Link>
          </div>
        </div>

        {/* Factory Description & Certificates */}
        <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              О производственном предприятии
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {supplier.description}
            </p>
            {supplier.address && (
              <p className="text-xs text-slate-400 mt-2">
                <strong>Юридический и фактический адрес:</strong> {supplier.address}
              </p>
            )}
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-navy" />
              <span>Международные сертификаты</span>
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

      {/* Factory's Products Showcase */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Каталог продукции фабрики ({products.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Цены напрямую от турецкого производителя без переплат
            </p>
          </div>
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
