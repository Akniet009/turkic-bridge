import { NextResponse } from 'next/server';
import { DEFAULT_USD_KZT_RATE } from '@/lib/currency';

export async function GET() {
  try {
    // Attempt to fetch live exchange rate from free open exchange rate API with timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const kztRate = data?.rates?.KZT;
      if (typeof kztRate === 'number' && kztRate > 0) {
        return NextResponse.json({
          base: 'USD',
          rate_kzt: Number(kztRate.toFixed(2)),
          updated_at: new Date().toISOString(),
          source: 'live',
        });
      }
    }
  } catch {
    // network timeout / offline
  }

  return NextResponse.json({
    base: 'USD',
    rate_kzt: DEFAULT_USD_KZT_RATE,
    updated_at: new Date().toISOString(),
    source: 'fallback',
  });
}
