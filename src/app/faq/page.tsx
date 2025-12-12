//src/app/faq/page.tsx
import type { Metadata } from 'next'
import { HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Pakistan Trails',
  description: 'Common questions and answers about hiking trails, travel guides, and planning your adventure in Pakistan.',
}

const faqs = [
  {
    question: 'How do I download GPX files for trails?',
    answer: 'GPX files are available on individual trail pages. Look for the download button on trail detail pages.',
  },
  {
    question: 'Are the trails suitable for beginners?',
    answer: 'Trails are categorized by difficulty (Easy, Moderate, Hard, Expert). Check the difficulty rating on each trail page to find trails suitable for your experience level.',
  },
  {
    question: 'What is the best time to visit Pakistan for hiking?',
    answer: 'The best time varies by region. Generally, late spring (May-June) and early autumn (September-October) offer the best weather for most trails. Check individual trail pages for specific seasonal recommendations.',
  },
  {
    question: 'Do I need permits for hiking in Pakistan?',
    answer: 'Some areas require permits, especially in national parks and restricted zones. Always check local regulations before your trip. Contact local authorities or tour operators for the most current information.',
  },
  {
    question: 'Can I contribute trail information?',
    answer: 'Yes! We welcome contributions. Please contact us through our contact page or collaboration page to share your trail experiences and information.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
              Common questions about trails, guides, and planning your adventure
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600">
                Still have questions?{' '}
                <a href="/contact" className="text-primary hover:underline">
                  Contact us
                </a>
                {' '}and we&apos;ll be happy to help!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

