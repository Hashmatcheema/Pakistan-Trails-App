//src/lib/supabase-server.ts
// Server-only Supabase utilities (uses next/headers)
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from './env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Server-side Supabase client for server components
export const createServerSupabaseClient = async () => {
  try {
    const cookieStore = await cookies()
    
    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Handle cookies in middleware
            }
          },
        },
      }
    )
  } catch {
    // Fallback for static generation or environments without cookies
    return createClient(supabaseUrl, supabaseAnonKey)
  }
}

