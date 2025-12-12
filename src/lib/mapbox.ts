//src/lib/mapbox.ts
import mapboxgl from 'mapbox-gl'
import { Trail, MapMarker } from '@/types'
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'
import { logger } from './logger'

function createTrailPopupContent(args: {
  title: string
  subtitle: string
  href: string
  linkText: string
}): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'p-2'

  const h3 = document.createElement('h3')
  h3.className = 'font-semibold text-sm'
  h3.textContent = args.title
  wrapper.appendChild(h3)

  const p = document.createElement('p')
  p.className = 'text-xs text-gray-600 mt-1'
  p.textContent = args.subtitle
  wrapper.appendChild(p)

  const a = document.createElement('a')
  a.className = 'text-blue-600 text-xs hover:underline'
  a.href = args.href
  a.textContent = args.linkText
  wrapper.appendChild(a)

  return wrapper
}

function createSimplePopupContent(label: string): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'p-1'
  const strong = document.createElement('strong')
  strong.textContent = label
  wrapper.appendChild(strong)
  return wrapper
}

// Initialize Mapbox
export function initializeMapbox() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  if (typeof window !== 'undefined' && token) {
    mapboxgl.accessToken = token
  } else {
    // Keep this as a plain console error; tests expect this exact message
    console.error('Mapbox access token is missing or invalid')
    logger.error('Mapbox access token is missing or invalid')
  }
}

// Create map instance
export function createMap(container: string | HTMLElement, options: Omit<mapboxgl.MapboxOptions, 'container'> = {}) {
  initializeMapbox()

  const defaultOptions: mapboxgl.MapboxOptions = {
    container,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [73.0479, 33.6844], // Pakistan center
    zoom: 6,
    ...options
  }

  return new mapboxgl.Map(defaultOptions)
}

// Add trail markers to map
export function addTrailMarkers(map: mapboxgl.Map, trails: Trail[]): MapMarker[] {
  const markers: MapMarker[] = []
  
  trails.forEach(trail => {
    if (trail.start_point) {
      new mapboxgl.Marker({
        color: getDifficultyColor(trail.difficulty)
      })
        .setLngLat([trail.start_point.lng, trail.start_point.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setDOMContent(
              createTrailPopupContent({
                title: trail.title,
                subtitle: `${trail.distance_km}km • ${trail.difficulty}`,
                href: `/trails/${trail.slug}`,
                linkText: 'View Details',
              })
            )
        )
        .addTo(map)
      
      markers.push({
        id: trail.id,
        position: [trail.start_point.lng, trail.start_point.lat],
        type: 'trail',
        title: trail.title,
        description: trail.description,
        difficulty: trail.difficulty,
        distance: trail.distance_km
      })
    }
  })
  
  return markers
}

// Add trail route to map
export function addTrailRoute(map: mapboxgl.Map, trail: Trail) {
  if (!trail.geojson) return
  
  // Add source
  if (!map.getSource('trail-route')) {
    map.addSource('trail-route', {
      type: 'geojson',
      data: trail.geojson
    })
  } else {
    (map.getSource('trail-route') as mapboxgl.GeoJSONSource).setData(trail.geojson)
  }
  
  // Add layer
  if (!map.getLayer('trail-route-line')) {
    map.addLayer({
      id: 'trail-route-line',
      type: 'line',
      source: 'trail-route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#2E5A32',
        'line-width': 4
      }
    })
  }
  
  // Add start/end markers
  if (trail.start_point) {
    new mapboxgl.Marker({ color: '#22c55e' })
      .setLngLat([trail.start_point.lng, trail.start_point.lat])
      .setPopup(new mapboxgl.Popup().setDOMContent(createSimplePopupContent('Start')))
      .addTo(map)
  }
  
  if (trail.end_point) {
    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([trail.end_point.lng, trail.end_point.lat])
      .setPopup(new mapboxgl.Popup().setDOMContent(createSimplePopupContent('End')))
      .addTo(map)
  }
}

// Fit map to trail bounds
export function fitMapToTrail(map: mapboxgl.Map, trail: Trail) {
  if (!trail.start_point || !trail.end_point) return
  
  const bounds = new mapboxgl.LngLatBounds()
  bounds.extend([trail.start_point.lng, trail.start_point.lat])
  bounds.extend([trail.end_point.lng, trail.end_point.lat])
  
  map.fitBounds(bounds, {
    padding: 50,
    maxZoom: 15
  })
}

// Get difficulty color for markers
function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return '#22c55e'
    case 'moderate':
      return '#f59e0b'
    case 'hard':
      return '#f97316'
    case 'expert':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

// Create cluster markers for multiple trails
export function createTrailClusters(map: mapboxgl.Map, trails: Trail[]) {
  const geojson = {
    type: 'FeatureCollection',
    features: trails.map(trail => ({
      type: 'Feature',
      properties: {
        id: trail.id,
        title: trail.title,
        difficulty: trail.difficulty,
        distance: trail.distance_km,
        slug: trail.slug
      },
      geometry: {
        type: 'Point',
        coordinates: [trail.start_point.lng, trail.start_point.lat]
      }
    }))
  }
  
  // Add source
  map.addSource('trails', {
    type: 'geojson',
    data: geojson as FeatureCollection<Geometry, GeoJsonProperties>,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  })
  
  // Add cluster circles
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'trails',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#2E5A32',
      'circle-radius': 20,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff'
    }
  })
  
  // Add cluster count labels
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'trails',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  })
  
  // Add individual trail markers
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'trails',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': [
        'case',
        ['==', ['get', 'difficulty'], 'easy'], '#22c55e',
        ['==', ['get', 'difficulty'], 'moderate'], '#f59e0b',
        ['==', ['get', 'difficulty'], 'hard'], '#f97316',
        ['==', ['get', 'difficulty'], 'expert'], '#ef4444',
        '#6b7280'
      ],
      'circle-radius': 8,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff'
    }
  })
  
  // Add click handlers
  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });
  
    if (!features.length || !features[0].properties) return;
  
    const clusterId = features[0].properties.cluster_id;
    if (typeof clusterId !== 'number') return;
  
    (map.getSource('trails') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
      clusterId,
      (err, zoom) => {
        if (err || typeof zoom !== 'number') return;
  
        const geom = features[0].geometry;
        if (geom.type === 'Point') {
          map.easeTo({
            center: geom.coordinates as [number, number],
            zoom
          });
        }
      }
    );
  });
  
  
  map.on('click', 'unclustered-point', (e) => {
    if (!e.features || e.features.length === 0) return
  
    const feature = e.features[0]
    if (!feature.properties || !feature.geometry) return
  
    // Ensure geometry is Point
    if (feature.geometry.type !== 'Point') return
    const coordinates = [...feature.geometry.coordinates] as [number, number]
  
    const properties = feature.properties as {
      title: string
      distance: number
      difficulty: string
      slug: string
    }
  
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setDOMContent(
        createTrailPopupContent({
          title: properties.title,
          subtitle: `${properties.distance}km • ${properties.difficulty}`,
          href: `/trails/${properties.slug}`,
          linkText: 'View Details',
        })
      )
      .addTo(map)
  })
  
  // Change cursor on hover
  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = ''
  })
}
