import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Tag, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getBlogPosts } from '@/lib/database'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Adventure Stories & Blog - Pakistan Trails',
  description: 'Read our latest adventure stories, hiking experiences, and travel tips from Pakistan\'s most beautiful destinations.',
  keywords: [
    'Pakistan travel blog',
    'hiking stories',
    'adventure travel',
    'Pakistan experiences',
    'travel tips',
    'hiking blog',
  ],
}

interface BlogPageProps {
  searchParams: {
    category?: string
    search?: string
    page?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1
  const postsResult = await getBlogPosts(page, 12)

  const { data: posts, pagination } = postsResult

  const categories = [
    'Adventure Stories',
    'Hidden Gems',
    'Hiking Fails',
    'Gear Reviews',
    'Local Encounters',
    'Myths & Folklore',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Adventure Stories
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Real stories from the trails and hidden gems we've discovered
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Sidebar with Categories */}
          <div className="lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    href="/blog"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                  >
                    All Stories
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      {category}
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
                {pagination.total} Stories
              </h2>
              {searchParams.search && (
                <p className="mt-2 text-gray-600">
                  Results for "{searchParams.search}"
                </p>
              )}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-white">
                        <Tag className="mr-1 h-3 w-3" />
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                        <Clock className="mr-1 h-3 w-3" />
                        {post.read_time} min read
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <Button asChild className="w-full">
                        <Link href={`/blog/${post.slug}`}>
                          Read Story
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {posts.length === 0 && (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No stories found</h3>
                <p className="mt-2 text-gray-600">
                  Try adjusting your filters
                </p>
                <Button asChild className="mt-4">
                  <Link href="/blog">View All Stories</Link>
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
                    pathname: '/blog',
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
                    pathname: '/blog',
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
