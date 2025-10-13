//src/app/contact/page.tsx
import { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Contact Us - Pakistan Trails',
  description: 'Get in touch with Pakistan Trails for travel advice, collaboration opportunities, or general inquiries.',
  keywords: [
    'contact Pakistan Trails',
    'travel advice Pakistan',
    'collaboration opportunities',
    'Pakistan travel help',
  ],
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Have questions about Pakistan travel? Want to collaborate? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="travel-advice">Travel Advice</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="trail-suggestion">Trail Suggestion</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Mail className="mr-3 h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">hello@pakistantrails.com</div>
                    <div className="text-sm text-gray-500">We respond within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="mr-3 h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <div className="text-gray-600">+92 300 123 4567</div>
                    <div className="text-sm text-gray-500">Mon-Fri, 9AM-6PM PKT</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-600">Islamabad, Pakistan</div>
                    <div className="text-sm text-gray-500">We're based in the capital</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="mr-3 h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Response Time</div>
                    <div className="text-gray-600">Within 24 hours</div>
                    <div className="text-sm text-gray-500">Usually much faster!</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium text-gray-900">How accurate are your trail maps?</div>
                  <div className="text-sm text-gray-600 mt-1">
                    All our trails are personally verified and GPS-tracked for accuracy.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Can I suggest a new trail?</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Absolutely! We love discovering new trails. Use the "Trail Suggestion" subject.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Do you offer guided tours?</div>
                  <div className="text-sm text-gray-600 mt-1">
                    We don't offer tours directly, but we can connect you with trusted local guides.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
