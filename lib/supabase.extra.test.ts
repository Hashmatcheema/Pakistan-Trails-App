import { describe, it, expect, vi, beforeEach } from 'vitest'

// Ensure env vars exist for module import
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ __client: true })),
}))

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({ __browser: true })),
  createServerClient: vi.fn(() => ({ __server: true, auth: { getUser: vi.fn() } })),
}))

vi.mock('next/headers', async () => {
  const mock = await import('../__mocks__/next-headers')
  return {
    cookies: mock.cookies,
  }
})

describe('supabase helpers', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('createStaticSupabaseClient returns a client', async () => {
    const { createStaticSupabaseClient } = await import('../src/lib/supabase')
    const client = createStaticSupabaseClient()
    expect(client).toEqual({ __client: true })
  })

  it('createBrowserSupabaseClient returns a client', async () => {
    const { createBrowserSupabaseClient } = await import('../src/lib/supabase')
    const client = createBrowserSupabaseClient()
    expect(client).toEqual({ __browser: true })
  })

  it('createServerSupabaseClient returns a server client when cookies available', async () => {
    const { createServerSupabaseClient } = await import('../src/lib/supabase')
    const client = await createServerSupabaseClient()
    expect(client).toMatchObject({ __server: true })
  })

  it('createServerSupabaseClient falls back when cookies throws', async () => {
    const headers = await import('next/headers')
    ;(headers.cookies as any).mockImplementationOnce(async () => {
      throw new Error('no cookies')
    })

    const { createServerSupabaseClient } = await import('../src/lib/supabase')
    const client = await createServerSupabaseClient()
    // Falls back to createClient
    expect(client).toEqual({ __client: true })
  })
})


