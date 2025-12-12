//src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}min`
  }
  if (hours < 24) {
    return `${Math.round(hours)}h`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = Math.round(hours % 24)
  return `${days}d ${remainingHours}h`
}

export function formatElevation(meters: number): string {
  return `${meters.toLocaleString()}m`
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'hard':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'expert':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'Easy'
    case 'moderate':
      return 'Moderate'
    case 'hard':
      return 'Hard'
    case 'expert':
      return 'Expert'
    default:
      return 'Unknown'
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateExcerpt(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function formatCurrency(amount: number, currency = 'PKR'): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getRegionColor(region: string): string {
  const colors: Record<string, string> = {
    'hunza': 'bg-blue-100 text-blue-800 border-blue-200',
    'skardu': 'bg-purple-100 text-purple-800 border-purple-200',
    'swat': 'bg-green-100 text-green-800 border-green-200',
    'kumrat': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'neelum': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'fairy-meadows': 'bg-pink-100 text-pink-800 border-pink-200',
    'nathiagali': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  }
  return colors[region.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export function getRegionLabel(region: string): string {
  const labels: Record<string, string> = {
    'hunza': 'Hunza Valley',
    'skardu': 'Skardu',
    'swat': 'Swat Valley',
    'kumrat': 'Kumrat Valley',
    'neelum': 'Neelum Valley',
    'fairy-meadows': 'Fairy Meadows',
    'nathiagali': 'Nathiagali',
  }
  return labels[region.toLowerCase()] || region
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
