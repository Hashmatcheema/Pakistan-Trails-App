//src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { getTrails } from '@/lib/database'
import { getGuides } from '@/lib/database'
import { getBlogPosts } from '@/lib/database'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/trails`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/itineraries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/collaborate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/safety`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Dynamic routes - trails
  let trailRoutes: MetadataRoute.Sitemap = []
  try {
    // Fetch trails in batches (max 100 per request due to validation)
    const trailsResult = await getTrails({}, 1, 100) // Get first 100 trails
    trailRoutes = trailsResult.data.map((trail) => ({
      url: `${baseUrl}/trails/${trail.slug}`,
      lastModified: new Date(trail.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    logger.error('Error generating trail sitemap entries', { error })
  }

  // Dynamic routes - guides
  let guideRoutes: MetadataRoute.Sitemap = []
  try {
    const guidesResult = await getGuides(1, 100) // Get first 100 guides
    guideRoutes = guidesResult.data.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: new Date(guide.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    logger.error('Error generating guide sitemap entries', { error })
  }

  // Dynamic routes - blog posts
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const blogResult = await getBlogPosts(1, 100) // Get first 100 posts
    blogRoutes = blogResult.data.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    logger.error('Error generating blog sitemap entries', { error })
  }

  return [...staticRoutes, ...trailRoutes, ...guideRoutes, ...blogRoutes]
}

