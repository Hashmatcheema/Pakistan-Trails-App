//src/components/trails/trail-map.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Trail } from '@/types'
import { createMap, addTrailMarkers, createTrailClusters } from '@/lib/mapbox'

interface TrailMapProps {
  trails: Trail[]
}

export function TrailMap({ trails }: TrailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize map
    map.current = createMap(mapContainer.current, {
      center: [73.0479, 33.6844], // Pakistan center
      zoom: 6,
    })

    // Add trail clusters when map is loaded
    map.current.on('load', () => {
      if (map.current && trails.length > 0) {
        createTrailClusters(map.current, trails)
      }
    })

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [trails])

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  )
}
