import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${remainingMinutes} min`
}

export const formatNumberWithCommas = (value: string) => {
  const parts = value.replace(/,/g, '').split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] ? '.' + parts[1] : '';
  return parseInt(integerPart || '0', 10).toLocaleString('en-US') + decimalPart;
}
