import { Mountain, Clock, MapPin, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trail } from '@/types'
import { formatDistance, formatDuration, formatElevation } from '@/lib/utils'

interface TrailStatsProps {
  trail: Trail
}

export function TrailStats({ trail }: TrailStatsProps) {
  const stats = [
    {
      label: 'Distance',
      value: formatDistance(trail.distance_km),
      icon: MapPin,
      description: 'Total trail length'
    },
    {
      label: 'Duration',
      value: formatDuration(trail.duration_h),
      icon: Clock,
      description: 'Estimated hiking time'
    },
    {
      label: 'Elevation Gain',
      value: `+${formatElevation(trail.elevation_gain_m)}`,
      icon: TrendingUp,
      description: 'Total elevation climbed'
    },
    {
      label: 'Difficulty',
      value: trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1),
      icon: Mountain,
      description: 'Trail difficulty level'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trail Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
