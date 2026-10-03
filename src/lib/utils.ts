import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price >= 1) {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) {
    return `\$${(volume / 1_000_000_000).toFixed(2)}B`;
  }
  if (volume >= 1_000_000) {
    return `\$${(volume / 1_000_000).toFixed(2)}M`;
  }
  if (volume >= 1_000) {
    return `\$${(volume / 1_000).toFixed(2)}K`;
  }
  return `\$${volume.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatMarketCap(cap: number): string {
  if (cap >= 1_000_000_000_000) {
    return `\$${(cap / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (cap >= 1_000_000_000) {
    return `\$${(cap / 1_000_000_000).toFixed(2)}B`;
  }
  if (cap >= 1_000_000) {
    return `\$${(cap / 1_000_000).toFixed(2)}M`;
  }
  return `\$${cap.toLocaleString()}`;
}
