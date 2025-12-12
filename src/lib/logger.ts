//src/lib/logger.ts
// Structured logging utility

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    }

    if (this.isDevelopment) {
      // Pretty print for development
      return JSON.stringify(logEntry, null, 2)
    }

    // JSON format for production
    return JSON.stringify(logEntry)
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const formatted = this.formatMessage(level, message, context)
    
    switch (level) {
      case 'error':
        console.error(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'info':
        console.info(formatted)
        break
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formatted)
        }
        break
    }
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }
}

// Export singleton instance
export const logger = new Logger()

