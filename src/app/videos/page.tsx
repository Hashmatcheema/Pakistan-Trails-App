//src/app/videos/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Clock, Video, ArrowLeft, Mountain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Adventure Videos - Coming Soon',
  description: 'Watch our latest adventures and get inspired for your next trip to Pakistan. Video content coming soon!',
}

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Video className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Adventure Videos
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Watch our latest adventures and get inspired for your next trip
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="relative h-64 md:h-96">
              <Image
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop"
                alt="Pakistan Mountains"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 inline-flex rounded-full bg-white/20 p-4 backdrop-blur-sm">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white sm:text-4xl">
                    Coming Soon
                  </h2>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900">
                  We&apos;re Working on Something Amazing!
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  Our video library is currently under development. Soon you&apos;ll be able to watch:
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Adventure Series</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Complete video series covering our adventures across Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Mountain className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Trail Guides</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Video guides for popular hiking trails and destinations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Travel Vlogs</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Day-by-day travel experiences from our adventures
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Live Streams</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Live coverage of special events and expeditions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/trails">
                      Explore Trails
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/guides">
                      Read Travel Guides
                    </Link>
                  </Button>
                </div>

                <p className="mt-8 text-sm text-gray-500">
                  Stay tuned for updates! Follow us for the latest adventure content.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

