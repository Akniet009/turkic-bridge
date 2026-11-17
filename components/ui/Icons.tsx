'use client';

import React from 'react';
import { Language, ProductCategory } from '@/lib/types';

/**
 * Custom Geometric Brand Emblem: Woven Silk Road Arch / Turkic Bridge
 */
export function BrandLogoMark({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-xl bg-[#0B1120] text-white flex items-center justify-center shadow-card ring-1 ring-slate-900/10 shrink-0`}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        aria-hidden="true"
      >
        {/* Dual interlocking woven arch representing Turkey <-> Kazakhstan */}
        <path
          d="M5 22C5 14.8203 10.8203 9 18 9C21.5 9 24.5 10.4 27 12.6"
          stroke="#2DD4BF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M27 22C27 15.9249 22.0751 11 16 11C9.92487 11 5 15.9249 5 22"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M4 22H28"
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="16" cy="18" r="2" fill="#2DD4BF" />
      </svg>
    </div>
  );
}

/**
 * Crisp Geometric SVG Flags (renders reliably on all OS without blurry emoji fonts)
 */
export function FlagIcon({ lang, className = 'w-4 h-4' }: { lang: Language; className?: string }) {
  if (lang === 'tr') {
    return (
      <svg viewBox="0 0 24 24" className={`${className} rounded-full shrink-0`} aria-hidden="true">
        <rect width="24" height="24" rx="12" fill="#E30A17" />
        <circle cx="10.5" cy="12" r="4.5" fill="#FFFFFF" />
        <circle cx="11.7" cy="12" r="3.6" fill="#E30A17" />
        <path
          d="M15.2 10.1L15.7 11.4L17 11.4L15.9 12.2L16.3 13.5L15.2 12.7L14.1 13.5L14.5 12.2L13.4 11.4L14.7 11.4Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }
  if (lang === 'kk') {
    return (
      <svg viewBox="0 0 24 24" className={`${className} rounded-full shrink-0`} aria-hidden="true">
        <rect width="24" height="24" rx="12" fill="#00AFCA" />
        <circle cx="12" cy="11.5" r="4" fill="#FEC50C" />
        <path
          d="M7 17.5C9.5 16.2 14.5 16.2 17 17.5"
          stroke="#FEC50C"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={`${className} rounded-full shrink-0 ring-1 ring-slate-200`} aria-hidden="true">
      <clipPath id="ru-flag-clip">
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath="url(#ru-flag-clip)">
        <rect y="0" width="24" height="8" fill="#FFFFFF" />
        <rect y="8" width="24" height="8" fill="#0039A6" />
        <rect y="16" width="24" height="8" fill="#D52B1E" />
      </g>
    </svg>
  );
}

/**
 * Custom Bespoke Textile Category Vector Icons
 */
export function CategoryVectorIcon({
  category,
  className = 'w-6 h-6',
}: {
  category: ProductCategory | 'all';
  className?: string;
}) {
  switch (category) {
    case 'bedding':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M3 18V8.5C3 7.67 3.67 7 4.5 7H19.5C20.33 7 21 7.67 21 8.5V18"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M2 14H22V17C22 17.55 21.55 18 21 18H3C2.45 18 2 17.55 2 17V14Z"
            fill="currentColor"
            fillOpacity="0.12"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <rect
            x="5.5"
            y="10"
            width="5.5"
            height="4"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <rect
            x="13"
            y="10"
            width="5.5"
            height="4"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M4 18V20M20 18V20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'towels':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect
            x="4"
            y="5"
            width="16"
            height="4.5"
            rx="2"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <rect
            x="4"
            y="10.5"
            width="16"
            height="4.5"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <rect
            x="4"
            y="16"
            width="16"
            height="4"
            rx="2"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path d="M15 7.25H17.5M15 12.75H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'plaids':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M6 5H18C19.1 5 20 5.9 20 7V15C20 16.1 19.1 17 18 17H6C4.9 17 4 16.1 4 15V7C4 5.9 4.9 5 6 5Z"
            fill="currentColor"
            fillOpacity="0.12"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path d="M4 11H20M12 5V17" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
          <path
            d="M6 17V20M9.5 17V20M14.5 17V20M18 17V20"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'fabrics':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <ellipse
            cx="8.5"
            cy="12"
            rx="4"
            ry="6.5"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <circle cx="8.5" cy="12" r="1.4" fill="currentColor" />
          <path
            d="M8.5 5.5H17.5C19.7 5.5 21 8.4 21 12C21 15.6 19.7 18.5 17.5 18.5H8.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path d="M13 18.5V21H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'apparel':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M9 4L6 6.5L3 10L5.5 12L7.5 10V20H16.5V10L18.5 12L21 10L18 6.5L15 4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 4C9.5 5.5 10.6 6.5 12 6.5C13.4 6.5 14.5 5.5 15 4L12 10L9 4Z"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M7.5 14H16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <rect x="13" y="4" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.75" />
          <rect x="4" y="13" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.75" />
          <rect x="13" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
  }
}
