import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Calendar,
  DollarSign,
  Car,
  Home,
  Utensils,
  Lightbulb,
  Play,
  Share2,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getGuideBySlug, getGuides } from '@/lib/database'
import { formatDate } from '@/lib/utils'

interface GuidePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = await getGuideBySlug(params.slug)
  
  if (!guide) {
    return {
      title: 'Guide Not Found',
    }
  }

  return {
    title: guide.seo_title || `${guide.title} - Complete Travel Guide`,
    description: guide.seo_description || guide.excerpt,
    keywords: [
      guide.title,
      guide.region?.name,
      'Pakistan travel',
      'travel guide',
      'tourism',
      'destination guide',
    ],
    openGraph: {
      title: guide.seo_title || `${guide.title} - Complete Travel Guide`,
      description: guide.seo_description || guide.excerpt,
      images: [guide.featured_image],
    },
  }
}

export async function generateStaticParams() {
  const guides = await getGuides()
  return guides.data.map((guide) => ({
    slug: guide.slug,
  }))
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getGuideBySlug(params.slug)
  
  if (!guide) {
    notFound()
  }

  // Get related guides
  const relatedGuides = await getGuides(1, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={guide.featured_image}
            alt={guide.title}
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
                  href="/guides" 
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Guides
                </Link>
              </nav>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {guide.title}
              </h1>
              <p className="mt-4 text-lg text-gray-200 sm:text-xl">
                {guide.excerpt}
              </p>

              {/* Quick Info */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-white">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {guide.region?.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {formatDate(guide.published_at)}
                </div>
                {guide.cost_estimate && (
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    {guide.cost_estimate}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>📍 Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {guide.excerpt}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Best Time to Visit */}
            {guide.best_time && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    📅 Best Time to Visit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{guide.best_time}</p>
                </CardContent>
              </Card>
            )}

            {/* How to Get There */}
            {guide.transport_notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="mr-2 h-5 w-5" />
                    🚌 How to Get There
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {guide.transport_notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Accommodation */}
            {guide.accommodation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    🏠 Accommodation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {guide.accommodation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Food & Culture */}
            {guide.cost_estimate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5" />
                    🥘 Local Food & Culture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {guide.cost_estimate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Local Tips */}
            {guide.transport_notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    💡 Local Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {guide.transport_notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Section */}
            {guide.youtube_embed_id && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    ▶️ Watch Our Adventure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${guide.youtube_embed_id}`}
                      title={guide.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
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
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Guide
                </Button>
                <Button variant="outline" className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  Save Guide
                </Button>
              </CardContent>
            </Card>

            {/* Guide Info */}
            <Card>
              <CardHeader>
                <CardTitle>Guide Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium text-gray-900">Region</div>
                  <div className="text-gray-600">{guide.region?.name}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Published</div>
                  <div className="text-gray-600">{formatDate(guide.published_at)}</div>
                </div>
                {guide.best_time && (
                  <div>
                    <div className="font-medium text-gray-900">Best Time</div>
                    <div className="text-gray-600">{guide.best_time}</div>
                  </div>
                )}
                {guide.cost_estimate && (
                  <div>
                    <div className="font-medium text-gray-900">Cost Estimate</div>
                    <div className="text-gray-600">{guide.cost_estimate}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Guides */}
            {relatedGuides.data.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Guides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedGuides.data
                      .filter(g => g.id !== guide.id)
                      .slice(0, 3)
                      .map((relatedGuide) => (
                        <Link
                          key={relatedGuide.id}
                          href={`/guides/${relatedGuide.slug}`}
                          className="block p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-sm">{relatedGuide.title}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {relatedGuide.region?.name}
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
