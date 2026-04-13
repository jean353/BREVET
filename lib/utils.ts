import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(date));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const PATENT_CATEGORIES = [
  'TECHNOLOGY', 'BIOTECHNOLOGY', 'CHEMISTRY', 'MECHANICAL',
  'ELECTRICAL', 'SOFTWARE', 'MEDICAL', 'ENERGY', 'AEROSPACE',
  'CONSUMER', 'OTHER',
] as const;

export const STATUS_COLORS: Record<string, string> = {
  DRAFT:          'bg-graphite-700 text-graphite-200',
  PENDING:        'bg-yellow-900/50 text-yellow-300',
  VERIFIED:       'bg-emerald-900/50 text-emerald-300',
  UNDER_CONTRACT: 'bg-blue-900/50 text-blue-300',
  REJECTED:       'bg-red-900/50 text-red-300',
};
