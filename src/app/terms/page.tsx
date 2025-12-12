//src/app/terms/page.tsx
import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Service - Pakistan Trails',
  description: 'Terms of service for Pakistan Trails website.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Terms and conditions for using Pakistan Trails
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Terms and Conditions
                  </h2>
                </div>

                <div className="space-y-4 text-gray-600">
                  <div>
                    <h3 className="font-semibold text-gray-900">Acceptance of Terms</h3>
                    <p className="mt-2 text-sm">
                      By accessing and using Pakistan Trails, you accept and agree to be bound by
                      these Terms of Service. If you do not agree, please do not use our website.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Use of Content</h3>
                    <p className="mt-2 text-sm">
                      All content on Pakistan Trails is for informational purposes only. Trail information,
                      maps, and guides are provided as-is and should be verified independently before
                      your trip.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Safety Disclaimer</h3>
                    <p className="mt-2 text-sm">
                      Hiking and outdoor activities carry inherent risks. Pakistan Trails is not
                      responsible for any injuries, accidents, or damages that may occur while using
                      information from this website. Always exercise caution and use your best judgment.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Accuracy of Information</h3>
                    <p className="mt-2 text-sm">
                      While we strive to provide accurate information, trail conditions, regulations,
                      and access may change. Always verify current conditions and regulations before
                      your trip.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Intellectual Property</h3>
                    <p className="mt-2 text-sm">
                      All content, including text, images, and maps, is the property of Pakistan Trails
                      or its content providers. Unauthorized use or reproduction is prohibited.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Limitation of Liability</h3>
                    <p className="mt-2 text-sm">
                      Pakistan Trails shall not be liable for any indirect, incidental, special, or
                      consequential damages arising from your use of this website or the information
                      contained herein.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Contact</h3>
                    <p className="mt-2 text-sm">
                      For questions about these Terms of Service, please contact us at{' '}
                      <a href="mailto:legal@pakistantrails.com" className="text-primary hover:underline">
                        legal@pakistantrails.com
                      </a>
                    </p>
                  </div>

                  <div className="pt-4 text-xs text-gray-500">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

