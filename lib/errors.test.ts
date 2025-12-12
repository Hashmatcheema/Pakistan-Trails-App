//lib/errors.test.ts
import { describe, it, expect } from 'vitest'
import {
  DatabaseError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  RateLimitError,
  formatErrorResponse,
  shouldLogError,
} from '../src/lib/errors'

describe('Error Classes', () => {
  describe('DatabaseError', () => {
    it('should create error with message and context', () => {
      const error = new DatabaseError('Database connection failed', { table: 'trails' })
      expect(error.message).toBe('Database connection failed')
      expect(error.context).toEqual({ table: 'trails' })
      expect(error.name).toBe('DatabaseError')
    })
  })

  describe('ValidationError', () => {
    it('should create error with message, field, and value', () => {
      const error = new ValidationError('Invalid input', 'email', 'invalid@')
      expect(error.message).toBe('Invalid input')
      expect(error.field).toBe('email')
      expect(error.value).toBe('invalid@')
      expect(error.name).toBe('ValidationError')
    })
  })

  describe('NotFoundError', () => {
    it('should create error with message, resource, and identifier', () => {
      const error = new NotFoundError('Resource not found', 'trail', 'test-slug')
      expect(error.message).toBe('Resource not found')
      expect(error.resource).toBe('trail')
      expect(error.identifier).toBe('test-slug')
      expect(error.name).toBe('NotFoundError')
    })
  })

  describe('UnauthorizedError', () => {
    it('should create error with default message', () => {
      const error = new UnauthorizedError()
      expect(error.message).toBe('Unauthorized access')
      expect(error.name).toBe('UnauthorizedError')
    })

    it('should create error with custom message', () => {
      const error = new UnauthorizedError('Custom message')
      expect(error.message).toBe('Custom message')
    })
  })

  describe('RateLimitError', () => {
    it('should create error with message and retryAfter', () => {
      const error = new RateLimitError('Too many requests', 60)
      expect(error.message).toBe('Too many requests')
      expect(error.retryAfter).toBe(60)
      expect(error.name).toBe('RateLimitError')
    })
  })
})

describe('formatErrorResponse', () => {
  it('should format ValidationError', () => {
    const error = new ValidationError('Invalid input', 'email', 'test')
    const response = formatErrorResponse(error)
    expect(response.success).toBe(false)
    expect(response.error.name).toBe('ValidationError')
    expect(response.error.message).toBe('Invalid input')
    expect(response.error.field).toBe('email')
  })

  it('should format NotFoundError', () => {
    const error = new NotFoundError('Not found', 'trail', 'slug')
    const response = formatErrorResponse(error)
    expect(response.success).toBe(false)
    expect(response.error.name).toBe('NotFoundError')
    expect(response.error.resource).toBe('trail')
  })

  it('should format RateLimitError', () => {
    const error = new RateLimitError('Rate limit exceeded', 60)
    const response = formatErrorResponse(error)
    expect(response.success).toBe(false)
    expect(response.error.name).toBe('RateLimitError')
    expect(response.error.retryAfter).toBe(60)
  })

  it('should format DatabaseError', () => {
    const error = new DatabaseError('Database error')
    const response = formatErrorResponse(error)
    expect(response.success).toBe(false)
    expect(response.error.name).toBe('DatabaseError')
  })

  it('should format generic Error', () => {
    const error = new Error('Generic error')
    const response = formatErrorResponse(error)
    expect(response.success).toBe(false)
    expect(response.error.name).toBe('Error')
    expect(response.error.message).toBe('Generic error')
  })

  it('should handle unknown error types', () => {
    const response = formatErrorResponse('string error')
    expect(response.success).toBe(false)
    expect(response.error.name).toBe('UnknownError')
  })
})

describe('shouldLogError', () => {
  it('should return false for ValidationError', () => {
    const error = new ValidationError('Invalid input')
    expect(shouldLogError(error)).toBe(false)
  })

  it('should return true for DatabaseError', () => {
    const error = new DatabaseError('Database error')
    expect(shouldLogError(error)).toBe(true)
  })

  it('should return true for generic Error', () => {
    const error = new Error('Generic error')
    expect(shouldLogError(error)).toBe(true)
  })
})

