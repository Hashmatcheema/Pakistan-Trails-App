//src/app/itineraries/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Travel Itineraries - Pakistan Trails',
  description: 'Detailed day-by-day travel itineraries for exploring Pakistan\'s most beautiful destinations.',
}

export default function ItinerariesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Travel Itineraries
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Detailed day-by-day plans for your perfect Pakistan adventure
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Calendar className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Itineraries Coming Soon
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  We&apos;re working on comprehensive day-by-day itineraries for popular destinations.
                </p>
                <p className="mt-2 text-gray-600">
                  Soon you&apos;ll find detailed plans including:
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-primary" />
                    <h3 className="mt-2 font-semibold">Route Planning</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Step-by-step travel routes
                    </p>
                  </div>
                  <div className="text-center">
                    <Clock className="mx-auto h-8 w-8 text-primary" />
                    <h3 className="mt-2 font-semibold">Time Estimates</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Realistic time allocations
                    </p>
                  </div>
                  <div className="text-center">
                    <Calendar className="mx-auto h-8 w-8 text-primary" />
                    <h3 className="mt-2 font-semibold">Daily Schedules</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Day-by-day activities
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/guides">
                      Browse Travel Guides
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/trails">
                      Explore Trails
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

