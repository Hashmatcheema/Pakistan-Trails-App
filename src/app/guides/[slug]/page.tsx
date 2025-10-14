//src/app/guides/[slug]/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getGuides, getRegions } from '@/lib/database'
import { formatDate } from '@/lib/utils'

// Define interfaces for Region and Guide
interface Region {
  id: string
  name: string
}

interface Guide {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  region?: { name: string }
  published_at: string
  best_time?: string
  cost_estimate?: string
}

export const metadata: Metadata = {
  title: 'Pakistan Travel Guides - Complete Destination Guides',
  description: 'Comprehensive travel guides for Pakistan&apos;s most beautiful destinations. From Hunza to Skardu, Swat to Kumrat - plan your perfect adventure.',
  keywords: [
    'Pakistan travel guides',
    'Hunza Valley guide',
    'Skardu travel',
    'Swat Valley guide',
    'Pakistan tourism',
    'travel planning Pakistan',
    'destination guides',
  ],
}

interface GuidesPageProps {
  searchParams: Promise<{
    region?: string
    search?: string
    page?: string
  }>
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const region = params.region
  const search = params.search

  const guidesResult = await getGuides(page, 12, region)
  const regions = await getRegions()

  const { data: guides, pagination } = guidesResult

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Pakistan Travel Guides
            </h1>
            <p className="mt-4 text-lg text-primary-50 sm:text-xl">
              Comprehensive guides to Pakistan&apos;s most beautiful destinations
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle>Filter by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    href="/guides"
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      !region 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                    }`}
                  >
                    All Regions
                  </Link>
                  {regions.map((regionItem: Region) => (
                    <Link
                      key={regionItem.id}
                      href={`/guides?region=${regionItem.id}`}
                      className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        region === regionItem.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                      }`}
                    >
                      {regionItem.name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {pagination?.total || 0} Travel Guides
              </h2>
              {search && (
                <p className="mt-2 text-gray-600">
                  Results for &quot;{search}&quot;
                </p>
              )}
              {region && (
                <p className="mt-2 text-gray-600">
                  Filtered by region: {regions.find((r: Region) => r.id === region)?.name}
                </p>
              )}
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides?.map((guide: Guide) => (
                <Card key={guide.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={guide.featured_image || '/placeholder-guide.jpg'}
                      alt={guide.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-primary-600/90 px-2 py-1 text-xs font-medium text-white">
                        <MapPin className="mr-1 h-3 w-3" />
                        {guide.region?.name || 'Pakistan'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDate(guide.published_at)}
                      </span>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary-600 transition-colors">
                      <Link href={`/guides/${guide.slug}`}>
                        {guide.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {guide.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Quick Info */}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        {guide.best_time && (
                          <span className="inline-flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {guide.best_time}
                          </span>
                        )}
                        {guide.cost_estimate && (
                          <span className="inline-flex items-center">
                            <Star className="mr-1 h-3 w-3" />
                            {guide.cost_estimate}
                          </span>
                        )}
                      </div>

                      <Button asChild className="w-full">
                        <Link href={`/guides/${guide.slug}`}>
                          Read Guide
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {(!guides || guides.length === 0) && (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No guides found</h3>
                <p className="mt-2 text-gray-600">
                  Try adjusting your filters
                </p>
                <Button asChild className="mt-4">
                  <Link href="/guides">View All Guides</Link>
                </Button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  asChild
                >
                  <Link href={{
                    pathname: '/guides',
                    query: { ...params, page: pagination.page - 1 }
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
                    pathname: '/guides',
                    query: { ...params, page: pagination.page + 1 }
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