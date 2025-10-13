import { createServerSupabaseClient, TABLES } from './supabase'
import { Trail, Guide, Itinerary, BlogPost, Region, TrailFilters, SearchResult } from '@/types'

// Trail operations
export async function getTrails(filters?: TrailFilters, page = 1, limit = 12) {
  const supabase = createServerSupabaseClient()
  
  let query = supabase
    .from(TABLES.TRAILS)
    .select(`
      *,
      region:regions(*)
    `)
    .eq('published_at', true)
    .order('created_at', { ascending: false })

  if (filters?.region) {
    query = query.eq('region_id', filters.region)
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty)
  }

  if (filters?.max_distance) {
    query = query.lte('distance_km', filters.max_distance)
  }

  if (filters?.min_elevation) {
    query = query.gte('elevation_gain_m', filters.min_elevation)
  }

  if (filters?.max_elevation) {
    query = query.lte('elevation_gain_m', filters.max_elevation)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
    .select('*', { count: 'exact' })

  if (error) throw error

  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }
}

export async function getTrailBySlug(slug: string): Promise<Trail | null> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.TRAILS)
    .select(`
      *,
      region:regions(*)
    `)
    .eq('slug', slug)
    .eq('published_at', true)
    .single()

  if (error) return null
  return data
}

export async function getFeaturedTrails(limit = 6): Promise<Trail[]> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.TRAILS)
    .select(`
      *,
      region:regions(*)
    `)
    .eq('is_featured', true)
    .eq('published_at', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data || []
}

// Guide operations
export async function getGuides(page = 1, limit = 12) {
  const supabase = createServerSupabaseClient()
  
  const { data, error, count } = await supabase
    .from(TABLES.GUIDES)
    .select(`
      *,
      region:regions(*)
    `, { count: 'exact' })
    .eq('published_at', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) throw error

  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.GUIDES)
    .select(`
      *,
      region:regions(*)
    `)
    .eq('slug', slug)
    .eq('published_at', true)
    .single()

  if (error) return null
  return data
}

export async function getFeaturedGuides(limit = 4): Promise<Guide[]> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.GUIDES)
    .select(`
      *,
      region:regions(*)
    `)
    .eq('published_at', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data || []
}

// Itinerary operations
export async function getItineraries(page = 1, limit = 12) {
  const supabase = createServerSupabaseClient()
  
  const { data, error, count } = await supabase
    .from(TABLES.ITINERARIES)
    .select('*', { count: 'exact' })
    .eq('published_at', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) throw error

  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }
}

export async function getItineraryBySlug(slug: string): Promise<Itinerary | null> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.ITINERARIES)
    .select('*')
    .eq('slug', slug)
    .eq('published_at', true)
    .single()

  if (error) return null
  return data
}

// Blog operations
export async function getBlogPosts(page = 1, limit = 12) {
  const supabase = createServerSupabaseClient()
  
  const { data, error, count } = await supabase
    .from(TABLES.BLOG_POSTS)
    .select('*', { count: 'exact' })
    .eq('published_at', true)
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) throw error

  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.BLOG_POSTS)
    .select('*')
    .eq('slug', slug)
    .eq('published_at', true)
    .single()

  if (error) return null
  return data
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.BLOG_POSTS)
    .select('*')
    .eq('published_at', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data || []
}

// Region operations
export async function getRegions(): Promise<Region[]> {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.REGIONS)
    .select('*')
    .order('name', { ascending: true })

  if (error) return []
  return data || []
}

// Search operations
export async function searchContent(query: string, limit = 20): Promise<SearchResult[]> {
  const supabase = createServerSupabaseClient()
  
  const searchTerm = `%${query}%`
  
  // Search trails
  const { data: trails } = await supabase
    .from(TABLES.TRAILS)
    .select('id, title, description, slug, featured_image, published_at')
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .eq('published_at', true)
    .limit(limit / 4)

  // Search guides
  const { data: guides } = await supabase
    .from(TABLES.GUIDES)
    .select('id, title, excerpt, slug, featured_image, published_at')
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    .eq('published_at', true)
    .limit(limit / 4)

  // Search blog posts
  const { data: posts } = await supabase
    .from(TABLES.BLOG_POSTS)
    .select('id, title, excerpt, slug, featured_image, published_at')
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    .eq('published_at', true)
    .limit(limit / 4)

  // Search itineraries
  const { data: itineraries } = await supabase
    .from(TABLES.ITINERARIES)
    .select('id, title, description, slug, featured_image, published_at')
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .eq('published_at', true)
    .limit(limit / 4)

  const results: SearchResult[] = [
    ...(trails || []).map(trail => ({
      type: 'trail' as const,
      id: trail.id,
      title: trail.title,
      description: trail.description,
      slug: trail.slug,
      image: trail.featured_image,
      published_at: trail.published_at
    })),
    ...(guides || []).map(guide => ({
      type: 'guide' as const,
      id: guide.id,
      title: guide.title,
      description: guide.excerpt,
      slug: guide.slug,
      image: guide.featured_image,
      published_at: guide.published_at
    })),
    ...(posts || []).map(post => ({
      type: 'post' as const,
      id: post.id,
      title: post.title,
      description: post.excerpt,
      slug: post.slug,
      image: post.featured_image,
      published_at: post.published_at
    })),
    ...(itineraries || []).map(itinerary => ({
      type: 'itinerary' as const,
      id: itinerary.id,
      title: itinerary.title,
      description: itinerary.description,
      slug: itinerary.slug,
      image: itinerary.featured_image,
      published_at: itinerary.published_at
    }))
  ]

  return results.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}
