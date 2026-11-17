'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Percent, Truck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function VerifiedBadge({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-navy/10 text-brand-navy border border-brand-navy/20 ${className}`}
      title={t.safeDealBadge}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
      <span>{t.safeDealBadge}</span>
    </span>
  );
}

export function CommissionBadge({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 ${className}`}
      title={t.commissionBadge}
    >
      <Percent className="w-3 h-3 text-brand-accent" />
      <span>{t.commissionBadge}</span>
    </span>
  );
}

export function DeliveryDirectBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
    >
      <Truck className="w-3.5 h-3.5 text-blue-600" />
      <span>Турция → Казахстан</span>
    </span>
  );
}
