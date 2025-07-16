import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price?: number | null): string {
  return (price != null && !isNaN(price)) ? price.toLocaleString() : '0';
}

export const formatStatus = (s: string) => s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');