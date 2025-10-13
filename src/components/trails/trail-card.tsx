import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Mountain, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trail } from '@/types'
import { formatDistance, formatDuration, formatElevation, getDifficultyColor, getDifficultyLabel, getRegionLabel } from '@/lib/utils'

interface TrailCardProps {
  trail: Trail
  view: 'map' | 'list'
}

export function TrailCard({ trail, view }: TrailCardProps) {
  if (view === 'list') {
    return (
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative h-48 w-full sm:h-32 sm:w-48 flex-shrink-0">
            <Image
              src={trail.photos[0] || '/placeholder-trail.jpg'}
              alt={trail.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${getDifficultyColor(trail.difficulty)}`}>
                {getDifficultyLabel(trail.difficulty)}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                <MapPin className="mr-1 h-3 w-3" />
                {trail.region?.name}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  <Link href={`/trails/${trail.slug}`}>
                    {trail.title}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                  {trail.description}
                </CardDescription>
                
                {/* Stats */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mountain className="mr-1 h-4 w-4" />
                    {formatDistance(trail.distance_km)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDuration(trail.duration_h)}
                  </div>
                  <div className="flex items-center">
                    <Mountain className="mr-1 h-4 w-4" />
                    +{formatElevation(trail.elevation_gain_m)}
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Button asChild>
                  <Link href={`/trails/${trail.slug}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid view (default)
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={trail.photos[0] || '/placeholder-trail.jpg'}
          alt={trail.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${getDifficultyColor(trail.difficulty)}`}>
            {getDifficultyLabel(trail.difficulty)}
          </span>
        </div>
        
        {/* Region Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
            <MapPin className="mr-1 h-3 w-3" />
            {trail.region?.name}
          </span>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/trails/${trail.slug}`}>
            {trail.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {trail.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDistance(trail.distance_km)}
            </div>
            <div className="text-xs text-gray-600">Distance</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDuration(trail.duration_h)}
            </div>
            <div className="text-xs text-gray-600">Duration</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              +{formatElevation(trail.elevation_gain_m)}
            </div>
            <div className="text-xs text-gray-600">Elevation</div>
          </div>
        </div>
        
        <Button asChild className="w-full">
          <Link href={`/trails/${trail.slug}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
