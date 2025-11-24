import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
  getDifficultyColor,
  getDifficultyLabel,
  slugify,
  generateExcerpt,
  calculateReadTime,
  formatCurrency,
  getRegionColor,
  getRegionLabel,
  isValidEmail,
  debounce,
  throttle,
} from '../src/lib/utils'

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    const date = '2024-01-15'
    const result = formatDate(date)
    expect(result).toMatch(/January 15, 2024/)
  })

  it('formats a Date object correctly', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toMatch(/January 15, 2024/)
  })

  it('handles different date formats', () => {
    const date = '2024-12-25T10:30:00Z'
    const result = formatDate(date)
    expect(result).toMatch(/December 25, 2024/)
  })
})

describe('formatDistance', () => {
  it('formats distances less than 1km in meters', () => {
    expect(formatDistance(0.5)).toBe('500m')
    expect(formatDistance(0.1)).toBe('100m')
    expect(formatDistance(0.99)).toBe('990m')
  })

  it('formats distances 1km and above in kilometers', () => {
    expect(formatDistance(1)).toBe('1.0km')
    expect(formatDistance(5.5)).toBe('5.5km')
    expect(formatDistance(10.123)).toBe('10.1km')
  })

  it('handles zero distance', () => {
    expect(formatDistance(0)).toBe('0m')
  })

  it('handles very small distances', () => {
    expect(formatDistance(0.001)).toBe('1m')
  })
})

describe('formatDuration', () => {
  it('formats durations less than 1 hour in minutes', () => {
    expect(formatDuration(0.5)).toBe('30min')
    expect(formatDuration(0.25)).toBe('15min')
    expect(formatDuration(0.1)).toBe('6min')
  })

  it('formats durations less than 24 hours in hours', () => {
    expect(formatDuration(1)).toBe('1h')
    expect(formatDuration(5)).toBe('5h')
    expect(formatDuration(12.5)).toBe('13h')
  })

  it('formats durations 24 hours and above in days and hours', () => {
    expect(formatDuration(24)).toBe('1d 0h')
    expect(formatDuration(25)).toBe('1d 1h')
    expect(formatDuration(48)).toBe('2d 0h')
    expect(formatDuration(50)).toBe('2d 2h')
  })

  it('handles zero duration', () => {
    expect(formatDuration(0)).toBe('0min')
  })
})

describe('formatElevation', () => {
  it('formats elevation with thousand separators', () => {
    expect(formatElevation(1000)).toBe('1,000m')
    expect(formatElevation(5000)).toBe('5,000m')
    expect(formatElevation(12345)).toBe('12,345m')
  })

  it('formats elevation without separators for numbers less than 1000', () => {
    expect(formatElevation(100)).toBe('100m')
    expect(formatElevation(500)).toBe('500m')
    expect(formatElevation(999)).toBe('999m')
  })

  it('handles zero elevation', () => {
    expect(formatElevation(0)).toBe('0m')
  })
})

describe('getDifficultyColor', () => {
  it('returns correct color classes for each difficulty level', () => {
    expect(getDifficultyColor('easy')).toBe('bg-green-100 text-green-800 border-green-200')
    expect(getDifficultyColor('moderate')).toBe('bg-yellow-100 text-yellow-800 border-yellow-200')
    expect(getDifficultyColor('hard')).toBe('bg-orange-100 text-orange-800 border-orange-200')
    expect(getDifficultyColor('expert')).toBe('bg-red-100 text-red-800 border-red-200')
  })

  it('returns default gray color for unknown difficulty', () => {
    expect(getDifficultyColor('unknown')).toBe('bg-gray-100 text-gray-800 border-gray-200')
    expect(getDifficultyColor('')).toBe('bg-gray-100 text-gray-800 border-gray-200')
    expect(getDifficultyColor('extreme')).toBe('bg-gray-100 text-gray-800 border-gray-200')
  })
})

describe('getDifficultyLabel', () => {
  it('returns correct label for each difficulty level', () => {
    expect(getDifficultyLabel('easy')).toBe('Easy')
    expect(getDifficultyLabel('moderate')).toBe('Moderate')
    expect(getDifficultyLabel('hard')).toBe('Hard')
    expect(getDifficultyLabel('expert')).toBe('Expert')
  })

  it('returns "Unknown" for unknown difficulty', () => {
    expect(getDifficultyLabel('unknown')).toBe('Unknown')
    expect(getDifficultyLabel('')).toBe('Unknown')
    expect(getDifficultyLabel('extreme')).toBe('Unknown')
  })
})

describe('slugify', () => {
  it('converts text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Pakistan Trails')).toBe('pakistan-trails')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! World@')).toBe('hello-world')
    expect(slugify('Test #1')).toBe('test-1')
  })

  it('replaces multiple spaces/hyphens with single hyphen', () => {
    expect(slugify('Hello   World')).toBe('hello-world')
    expect(slugify('Hello---World')).toBe('hello-world')
    expect(slugify('Hello___World')).toBe('hello-world')
  })

  it('removes leading and trailing hyphens', () => {
    expect(slugify('-Hello World-')).toBe('hello-world')
    expect(slugify('---Hello World---')).toBe('hello-world')
  })

  it('handles empty strings', () => {
    expect(slugify('')).toBe('')
  })

  it('handles strings with only special characters', () => {
    expect(slugify('!!!@@@###')).toBe('')
  })
})

describe('generateExcerpt', () => {
  it('returns full text if shorter than maxLength', () => {
    const text = 'Short text'
    expect(generateExcerpt(text, 160)).toBe('Short text')
  })

  it('truncates text longer than maxLength', () => {
    const text = 'This is a very long text that should be truncated because it exceeds the maximum length specified for the excerpt generation function'
    const result = generateExcerpt(text, 50)
    expect(result.length).toBeLessThanOrEqual(53) // 50 + '...'
    expect(result.endsWith('...')).toBe(true)
  })

  it('truncates at word boundary', () => {
    const text = 'This is a test sentence for excerpt generation'
    const result = generateExcerpt(text, 20)
    expect(result).not.toContain('sentence') // Should cut before incomplete word
    expect(result.endsWith('...')).toBe(true)
  })

  it('uses default maxLength of 160', () => {
    const longText = 'a '.repeat(100) // 200 characters
    const result = generateExcerpt(longText)
    expect(result.length).toBeLessThanOrEqual(163) // 160 + '...'
  })
})

describe('calculateReadTime', () => {
  it('calculates read time based on word count', () => {
    // 200 words = 1 minute at 200 WPM
    const text = Array(200).fill('word').join(' ')
    expect(calculateReadTime(text)).toBe(1)
  })

  it('rounds up to next minute', () => {
    // 201 words = 2 minutes (rounded up)
    const text = 'word '.repeat(201)
    expect(calculateReadTime(text)).toBe(2)
  })

  it('returns 1 minute for empty or very short text', () => {
    expect(calculateReadTime('')).toBe(1)
    expect(calculateReadTime('word')).toBe(1)
  })

  it('handles text with multiple spaces', () => {
    const text = 'word    word   word'
    expect(calculateReadTime(text)).toBe(1)
  })
})

describe('formatCurrency', () => {
  it('formats currency in PKR by default', () => {
    expect(formatCurrency(1000)).toContain('1,000')
    expect(formatCurrency(50000)).toContain('50,000')
  })

  it('formats currency without decimal places', () => {
    const result = formatCurrency(1234.56)
    expect(result).not.toContain('.')
  })

  it('handles zero amount', () => {
    expect(formatCurrency(0)).toContain('0')
  })

  it('handles large amounts', () => {
    const result = formatCurrency(1000000)
    expect(result).toContain('1,000,000')
  })
})

describe('getRegionColor', () => {
  it('returns correct color for known regions', () => {
    expect(getRegionColor('hunza')).toBe('bg-blue-100 text-blue-800 border-blue-200')
    expect(getRegionColor('skardu')).toBe('bg-purple-100 text-purple-800 border-purple-200')
    expect(getRegionColor('swat')).toBe('bg-green-100 text-green-800 border-green-200')
    expect(getRegionColor('kumrat')).toBe('bg-emerald-100 text-emerald-800 border-emerald-200')
    expect(getRegionColor('neelum')).toBe('bg-cyan-100 text-cyan-800 border-cyan-200')
    expect(getRegionColor('fairy-meadows')).toBe('bg-pink-100 text-pink-800 border-pink-200')
    expect(getRegionColor('nathiagali')).toBe('bg-indigo-100 text-indigo-800 border-indigo-200')
  })

  it('is case-insensitive', () => {
    expect(getRegionColor('HUNZA')).toBe('bg-blue-100 text-blue-800 border-blue-200')
    expect(getRegionColor('Hunza')).toBe('bg-blue-100 text-blue-800 border-blue-200')
  })

  it('returns default gray color for unknown regions', () => {
    expect(getRegionColor('unknown')).toBe('bg-gray-100 text-gray-800 border-gray-200')
    expect(getRegionColor('')).toBe('bg-gray-100 text-gray-800 border-gray-200')
  })
})

describe('getRegionLabel', () => {
  it('returns correct label for known regions', () => {
    expect(getRegionLabel('hunza')).toBe('Hunza Valley')
    expect(getRegionLabel('skardu')).toBe('Skardu')
    expect(getRegionLabel('swat')).toBe('Swat Valley')
    expect(getRegionLabel('kumrat')).toBe('Kumrat Valley')
    expect(getRegionLabel('neelum')).toBe('Neelum Valley')
    expect(getRegionLabel('fairy-meadows')).toBe('Fairy Meadows')
    expect(getRegionLabel('nathiagali')).toBe('Nathiagali')
  })

  it('is case-insensitive', () => {
    expect(getRegionLabel('HUNZA')).toBe('Hunza Valley')
    expect(getRegionLabel('Hunza')).toBe('Hunza Valley')
  })

  it('returns original value for unknown regions', () => {
    expect(getRegionLabel('unknown')).toBe('unknown')
    expect(getRegionLabel('custom-region')).toBe('custom-region')
  })
})

describe('isValidEmail', () => {
  it('validates correct email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    expect(isValidEmail('user+tag@example.com')).toBe(true)
  })

  it('rejects invalid email addresses', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('invalid@')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('invalid@.com')).toBe(false)
    expect(isValidEmail('invalid.com')).toBe(false)
  })

  it('rejects empty strings', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('rejects strings with spaces', () => {
    expect(isValidEmail('test @example.com')).toBe(false)
    expect(isValidEmail('test@example .com')).toBe(false)
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays function execution', () => {
    const func = vi.fn()
    const debounced = debounce(func, 100)

    debounced()
    expect(func).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('cancels previous calls when called multiple times', () => {
    const func = vi.fn()
    const debounced = debounce(func, 100)

    debounced()
    debounced()
    debounced()

    vi.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('passes arguments correctly', () => {
    const func = vi.fn()
    const debounced = debounce(func, 100)

    debounced('arg1', 'arg2')
    vi.advanceTimersByTime(100)

    expect(func).toHaveBeenCalledWith('arg1', 'arg2')
  })
})

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('executes function immediately on first call', () => {
    const func = vi.fn()
    const throttled = throttle(func, 100)

    throttled()
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('ignores subsequent calls within throttle period', () => {
    const func = vi.fn()
    const throttled = throttle(func, 100)

    throttled()
    throttled()
    throttled()

    expect(func).toHaveBeenCalledTimes(1)
  })

  it('allows execution after throttle period', () => {
    const func = vi.fn()
    const throttled = throttle(func, 100)

    throttled()
    vi.advanceTimersByTime(100)
    throttled()

    expect(func).toHaveBeenCalledTimes(2)
  })

  it('passes arguments correctly', () => {
    const func = vi.fn()
    const throttled = throttle(func, 100)

    throttled('arg1', 'arg2')
    expect(func).toHaveBeenCalledWith('arg1', 'arg2')
  })
})

