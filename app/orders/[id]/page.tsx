'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  MessageSquare,
  ArrowRight,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  CreditCard,
  Building2,
  Lock,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { formatUsd, formatKzt } from '@/lib/currency';
import { getStatusBadge } from '@/components/orders/StatusBadge';
import { EscrowBadge, CommissionBadge } from '@/components/ui/TrustBadges';

const STATUS_PIPELINE: { key: OrderStatus; labelRu: string; icon: any }[] = [
  { key: 'new', labelRu: 'Создан', icon: Clock },
  { key: 'accepted_by_supplier', labelRu: 'Принят фабрикой', icon: Building2 },
  { key: 'paid_in_escrow', labelRu: 'Оплачен в Эскроу', icon: ShieldCheck },
  { key: 'in_production', labelRu: 'В производстве', icon: Package },
  { key: 'shipped', labelRu: 'Отгружен (в пути)', icon: Truck },
  { key: 'delivered', labelRu: 'Прибыл в РК', icon: MapPin },
  { key: 'completed', labelRu: 'Завершен (выплачено)', icon: CheckCircle2 },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const orderId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState(() => AppStore.getCurrentUser());
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (orderId) {
      setOrder(AppStore.getOrderById(orderId));
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Заказ не найден</h2>
        <Link href="/orders" className="inline-block py-2 px-5 bg-[#0B1120] text-white rounded-xl text-sm font-semibold">
          Вернуться к заказам
        </Link>
      </div>
    );
  }

  const currentStatusIdx = STATUS_PIPELINE.findIndex((s) => s.key === order.status);
  const firstItem = order.items?.[0];

  const handlePayEscrow = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const updated = AppStore.updateOrderStatus(
        order.id,
        'paid_in_escrow',
        `Оплата ${formatKzt(order.total_kzt)} (${formatUsd(order.total_usd)}) успешно заблокирована в Escrow. Фабрика в Турции оповещена о старте производства.`
      );
      if (updated) setOrder(updated);
      setIsProcessingPayment(false);
      setPaymentModalOpen(false);
    }, 1200);
  };

  const handleNextStatusSimulation = (nextStatus: OrderStatus, note: string) => {
    const updated = AppStore.updateOrderStatus(order.id, nextStatus, note);
    if (updated) setOrder(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0B1120]">Главная</Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-slate-900">Мои заказы</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{order.order_number}</span>
      </nav>

      {/* Header Info */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <span className="text-2xl font-black text-slate-950">{order.order_number}</span>
            {getStatusBadge(order.status, t.orders.statuses[order.status] || order.status)}
            <EscrowBadge />
          </div>

          <div className="text-xs text-slate-500">
            Оформлен: <strong>{new Date(order.created_at).toLocaleString('ru-RU')}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/chat?supplierId=${order.supplier_id}&productId=${firstItem?.product_id}`}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200/80 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-all hover:bg-slate-50"
          >
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span>Чат по заказу (ИИ-перевод)</span>
          </Link>
        </div>
      </div>

      {/* STATUS TIMELINE PIPELINE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">
            Хронология выполнения безопасной сделки
          </h2>
          <span className="text-xs text-slate-400">Статус: {t.orders.statuses[order.status]}</span>
        </div>

        {/* Step-by-step visual tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {STATUS_PIPELINE.map((stage, idx) => {
            const isCompleted = currentStatusIdx >= idx && currentStatusIdx !== -1;
            const isCurrent = currentStatusIdx === idx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-teal-400/50'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${
                    isCurrent
                      ? 'bg-teal-400 text-slate-900'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">{stage.labelRu}</span>
                <span className="text-[9px] mt-1 opacity-70">Шаг {idx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Action card for Escrow payment if status is new or accepted */}
        {(order.status === 'new' || order.status === 'accepted_by_supplier') && (
          <div className="p-6 rounded-2xl bg-[#0B1120] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevated">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Ожидает блокировки средств в Escrow</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold">
                Внесите оплату: <span className="font-mono tabular-nums">{formatKzt(order.total_kzt)}</span> ({formatUsd(order.total_usd)})
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Деньги замораживаются на защищенном счете. Фабрика в Турции получит оплату только после того, как вы примете товар на складе в Казахстане.
              </p>
            </div>

            <button
              onClick={() => setPaymentModalOpen(true)}
              className="py-3.5 px-7 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#0B1120] font-bold text-sm shadow-2xs transition-all shrink-0"
            >
              Оплатить в тенге (Escrow)
            </button>
          </div>
        )}

        {/* Demo status progression tools */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-semibold">Симуляция смены статуса (для тестирования):</span>
          <div className="flex flex-wrap gap-2">
            {order.status === 'paid_in_escrow' && (
              <button
                onClick={() => handleNextStatusSimulation('in_production', 'Фабрика запустила раскрой и пошив')}
                className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                В производство →
              </button>
            )}
            {order.status === 'in_production' && (
              <button
                onClick={() => handleNextStatusSimulation('shipped', 'Партия передана международному автоперевозчику Турция-Казахстан')}
                className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                Отгрузить в РК →
              </button>
            )}
            {order.status === 'shipped' && (
              <button
                onClick={() => handleNextStatusSimulation('delivered', 'Груз прошел таможню и доставлен на склад в г. ' + order.delivery_address.city)}
                className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                Прибыл в РК →
              </button>
            )}
            {order.status === 'delivered' && (
              <button
                onClick={() => handleNextStatusSimulation('completed', 'Покупатель подтвердил приемку. Средства перечислены фабрике в Турции!')}
                className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Принять и закрыть сделку ✓
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ORDER ITEMS & DELIVERY DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Items list */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
            Состав заказанного текстиля
          </h3>

          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image
                    src={item.product?.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'}
                    alt="product"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {item.product?.title_ru}
                  </h4>
                  <div className="text-xs text-slate-500 mt-1">
                    {item.quantity} шт × {formatUsd(item.unit_price_usd)}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5">
                    Итого по позиции: {formatUsd(item.quantity * item.unit_price_usd)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Сумма товаров:</span>
              <strong className="font-mono tabular-nums text-[#0B1120]">{formatUsd(order.subtotal_usd)}</strong>
            </div>
            <div className="flex justify-between text-[#0B1120] font-semibold">
              <span>Комиссия платформы (5%):</span>
              <span className="font-mono tabular-nums">{formatUsd(order.commission_usd)}</span>
            </div>
            <div className="flex justify-between">
              <span>Международная доставка:</span>
              <strong className="font-mono tabular-nums text-[#0B1120]">{formatUsd(order.delivery_usd)}</strong>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200/80 text-sm font-extrabold text-[#0B1120]">
              <span>Итого:</span>
              <span className="font-mono tabular-nums text-teal-700">{formatUsd(order.total_usd)} ({formatKzt(order.total_kzt)})</span>
            </div>
          </div>
        </div>

        {/* Right: Delivery Address & Event Logs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="font-display font-bold text-[#0B1120] text-sm pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Адрес доставки в Казахстане</span>
            </h3>

            <div className="text-xs text-slate-700 space-y-1.5">
              <div><strong>Город:</strong> {order.delivery_address.city}</div>
              <div><strong>Адрес:</strong> {order.delivery_address.street}, {order.delivery_address.building}</div>
              <div><strong>Получатель:</strong> {order.delivery_address.recipient_name}</div>
              <div><strong>Телефон:</strong> <span className="font-mono">{order.delivery_address.recipient_phone}</span></div>
              {order.notes && (
                <div className="pt-2 text-slate-500 italic">
                  «{order.notes}»
                </div>
              )}
            </div>
          </div>

          {/* Event Logs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="font-display font-bold text-[#0B1120] text-sm pb-2 border-b border-slate-100">
              Журнал событий заказа
            </h3>

            <div className="space-y-3">
              {order.events?.map((ev) => (
                <div key={ev.id} className="text-xs border-l-2 border-teal-500 pl-3 py-0.5 space-y-0.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-mono font-bold uppercase">{ev.status}</span>
                    <span className="font-mono">{new Date(ev.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-slate-700 font-medium">{ev.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ESCROW PAYMENT MOCK MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-6 shadow-elevated border border-slate-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 ring-1 ring-teal-500/20 text-teal-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-[#0B1120]">
                Безопасная сделка (Эскроу)
              </h3>
              <p className="font-mono text-xs text-slate-500">
                Заказ № {order.order_number}
              </p>
            </div>

            <div className="bg-[#F9FAFB] p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Сумма в тенге:</span>
                <span className="font-display tabular-nums text-base font-black text-[#0B1120]">{formatKzt(order.total_kzt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Эквивалент:</span>
                <span className="font-mono tabular-nums font-bold text-slate-800">{formatUsd(order.total_usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Комиссия сервиса 5%:</span>
                <span className="font-mono tabular-nums font-bold text-emerald-700">{formatUsd(order.commission_usd)} (включена)</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>Имитация платежа (MVP):</strong> Нажмите «Подтвердить оплату», чтобы заблокировать средства в Эскроу и перевести статус заказа в <code className="font-mono">paid_in_escrow</code>.
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handlePayEscrow}
                disabled={isProcessingPayment}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0B1120] hover:bg-slate-800 text-white font-semibold text-sm shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <span>Блокировка средств в Escrow...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-teal-400" />
                    <span>Подтвердить оплату {formatKzt(order.total_kzt)}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setPaymentModalOpen(false)}
                disabled={isProcessingPayment}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
