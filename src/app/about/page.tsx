//src/app/about/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import { Mountain, Heart, Users, MapPin, Star, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define Stat interface for the stats array
interface Stat {
  label: string
  value: string
}

export const metadata: Metadata = {
  title: 'About Pakistan Trails - Our Mission & Story',
  description: 'Learn about Pakistan Trails, our mission to showcase Pakistan&apos;s natural beauty, and our commitment to responsible tourism.',
  keywords: [
    'about Pakistan Trails',
    'Pakistan tourism mission',
    'responsible tourism',
    'Pakistan travel community',
  ],
}

export default function AboutPage() {
  const stats: Stat[] = [
    { label: 'Trails Mapped', value: '50+' },
    { label: 'Travel Guides', value: '25+' },
    { label: 'Happy Explorers', value: '10K+' },
    { label: 'Adventure Stories', value: '100+' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              About Pakistan Trails
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Your trusted companion for exploring Pakistan&apos;s natural wonders
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-4">
                  Pakistan Trails was born from a simple belief: that Pakistan&apos;s natural beauty 
                  deserves to be shared with the world. What started as a passion project to 
                  document our hiking adventures has grown into Pakistan&apos;s most comprehensive 
                  resource for outdoor exploration.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  We&apos;ve personally hiked, mapped, and documented over 50 trails across Pakistan, 
                  from the towering peaks of Hunza to the hidden valleys of Swat. Every trail 
                  on our platform has been GPS-tracked, photographed, and carefully documented 
                  to ensure accuracy and safety.
                </p>
                <p className="text-lg leading-relaxed">
                  Our mission is simple: to make Pakistan&apos;s incredible natural beauty accessible 
                  to everyone, while promoting responsible tourism and environmental conservation.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                alt="Pakistan Trails Team"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To showcase Pakistan&apos;s natural beauty while promoting responsible tourism and 
              environmental conservation
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mountain className="mr-2 h-5 w-5 text-primary" />
                  Document & Preserve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We carefully document every trail, ensuring future generations can enjoy 
                  Pakistan&apos;s natural beauty while preserving its pristine condition.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Build Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We&apos;re building a community of outdoor enthusiasts who share our passion 
                  for Pakistan&apos;s mountains, valleys, and hidden gems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-primary" />
                  Promote Responsible Tourism
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We advocate for responsible tourism practices that protect the environment 
                  and benefit local communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Accuracy & Safety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Every trail is personally verified, GPS-tracked, and includes detailed 
                  safety information. Your safety is our top priority.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• GPS-verified trail coordinates</li>
                  <li>• Detailed difficulty ratings</li>
                  <li>• Weather and safety considerations</li>
                  <li>• Emergency contact information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-primary" />
                  Quality Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We believe in providing high-quality, comprehensive content that helps 
                  you plan the perfect adventure.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• High-resolution photography</li>
                  <li>• Detailed trail descriptions</li>
                  <li>• Local culture and tips</li>
                  <li>• Downloadable GPX files</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Impact */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Since our launch, we&apos;ve helped thousands of adventurers discover Pakistan&apos;s beauty
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat: Stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Our Community */}
        <section className="bg-primary rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Be part of Pakistan&apos;s growing outdoor community. Share your adventures, 
            discover new trails, and connect with fellow explorers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://youtube.com/@pakistantrails"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-primary hover:bg-gray-50 transition-colors"
            >
              <Award className="mr-2 h-4 w-4" />
              Watch Our Videos
            </a>
            <a
              href="https://instagram.com/pakistantrails"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Follow Our Adventures
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}