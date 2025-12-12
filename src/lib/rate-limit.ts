//src/lib/rate-limit.ts
// Rate limiting utility
//
// In production, this uses Upstash Redis (distributed).
// In local/dev or when Upstash env vars aren't configured, it falls back to an in-memory limiter.

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class InMemoryRateLimiter {
  private store: RateLimitStore = {}
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  private cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  async check(identifier: string): Promise<RateLimitResult> {
    this.cleanup()

    const now = Date.now()
    const record = this.store[identifier]

    if (!record || record.resetTime < now) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs,
      }
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      }
    }

    if (record.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      }
    }

    record.count++
    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      resetTime: record.resetTime,
    }
  }
}

function createUpstash() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const redis = new Redis({ url, token })
  return {
    api: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: 'ratelimit:api',
    }),
    search: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      prefix: 'ratelimit:search',
    }),
    newsletter: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'ratelimit:newsletter',
    }),
  }
}

const upstash = createUpstash()
const fallbackApi = new InMemoryRateLimiter(100, 60000)
const fallbackSearch = new InMemoryRateLimiter(30, 60000)
const fallbackNewsletter = new InMemoryRateLimiter(5, 3600000)

async function checkWithUpstashOrFallback(
  ratelimit: Ratelimit | null,
  fallback: InMemoryRateLimiter,
  identifier: string
): Promise<RateLimitResult> {
  if (!ratelimit) return fallback.check(identifier)

  const res = await ratelimit.limit(identifier)
  return {
    allowed: res.success,
    remaining: res.remaining ?? 0,
    resetTime: res.reset ?? Date.now() + 60_000,
  }
}

// Create rate limiters for different endpoints (async interface)
export const apiRateLimiter = {
  check: (identifier: string) => checkWithUpstashOrFallback(upstash?.api ?? null, fallbackApi, identifier),
}
export const searchRateLimiter = {
  check: (identifier: string) => checkWithUpstashOrFallback(upstash?.search ?? null, fallbackSearch, identifier),
}
export const newsletterRateLimiter = {
  check: (identifier: string) => checkWithUpstashOrFallback(upstash?.newsletter ?? null, fallbackNewsletter, identifier),
}

// Get client identifier from request
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (works with most proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  return ip
}

