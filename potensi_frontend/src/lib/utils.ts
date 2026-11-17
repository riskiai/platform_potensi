import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Gabungkan className Tailwind tanpa konflik (pola shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
