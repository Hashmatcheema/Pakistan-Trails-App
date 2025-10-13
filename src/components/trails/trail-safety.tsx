import { AlertTriangle, Shield, Phone, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TrailSafetyProps {
  safetyNotes: string
}

export function TrailSafety({ safetyNotes }: TrailSafetyProps) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center text-amber-800">
          <Shield className="mr-2 h-5 w-5" />
          Safety Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start">
            <AlertTriangle className="mr-3 h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-amber-800">
              <p className="font-medium mb-2">Important Safety Notes:</p>
              <p className="text-sm leading-relaxed">{safetyNotes}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center text-sm text-amber-700">
              <Phone className="mr-2 h-4 w-4" />
              Emergency: 112
            </div>
            <div className="flex items-center text-sm text-amber-700">
              <MapPin className="mr-2 h-4 w-4" />
              Share your location
            </div>
          </div>
          
          <div className="pt-2 border-t border-amber-200">
            <p className="text-xs text-amber-700">
              Always inform someone of your hiking plans and expected return time. 
              Check weather conditions before departure and carry appropriate gear.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
