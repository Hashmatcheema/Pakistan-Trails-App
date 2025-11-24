/**
 * Mock Next.js cookies API for testing
 */
import { vi } from 'vitest'

export const cookies = vi.fn(async () => {
  const cookieStore = new Map<string, string>()

  return {
    get: vi.fn((name: string) => {
      const value = cookieStore.get(name)
      return value ? { name, value } : undefined
    }),
    set: vi.fn(({ name, value }: { name: string; value: string }) => {
      cookieStore.set(name, value)
    }),
    has: vi.fn((name: string) => cookieStore.has(name)),
    delete: vi.fn((name: string) => {
      cookieStore.delete(name)
    }),
    getAll: vi.fn(() => {
      return Array.from(cookieStore.entries()).map(([name, value]) => ({ name, value }))
    }),
  }
})

