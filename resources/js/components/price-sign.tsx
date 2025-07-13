import React from 'react';

type PriceSignProps = {
  currency?: 'PHP' | 'USD' | 'EUR' | 'JPY' | string;
  className?: string;
};

const symbolMap: Record<string, string> = {
  PHP: '₱',
  USD: '$',
  EUR: '€',
  JPY: '¥',
};

export default function PriceSign({ currency = 'PHP', className = 'mr-1' }: PriceSignProps) {
  const symbol = symbolMap[currency] || currency;

  return <span className={className}>{symbol}</span>;
}
