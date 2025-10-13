//Created a new API route to handle GET /videos requests, returning a placeholder response to resolve the 404 error. You can replace the placeholder data with actual video data from your database.
//src/app/videos/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Placeholder video data (replace with actual database query)
  const videos = [
    {
      id: 1,
      title: 'Hunza Valley Adventure',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      duration: '2h 30m',
      rating: 4.9,
      category: 'Adventure Series',
    },
    // Add more video objects as needed
  ]

  return NextResponse.json({
    data: videos,
    pagination: {
      page: 1,
      totalPages: 1,
      total: videos.length,
    },
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}