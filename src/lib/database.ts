//src/lib/database.ts
import { createStaticSupabaseClient, TABLES } from './supabase'
import { Trail, Guide, Itinerary, BlogPost, Region, TrailFilters, SearchResult } from '@/types'
import { TrailFiltersSchema, PaginationSchema, SearchQuerySchema, SlugSchema, validateAndSanitizeSearch } from './validation'
import { DatabaseError, ValidationError } from './errors'

// Trail operations
export async function getTrails(filters?: TrailFilters, page = 1, limit = 12) {
  try {
    // Validate pagination
    const paginationResult = PaginationSchema.safeParse({ page, limit })
    if (!paginationResult.success) {
      throw new ValidationError('Invalid pagination parameters', undefined, { page, limit })
    }
    const { page: validatedPage, limit: validatedLimit } = paginationResult.data

    // Validate filters if provided
    if (filters) {
      const filtersResult = TrailFiltersSchema.safeParse(filters)
      if (!filtersResult.success) {
        throw new ValidationError('Invalid filter parameters', undefined, filters)
      }
      filters = filtersResult.data
    }

    const supabase = createStaticSupabaseClient()
    
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
      // Sanitize search query to prevent SQL injection
      const sanitized = validateAndSanitizeSearch(filters.search)
      // Use Supabase's ilike with proper escaping
      query = query.or(`title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
    }

    const { data, error, count } = await query
      .range((validatedPage - 1) * validatedLimit, validatedPage * validatedLimit - 1)

    if (error) {
      throw new DatabaseError('Failed to fetch trails', { error, filters, page: validatedPage, limit: validatedLimit })
    }

    return {
      data: data || [],
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / validatedLimit)
      }
    }
  } catch (error) {
    // Public pages should degrade gracefully
    console.error('getTrails failed', error)
    return {
      data: [],
      pagination: {
        page: Number.isFinite(page) && page > 0 ? page : 1,
        limit: Number.isFinite(limit) && limit > 0 ? limit : 12,
        total: 0,
        totalPages: 0,
      },
    }
  }
}

// For static generation (minimal payload)
export async function getTrailsForStatic() {
  const supabase = createStaticSupabaseClient()

  const { data, error } = await supabase
    .from(TABLES.TRAILS)
    .select('slug')
    .not('published_at', 'is', null)

  if (error) {
    throw new DatabaseError('Failed to fetch trails for static generation', { error })
  }

  return data || []
}

export async function getTrailBySlug(slug: string): Promise<Trail | null> {
  try {
    // Validate slug format
    const slugResult = SlugSchema.safeParse(slug)
    if (!slugResult.success) {
      return null
    }

    const supabase = createStaticSupabaseClient()
    
    const { data, error } = await supabase
      .from(TABLES.TRAILS)
      .select(`
        *,
        region:regions(*)
      `)
      .eq('slug', slugResult.data)
      .not('published_at', 'is', null)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      return null
    }

    if (!data) {
      return null
    }

    return data
  } catch (error) {
    console.error('getTrailBySlug failed', error)
    return null
  }
}

export async function getFeaturedTrails(limit = 6): Promise<Trail[]> {
  try {
    // Validate limit
    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100', 'limit', limit)
    }

    const supabase = createStaticSupabaseClient()
  
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
      console.error('getFeaturedTrails failed', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('getFeaturedTrails failed', error)
    return []
  }
}

// Guide operations
export async function getGuides(page: number = 1, limit: number = 12, region?: string) {
  try {
    const supabase = createStaticSupabaseClient()

    let query = supabase
      .from(TABLES.GUIDES)
      .select(
        `
          *,
          region:regions(name)
        `,
        { count: 'exact' }
      )
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    if (region) {
      query = query.eq('region_id', region)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)
    if (error) {
      console.error('getGuides failed', error)
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      }
    }

    const totalPages = count ? Math.ceil(count / limit) : 0
    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    }
  } catch (error) {
    console.error('getGuides failed', error)
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    }
  }
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  try {
    // Validate slug format
    const slugResult = SlugSchema.safeParse(slug)
    if (!slugResult.success) {
      return null
    }

    const supabase = createStaticSupabaseClient()
  
    const { data, error } = await supabase
      .from(TABLES.GUIDES)
      .select(`
        *,
        region:regions(*)
      `)
      .eq('slug', slugResult.data)
      .not('published_at', 'is', null)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      return null
    }

    if (!data) {
      return null
    }

    return data
  } catch (error) {
    console.error('getGuideBySlug failed', error)
    return null
  }
}

export async function getFeaturedGuides(limit = 4): Promise<Guide[]> {
  try {
    const supabase = createStaticSupabaseClient()

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
      console.error('getFeaturedGuides failed', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('getFeaturedGuides failed', error)
    return []
  }
}

// Itinerary operations
export async function getItineraries(page = 1, limit = 12) {
  try {
    const supabase = createStaticSupabaseClient()

    const { data, error, count } = await supabase
      .from(TABLES.ITINERARIES)
      .select('*', { count: 'exact' })
      .not('published_at', 'is', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('getItineraries failed', error)
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      }
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }
  } catch (error) {
    console.error('getItineraries failed', error)
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    }
  }
}

export async function getItineraryBySlug(slug: string): Promise<Itinerary | null> {
  try {
    const supabase = createStaticSupabaseClient()

    const { data, error } = await supabase
      .from(TABLES.ITINERARIES)
      .select('*')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .single()

    if (error) return null
    return data || null
  } catch (error) {
    console.error('getItineraryBySlug failed', error)
    return null
  }
}

// Blog operations
export async function getBlogPosts(page = 1, limit = 12) {
  try {
    const supabase = createStaticSupabaseClient()

    const { data, error, count } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select('*', { count: 'exact' })
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('getBlogPosts failed', error)
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      }
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }
  } catch (error) {
    console.error('getBlogPosts failed', error)
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    }
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createStaticSupabaseClient()

    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select('*')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .single()

    if (error) return null
    return data || null
  } catch (error) {
    console.error('getBlogPostBySlug failed', error)
    return null
  }
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const supabase = createStaticSupabaseClient()

    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select('*')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('getFeaturedBlogPosts failed', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('getFeaturedBlogPosts failed', error)
    return []
  }
}

// Region operations
export async function getRegions(): Promise<Region[]> {
  try {
    const supabase = createStaticSupabaseClient()

    const { data, error } = await supabase
      .from(TABLES.REGIONS)
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('getRegions failed', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('getRegions failed', error)
    return []
  }
}

// Search operations
export async function searchContent(query: string, limit = 20): Promise<SearchResult[]> {
  try {
    // Validate search query
    const searchResult = SearchQuerySchema.safeParse({ query, limit })
    if (!searchResult.success) {
      throw new ValidationError('Invalid search query', 'query', { query, limit })
    }

    const { query: validatedQuery, limit: validatedLimit } = searchResult.data

    // Sanitize search query to prevent SQL injection
    const sanitizedQuery = validateAndSanitizeSearch(validatedQuery)
    const searchTerm = `%${sanitizedQuery}%`
    
    const supabase = createStaticSupabaseClient()
    const perCategoryLimit = Math.max(1, Math.floor(validatedLimit / 4))
  
    // Search trails
    const { data: trails, error: trailsError } = await supabase
      .from(TABLES.TRAILS)
      .select('id, title, description, slug, featured_image, published_at')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .not('published_at', 'is', null)
      .limit(perCategoryLimit)

    if (trailsError) {
      throw new DatabaseError('Failed to search trails', { error: trailsError, query: sanitizedQuery })
    }

    // Search guides
    const { data: guides, error: guidesError } = await supabase
      .from(TABLES.GUIDES)
      .select('id, title, excerpt, slug, featured_image, published_at')
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
      .not('published_at', 'is', null)
      .limit(perCategoryLimit)

    if (guidesError) {
      throw new DatabaseError('Failed to search guides', { error: guidesError, query: sanitizedQuery })
    }

    // Search blog posts
    const { data: posts, error: postsError } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select('id, title, excerpt, slug, featured_image, published_at')
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
      .not('published_at', 'is', null)
      .limit(perCategoryLimit)

    if (postsError) {
      throw new DatabaseError('Failed to search blog posts', { error: postsError, query: sanitizedQuery })
    }

    // Search itineraries
    const { data: itineraries, error: itinerariesError } = await supabase
      .from(TABLES.ITINERARIES)
      .select('id, title, description, slug, featured_image, published_at')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .not('published_at', 'is', null)
      .limit(perCategoryLimit)

    if (itinerariesError) {
      throw new DatabaseError('Failed to search itineraries', { error: itinerariesError, query: sanitizedQuery })
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
  } catch (error) {
    console.error('searchContent failed', error)
    return []
  }
}

// For static generation
export async function getGuidesForStatic() {
  const supabase = createStaticSupabaseClient()
  
  const { data, error } = await supabase
    .from('guides')
    .select('slug')
    .not('published_at', 'is', null)
    
  if (error) {
    throw new DatabaseError('Failed to fetch guides for static generation', { error })
  }
  
  return data || []
}