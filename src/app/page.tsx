//src/app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock, Mountain, Users, Star, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getFeaturedTrails, getFeaturedGuides, getFeaturedBlogPosts } from '@/lib/database'

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop"
          alt="Northern Pakistan Mountains"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Your Travel & Hiking Companion for{' '}
              <span className="text-primary">Pakistan</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              Detailed guides, trail maps, itineraries & adventure stories from 
              Hunza to Skardu, Swat to Kumrat. Plan your next adventure with confidence.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/guides">
                  Plan Your Adventure
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Link href="/trails">
                  Explore Trails
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Featured Guides Section
async function FeaturedGuides() {
  const guides = await getFeaturedGuides(4)

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Top Travel Guides
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive guides to Pakistan's most beautiful destinations
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <Card key={guide.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
            <Image
                  src={guide.featured_image}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-white">
                    <MapPin className="mr-1 h-3 w-3" />
                    {guide.region?.name}
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{guide.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {guide.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/guides/${guide.slug}`}>
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/guides">
              View All Guides
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Latest Blog Stories Section
async function LatestBlogStories() {
  const posts = await getFeaturedBlogPosts(3)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Adventure Stories
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Real stories from the trails and hidden gems we've discovered
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
          <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-900">
                    {post.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                    <Clock className="mr-1 h-3 w-3" />
                    {post.read_time} min read
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    Read Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              Read All Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Interactive Trail Map Preview
function TrailMapPreview() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Interactive Trail Map
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore Pakistan's hiking trails with our interactive map
          </p>
        </div>

        <div className="mt-12">
          <Card className="overflow-hidden">
            <div className="relative h-96 bg-gray-200">
              {/* Map placeholder - will be replaced with actual Mapbox component */}
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-lg font-medium text-gray-600">
                    Interactive Map Coming Soon
                  </p>
                  <p className="text-sm text-gray-500">
                    Powered by Mapbox
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Explore All Trails</h3>
                  <p className="text-sm text-gray-600">
                    Filter by difficulty, region, and distance
                  </p>
                </div>
                <Button asChild>
                  <Link href="/trails">
                    View Full Map
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Video Hub Teaser
function VideoHubTeaser() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Adventure Videos
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Watch our latest adventures and get inspired for your next trip
          </p>
        </div>

        <div className="mt-12">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-80">
          <Image
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
                  alt="Hunza Valley Adventure"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                    <Play className="h-6 w-6" />
                    <span className="ml-2">Watch Hunza Series</span>
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">Hunza Diaries</h3>
                <p className="mt-2 text-gray-600">
                  Complete video series covering our adventures in Hunza Valley, 
                  from arrival to departure. Watch us explore Karimabad, 
                  Attabad Lake, and the stunning Passu Cones.
                </p>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    12 videos
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    2h 30m
                  </span>
                  <span className="flex items-center">
                    <Star className="mr-1 h-4 w-4" />
                    4.9 rating
                  </span>
                </div>
                <div className="mt-6">
                  <Button asChild className="w-full">
                    <Link href="/videos">
                      Watch More Adventures
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Stats Section
function StatsSection() {
  const stats = [
    { label: 'Trails Mapped', value: '50+' },
    { label: 'Travel Guides', value: '25+' },
    { label: 'Adventure Stories', value: '100+' },
    { label: 'Happy Explorers', value: '10K+' },
  ]

  return (
    <section className="py-16 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by Adventurers
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join thousands of hikers and travelers who trust Pakistan Trails
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-primary-foreground/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Newsletter Signup
function NewsletterSignup() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get Monthly Trail Tips
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Discover hidden gems, new trails, and exclusive travel tips delivered to your inbox
          </p>
        </div>

        <div className="mt-8 max-w-md mx-auto">
          <form className="flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Subscribe
            </Button>
          </form>
          <p className="mt-2 text-xs text-gray-400 text-center">
            No spam, unsubscribe at any time
          </p>
        </div>
      </div>
    </section>
  )
}

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedGuides />
      <LatestBlogStories />
      <TrailMapPreview />
      <VideoHubTeaser />
      <StatsSection />
      <NewsletterSignup />
    </div>
  )
}