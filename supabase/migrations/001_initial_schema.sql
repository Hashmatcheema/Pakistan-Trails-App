--supabase/migrations/001_initial_schema.sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create regions table
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trails table
CREATE TABLE trails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'hard', 'expert')),
    distance_km DECIMAL(10,2) NOT NULL,
    elevation_gain_m INTEGER NOT NULL,
    duration_h DECIMAL(5,2) NOT NULL,
    gpx_url TEXT,
    geojson JSONB,
    start_point POINT,
    end_point POINT,
    photos TEXT[] DEFAULT '{}',
    safety_notes TEXT,
    best_season TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guides table
CREATE TABLE guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    body JSONB,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    best_time TEXT,
    transport_notes TEXT,
    accommodation TEXT,
    cost_estimate TEXT,
    featured_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    seo_title VARCHAR(255),
    seo_description TEXT,
    youtube_embed_id VARCHAR(255),
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create itineraries table
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    days INTEGER NOT NULL,
    total_cost_estimate DECIMAL(10,2),
    cost_breakdown JSONB,
    day_by_day JSONB NOT NULL,
    pdf_url TEXT,
    map_embed TEXT,
    related_trails UUID[] DEFAULT '{}',
    featured_image TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    body JSONB,
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    featured_image TEXT,
    read_time INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create video_series table
CREATE TABLE video_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_playlist_id VARCHAR(255) NOT NULL,
    thumbnail TEXT,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_trails_region_id ON trails(region_id);
CREATE INDEX idx_trails_difficulty ON trails(difficulty);
CREATE INDEX idx_trails_published_at ON trails(published_at);
CREATE INDEX idx_trails_is_featured ON trails(is_featured);
CREATE INDEX idx_trails_distance ON trails(distance_km);
CREATE INDEX idx_trails_elevation ON trails(elevation_gain_m);

CREATE INDEX idx_guides_region_id ON guides(region_id);
CREATE INDEX idx_guides_published_at ON guides(published_at);
CREATE INDEX idx_guides_author_id ON guides(author_id);

CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

CREATE INDEX idx_itineraries_published_at ON itineraries(published_at);
CREATE INDEX idx_itineraries_days ON itineraries(days);

-- Create full-text search indexes
CREATE INDEX idx_trails_search ON trails USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_guides_search ON guides USING GIN(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trails_updated_at BEFORE UPDATE ON trails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_series_updated_at BEFORE UPDATE ON video_series FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_series ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for regions" ON regions FOR SELECT USING (true);
CREATE POLICY "Public read access for trails" ON trails FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "Public read access for guides" ON guides FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "Public read access for itineraries" ON itineraries FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "Public read access for blog_posts" ON blog_posts FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "Public read access for video_series" ON video_series FOR SELECT USING (true);

-- Create policies for authenticated users (admin/editor)
CREATE POLICY "Admin/Editor full access to trails" ON trails FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);

CREATE POLICY "Admin/Editor full access to guides" ON guides FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);

CREATE POLICY "Admin/Editor full access to itineraries" ON itineraries FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);

CREATE POLICY "Admin/Editor full access to blog_posts" ON blog_posts FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);

CREATE POLICY "Admin/Editor full access to video_series" ON video_series FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);

CREATE POLICY "Admin/Editor full access to regions" ON regions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
('trail-images', 'trail-images', true),
('gpx-files', 'gpx-files', true),
('pdf-files', 'pdf-files', true);

-- Create storage policies
CREATE POLICY "Public read access for trail images" ON storage.objects FOR SELECT USING (bucket_id = 'trail-images');
CREATE POLICY "Public read access for GPX files" ON storage.objects FOR SELECT USING (bucket_id = 'gpx-files');
CREATE POLICY "Public read access for PDF files" ON storage.objects FOR SELECT USING (bucket_id = 'pdf-files');

CREATE POLICY "Admin/Editor upload access" ON storage.objects FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);

CREATE POLICY "Admin/Editor update access" ON storage.objects FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);

CREATE POLICY "Admin/Editor delete access" ON storage.objects FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'editor')
    )
);
