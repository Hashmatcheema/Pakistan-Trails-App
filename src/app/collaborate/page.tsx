//src/app/collaborate/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Collaborate With Us - Pakistan Trails',
  description: 'Partner with Pakistan Trails to share your adventures and contribute to our community.',
}

export default function CollaboratePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Collaborate With Us
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Share your adventures and help others discover Pakistan
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  We&apos;d Love to Work With You!
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Are you a travel blogger, photographer, or adventure enthusiast?
                </p>
                <p className="mt-2 text-gray-600">
                  We&apos;re always looking for collaborators to share authentic stories and experiences.
                </p>

                <div className="mt-8 space-y-4 text-left">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-900">Content Contributors</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Share your trail experiences, travel guides, and photography
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-900">Photographers</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Contribute stunning visuals of Pakistan&apos;s landscapes
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-900">Local Guides</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Help us create accurate and detailed trail information
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
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

