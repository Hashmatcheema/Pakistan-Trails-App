// Set environment variables BEFORE any imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockSupabaseClient } from '../__mocks__/supabase'

vi.mock('../src/lib/supabase', () => {
  const mockClient = createMockSupabaseClient()
  return {
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

describe('database extra coverage', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(async () => {
    const { createStaticSupabaseClient } = await import('../src/lib/supabase')
    mockClient = createStaticSupabaseClient() as ReturnType<typeof createMockSupabaseClient>
    mockClient._clearMocks()
    vi.clearAllMocks()
  })

  it('getGuideBySlug returns a guide', async () => {
    const guide = { id: '1', slug: 'g', title: 'Guide', excerpt: 'x', published_at: '2024-01-01' }
    mockClient._setMockData('guides', [guide])
    const res = await database.getGuideBySlug('g')
    expect(res).toEqual(guide)
  })

  it('getGuideBySlug returns null on error', async () => {
    mockClient._setMockError('guides', { code: 'X', message: 'nope' })
    const res = await database.getGuideBySlug('g')
    expect(res).toBeNull()
  })

  it('getFeaturedGuides returns [] on error', async () => {
    mockClient._setMockError('guides', { message: 'Database error' })
    const res = await database.getFeaturedGuides(3)
    expect(res).toEqual([])
  })

  it('getItineraries returns paginated data', async () => {
    mockClient._setMockData('itineraries', [
      { id: '1', title: 'I1', published_at: '2024-01-01' },
      { id: '2', title: 'I2', published_at: '2024-01-02' },
    ])
    mockClient._setMockCount('itineraries', 2)

    const res = await database.getItineraries(1, 12)
    expect(res.data).toHaveLength(2)
    expect(res.pagination.total).toBe(2)
  })

  it('getItineraryBySlug returns null on error', async () => {
    mockClient._setMockError('itineraries', { message: 'not found' })
    const res = await database.getItineraryBySlug('missing')
    expect(res).toBeNull()
  })

  it('getBlogPosts returns empty on error', async () => {
    mockClient._setMockError('blog_posts', { message: 'Database error' })
    const res = await database.getBlogPosts(1, 12)
    expect(res.data).toEqual([])
    expect(res.pagination.total).toBe(0)
  })

  it('getBlogPostBySlug returns null on error', async () => {
    mockClient._setMockError('blog_posts', { message: 'Database error' })
    const res = await database.getBlogPostBySlug('missing')
    expect(res).toBeNull()
  })

  it('getFeaturedBlogPosts returns [] on error', async () => {
    mockClient._setMockError('blog_posts', { message: 'Database error' })
    const res = await database.getFeaturedBlogPosts(3)
    expect(res).toEqual([])
  })

  it('getTrailsForStatic returns slugs', async () => {
    mockClient._setMockData('trails', [{ slug: 'a' }, { slug: 'b' }])
    const res = await database.getTrailsForStatic()
    expect(res).toEqual([{ slug: 'a' }, { slug: 'b' }])
  })

  it('getTrails applies additional filters (distance/elevation/search)', async () => {
    mockClient._setMockData('trails', [{ id: '1', title: 'T', published_at: '2024-01-01' }])
    mockClient._setMockCount('trails', 1)

    const res = await database.getTrails(
      { max_distance: 10, min_elevation: 100, max_elevation: 200, search: 'hello', difficulty: 'easy' },
      1,
      12
    )

    expect(res.data).toHaveLength(1)
  })

  it('getTrailBySlug returns null for invalid slug', async () => {
    const res = await database.getTrailBySlug('NOT A VALID SLUG')
    expect(res).toBeNull()
  })

  it('searchContent returns [] when guides search errors', async () => {
    mockClient._setMockError('guides', { message: 'Database error' })
    const res = await database.searchContent('hello', 20)
    expect(res).toEqual([])
  })

  it('searchContent returns [] when blog_posts search errors', async () => {
    mockClient._setMockError('blog_posts', { message: 'Database error' })
    const res = await database.searchContent('hello', 20)
    expect(res).toEqual([])
  })

  it('searchContent returns [] when itineraries search errors', async () => {
    mockClient._setMockError('itineraries', { message: 'Database error' })
    const res = await database.searchContent('hello', 20)
    expect(res).toEqual([])
  })

  it('searchContent returns [] when a category search errors', async () => {
    mockClient._setMockError('trails', { message: 'Database error' })
    const res = await database.searchContent('hello', 20)
    expect(res).toEqual([])
  })
})


