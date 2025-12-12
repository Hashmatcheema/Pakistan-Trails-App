import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'unknown',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}


