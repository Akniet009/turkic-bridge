'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Percent,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Package,
  ArrowRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Supplier, Order } from '@/lib/types';
import { formatUsd, formatKzt } from '@/lib/currency';
import { getStatusBadge } from '@/components/orders/StatusBadge';
import { useTranslation } from '@/lib/i18n/context';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const refresh = () => {
    setSuppliers(AppStore.getSuppliers());
    setOrders(AppStore.getOrders());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleVerify = (id: string, verified: boolean) => {
    AppStore.updateSupplierVerification(id, verified);
    setSuccessMessage(
      verified
        ? 'Фабрика успешно верифицирована. Значок «Проверенный поставщик» активирован!'
        : 'Верификация фабрики отменена.'
    );
    setTimeout(() => setSuccessMessage(''), 3500);
    refresh();
  };

  // Financial aggregates
  const totalVolumeUsd = orders.reduce((sum, o) => sum + o.subtotal_usd, 0);
  const totalCommissionUsd = orders.reduce((sum, o) => sum + o.commission_usd, 0);
  const totalCommissionKzt = Math.round(totalCommissionUsd * 502.5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-navy px-2.5 py-0.5 rounded">
              Super Admin
            </span>
            <span className="text-xs text-slate-400">Turkic Bridge HQ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Панель управления маркетплейсом
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Мониторинг безопасных сделок, сбор комиссии 5% и аудит турецких фабрик.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Доход платформы (5%)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-brand-navy">
            {formatUsd(totalCommissionUsd)}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            ≈ {formatKzt(totalCommissionKzt)} чистая выручка
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Общий оборот сделок</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatUsd(totalVolumeUsd)}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            По всем активным B2B сделкам
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Всего заказов</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {orders.length}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            В обработке и доставке
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Активные фабрики</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {suppliers.filter((s) => s.verified).length} / {suppliers.length}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Верифицировано аудиторами
          </div>
        </div>
      </div>

      {/* SECTION 1: SUPPLIERS VERIFICATION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Заявки фабрик на верификацию и статус проверенного поставщика
            </h2>
            <p className="text-xs text-slate-500">
              Одобренные фабрики получают зеленую галочку «Проверенный поставщик» и приоритет в каталоге
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                sup.verified ? 'bg-white border-slate-200' : 'bg-amber-50/40 border-amber-200 ring-2 ring-amber-300/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                    {sup.city}, TR
                  </span>

                  {sup.verified ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Верифицирован</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      На проверке
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base">{sup.factory_name}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{sup.description}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {sup.certificates.map((c) => (
                    <span key={c} className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/suppliers/${sup.id}`}
                  className="text-xs font-semibold text-brand-blue hover:text-brand-navy flex items-center gap-1"
                >
                  <span>Профиль</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                {sup.verified ? (
                  <button
                    onClick={() => handleVerify(sup.id, false)}
                    className="py-1.5 px-3 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                  >
                    Отозвать
                  </button>
                ) : (
                  <button
                    onClick={() => handleVerify(sup.id, true)}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                  >
                    Одобрить фабрику ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: ALL ORDERS ON PLATFORM */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Все сделки на платформе ({orders.length})
            </h2>
            <p className="text-xs text-slate-500">
              Контроль эскроу-депозитов и начисления 5% комиссии сервиса
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Заказ №</th>
                <th className="py-3 px-4">Покупатель (РК)</th>
                <th className="py-3 px-4">Фабрика (ТР)</th>
                <th className="py-3 px-4">Сумма (USD)</th>
                <th className="py-3 px-4">Комиссия 5% (USD)</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-brand-navy">
                    {o.order_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{o.buyer?.company || o.buyer?.name}</div>
                    <div className="text-[11px] text-slate-400">г. {o.delivery_address.city}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{o.supplier?.factory_name}</div>
                    <div className="text-[11px] text-slate-400">{o.supplier?.city}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatUsd(o.subtotal_usd)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    +{formatUsd(o.commission_usd)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(o.status, t.orders.statuses[o.status] || o.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/orders/${o.id}`}
                      className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-brand-navy hover:text-white font-bold transition-all inline-block"
                    >
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
