//src/app/safety/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, AlertTriangle, ArrowRight, Mountain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Safety Tips - Pakistan Trails',
  description: 'Important safety information and tips for hiking and traveling in Pakistan.',
}

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Safety Tips
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Stay safe while exploring Pakistan&apos;s beautiful trails
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Essential Safety Guidelines</h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600">
                      <li>• Always inform someone of your travel plans and expected return time</li>
                      <li>• Check weather conditions before heading out</li>
                      <li>• Carry adequate water, food, and emergency supplies</li>
                      <li>• Use proper hiking gear and footwear</li>
                      <li>• Stay on marked trails when possible</li>
                      <li>• Respect local customs and regulations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Altitude Safety</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Many trails in Pakistan reach high altitudes. Be aware of altitude sickness symptoms
                      and acclimatize properly. If you experience severe symptoms, descend immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Mountain className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Emergency Contacts</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Keep emergency contact numbers handy. In case of emergency, call local authorities
                      or your embassy. Always have a backup communication method.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <Link href="/contact">
                  Contact Us for More Safety Information
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

