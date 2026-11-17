'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Percent,
  TrendingUp,
  CheckCircle2,
  Package,
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
        ? 'Фабрика успешно верифицирована. Значок «Проверенный поставщик» активирован.'
        : 'Верификация фабрики отменена.'
    );
    setTimeout(() => setSuccessMessage(''), 3500);
    refresh();
  };

  const totalVolumeUsd = orders.reduce((sum, o) => sum + o.subtotal_usd, 0);
  const totalCommissionUsd = orders.reduce((sum, o) => sum + o.commission_usd, 0);
  const totalCommissionKzt = Math.round(totalCommissionUsd * 502.5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-[#0B1120] px-2.5 py-0.5 rounded-md">
              Super Admin
            </span>
            <span className="text-xs text-slate-400 font-medium">Turkic Bridge HQ</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1120]">
            Панель управления маркетплейсом
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Мониторинг безопасных сделок, сбор комиссии 5% и аудит турецких фабрик.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Доход платформы (5%)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 ring-1 ring-emerald-500/20 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display tabular-nums text-2xl font-extrabold text-[#0B1120]">
            {formatUsd(totalCommissionUsd)}
          </div>
          <div className="font-mono text-xs text-slate-500">
            ≈ {formatKzt(totalCommissionKzt)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Общий оборот сделок</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 ring-1 ring-sky-500/20 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display tabular-nums text-2xl font-extrabold text-[#0B1120]">
            {formatUsd(totalVolumeUsd)}
          </div>
          <div className="text-xs text-slate-500">По всем B2B сделкам</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Всего заказов</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 ring-1 ring-teal-500/20 text-teal-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display tabular-nums text-2xl font-extrabold text-[#0B1120]">
            {orders.length}
          </div>
          <div className="text-xs text-slate-500">В обработке и доставке</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Активные фабрики</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 ring-1 ring-indigo-500/20 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display tabular-nums text-2xl font-extrabold text-[#0B1120]">
            {suppliers.filter((s) => s.verified).length} / {suppliers.length}
          </div>
          <div className="text-xs text-slate-500">Верифицировано аудиторами</div>
        </div>
      </div>

      {/* SUPPLIERS VERIFICATION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="font-display text-lg font-extrabold text-[#0B1120]">
            Верификация турецких фабрик
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Одобренные фабрики получают значок «Проверенный поставщик» и приоритет в каталоге
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                sup.verified ? 'bg-white border-slate-200/80' : 'bg-amber-50/40 border-amber-200 ring-1 ring-amber-300/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {sup.city}, TR
                  </span>

                  {sup.verified ? (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Верифицирован</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      На проверке
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-[#0B1120] text-base">{sup.factory_name}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{sup.description}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {sup.certificates.map((c) => (
                    <span key={c} className="text-[10px] font-medium bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/suppliers/${sup.id}`}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>Профиль</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                {sup.verified ? (
                  <button
                    onClick={() => handleVerify(sup.id, false)}
                    className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                  >
                    Отозвать
                  </button>
                ) : (
                  <button
                    onClick={() => handleVerify(sup.id, true)}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    Одобрить ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL ORDERS TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="font-display text-lg font-extrabold text-[#0B1120]">
            Все сделки на платформе ({orders.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Контроль эскроу-депозитов и начисления 5% комиссии сервиса
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Заказ №</th>
                <th className="py-3 px-4">Покупатель (РК)</th>
                <th className="py-3 px-4">Фабрика (ТР)</th>
                <th className="py-3 px-4">Сумма (USD)</th>
                <th className="py-3 px-4">Комиссия 5%</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B1120]">{o.order_number}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{o.buyer?.company || o.buyer?.name}</div>
                    <div className="text-[11px] text-slate-400">г. {o.delivery_address.city}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{o.supplier?.factory_name}</div>
                    <div className="text-[11px] text-slate-400">{o.supplier?.city}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-[#0B1120]">
                    {formatUsd(o.subtotal_usd)}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-emerald-700">
                    +{formatUsd(o.commission_usd)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(o.status, t.orders.statuses[o.status] || o.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/orders/${o.id}`}
                      className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-[#0B1120] hover:text-white font-semibold transition-all inline-block"
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
