
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PeriodType, Transaction } from "@/types"
import { format, startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear, isWithinInterval } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMM yyyy')
}

export function getDateRangeForPeriod(period: PeriodType, date: Date = new Date()): { start: Date; end: Date } {
  switch (period) {
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    case 'year':
      return {
        start: startOfYear(date),
        end: endOfYear(date),
      };
    default:
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
  }
}

export function filterTransactionsByPeriod(transactions: Transaction[], period: PeriodType): Transaction[] {
  const dateRange = getDateRangeForPeriod(period);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, {
      start: dateRange.start,
      end: dateRange.end,
    });
  });
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getRandomColor(): string {
  const colors = [
    '#1E3A8A', // navy
    '#059669', // emerald
    '#F59E0B', // amber
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#10B981', // green
    '#6366F1', // indigo
    '#D946EF', // fuchsia
    '#F97316', // orange
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getPeriodLabel(period: PeriodType): string {
  switch (period) {
    case 'week':
      return 'This Week';
    case 'month':
      return 'This Month';
    case 'year':
      return 'This Year';
    default:
      return 'Custom Period';
  }
}
