# Pakistan Trails

Your travel & hiking companion for Pakistan — detailed guides, trail maps, itineraries & adventure stories.

## 🏔️ About

Pakistan Trails is a comprehensive platform for discovering and exploring Pakistan's most beautiful hiking trails and travel destinations. From the towering peaks of Hunza to the hidden valleys of Swat, we provide detailed guides, interactive maps, and practical information to help you plan your perfect adventure.

## ✨ Features

- **Interactive Trail Maps** - Explore trails with detailed maps powered by Mapbox
- **Comprehensive Travel Guides** - Detailed guides for Pakistan's top destinations
- **GPX Downloads** - Download trail files for your GPS devices
- **Photo Galleries** - High-quality photos from each trail
- **Safety Information** - Important safety tips and considerations
- **Mobile-First Design** - Optimized for all devices
- **SEO Optimized** - Built for search engine visibility

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL JS
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Mapbox account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/pakistan-trails.git
cd pakistan-trails
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Pakistan Trails

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

5. Set up the database:
```bash
# Run the migrations in your Supabase dashboard
# Or use the Supabase CLI
supabase db reset
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
pakistan-trails/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── trails/            # Trail pages
│   │   ├── guides/            # Travel guide pages
│   │   ├── blog/              # Blog pages
│   │   └── ...
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   └── trails/            # Trail-specific components
│   ├── lib/                   # Utility functions
│   │   ├── database.ts        # Database operations
│   │   ├── mapbox.ts          # Map utilities
│   │   └── utils.ts           # General utilities
│   └── types/                 # TypeScript type definitions
├── supabase/
│   └── migrations/            # Database migrations
└── public/                     # Static assets
```

## 🗄️ Database Schema

The application uses the following main tables:

- **regions** - Geographic regions (Hunza, Skardu, etc.)
- **trails** - Hiking trail information
- **guides** - Travel guide content
- **itineraries** - Trip planning content
- **blog_posts** - Blog articles
- **users** - User accounts and authentication

## 🗺️ Map Integration

The application uses Mapbox GL JS for interactive maps:

- Trail visualization with custom markers
- GPX file integration
- Clustering for better performance
- Custom map styles

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized images and assets
- Progressive Web App (PWA) ready

## 🔍 SEO Features

- Server-side rendering (SSR)
- Dynamic meta tags
- Structured data (JSON-LD)
- XML sitemaps
- Optimized images

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Pakistan's incredible natural beauty
- The hiking community for trail information
- Open source contributors
- Local guides and communities

## 📞 Support

- Email: hello@pakistantrails.com
- Website: https://pakistantrails.com
- GitHub Issues: [Create an issue](https://github.com/your-username/pakistan-trails/issues)

---

Made with ❤️ for Pakistan