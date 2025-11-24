import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock environment variables
const originalEnv = process.env

describe('Supabase Client Setup', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('throws error when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await expect(async () => {
      await import('../src/lib/supabase')
    }).rejects.toThrow('Missing Supabase environment variables')
  })

  it('throws error when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await expect(async () => {
      await import('../src/lib/supabase')
    }).rejects.toThrow('Missing Supabase environment variables')
  })

  it('creates client when environment variables are set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

    const { supabase } = await import('../src/lib/supabase')
    expect(supabase).toBeDefined()
  })
})

