/**
 * Mock Mapbox GL for testing
 */
import { vi } from 'vitest'

// Mock Mapbox GL Map class
// Use a different name to avoid conflict with JavaScript's Map
type MapStorage = globalThis.Map<string, any>
type FunctionMap = globalThis.Map<string, Function[]>

export class Map {
  container: HTMLElement | string
  options: any
  accessToken: string | null = null
  private sources: MapStorage = new globalThis.Map()
  private layers: MapStorage = new globalThis.Map()
  private markers: any[] = []
  private eventHandlers: FunctionMap = new globalThis.Map()
  private canvas = {
    style: {
      cursor: '',
    },
  }

  constructor(options: any) {
    this.container = options.container
    this.options = options
  }

  on(event: string, layer: string | Function, handler?: Function) {
    const key = typeof layer === 'string' ? `${event}:${layer}` : event
    const callback = typeof layer === 'function' ? layer : handler
    
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, [])
    }
    this.eventHandlers.get(key)?.push(callback!)
  }

  off(event: string, layer?: string | Function, handler?: Function) {
    const key = layer ? `${event}:${layer}` : event
    this.eventHandlers.delete(key)
  }

  getSource(id: string) {
    return this.sources.get(id) || null
  }

  getLayer(id: string) {
    return this.layers.get(id) || null
  }

  addSource(id: string, source: any) {
    this.sources.set(id, source)
  }

  addLayer(layer: any) {
    this.layers.set(layer.id, layer)
  }

  removeSource(id: string) {
    this.sources.delete(id)
  }

  removeLayer(id: string) {
    this.layers.delete(id)
  }

  queryRenderedFeatures(point: any, options?: any) {
    return []
  }

  fitBounds(bounds: any, options?: any) {
    return this
  }

  easeTo(options: any) {
    return this
  }

  remove() {
    this.sources.clear()
    this.layers.clear()
    this.markers = []
    this.eventHandlers.clear()
  }

  getCanvas() {
    return this.canvas
  }

  // Test helpers
  _triggerEvent(event: string, data?: any) {
    const handlers = this.eventHandlers.get(event) || []
    handlers.forEach((handler) => handler(data))
  }
}

// Mock Marker class
export class Marker {
  private lngLat: [number, number] = [0, 0]
  private popup: Popup | null = null
  private color: string = '#000000'
  private map: Map | null = null

  constructor(options?: { color?: string }) {
    if (options?.color) {
      this.color = options.color
    }
  }

  setLngLat(coords: [number, number]) {
    this.lngLat = coords
    return this
  }

  setPopup(popup: Popup) {
    this.popup = popup
    return this
  }

  addTo(map: Map) {
    this.map = map
    return this
  }

  remove() {
    this.map = null
  }
}

// Mock Popup class
export class Popup {
  private html: string = ''
  private lngLat: [number, number] | null = null
  private offset: number = 0
  private dom: HTMLElement | null = null

  constructor(options?: { offset?: number }) {
    if (options?.offset) {
      this.offset = options.offset
    }
  }

  setHTML(html: string) {
    this.html = html
    return this
  }

  setDOMContent(node: any) {
    // Mapbox accepts HTMLElement; we store it for inspection if needed.
    if (node && typeof node === 'object') {
      this.dom = node as HTMLElement
      // Best-effort: preserve text in html for assertions/debug
      try {
        this.html = (node as HTMLElement).outerHTML || ''
      } catch {
        this.html = ''
      }
    }
    return this
  }

  setLngLat(coords: [number, number]) {
    this.lngLat = coords
    return this
  }

  addTo(map: Map) {
    return this
  }
}

// Mock LngLatBounds class
export class LngLatBounds {
  private bounds: [[number, number], [number, number]] = [[0, 0], [0, 0]]

  extend(coords: [number, number]) {
    return this
  }
}

// Mock GeoJSONSource
export class GeoJSONSource {
  private data: any = null

  setData(data: any) {
    this.data = data
  }

  getClusterExpansionZoom(clusterId: number, callback: (err: any, zoom?: number) => void) {
    callback(null, 10)
  }
}

// Create a mutable accessToken object
export const accessTokenObj = { value: '' }

// Mock the default export
const mapboxgl = {
  Map,
  Marker,
  Popup,
  LngLatBounds,
  GeoJSONSource,
  get accessToken() {
    return accessTokenObj.value
  },
  set accessToken(value: string) {
    accessTokenObj.value = value
  },
  setRTLTextPlugin: vi.fn(),
}

export default mapboxgl

