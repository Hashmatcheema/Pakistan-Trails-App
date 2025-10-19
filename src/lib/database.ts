//src/lib/database.ts
import { createServerSupabaseClient, createStaticSupabaseClient, TABLES } from './supabase'
import { Trail, Guide, Itinerary, BlogPost, Region, TrailFilters, SearchResult } from '@/types'

// Trail operations
export async function getTrails(filters?: TrailFilters, page = 1, limit = 12) {
  try {
    const supabase = await createServerSupabaseClient()
    
    let query = supabase
      .from(TABLES.TRAILS)
      .select(`
        *,
        region:regions(*)
      `, { count: 'exact' })
      .not('published_at', 'is', null)
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

    if (error) {
      console.error('Error fetching trails:', error)
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  } catch (error) {
    console.error('Unexpected error in getTrails:', error)
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    }
  }
}

export async function getTrailBySlug(slug: string): Promise<Trail | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.TRAILS)
    .select(`
      *,
      region:regions(*)
    `)
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single()

  if (error) {
    console.error('Error fetching trail:', error)
    return null
  }
  return data
}

export async function getFeaturedTrails(limit = 6): Promise<Trail[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.TRAILS)
    .select(`
      *,
      region:regions(*)
    `)
    .eq('is_featured', true)
    .not('published_at', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured trails:', error)
    return []
  }
  return data || []
}

// Guide operations
export async function getGuides(page: number = 1, limit: number = 12, region?: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    let query = supabase
      .from('guides')
      .select(`
        *,
        region:regions(name)
      `, { count: 'exact' })
      .order('published_at', { ascending: false })
    
    if (region) {
      query = query.eq('region_id', region)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    const { data, error: guidesError, count } = await query.range(from, to)
    
    if (guidesError) throw guidesError
    
    const totalPages = count ? Math.ceil(count / limit) : 0
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      }
    }
  } catch (error) {
    // Fallback to static client if server client fails
    const supabase = createStaticSupabaseClient()
    
    let query = supabase
      .from('guides')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    
    if (region) {
      query = query.eq('region_id', region)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    const { data, error: staticError, count } = await query.range(from, to)
    
    if (staticError) {
      console.error('Error fetching guides:', staticError)
      return { data: [], pagination: null }
    }
    
    const totalPages = count ? Math.ceil(count / limit) : 0
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      }
    }
  }
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.GUIDES)
    .select(`
      *,
      region:regions(*)
    `)
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single()

  if (error) {
    console.error('Error fetching guide:', error)
    return null
  }
  return data
}

export async function getFeaturedGuides(limit = 4): Promise<Guide[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.GUIDES)
    .select(`
      *,
      region:regions(*)
    `)
    .not('published_at', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured guides:', error)
    return []
  }
  return data || []
}

// Itinerary operations
export async function getItineraries(page = 1, limit = 12) {
  const supabase = await createServerSupabaseClient()
  
  const { data, error, count } = await supabase
    .from(TABLES.ITINERARIES)
    .select('*', { count: 'exact' })
    .not('published_at', 'is', null)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) {
    console.error('Error fetching itineraries:', error)
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    }
  }

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
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.ITINERARIES)
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single()

  if (error) {
    console.error('Error fetching itinerary:', error)
    return null
  }
  return data
}

// Blog operations
export async function getBlogPosts(page = 1, limit = 12) {
  const supabase = await createServerSupabaseClient()
  
  const { data, error, count } = await supabase
    .from(TABLES.BLOG_POSTS)
    .select('*', { count: 'exact' })
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) {
    console.error('Error fetching blog posts:', error)
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    }
  }

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
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.BLOG_POSTS)
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  return data
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.BLOG_POSTS)
    .select('*')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured blog posts:', error)
    return []
  }
  return data || []
}

// Region operations
export async function getRegions(): Promise<Region[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from(TABLES.REGIONS)
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching regions:', error)
    return []
  }
  return data || []
}

// Search operations
export async function searchContent(query: string, limit = 20): Promise<SearchResult[]> {
  const supabase = await createServerSupabaseClient()
  
  const searchTerm = `%${query}%`
  
  // Search trails
  const { data: trails, error: trailsError } = await supabase
    .from(TABLES.TRAILS)
    .select('id, title, description, slug, featured_image, published_at')
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .not('published_at', 'is', null)
    .limit(limit / 4)

  if (trailsError) {
    console.error('Error searching trails:', trailsError)
  }

  // Search guides
  const { data: guides, error: guidesError } = await supabase
    .from(TABLES.GUIDES)
    .select('id, title, excerpt, slug, featured_image, published_at')
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    .not('published_at', 'is', null)
    .limit(limit / 4)

  if (guidesError) {
    console.error('Error searching guides:', guidesError)
  }

  // Search blog posts
  const { data: posts, error: postsError } = await supabase
    .from(TABLES.BLOG_POSTS)
    .select('id, title, excerpt, slug, featured_image, published_at')
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    .not('published_at', 'is', null)
    .limit(limit / 4)

  if (postsError) {
    console.error('Error searching blog posts:', postsError)
  }

  // Search itineraries
  const { data: itineraries, error: itinerariesError } = await supabase
    .from(TABLES.ITINERARIES)
    .select('id, title, description, slug, featured_image, published_at')
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .not('published_at', 'is', null)
    .limit(limit / 4)

  if (itinerariesError) {
    console.error('Error searching itineraries:', itinerariesError)
  }

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

// For static generation
export async function getGuidesForStatic() {
  const supabase = createStaticSupabaseClient()
  
  const { data, error } = await supabase
    .from('guides')
    .select('slug')
    .eq('status', 'published')
    
  if (error) {
    console.error('Error fetching guides for static generation:', error)
    return []
  }
  
  return data || []
}