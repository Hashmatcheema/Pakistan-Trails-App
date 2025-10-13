import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Mountain, ArrowRight, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTrails, getRegions } from '@/lib/database'
import { formatDistance, formatDuration, formatElevation, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'
import { TrailMap } from '@/components/trails/trail-map'
import { TrailFilters } from '@/components/trails/trail-filters'
import { TrailCard } from '@/components/trails/trail-card'

export const metadata: Metadata = {
  title: 'Hiking Trails in Pakistan - Interactive Trail Map & Guide',
  description: 'Discover the best hiking trails in Pakistan with our interactive map. Find trails by difficulty, region, and distance. Download GPX files and detailed guides.',
  keywords: [
    'Pakistan hiking trails',
    'Pakistan trekking',
    'Hunza hiking',
    'Skardu trails',
    'Swat Valley hiking',
    'trail maps Pakistan',
    'GPX downloads',
    'hiking guides Pakistan',
  ],
}

interface TrailsPageProps {
  searchParams: {
    region?: string
    difficulty?: string
    max_distance?: string
    min_elevation?: string
    max_elevation?: string
    search?: string
    view?: 'map' | 'list'
  }
}

export default async function TrailsPage({ searchParams }: TrailsPageProps) {
  const filters = {
    region: searchParams.region,
    difficulty: searchParams.difficulty,
    max_distance: searchParams.max_distance ? Number(searchParams.max_distance) : undefined,
    min_elevation: searchParams.min_elevation ? Number(searchParams.min_elevation) : undefined,
    max_elevation: searchParams.max_elevation ? Number(searchParams.max_elevation) : undefined,
    search: searchParams.search,
  }

  const [trailsResult, regions] = await Promise.all([
    getTrails(filters),
    getRegions(),
  ])

  const { data: trails, pagination } = trailsResult
  const view = searchParams.view || 'map'

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
              Explore {pagination.total} carefully mapped trails across Pakistan's most beautiful regions
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
            {/* View Toggle */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {pagination.total} Trails Found
                </h2>
                {filters.search && (
                  <span className="text-sm text-gray-600">
                    for "{filters.search}"
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === 'map' ? 'default' : 'outline'}
                  size="sm"
                  asChild
                >
                  <Link href={{ pathname: '/trails', query: { ...searchParams, view: 'map' } }}>
                    <Grid className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Map</span>
                  </Link>
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  asChild
                >
                  <Link href={{ pathname: '/trails', query: { ...searchParams, view: 'list' } }}>
                    <List className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">List</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Map View */}
            {view === 'map' && (
              <div className="mb-8">
                <Card className="overflow-hidden">
                  <div className="h-96">
                    <Suspense fallback={
                      <div className="flex h-full items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Loading map...</p>
                        </div>
                      </div>
                    }>
                      <TrailMap trails={trails} />
                    </Suspense>
                  </div>
                </Card>
              </div>
            )}

            {/* Trails Grid/List */}
            <div className={view === 'list' ? 'space-y-4' : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'}>
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  asChild
                >
                  <Link href={{
                    pathname: '/trails',
                    query: { ...searchParams, page: pagination.page - 1 }
                  }}>
                    Previous
                  </Link>
                </Button>
                
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.totalPages}
                  asChild
                >
                  <Link href={{
                    pathname: '/trails',
                    query: { ...searchParams, page: pagination.page + 1 }
                  }}>
                    Next
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
