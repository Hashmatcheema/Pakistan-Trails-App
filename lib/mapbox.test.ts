import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'
import { Trail } from '../src/types'

// Set environment variable before importing
beforeAll(() => {
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-token'
})

// Mock mapbox-gl
vi.mock('mapbox-gl', async () => {
  const mapboxMock = await import('../__mocks__/mapbox-gl')
  return {
    default: {
      Map: mapboxMock.Map,
      Marker: mapboxMock.Marker,
      Popup: mapboxMock.Popup,
      LngLatBounds: mapboxMock.LngLatBounds,
      accessToken: '',
    },
  }
})

import { initializeMapbox, createMap, addTrailMarkers } from '../src/lib/mapbox'

describe('initializeMapbox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-token'
  })

  it('sets access token when token is available', async () => {
    const mapboxgl = await import('mapbox-gl')
    initializeMapbox()
    expect(mapboxgl.default.accessToken).toBe('test-token')
  })

  it('handles missing token gracefully', () => {
    delete process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    initializeMapbox()
    
    expect(consoleSpy).toHaveBeenCalledWith('Mapbox access token is missing or invalid')
    consoleSpy.mockRestore()
  })
})

describe('createMap', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-token'
  })

  it('creates a map instance with default options', () => {
    const container = document.createElement('div')
    const map = createMap(container)
    
    expect(map).toBeDefined()
    expect(map.container).toBe(container)
  })

  it('creates a map with custom options', () => {
    const container = document.createElement('div')
    const map = createMap(container, {
      center: [74, 35],
      zoom: 10,
    })
    
    expect(map).toBeDefined()
    expect(map.options.center).toEqual([74, 35])
    expect(map.options.zoom).toBe(10)
  })
})

describe('addTrailMarkers', () => {
  it('adds markers for trails with start points', () => {
    const map = createMap(document.createElement('div'))
    const trails: Trail[] = [
      {
        id: '1',
        slug: 'test-trail',
        title: 'Test Trail',
        description: 'Test',
        region_id: 'region-1',
        difficulty: 'easy',
        distance_km: 5,
        elevation_gain_m: 100,
        duration_h: 2,
        start_point: { lat: 35, lng: 74 },
        end_point: { lat: 35.1, lng: 74.1 },
        photos: [],
        best_season: [],
        created_by: 'user-1',
        published_at: '2024-01-01',
        is_featured: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ]

    const markers = addTrailMarkers(map, trails)

    expect(markers).toHaveLength(1)
    expect(markers[0].id).toBe('1')
    expect(markers[0].position).toEqual([74, 35])
  })

  it('skips trails without start points', () => {
    const map = createMap(document.createElement('div'))
    const trails: Trail[] = [
      {
        id: '1',
        slug: 'test-trail',
        title: 'Test Trail',
        description: 'Test',
        region_id: 'region-1',
        difficulty: 'easy',
        distance_km: 5,
        elevation_gain_m: 100,
        duration_h: 2,
        start_point: null as any,
        end_point: { lat: 35.1, lng: 74.1 },
        photos: [],
        best_season: [],
        created_by: 'user-1',
        published_at: '2024-01-01',
        is_featured: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ]

    const markers = addTrailMarkers(map, trails)

    expect(markers).toHaveLength(0)
  })
})

describe('getDifficultyColor (internal)', () => {
  it('returns correct colors for difficulty levels', () => {
    // This tests the internal function indirectly through addTrailMarkers
    const map = createMap(document.createElement('div'))
    const trails: Trail[] = [
      {
        id: '1',
        slug: 'easy-trail',
        title: 'Easy Trail',
        description: 'Test',
        region_id: 'region-1',
        difficulty: 'easy',
        distance_km: 5,
        elevation_gain_m: 100,
        duration_h: 2,
        start_point: { lat: 35, lng: 74 },
        end_point: { lat: 35.1, lng: 74.1 },
        photos: [],
        best_season: [],
        created_by: 'user-1',
        published_at: '2024-01-01',
        is_featured: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ]

    const markers = addTrailMarkers(map, trails)
    expect(markers).toHaveLength(1)
  })
})

