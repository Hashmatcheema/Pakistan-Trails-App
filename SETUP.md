# Pakistan Trails - Setup Guide

## 🚀 Quick Start

The Pakistan Trails website is now ready to run! Here's how to get started:

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Pakistan Trails

# Database (Get these from Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Maps (Get from Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email (Optional)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@pakistantrails.com

# File Storage (Optional)
CLOUDINARY_URL=your_cloudinary_url_here

# JWT Secret for admin authentication
JWT_SECRET=your_jwt_secret_key_here

# Development
NODE_ENV=development
```

### 3. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the migrations from `supabase/migrations/001_initial_schema.sql`
4. Run the seed data from `supabase/migrations/002_seed_data.sql`
5. Copy your project URL and anon key to the environment variables

### 4. Set Up Mapbox

1. Create an account at [mapbox.com](https://mapbox.com)
2. Get your access token from the account page
3. Add it to your environment variables

### 5. Run the Development Server

```bash
npm run dev
```

The website will be available at [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The database includes the following tables:
- `regions` - Geographic areas (Hunza, Skardu, etc.)
- `trails` - Hiking trail data with GPS coordinates
- `guides` - Travel destination guides
- `itineraries` - Trip planning content
- `blog_posts` - Adventure stories
- `users` - Authentication system

## 🗺️ Map Integration

The website uses Mapbox GL JS for interactive maps. You'll need:
1. A Mapbox account
2. An access token
3. The token added to your environment variables

## 📱 Features

- ✅ Responsive design for all devices
- ✅ Interactive trail maps with Mapbox
- ✅ GPX file downloads
- ✅ Photo galleries with lightbox
- ✅ SEO optimization
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Supabase database integration

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Troubleshooting

### Common Issues

1. **Module format errors**: Make sure `"type": "module"` is set in package.json
2. **Missing dependencies**: Run `npm install` to install all dependencies
3. **Database connection**: Check your Supabase credentials
4. **Map not loading**: Verify your Mapbox token

### Development Tips

- Use `npm run dev` for development
- Use `npm run build` to test production build
- Check the browser console for any errors
- Ensure all environment variables are set correctly

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database migrations have been run
4. Check that all dependencies are installed

## 🎉 Ready to Go!

Your Pakistan Trails website is now ready to showcase the beauty of Pakistan's mountains and trails! 🇵🇰🏔️
