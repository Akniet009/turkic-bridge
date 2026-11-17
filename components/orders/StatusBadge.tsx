'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { OrderStatus } from '@/lib/types';

export function getStatusBadge(status: OrderStatus, label: string) {
  switch (status) {
    case 'new':
      return <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">{label}</span>;
    case 'accepted_by_supplier':
      return <span className="bg-sky-50 text-sky-700 border border-sky-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">{label}</span>;
    case 'paid_in_escrow':
      return (
        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {label}
        </span>
      );
    case 'in_production':
      return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">{label}</span>;
    case 'shipped':
      return <span className="bg-cyan-50 text-cyan-800 border border-cyan-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">{label}</span>;
    case 'delivered':
      return <span className="bg-teal-50 text-teal-800 border border-teal-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">{label}</span>;
    case 'completed':
      return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">{label}</span>;
    case 'cancelled':
      return <span className="bg-rose-50 text-rose-700 border border-rose-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">{label}</span>;
    case 'dispute':
      return <span className="bg-red-50 text-red-700 border border-red-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">{label}</span>;
    default:
      return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-medium">{label}</span>;
  }
}
