import type { UserRole, User } from '../types';

import { type ClassValue, clsx } from 'clsx';
import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';
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

export const isAdmin = (user: User) => user?.role === 'admin';
export const isUser = (user: User) => user?.role === 'user';
export const isDriver = (user: User) => user?.role === 'driver';
export const isStaff = (user: User) => user?.role === 'staff';

export function normalizePhoneNumber(
    input: string, 
    country?: string
) {
    const phoneNumber = parsePhoneNumberFromString(input, country ? { defaultCountry: country.toUpperCase() as any } : undefined);

    if (!phoneNumber || !phoneNumber.isValid()) {
        return null; // invalid number
    }

    // E.164 format for storage
    const e164 = phoneNumber.format('E.164');

    // National format for display
    const national = phoneNumber.format('NATIONAL');

    return { e164, national };
}

export function normalizePHNumber(number: string) {
  let digits = number.replace(/\D/g, ''); // remove non-digits

  // Remove leading 63 if present, then add +
  if (digits.startsWith('63')) {
    digits = '+' + digits;
  } 
  // Remove leading 0 if number starts with 0 after 63
  else if (digits.startsWith('0')) {
    digits = '+63' + digits.slice(1);
  }
  // If already starts with 9 (no leading 0)
  else if (digits.startsWith('9')) {
    digits = '+63' + digits;
  }

  return digits; // e.g., '+639954609624'
}