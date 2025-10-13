import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client for server components
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Client-side Supabase client for client components
export const createBrowserSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database table names
export const TABLES = {
  REGIONS: 'regions',
  TRAILS: 'trails',
  GUIDES: 'guides',
  ITINERARIES: 'itineraries',
  BLOG_POSTS: 'blog_posts',
  VIDEO_SERIES: 'video_series',
  USERS: 'users',
} as const
