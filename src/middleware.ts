//src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiRateLimiter, getClientIdentifier } from './lib/rate-limit'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Keep Supabase session fresh (SSR helpers rely on cookies)
  // NOTE: avoid importing strict env parsing here; middleware runs in more environments.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    // Touch auth state to refresh cookies when needed.
    // We intentionally ignore failures to avoid breaking public pages.
    void supabase.auth.getUser()
  }

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const identifier = getClientIdentifier(request)
    const result = await apiRateLimiter.check(identifier)

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            name: 'RateLimitError',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
          },
        }
      )
    }

    // Add rate limit headers to successful requests
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
      Run middleware on all routes (to maintain auth cookies), but skip Next internals.
      API routes are included (rate limiting applies there).
    */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

