//src/app/guides/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getGuideBySlug, getGuidesForStatic } from '@/lib/database'
import { formatDate } from '@/lib/utils'

// Enable ISR (cache detail pages and revalidate periodically)
export const revalidate = 3600

function extractGuideParagraphs(body: unknown): string[] {
  const normalize = (val: unknown): unknown => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return val
      }
    }
    return val
  }

  const parsed = normalize(body)
  if (!parsed || typeof parsed !== 'object') return []

  // Seed data uses { blocks: [{ text: "..." }, ...] }
  const blocks = (parsed as { blocks?: Array<{ text?: string }> }).blocks
  if (Array.isArray(blocks)) {
    return blocks
      .map((b) => (b && typeof b.text === 'string' ? b.text : ''))
      .map((t) => t.trim())
      .filter(Boolean)
  }

  return []
}

export async function generateStaticParams() {
  const guides = await getGuidesForStatic()
  return guides.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuideBySlug(slug)

  if (!guide) {
    return { title: 'Guide Not Found' }
  }

  return {
    title: guide.seo_title || `${guide.title} | Pakistan Trails`,
    description: guide.seo_description || guide.excerpt,
    openGraph: {
      title: guide.seo_title || guide.title,
      description: guide.seo_description || guide.excerpt,
      images: guide.featured_image ? [guide.featured_image] : [],
    },
  }
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = await getGuideBySlug(slug)
  if (!guide) notFound()

  const paragraphs = extractGuideParagraphs(guide.body)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={guide.featured_image || '/placeholder-guide.jpg'}
            alt={guide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-5xl px-4 pb-10">
            <Link
              href="/guides"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guides
            </Link>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-gray-200 sm:text-lg">
              {guide.excerpt}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white">
              {guide.region?.name && (
                <span className="inline-flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {guide.region.name}
                </span>
              )}
              {guide.published_at && (
                <span className="inline-flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(guide.published_at)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                ) : (
                  <p>{guide.excerpt}</p>
                )}
              </CardContent>
            </Card>

            {guide.gallery?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {guide.gallery.slice(0, 6).map((src, idx) => (
                      <div key={idx} className="relative h-48 overflow-hidden rounded-md">
                        <Image src={src} alt={`${guide.title} photo ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip quick info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                {guide.best_time && (
                  <div>
                    <div className="font-medium text-gray-900">Best time</div>
                    <div>{guide.best_time}</div>
                  </div>
                )}
                {guide.cost_estimate && (
                  <div>
                    <div className="font-medium text-gray-900">Budget</div>
                    <div>{guide.cost_estimate}</div>
                  </div>
                )}
                {guide.transport_notes && (
                  <div>
                    <div className="font-medium text-gray-900">Transport</div>
                    <div>{guide.transport_notes}</div>
                  </div>
                )}
                {guide.accommodation && (
                  <div>
                    <div className="font-medium text-gray-900">Accommodation</div>
                    <div>{guide.accommodation}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {guide.youtube_embed_id && (
              <Card>
                <CardHeader>
                  <CardTitle>Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video overflow-hidden rounded-md bg-black">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${guide.youtube_embed_id}`}
                      title={guide.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
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