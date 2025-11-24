import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrailCard } from '@/components/trails/trail-card'
import { Trail } from '@/types'

const mockTrail: Trail = {
  id: '1',
  slug: 'test-trail',
  title: 'Test Trail',
  description: 'A beautiful test trail',
  region_id: 'region-1',
  region: {
    id: 'region-1',
    slug: 'hunza',
    name: 'Hunza Valley',
    description: 'Test region',
    cover_image: '',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  difficulty: 'moderate',
  distance_km: 10,
  elevation_gain_m: 500,
  duration_h: 4,
  start_point: { lat: 35, lng: 74 },
  end_point: { lat: 35.1, lng: 74.1 },
  photos: ['/test-image.jpg'],
  best_season: ['spring', 'summer'],
  created_by: 'user-1',
  published_at: '2024-01-01',
  is_featured: false,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('TrailCard', () => {
  it('renders trail card in grid view by default', () => {
    render(<TrailCard trail={mockTrail} view="map" />)
    expect(screen.getByText('Test Trail')).toBeInTheDocument()
    expect(screen.getByText('A beautiful test trail')).toBeInTheDocument()
  })

  it('renders trail card in list view', () => {
    render(<TrailCard trail={mockTrail} view="list" />)
    expect(screen.getByText('Test Trail')).toBeInTheDocument()
    expect(screen.getByText('A beautiful test trail')).toBeInTheDocument()
  })

  it('displays trail statistics', () => {
    render(<TrailCard trail={mockTrail} view="map" />)
    expect(screen.getByText(/10.0km/i)).toBeInTheDocument()
    expect(screen.getByText(/4h/i)).toBeInTheDocument()
    expect(screen.getByText(/500m/i)).toBeInTheDocument()
  })

  it('displays difficulty badge', () => {
    render(<TrailCard trail={mockTrail} view="map" />)
    expect(screen.getByText('Moderate')).toBeInTheDocument()
  })

  it('displays region name', () => {
    render(<TrailCard trail={mockTrail} view="map" />)
    expect(screen.getByText('Hunza Valley')).toBeInTheDocument()
  })

  it('renders view details link', () => {
    render(<TrailCard trail={mockTrail} view="map" />)
    const link = screen.getByRole('link', { name: /view details/i })
    expect(link).toHaveAttribute('href', '/trails/test-trail')
  })

  it('handles missing region gracefully', () => {
    const trailWithoutRegion = { ...mockTrail, region: undefined }
    render(<TrailCard trail={trailWithoutRegion} view="map" />)
    expect(screen.getByText('Pakistan')).toBeInTheDocument()
  })
})

