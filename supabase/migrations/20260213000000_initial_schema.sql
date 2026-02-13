-- Initial database schema for MCP Apps Directory
-- Created: 2026-02-13

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Developers table (app creators)
CREATE TABLE developers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  github_username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  twitter TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories for apps
CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apps table (MCP Apps)
CREATE TABLE apps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  long_description TEXT,
  screenshot_urls TEXT[],
  demo_video_url TEXT,
  github_url TEXT,
  npm_package TEXT,
  category_id uuid REFERENCES categories(id),
  tags TEXT[],
  
  -- Client compatibility
  compatibility_claude BOOLEAN DEFAULT FALSE,
  compatibility_chatgpt BOOLEAN DEFAULT FALSE,
  compatibility_vscode BOOLEAN DEFAULT FALSE,
  compatibility_goose BOOLEAN DEFAULT FALSE,
  
  -- Stats
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  install_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Relations
  developer_id uuid REFERENCES developers(id),
  
  -- Config templates for different clients
  config_template_claude JSONB,
  config_template_chatgpt JSONB,
  config_template_vscode JSONB,
  config_template_goose JSONB,
  
  -- Status
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  client_used TEXT, -- 'claude', 'chatgpt', 'vscode', 'goose'
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, user_id)
);

-- Blog posts table
CREATE TABLE blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id uuid REFERENCES developers(id),
  author_name TEXT,
  author_avatar TEXT,
  cover_image TEXT,
  tags TEXT[],
  category TEXT,
  read_time INTEGER, -- in minutes
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Status
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections/Curated lists
CREATE TABLE collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table: Apps in Collections
CREATE TABLE collection_apps (
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (collection_id, app_id)
);

-- User favorites/bookmarks
CREATE TABLE user_favorites (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, app_id)
);

-- App installs tracking
CREATE TABLE app_installs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  client TEXT, -- 'claude', 'chatgpt', 'vscode', 'goose'
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_apps_category ON apps(category_id);
CREATE INDEX idx_apps_developer ON apps(developer_id);
CREATE INDEX idx_apps_featured ON apps(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_apps_published ON apps(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_apps_slug ON apps(slug);

CREATE INDEX idx_reviews_app ON reviews(app_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at) WHERE is_published = TRUE;
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = TRUE;

CREATE INDEX idx_collection_apps_collection ON collection_apps(collection_id);
CREATE INDEX idx_collection_apps_app ON collection_apps(app_id);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
  ('Data Visualization', 'data-visualization', 'Charts, graphs, and data exploration tools', 'BarChart3', '#3B82F6', 1),
  ('Developer Tools', 'developer-tools', 'Code editors, debuggers, and dev utilities', 'Code2', '#22C55E', 2),
  ('Productivity', 'productivity', 'Task management, notes, and workflow tools', 'Zap', '#F59E0B', 3),
  ('Creative', 'creative', 'Design, media, and creative tools', 'Palette', '#EC4899', 4),
  ('Communication', 'communication', 'Chat, email, and collaboration tools', 'MessageSquare', '#8B5CF6', 5),
  ('Monitoring', 'monitoring', 'System monitoring and analytics dashboards', 'Activity', '#EF4444', 6),
  ('Documents', 'documents', 'PDF viewers, editors, and document tools', 'FileText', '#06B6D4', 7),
  ('Utilities', 'utilities', 'General purpose tools and utilities', 'Wrench', '#6B7280', 8);

-- Insert sample collections
INSERT INTO collections (name, slug, description, is_featured, sort_order) VALUES
  ('Getting Started', 'getting-started', 'Perfect apps for first-time MCP users', TRUE, 1),
  ('Data Viz Essentials', 'data-viz-essentials', 'Best apps for data visualization', TRUE, 2),
  ('Developer Favorites', 'developer-favorites', 'Top-rated developer tools', TRUE, 3),
  ('Productivity Boosters', 'productivity-boosters', 'Apps to supercharge your workflow', FALSE, 4);

-- Row Level Security (RLS) policies
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Developers: Public read, authenticated write
CREATE POLICY "Developers public read" ON developers FOR SELECT USING (TRUE);
CREATE POLICY "Developers insert own" ON developers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Developers update own" ON developers FOR UPDATE USING (auth.uid() = id);

-- Apps: Public read, developer write
CREATE POLICY "Apps public read" ON apps FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Apps developer insert" ON apps FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM developers WHERE id = auth.uid())
);
CREATE POLICY "Apps developer update" ON apps FOR UPDATE USING (
  developer_id IN (SELECT id FROM developers WHERE id = auth.uid())
);

-- Reviews: Public read, authenticated write own
CREATE POLICY "Reviews public read" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Reviews insert own" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reviews update own" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Reviews delete own" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Blog posts: Public read published, admin write all
CREATE POLICY "Blog posts public read" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Blog posts admin write" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM developers WHERE id = auth.uid() AND is_verified = TRUE)
);

-- User favorites: Private per user
CREATE POLICY "Favorites own read" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Favorites own insert" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Favorites own delete" ON user_favorites FOR DELETE USING (auth.uid() = user_id);
