// Core data types for Pakistan Trails

export interface Region {
  id: string;
  slug: string;
  name: string;
  description: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
}

export interface Trail {
  id: string;
  slug: string;
  title: string;
  description: string;
  region_id: string;
  region?: Region;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  distance_km: number;
  elevation_gain_m: number;
  duration_h: number;
  gpx_url?: string;
  geojson?: any;
  start_point: {
    lat: number;
    lng: number;
  };
  end_point: {
    lat: number;
    lng: number;
  };
  photos: string[];
  safety_notes?: string;
  best_season: string[];
  created_by: string;
  published_at: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: any; // Portable Text
  region_id: string;
  region?: Region;
  best_time: string;
  transport_notes: string;
  accommodation: string;
  cost_estimate: string;
  featured_image: string;
  gallery: string[];
  seo_title?: string;
  seo_description?: string;
  youtube_embed_id?: string;
  published_at: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  slug: string;
  title: string;
  description: string;
  days: number;
  total_cost_estimate: number;
  cost_breakdown: {
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
  };
  day_by_day: DayPlan[];
  pdf_url?: string;
  map_embed?: string;
  related_trails: string[];
  featured_image: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  transport: string;
  notes?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: any; // Portable Text
  tags: string[];
  category: string;
  featured_image: string;
  read_time: number;
  published_at: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface VideoSeries {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtube_playlist_id: string;
  thumbnail: string;
  region_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Filter and search types
export interface TrailFilters {
  region?: string;
  difficulty?: string;
  max_distance?: number;
  min_elevation?: number;
  max_elevation?: number;
  search?: string;
}

export interface SearchResult {
  type: 'trail' | 'guide' | 'post' | 'itinerary';
  id: string;
  title: string;
  description: string;
  slug: string;
  image?: string;
  published_at: string;
}

// Map types
export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'trail' | 'guide' | 'accommodation';
  title: string;
  description?: string;
  difficulty?: string;
  distance?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
