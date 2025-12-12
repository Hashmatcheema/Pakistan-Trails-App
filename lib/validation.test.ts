//lib/validation.test.ts
import { describe, it, expect } from 'vitest'
import {
  TrailFiltersSchema,
  SearchQuerySchema,
  PaginationSchema,
  SlugSchema,
  EmailSchema,
  sanitizeSearchQuery,
  validateAndSanitizeSearch,
} from '../src/lib/validation'

describe('Validation Schemas', () => {
  describe('PaginationSchema', () => {
    it('should validate valid pagination', () => {
      const result = PaginationSchema.safeParse({ page: 1, limit: 12 })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(12)
      }
    })

    it('should use defaults for missing values', () => {
      const result = PaginationSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(12)
      }
    })

    it('should reject negative page numbers', () => {
      const result = PaginationSchema.safeParse({ page: -1, limit: 12 })
      expect(result.success).toBe(false)
    })

    it('should reject limit over 100', () => {
      const result = PaginationSchema.safeParse({ page: 1, limit: 101 })
      expect(result.success).toBe(false)
    })
  })

  describe('TrailFiltersSchema', () => {
    it('should validate valid filters', () => {
      const result = TrailFiltersSchema.safeParse({
        region: '123e4567-e89b-12d3-a456-426614174000',
        difficulty: 'easy',
        max_distance: 10,
        search: 'hiking',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid difficulty', () => {
      const result = TrailFiltersSchema.safeParse({
        difficulty: 'very-hard',
      })
      expect(result.success).toBe(false)
    })

    it('should reject search query over 200 characters', () => {
      const longQuery = 'a'.repeat(201)
      const result = TrailFiltersSchema.safeParse({
        search: longQuery,
      })
      expect(result.success).toBe(false)
    })

    it('should accept empty filters', () => {
      const result = TrailFiltersSchema.safeParse({})
      expect(result.success).toBe(true)
    })
  })

  describe('SearchQuerySchema', () => {
    it('should validate valid search query', () => {
      const result = SearchQuerySchema.safeParse({ query: 'hiking trails', limit: 20 })
      expect(result.success).toBe(true)
    })

    it('should reject empty query', () => {
      const result = SearchQuerySchema.safeParse({ query: '', limit: 20 })
      expect(result.success).toBe(false)
    })

    it('should reject query over 200 characters', () => {
      const longQuery = 'a'.repeat(201)
      const result = SearchQuerySchema.safeParse({ query: longQuery, limit: 20 })
      expect(result.success).toBe(false)
    })
  })

  describe('SlugSchema', () => {
    it('should validate valid slug', () => {
      const result = SlugSchema.safeParse('hunza-valley-trail')
      expect(result.success).toBe(true)
    })

    it('should reject slug with uppercase letters', () => {
      const result = SlugSchema.safeParse('Hunza-Valley')
      expect(result.success).toBe(false)
    })

    it('should reject slug with special characters', () => {
      const result = SlugSchema.safeParse('hunza_valley!')
      expect(result.success).toBe(false)
    })

    it('should reject empty slug', () => {
      const result = SlugSchema.safeParse('')
      expect(result.success).toBe(false)
    })
  })

  describe('EmailSchema', () => {
    it('should validate valid email', () => {
      const result = EmailSchema.safeParse('test@example.com')
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = EmailSchema.safeParse('not-an-email')
      expect(result.success).toBe(false)
    })
  })

  describe('sanitizeSearchQuery', () => {
    it('should remove SQL injection characters', () => {
      const malicious = "test'; DROP TABLE trails; --"
      const sanitized = sanitizeSearchQuery(malicious)
      expect(sanitized).not.toContain("'")
      expect(sanitized).not.toContain(';')
      expect(sanitized).not.toContain('--')
    })

    it('should remove wildcards', () => {
      const withWildcards = 'test%query'
      const sanitized = sanitizeSearchQuery(withWildcards)
      expect(sanitized).not.toContain('%')
    })

    it('should trim whitespace', () => {
      const withSpaces = '  test query  '
      const sanitized = sanitizeSearchQuery(withSpaces)
      expect(sanitized).toBe('test query')
    })

    it('should limit length to 200 characters', () => {
      const longQuery = 'a'.repeat(300)
      const sanitized = sanitizeSearchQuery(longQuery)
      expect(sanitized.length).toBeLessThanOrEqual(200)
    })
  })

  describe('validateAndSanitizeSearch', () => {
    it('should sanitize valid query', () => {
      const result = validateAndSanitizeSearch('hiking trails')
      expect(result).toBe('hiking trails')
    })

    it('should throw error for empty query after sanitization', () => {
      expect(() => validateAndSanitizeSearch("';--")).toThrow()
    })

    it('should handle SQL injection attempts', () => {
      const malicious = "'; DROP TABLE trails; --"
      const result = validateAndSanitizeSearch(malicious)
      expect(result).not.toContain("'")
      expect(result).not.toContain(';')
    })
  })
})

