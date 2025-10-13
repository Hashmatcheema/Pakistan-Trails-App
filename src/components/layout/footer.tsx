import Link from 'next/link'
import { Mountain, Youtube, Instagram, Twitter, Mail } from 'lucide-react'

const navigation = {
  guides: [
    { name: 'Hunza Valley', href: '/guides/hunza-travel-guide' },
    { name: 'Skardu', href: '/guides/skardu-travel-guide' },
    { name: 'Swat Valley', href: '/guides/swat-valley-guide' },
    { name: 'Kumrat Valley', href: '/guides/kumrat-valley-guide' },
  ],
  trails: [
    { name: 'Miranjani Peak', href: '/trails/miranjani-peak' },
    { name: 'Katora Lake', href: '/trails/katora-lake' },
    { name: 'Fairy Meadows', href: '/trails/fairy-meadows-trek' },
    { name: 'Ansoo Lake', href: '/trails/ansoo-lake' },
  ],
  resources: [
    { name: 'Itineraries', href: '/itineraries' },
    { name: 'Blog', href: '/blog' },
    { name: 'Videos', href: '/videos' },
    { name: 'About', href: '/about' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'Collaborate', href: '/collaborate' },
    { name: 'Safety Tips', href: '/safety' },
    { name: 'FAQ', href: '/faq' },
  ],
}

const socialLinks = [
  {
    name: 'YouTube',
    href: 'https://youtube.com/@pakistantrails',
    icon: Youtube,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/pakistantrails',
    icon: Instagram,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/pakistantrails',
    icon: Twitter,
  },
  {
    name: 'Email',
    href: 'mailto:hello@pakistantrails.com',
    icon: Mail,
  },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Pakistan Trails</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your travel & hiking companion for Pakistan — detailed guides, 
              trail maps, itineraries & adventure stories.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Get Trail Tips</h3>
              <p className="text-xs text-gray-400 mb-3">
                Monthly updates on hidden gems and new trails
              </p>
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Follow Our Adventures</h3>
              <div className="flex space-x-4">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {/* Guides */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Travel Guides</h3>
                <ul className="space-y-3">
                  {navigation.guides.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trails */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Popular Trails</h3>
                <ul className="space-y-3">
                  {navigation.trails.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Support</h3>
                <ul className="space-y-3">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
              <p className="text-sm text-gray-400">
                © 2024 Pakistan Trails. All rights reserved.
              </p>
              <p className="text-sm text-gray-400">
                Made with ❤️ for Pakistan
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
