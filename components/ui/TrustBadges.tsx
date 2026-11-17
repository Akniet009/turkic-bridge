'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Percent, Truck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function VerifiedBadge({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${className}`}
      title={t.verifiedSupplierBadge}
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      <span>{t.verifiedSupplierBadge}</span>
    </span>
  );
}

export function EscrowBadge({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200/80 ${className}`}
      title={t.safeDealBadge}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
      <span>{t.safeDealBadge}</span>
    </span>
  );
}

export function CommissionBadge({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80 ${className}`}
      title={t.commissionBadge}
    >
      <Percent className="w-3 h-3 text-teal-600" />
      <span>{t.commissionBadge}</span>
    </span>
  );
}

export function DeliveryDirectBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
    >
      <Truck className="w-3.5 h-3.5 text-slate-500" />
      <span>Турция → Казахстан</span>
    </span>
  );
}
