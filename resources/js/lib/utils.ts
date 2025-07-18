import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price?: number | null): string {
  return (price != null && !isNaN(price)) ? price.toLocaleString() : '0';
}

export const formatStatus = (s: string) => s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
