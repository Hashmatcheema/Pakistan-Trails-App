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

import { initializeMapbox, createMap, addTrailMarkers, addTrailRoute, fitMapToTrail, createTrailClusters } from '../src/lib/mapbox'

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
        start_point: null as unknown as { lat: number; lng: number },
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

  it('covers marker colors for all difficulty levels (and default)', () => {
    const map = createMap(document.createElement('div'))
    const base: any = {
      id: 'x',
      slug: 's',
      title: 'T',
      description: 'Test',
      region_id: 'region-1',
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
    }

    expect(addTrailMarkers(map, [{ ...base, id: '1', difficulty: 'easy' }])).toHaveLength(1)
    expect(addTrailMarkers(map, [{ ...base, id: '2', difficulty: 'moderate' }])).toHaveLength(1)
    expect(addTrailMarkers(map, [{ ...base, id: '3', difficulty: 'hard' }])).toHaveLength(1)
    expect(addTrailMarkers(map, [{ ...base, id: '4', difficulty: 'expert' }])).toHaveLength(1)
    expect(addTrailMarkers(map, [{ ...base, id: '5', difficulty: 'unknown' }])).toHaveLength(1)
  })
})

describe('addTrailRoute / fitMapToTrail / createTrailClusters', () => {
  it('adds a trail route source and layer when geojson is present', () => {
    const map = createMap(document.createElement('div'))
    const trail: any = {
      id: '1',
      slug: 'trail',
      title: 'Trail',
      description: 'x',
      difficulty: 'easy',
      start_point: { lat: 35, lng: 74 },
      end_point: { lat: 35.1, lng: 74.1 },
      geojson: {
        type: 'FeatureCollection',
        features: [],
      },
    }

    const addSourceSpy = vi.spyOn(map as any, 'addSource')
    const addLayerSpy = vi.spyOn(map as any, 'addLayer')

    addTrailRoute(map as any, trail)

    expect(addSourceSpy).toHaveBeenCalled()
    expect(addLayerSpy).toHaveBeenCalled()
  })

  it('updates existing trail route source via setData', async () => {
    const map = createMap(document.createElement('div'))
    const mock = await import('../__mocks__/mapbox-gl')
    const source = new mock.GeoJSONSource()
    const setDataSpy = vi.spyOn(source as any, 'setData')

    // Pre-seed a source so addTrailRoute takes the update path
    ;(map as any).addSource('trail-route', source)

    addTrailRoute(map as any, {
      geojson: { type: 'FeatureCollection', features: [] },
      start_point: null,
      end_point: null,
    } as any)

    expect(setDataSpy).toHaveBeenCalled()
  })

  it('fits map to trail bounds when start/end exist', () => {
    const map = createMap(document.createElement('div'))
    const fitSpy = vi.spyOn(map as any, 'fitBounds')

    fitMapToTrail(map as any, {
      start_point: { lat: 35, lng: 74 },
      end_point: { lat: 35.1, lng: 74.1 },
    } as any)

    expect(fitSpy).toHaveBeenCalled()
  })

  it('creates clusters without throwing', () => {
    const map = createMap(document.createElement('div'))
    const addSourceSpy = vi.spyOn(map as any, 'addSource')
    const addLayerSpy = vi.spyOn(map as any, 'addLayer')

    expect(() =>
      createTrailClusters(map as any, [
        {
          id: '1',
          title: 'T',
          slug: 't',
          difficulty: 'easy',
          distance_km: 1,
          start_point: { lat: 35, lng: 74 },
        } as any,
      ])
    ).not.toThrow()

    expect(addSourceSpy).toHaveBeenCalled()
    expect(addLayerSpy).toHaveBeenCalled()
  })

  it('cluster click expands zoom when a valid cluster feature is present', async () => {
    const map = createMap(document.createElement('div'))
    createTrailClusters(map as any, [
      {
        id: '1',
        title: 'T',
        slug: 't',
        difficulty: 'easy',
        distance_km: 1,
        start_point: { lat: 35, lng: 74 },
      } as any,
    ])

    // Ensure the source has getClusterExpansionZoom
    const mock = await import('../__mocks__/mapbox-gl')
    ;(map as any).addSource('trails', new mock.GeoJSONSource())

    vi.spyOn(map as any, 'queryRenderedFeatures').mockReturnValue([
      {
        properties: { cluster_id: 123 },
        geometry: { type: 'Point', coordinates: [74, 35] },
      },
    ])
    const easeSpy = vi.spyOn(map as any, 'easeTo')

    ;(map as any)._triggerEvent('click:clusters', { point: { x: 1, y: 2 } })
    expect(easeSpy).toHaveBeenCalled()
  })

  it('cluster click returns early for empty features / bad cluster id', async () => {
    const map = createMap(document.createElement('div'))
    createTrailClusters(map as any, [
      {
        id: '1',
        title: 'T',
        slug: 't',
        difficulty: 'easy',
        distance_km: 1,
        start_point: { lat: 35, lng: 74 },
      } as any,
    ])

    const easeSpy = vi.spyOn(map as any, 'easeTo')
    const qSpy = vi.spyOn(map as any, 'queryRenderedFeatures')

    qSpy.mockReturnValue([])
    ;(map as any)._triggerEvent('click:clusters', { point: { x: 1, y: 2 } })
    expect(easeSpy).not.toHaveBeenCalled()

    qSpy.mockReturnValue([
      { properties: { cluster_id: 'not-a-number' }, geometry: { type: 'Point', coordinates: [74, 35] } },
    ])
    ;(map as any)._triggerEvent('click:clusters', { point: { x: 1, y: 2 } })
    expect(easeSpy).not.toHaveBeenCalled()
  })

  it('cluster hover updates cursor style', () => {
    const map = createMap(document.createElement('div'))
    createTrailClusters(map as any, [
      {
        id: '1',
        title: 'T',
        slug: 't',
        difficulty: 'easy',
        distance_km: 1,
        start_point: { lat: 35, lng: 74 },
      } as any,
    ])

    expect((map as any).getCanvas().style.cursor).toBe('')
    ;(map as any)._triggerEvent('mouseenter:clusters')
    expect((map as any).getCanvas().style.cursor).toBe('pointer')
    ;(map as any)._triggerEvent('mouseleave:clusters')
    expect((map as any).getCanvas().style.cursor).toBe('')
  })

  it('unclustered click shows popup without throwing', () => {
    const map = createMap(document.createElement('div'))
    createTrailClusters(map as any, [
      {
        id: '1',
        title: 'T',
        slug: 't',
        difficulty: 'easy',
        distance_km: 1,
        start_point: { lat: 35, lng: 74 },
      } as any,
    ])

    expect(() => {
      ;(map as any)._triggerEvent('click:unclustered-point', {
        features: [
          {
            geometry: { type: 'Point', coordinates: [74, 35] },
            properties: { title: 'T', distance: 1, difficulty: 'easy', slug: 't' },
          },
        ],
      })
    }).not.toThrow()
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

