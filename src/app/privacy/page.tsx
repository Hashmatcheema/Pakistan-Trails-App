//src/app/privacy/page.tsx
import type { Metadata } from 'next'
import { Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy - Pakistan Trails',
  description: 'Privacy policy for Pakistan Trails website.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              How we collect, use, and protect your information
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
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Your Privacy Matters
                  </h2>
                </div>

                <div className="space-y-4 text-gray-600">
                  <div>
                    <h3 className="font-semibold text-gray-900">Information We Collect</h3>
                    <p className="mt-2 text-sm">
                      We collect information that you provide directly to us, such as when you
                      contact us or subscribe to our newsletter. We also automatically collect
                      certain information about your device and how you interact with our website.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">How We Use Your Information</h3>
                    <p className="mt-2 text-sm">
                      We use the information we collect to provide, maintain, and improve our services,
                      respond to your inquiries, and send you updates about new content and features.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Data Security</h3>
                    <p className="mt-2 text-sm">
                      We implement appropriate security measures to protect your personal information.
                      However, no method of transmission over the internet is 100% secure.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Third-Party Services</h3>
                    <p className="mt-2 text-sm">
                      We may use third-party services such as analytics providers. These services
                      have their own privacy policies governing the use of your information.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Your Rights</h3>
                    <p className="mt-2 text-sm">
                      You have the right to access, update, or delete your personal information.
                      Please contact us if you have any questions or concerns about your privacy.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Contact Us</h3>
                    <p className="mt-2 text-sm">
                      If you have questions about this Privacy Policy, please contact us at{' '}
                      <a href="mailto:privacy@pakistantrails.com" className="text-primary hover:underline">
                        privacy@pakistantrails.com
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

