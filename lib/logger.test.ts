import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const originalEnv = process.env

describe('logger', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('logs debug only in development', async () => {
    process.env.NODE_ENV = 'development'
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

    const { logger } = await import('../src/lib/logger')
    logger.debug('hello')

    expect(debugSpy).toHaveBeenCalled()
    debugSpy.mockRestore()
  })

  it('does not log debug in production', async () => {
    process.env.NODE_ENV = 'production'
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

    const { logger } = await import('../src/lib/logger')
    logger.debug('hello')

    expect(debugSpy).not.toHaveBeenCalled()
    debugSpy.mockRestore()
  })
})


