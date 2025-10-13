'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Region, TrailFilters } from '@/types'

interface TrailFiltersProps {
  regions: Region[]
  currentFilters: TrailFilters
}

export function TrailFilters({ regions, currentFilters }: TrailFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const updateFilters = (newFilters: Partial<TrailFilters>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Clear existing filter params
    const filterKeys = ['region', 'difficulty', 'max_distance', 'min_elevation', 'max_elevation', 'search']
    filterKeys.forEach(key => params.delete(key))
    
    // Add new filter params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value.toString())
      }
    })
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    router.push(`/trails?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    const filterKeys = ['region', 'difficulty', 'max_distance', 'min_elevation', 'max_elevation', 'search', 'page']
    filterKeys.forEach(key => params.delete(key))
    router.push(`/trails?${params.toString()}`)
  }

  const hasActiveFilters = Object.values(currentFilters).some(value => value !== undefined && value !== '')

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Trails
          </label>
          <input
            type="text"
            placeholder="Trail name or description..."
            value={currentFilters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={currentFilters.region || ''}
            onChange={(e) => updateFilters({ region: e.target.value || undefined })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={currentFilters.difficulty || ''}
            onChange={(e) => updateFilters({ difficulty: e.target.value || undefined })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Distance Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Distance (km)
          </label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={currentFilters.max_distance || ''}
            onChange={(e) => updateFilters({ max_distance: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Elevation Range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Elevation Range (m)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                placeholder="0"
                value={currentFilters.min_elevation || ''}
                onChange={(e) => updateFilters({ min_elevation: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                placeholder="5000"
                value={currentFilters.max_elevation || ''}
                onChange={(e) => updateFilters({ max_elevation: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {currentFilters.region && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Region: {regions.find(r => r.id === currentFilters.region)?.name}
                  <button
                    onClick={() => updateFilters({ region: undefined })}
                    className="ml-1 hover:text-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {currentFilters.difficulty && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Difficulty: {currentFilters.difficulty}
                  <button
                    onClick={() => updateFilters({ difficulty: undefined })}
                    className="ml-1 hover:text-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {currentFilters.max_distance && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Max: {currentFilters.max_distance}km
                  <button
                    onClick={() => updateFilters({ max_distance: undefined })}
                    className="ml-1 hover:text-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
