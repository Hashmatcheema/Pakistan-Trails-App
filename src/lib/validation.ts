//src/lib/validation.ts
import { z } from 'zod'

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().min(1).max(100).default(12),
})

export type PaginationInput = z.infer<typeof PaginationSchema>

// Trail filters schema
export const TrailFiltersSchema = z.object({
  // Note: region_id is a UUID in the database, but we accept a string here because
  // query params and callers may pass non-UUID values in dev/test.
  region: z.string().optional(),
  difficulty: z.enum(['easy', 'moderate', 'hard', 'expert']).optional(),
  max_distance: z.number().positive().optional(),
  min_elevation: z.number().int().nonnegative().optional(),
  max_elevation: z.number().int().nonnegative().optional(),
  search: z.string().max(200).optional(),
})

export type TrailFiltersInput = z.infer<typeof TrailFiltersSchema>

// Search query schema
export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(200),
  limit: z.number().int().positive().min(1).max(100).default(20),
})

export type SearchQueryInput = z.infer<typeof SearchQuerySchema>

// Slug validation schema
export const SlugSchema = z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: 'Slug must contain only lowercase letters, numbers, and hyphens',
})

export type SlugInput = z.infer<typeof SlugSchema>

// Email validation schema
export const EmailSchema = z.string().email().max(255)

export type EmailInput = z.infer<typeof EmailSchema>

// Sanitize search query - remove dangerous characters
export function sanitizeSearchQuery(query: string): string {
  // Remove SQL injection patterns
  return query
    .replace(/[;'"\\]/g, '') // Remove SQL special characters
    .replace(/--/g, '') // Remove SQL comment operator
    .replace(/\/\*|\*\//g, '') // Remove block comment tokens
    .replace(/%/g, '') // Remove wildcards that could be injected
    .trim()
    .slice(0, 200) // Enforce max length
}

// Validate and sanitize search input
export function validateAndSanitizeSearch(query: string): string {
  const sanitized = sanitizeSearchQuery(query)
  if (sanitized.length === 0) {
    throw new Error('Search query cannot be empty after sanitization')
  }
  return sanitized
}

