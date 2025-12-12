//src/lib/env.ts
import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
  // Site Configuration
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1).optional().default('Pakistan Trails'),
  
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().default('https://test.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional().default('test-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Maps
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1).optional().default('test-mapbox-token'),
  
  // Analytics (optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Error tracking (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  
  // Email (optional)
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  
  // Rate limiting (optional; recommended for production)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // File Storage (optional)
  CLOUDINARY_URL: z.union([
    z.string().url(),
    z.literal(''),
    z.undefined(),
  ]).optional().transform((val) => (val === '' || val === 'your_cloudinary_url' ? undefined : val)),
  
  // JWT Secret (optional)
  JWT_SECRET: z.string().optional(),
  
  // Development
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables
function getEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      FROM_EMAIL: process.env.FROM_EMAIL,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      CLOUDINARY_URL: process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL !== 'your_cloudinary_url' 
        ? process.env.CLOUDINARY_URL 
        : undefined,
      JWT_SECRET: process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n')
      throw new Error(
        `Invalid or missing environment variables:\n${missingVars}\n\n` +
        'Please check your .env.local file and ensure all required variables are set.'
      )
    }
    throw error
  }
}

// Export validated environment variables
export const env = getEnv()

