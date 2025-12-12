//src/app/not-found.tsx
import Link from 'next/link'
import { ArrowLeft, Mountain, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Mountain className="mx-auto h-24 w-24 text-gray-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Trail Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you&apos;ve wandered off the beaten path. The page you&apos;re looking for 
          doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/trails">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explore Trails
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
