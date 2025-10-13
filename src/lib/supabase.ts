//src/lib/supabase.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client (for client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client for server components
export const createServerSupabaseClient = async () => {
  try {
    const cookieStore = await cookies()
    
    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookies in middleware
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Handle cookies in middleware
            }
          },
        },
      }
    )
  } catch (error) {
    // Fallback for static generation or environments without cookies
    return createClient(supabaseUrl, supabaseAnonKey)
  }
}

// Static Supabase client for static generation (no cookies)
export const createStaticSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
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