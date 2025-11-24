// Set environment variables BEFORE any imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockSupabaseClient } from '../__mocks__/supabase'

// Mock the supabase module
vi.mock('../src/lib/supabase', () => {
  const mockClient = createMockSupabaseClient()
  
  return {
    createServerSupabaseClient: vi.fn().mockResolvedValue(mockClient),
    createStaticSupabaseClient: vi.fn().mockReturnValue(mockClient),
    TABLES: {
      REGIONS: 'regions',
      TRAILS: 'trails',
      GUIDES: 'guides',
      ITINERARIES: 'itineraries',
      BLOG_POSTS: 'blog_posts',
      VIDEO_SERIES: 'video_series',
      USERS: 'users',
    },
  }
})

import * as database from '../src/lib/database'

describe('getTrails', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(async () => {
    const { createServerSupabaseClient } = await import('../src/lib/supabase')
    mockClient = await createServerSupabaseClient() as any
    mockClient._clearMocks()
  })

  it('fetches trails without filters', async () => {
    const mockTrails = [
      { id: '1', title: 'Trail 1', published_at: '2024-01-01' },
      { id: '2', title: 'Trail 2', published_at: '2024-01-02' },
    ]
    mockClient._setMockData('trails', mockTrails)
    mockClient._setMockCount('trails', 2)

    const result = await database.getTrails()

    expect(result.data).toEqual(mockTrails)
    expect(result.pagination.total).toBe(2)
    expect(result.pagination.page).toBe(1)
  })

  it('applies region filter', async () => {
    const mockTrails = [
      { id: '1', title: 'Trail 1', region_id: 'region-1', published_at: '2024-01-01' },
    ]
    mockClient._setMockData('trails', mockTrails)
    mockClient._setMockCount('trails', 1)

    await database.getTrails({ region: 'region-1' })

    expect(mockClient.from).toHaveBeenCalledWith('trails')
  })

  it('applies difficulty filter', async () => {
    const mockTrails = [
      { id: '1', title: 'Trail 1', difficulty: 'easy', published_at: '2024-01-01' },
    ]
    mockClient._setMockData('trails', mockTrails)
    mockClient._setMockCount('trails', 1)

    await database.getTrails({ difficulty: 'easy' })

    expect(mockClient.from).toHaveBeenCalledWith('trails')
  })

  it('handles pagination correctly', async () => {
    const mockTrails = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Trail ${i + 1}`,
      published_at: '2024-01-01',
    }))
    mockClient._setMockData('trails', mockTrails)
    mockClient._setMockCount('trails', 25)

    const result = await database.getTrails(undefined, 2, 10)

    expect(result.pagination.page).toBe(2)
    expect(result.pagination.limit).toBe(10)
    expect(result.pagination.total).toBe(25)
    expect(result.pagination.totalPages).toBe(3)
  })

  it('returns empty array on error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockClient._setMockError('trails', { message: 'Database error' })

    const result = await database.getTrails()

    expect(result.data).toEqual([])
    expect(result.pagination.total).toBe(0)
    consoleSpy.mockRestore()
  })
})

describe('getTrailBySlug', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(async () => {
    const { createServerSupabaseClient } = await import('../src/lib/supabase')
    mockClient = await createServerSupabaseClient() as any
    mockClient._clearMocks()
  })

  it('fetches trail by slug', async () => {
    const mockTrail = {
      id: '1',
      slug: 'test-trail',
      title: 'Test Trail',
      published_at: '2024-01-01',
    }
    mockClient._setMockData('trails', [mockTrail])

    const result = await database.getTrailBySlug('test-trail')

    expect(result).toEqual(mockTrail)
  })

  it('returns null when trail not found', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockClient._setMockError('trails', { message: 'Not found' })

    const result = await database.getTrailBySlug('non-existent')

    expect(result).toBeNull()
    consoleSpy.mockRestore()
  })
})

describe('getFeaturedTrails', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(async () => {
    const { createServerSupabaseClient } = await import('../src/lib/supabase')
    mockClient = await createServerSupabaseClient() as any
    mockClient._clearMocks()
  })

  it('fetches featured trails', async () => {
    const mockTrails = [
      { id: '1', title: 'Featured Trail 1', is_featured: true, published_at: '2024-01-01' },
      { id: '2', title: 'Featured Trail 2', is_featured: true, published_at: '2024-01-02' },
    ]
    mockClient._setMockData('trails', mockTrails)

    const result = await database.getFeaturedTrails(2)

    expect(result).toEqual(mockTrails)
  })

  it('returns empty array on error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockClient._setMockError('trails', { message: 'Database error' })

    const result = await database.getFeaturedTrails()

    expect(result).toEqual([])
    consoleSpy.mockRestore()
  })
})

describe('getGuides', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(async () => {
    const { createServerSupabaseClient } = await import('../src/lib/supabase')
    mockClient = await createServerSupabaseClient() as any
    mockClient._clearMocks()
  })

  it('fetches guides with pagination', async () => {
    const mockGuides = [
      { id: '1', title: 'Guide 1', published_at: '2024-01-01' },
      { id: '2', title: 'Guide 2', published_at: '2024-01-02' },
    ]
    mockClient._setMockData('guides', mockGuides)
    mockClient._setMockCount('guides', 2)

    const result = await database.getGuides(1, 12)

    expect(result.data).toEqual(mockGuides)
    expect(result.pagination.total).toBe(2)
  })

  it('applies region filter', async () => {
    const mockGuides = [
      { id: '1', title: 'Guide 1', region_id: 'region-1', published_at: '2024-01-01' },
    ]
    mockClient._setMockData('guides', mockGuides)
    mockClient._setMockCount('guides', 1)

    await database.getGuides(1, 12, 'region-1')

    expect(mockClient.from).toHaveBeenCalledWith('guides')
  })
})

describe('getRegions', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(async () => {
    const { createServerSupabaseClient } = await import('../src/lib/supabase')
    mockClient = await createServerSupabaseClient() as any
    mockClient._clearMocks()
  })

  it('fetches all regions', async () => {
    const mockRegions = [
      { id: '1', name: 'Hunza', slug: 'hunza' },
      { id: '2', name: 'Skardu', slug: 'skardu' },
    ]
    mockClient._setMockData('regions', mockRegions)

    const result = await database.getRegions()

    expect(result).toEqual(mockRegions)
  })

  it('returns empty array on error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockClient._setMockError('regions', { message: 'Database error' })

    const result = await database.getRegions()

    expect(result).toEqual([])
    consoleSpy.mockRestore()
  })
})

describe('searchContent', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(async () => {
    const { createServerSupabaseClient } = await import('../src/lib/supabase')
    mockClient = await createServerSupabaseClient() as any
    mockClient._clearMocks()
  })

  it('searches across multiple content types', async () => {
    const mockTrails = [
      { id: '1', title: 'Trail', slug: 'trail-1', published_at: '2024-01-01' },
    ]
    const mockGuides = [
      { id: '2', title: 'Guide', slug: 'guide-1', published_at: '2024-01-02' },
    ]
    const mockPosts = [
      { id: '3', title: 'Post', slug: 'post-1', published_at: '2024-01-03' },
    ]
    const mockItineraries = [
      { id: '4', title: 'Itinerary', slug: 'itinerary-1', published_at: '2024-01-04' },
    ]

    mockClient._setMockData('trails', mockTrails)
    mockClient._setMockData('guides', mockGuides)
    mockClient._setMockData('blog_posts', mockPosts)
    mockClient._setMockData('itineraries', mockItineraries)

    const result = await database.searchContent('test', 20)

    expect(result.length).toBeGreaterThan(0)
    expect(mockClient.from).toHaveBeenCalledWith('trails')
    expect(mockClient.from).toHaveBeenCalledWith('guides')
    expect(mockClient.from).toHaveBeenCalledWith('blog_posts')
    expect(mockClient.from).toHaveBeenCalledWith('itineraries')
  })

  it('returns empty array when no results found', async () => {
    mockClient._setMockData('trails', [])
    mockClient._setMockData('guides', [])
    mockClient._setMockData('blog_posts', [])
    mockClient._setMockData('itineraries', [])

    const result = await database.searchContent('nonexistent', 20)

    expect(result).toEqual([])
  })
})

