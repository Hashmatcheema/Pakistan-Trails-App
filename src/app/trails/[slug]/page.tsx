//src/app/trails/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { 
  MapPin, 
  Clock, 
  Mountain, 
  Download, 
  ArrowLeft, 
  AlertTriangle, 
  Calendar,
  Users,
  Star,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTrailBySlug, getTrails } from '@/lib/database'
import { formatDistance, formatDuration, formatElevation, getDifficultyColor, getDifficultyLabel, getRegionLabel } from '@/lib/utils'
import { TrailMap } from '@/components/trails/trail-map'
import { TrailGallery } from '@/components/trails/trail-gallery'
import { TrailStats } from '@/components/trails/trail-stats'
import { TrailSafety } from '@/components/trails/trail-safety'

interface TrailPageProps {
   params: Promise<{ slug: string }>

}

export async function generateMetadata({ params }: TrailPageProps): Promise<Metadata> {
  const { slug } = await params
  const trail = await getTrailBySlug(slug)
  
  if (!trail) {
    return {
      title: 'Trail Not Found',
    }
  }

  // Filter out undefined values for keywords
  const keywords = [
    trail.title,
    trail.region?.name, // This might be undefined
    'Pakistan hiking',
    'trail guide',
    'GPX download',
    trail.difficulty,
  ].filter((keyword): keyword is string => keyword !== undefined)

  return {
    title: `${trail.title} - ${trail.region?.name || 'Pakistan'} Hiking Trail`,
    description: trail.description,
    keywords,
    openGraph: {
      title: `${trail.title} - ${trail.region?.name || 'Pakistan'} Hiking Trail`,
      description: trail.description,
      images: trail.photos.length > 0 ? [trail.photos[0]] : [],
    },
  }
}

export async function generateStaticParams() {
  const trails = await getTrails()
  return trails.data.map((trail) => ({
    slug: trail.slug,
  }))
}

export default async function TrailPage({ params }: TrailPageProps) {
  const resolvedParams = await params // ✅ await the promise
  const trail = await getTrailBySlug(resolvedParams.slug)  
  if (!trail) {
    notFound()
  }

  // Get related trails
  const relatedTrails = await getTrails({ region: trail.region_id }, 1, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={trail.photos[0] || '/placeholder-trail.jpg'}
            alt={trail.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <nav className="mb-4">
                <Link 
                  href="/trails" 
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Trails
                </Link>
              </nav>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {trail.title}
              </h1>
              <p className="mt-4 text-lg text-gray-200 sm:text-xl">
                {trail.description}
              </p>

              {/* Quick Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-white">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {trail.region?.name}
                </div>
                <div className="flex items-center">
                  <Mountain className="mr-2 h-5 w-5" />
                  {formatDistance(trail.distance_km)}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {formatDuration(trail.duration_h)}
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getDifficultyColor(trail.difficulty)}`}>
                    {getDifficultyLabel(trail.difficulty)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trail Stats */}
            <TrailStats trail={trail} />

            {/* Trail Map */}
            <Card>
              <CardHeader>
                <CardTitle>Trail Map</CardTitle>
                <CardDescription>
                  Interactive map showing the trail route and key landmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <TrailMap trails={[trail]} />
                </div>
              </CardContent>
            </Card>

            {/* Trail Description */}
            <Card>
              <CardHeader>
                <CardTitle>Trail Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {trail.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Safety Information */}
            {trail.safety_notes && (
              <TrailSafety safetyNotes={trail.safety_notes} />
            )}

            {/* Photo Gallery */}
            {trail.photos.length > 1 && (
              <TrailGallery photos={trail.photos} title={trail.title} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trail.gpx_url && (
                  <Button asChild className="w-full">
                    <a href={trail.gpx_url} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download GPX
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Trail
                </Button>
                <Button variant="outline" className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  Save Trail
                </Button>
              </CardContent>
            </Card>

            {/* Best Time to Visit */}
            <Card>
              <CardHeader>
                <CardTitle>Best Time to Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trail.best_season.map((season) => (
                    <div key={season} className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      {season}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trail Info */}
            <Card>
              <CardHeader>
                <CardTitle>Trail Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Distance</div>
                    <div className="text-gray-600">{formatDistance(trail.distance_km)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Duration</div>
                    <div className="text-gray-600">{formatDuration(trail.duration_h)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Elevation Gain</div>
                    <div className="text-gray-600">+{formatElevation(trail.elevation_gain_m)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Difficulty</div>
                    <div className="text-gray-600">{getDifficultyLabel(trail.difficulty)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Trails */}
            {relatedTrails.data.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Trails</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedTrails.data.map((relatedTrail) => (
                      <Link
                        key={relatedTrail.id}
                        href={`/trails/${relatedTrail.slug}`}
                        className="block p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-sm">{relatedTrail.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {formatDistance(relatedTrail.distance_km)} • {getDifficultyLabel(relatedTrail.difficulty)}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
