//src/app/trails/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Mountain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTrails, getRegions } from '@/lib/database'
import { TrailMap } from '@/components/trails/trail-map'
import { TrailFilters } from '@/components/trails/trail-filters'
import { TrailCard } from '@/components/trails/trail-card'

export const metadata: Metadata = {
  title: 'Hiking Trails in Pakistan',
  description: 'Discover the best hiking trails in Pakistan',
}

interface TrailsPageProps {
  searchParams: Promise<{
    region?: string
    difficulty?: string
    max_distance?: string
    min_elevation?: string
    max_elevation?: string
    search?: string
    view?: 'map' | 'list'
  }>
}

export default async function TrailsPage({ searchParams }: TrailsPageProps) {
  const params = await searchParams
  
  const filters = {
    region: params.region,
    difficulty: params.difficulty,
    max_distance: params.max_distance ? Number(params.max_distance) : undefined,
    min_elevation: params.min_elevation ? Number(params.min_elevation) : undefined,
    max_elevation: params.max_elevation ? Number(params.max_elevation) : undefined,
    search: params.search,
  }

  const [trailsResult, regions] = await Promise.all([
    getTrails(filters),
    getRegions(),
  ])

  const { data: trails, pagination } = trailsResult
  const view = params.view || 'map'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Discover Pakistan's Hiking Trails
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Explore trails across Pakistan's most beautiful regions
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:w-80">
            <div className="sticky top-24">
              <TrailFilters regions={regions} currentFilters={filters} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {pagination.total} Trails Found
              </h2>
            </div>

            {/* Map View */}
            {view === 'map' && (
              <div className="mb-8">
                <Suspense fallback={
                  <div className="flex h-96 items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Loading map...</p>
                    </div>
                  </div>
                }>
                  <TrailMap trails={trails} />
                </Suspense>
              </div>
            )}

            {/* Trails Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} view={view} />
              ))}
            </div>

            {/* No Results */}
            {trails.length === 0 && (
              <div className="text-center py-12">
                <Mountain className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No trails found</h3>
                <p className="mt-2 text-gray-600">
                  Try adjusting your filters or search terms
                </p>
                <Button asChild className="mt-4">
                  <Link href="/trails">Clear Filters</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}