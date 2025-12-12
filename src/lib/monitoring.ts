//src/lib/monitoring.ts
// Error tracking and monitoring utilities

import { logger } from './logger'
import { shouldLogError } from './errors'
import * as Sentry from '@sentry/nextjs'

// Placeholder for Sentry integration
// To enable: npm install @sentry/nextjs
// Then uncomment and configure:

/*
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',
})
*/

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  // Log error
  if (shouldLogError(error)) {
    logger.error('Exception captured', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : String(error),
      context,
    })
  }

  // Send to Sentry (no-op if not enabled / not configured)
  try {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    })
  } catch {
    // Never let monitoring crash the app
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, unknown>): void {
  logger[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'info'](message, context)

  try {
    Sentry.captureMessage(message, {
      level,
      contexts: {
        custom: context,
      },
    })
  } catch {
    // Never let monitoring crash the app
  }
}

export function setUserContext(userId: string, email?: string): void {
  logger.info('User context set', { userId, email })

  try {
    Sentry.setUser({ id: userId, email })
  } catch {
    // Never let monitoring crash the app
  }
}

export function addBreadcrumb(message: string, category: string, data?: Record<string, unknown>): void {
  logger.debug('Breadcrumb', { message, category, data })

  try {
    Sentry.addBreadcrumb({ message, category, data, level: 'info' })
  } catch {
    // Never let monitoring crash the app
  }
}

