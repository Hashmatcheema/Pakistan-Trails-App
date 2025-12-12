//src/app/search/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Search - Pakistan Trails',
  description: 'Search for trails, guides, and travel content on Pakistan Trails.',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <SearchIcon className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Search
                </h1>
                <p className="mt-4 text-gray-600">
                  Search functionality is coming soon. For now, browse our content by category:
                </p>

                <div className="mt-8 space-y-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/trails">Browse Trails</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/guides">Browse Guides</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/blog">Browse Blog</Link>
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

