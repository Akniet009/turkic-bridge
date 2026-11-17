// Currency utilities for Turkic Bridge (B2B Platform)

export const DEFAULT_USD_KZT_RATE = 502.5;
export const PLATFORM_COMMISSION_RATE = 0.05; // 5%

export function convertUsdToKzt(usdAmount: number, rate: number = DEFAULT_USD_KZT_RATE): number {
  return Math.round(usdAmount * rate);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatKzt(amount: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(amount).replace('KZT', '₸');
}

export function calculateOrderSummary(subtotalUsd: number, deliveryUsd: number = 0, fxRate: number = DEFAULT_USD_KZT_RATE) {
  const commissionUsd = Number((subtotalUsd * PLATFORM_COMMISSION_RATE).toFixed(2));
  const totalUsd = Number((subtotalUsd + commissionUsd + deliveryUsd).toFixed(2));
  const totalKzt = convertUsdToKzt(totalUsd, fxRate);

  return {
    subtotalUsd,
    commissionUsd,
    deliveryUsd,
    totalUsd,
    totalKzt,
    fxRate,
  };
}
