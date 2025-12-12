//src/lib/errors.ts
// Custom error classes for better error handling

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'DatabaseError'
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {
    super(message)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string,
    public readonly resource?: string,
    public readonly identifier?: string
  ) {
    super(message)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number
  ) {
    super(message)
    this.name = 'RateLimitError'
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

// Error response formatter for API routes
export interface ErrorResponse {
  success: false
  error: {
    name: string
    message: string
    field?: string
    resource?: string
    retryAfter?: number
  }
}

export function formatErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: {
        name: error.name,
        message: error.message,
        field: error.field,
      },
    }
  }

  if (error instanceof NotFoundError) {
    return {
      success: false,
      error: {
        name: error.name,
        message: error.message,
        resource: error.resource,
      },
    }
  }

  if (error instanceof RateLimitError) {
    return {
      success: false,
      error: {
        name: error.name,
        message: error.message,
        retryAfter: error.retryAfter,
      },
    }
  }

  if (error instanceof DatabaseError) {
    return {
      success: false,
      error: {
        name: error.name,
        message: error.message,
      },
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: {
        name: error.name || 'Error',
        message: error.message,
      },
    }
  }

  return {
    success: false,
    error: {
      name: 'UnknownError',
      message: 'An unknown error occurred',
    },
  }
}

// Check if error should be logged (not user-facing validation errors)
export function shouldLogError(error: unknown): boolean {
  if (error instanceof ValidationError) {
    return false // Don't log validation errors
  }
  return true
}

