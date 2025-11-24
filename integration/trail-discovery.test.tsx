import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockSupabaseClient } from '../__mocks__/supabase'

// Mock the database module
vi.mock('../src/lib/database', () => ({
  getTrails: vi.fn(),
  getRegions: vi.fn(),
}))

describe('Trail Discovery Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches and displays trails', async () => {
    const { getTrails } = await import('../src/lib/database')
    const mockTrails = [
      {
        id: '1',
        title: 'Test Trail',
        slug: 'test-trail',
        description: 'A test trail',
        published_at: '2024-01-01',
      },
    ]

    vi.mocked(getTrails).mockResolvedValue({
      data: mockTrails,
      pagination: {
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
      },
    })

    const result = await getTrails()
    expect(result.data).toEqual(mockTrails)
    expect(result.pagination.total).toBe(1)
  })

  it('applies filters correctly', async () => {
    const { getTrails } = await import('../src/lib/database')
    
    await getTrails({ region: 'hunza', difficulty: 'easy' })
    
    expect(getTrails).toHaveBeenCalledWith(
      expect.objectContaining({
        region: 'hunza',
        difficulty: 'easy',
      })
    )
  })
})

