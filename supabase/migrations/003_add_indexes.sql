-- Add indexes for common query patterns
-- NOTE: Use CONCURRENTLY if you apply on a live DB (Supabase SQL editor may not allow it inside transactions).

-- Trails
CREATE INDEX IF NOT EXISTS idx_trails_slug ON trails(slug);
CREATE INDEX IF NOT EXISTS idx_trails_region_id ON trails(region_id);
CREATE INDEX IF NOT EXISTS idx_trails_published_at ON trails(published_at);
CREATE INDEX IF NOT EXISTS idx_trails_difficulty ON trails(difficulty);

-- Guides
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_region_id ON guides(region_id);
CREATE INDEX IF NOT EXISTS idx_guides_published_at ON guides(published_at);

-- Blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Itineraries
CREATE INDEX IF NOT EXISTS idx_itineraries_slug ON itineraries(slug);
CREATE INDEX IF NOT EXISTS idx_itineraries_published_at ON itineraries(published_at);


