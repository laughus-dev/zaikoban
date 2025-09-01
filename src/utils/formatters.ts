import { format, formatDistanceToNow, isAfter, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy年MM月dd日', { locale: ja });
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy年MM月dd日 HH:mm', { locale: ja });
};

export const formatShortDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MM/dd', { locale: ja });
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ja });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
};

export const formatNumber = (num: number, decimals = 0): string => {
  return new Intl.NumberFormat('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercent = (value: number, decimals = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};

export const formatQuantity = (quantity: number, unit: string): string => {
  return `${formatNumber(quantity)} ${unit}`;
};

export const isExpiringSoon = (expiryDate: Date | string, warningDays = 3): boolean => {
  const d = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const warningDate = addDays(new Date(), warningDays);
  return !isAfter(d, warningDate);
};

export const truncateText = (text: string, maxLength = 50): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const generateOrderNumber = (): string => {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${date}-${random}`;
};

export const generateBarcode = (): string => {
  return `JAN${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`;
};