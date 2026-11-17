'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt } from '@/lib/currency';
import { EscrowBadge } from '@/components/ui/TrustBadges';
import { getStatusBadge } from '@/components/orders/StatusBadge';

export default function OrdersListPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser] = useState(() => AppStore.getCurrentUser());

  useEffect(() => {
    // Load orders
    const all = AppStore.getOrders();
    if (currentUser.role === 'buyer') {
      setOrders(all.filter((o) => o.buyer_id === currentUser.id));
    } else if (currentUser.role === 'supplier') {
      setOrders(all.filter((o) => o.supplier?.profile_id === currentUser.id));
    } else {
      setOrders(all); // Admin sees all
    }
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {currentUser.role === 'supplier' ? 'Входящие оптовые заказы' : 'Мои оптовые заказы'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Все заказы защищены системой безопасной сделки Escrow с комиссией 5%
          </p>
        </div>

        <Link
          href="/catalog"
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all w-fit shadow-2xs"
        >
          <span>В каталог</span>
          <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Заказов пока нет</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Выберите текстильную продукцию в каталоге турецких фабрик и оформите безопасную сделку.
          </p>
          <Link
            href="/catalog"
            className="inline-block py-2.5 px-5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => {
            const statusLabel = t.orders.statuses[order.status] || order.status;
            const firstItem = order.items?.[0];
            const dateFormatted = new Date(order.created_at).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900">
                      {order.order_number}
                    </span>
                    {getStatusBadge(order.status, statusLabel)}
                    <span className="text-xs text-slate-400">
                      от {dateFormatted}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="text-slate-400">Фабрика: </span>
                    <strong className="text-slate-800">{order.supplier?.factory_name}</strong> ({order.supplier?.city}, Турция)
                  </div>

                  {firstItem && (
                    <div className="text-xs text-slate-500">
                      Позиция: <strong>{firstItem.quantity} шт</strong> • {firstItem.product?.title_ru || 'Текстильная продукция'}
                    </div>
                  )}

                  <div className="text-xs text-slate-500">
                    Доставка: <strong>г. {order.delivery_address.city}</strong> ({order.delivery_address.recipient_name})
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                  <div className="md:text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Сумма сделки (комиссия 5%)
                    </span>
                    <div className="flex items-baseline md:justify-end gap-1.5">
                      <span className="text-lg font-black text-slate-950">
                        {formatUsd(order.total_usd)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        ({formatKzt(order.total_kzt)})
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <span>Таймлайн заказа</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
