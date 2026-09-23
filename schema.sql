PRAGMA foreign_keys = ON;

-- ============================================================================
-- 1. SYSTEM & ADMIN AUTHENTICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  password TEXT DEFAULT '',
  tokenKey TEXT DEFAULT '',
  verified BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  password TEXT DEFAULT '',
  role TEXT DEFAULT 'client',
  avatar TEXT DEFAULT '',
  emailVisibility BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT (DATETIME('now')),
  updated_at TEXT DEFAULT (DATETIME('now'))
);

-- ============================================================================
-- 2. SITE SETTINGS & DECOUPLED HERO CMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  copy_rotation_frequency TEXT DEFAULT 'daily',
  copy_manual_index INTEGER DEFAULT 0,
  asset_rotation_frequency TEXT DEFAULT 'daily',
  asset_manual_index INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS hero_copy (
  id TEXT PRIMARY KEY,
  headline TEXT NOT NULL,
  subhead TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS hero_assets (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  overlay_opacity INTEGER DEFAULT 40,
  is_active INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (DATETIME('now'))
);

-- Legacy Hero Media table (preserved for backwards compatibility)
CREATE TABLE IF NOT EXISTS hero_media (
  id TEXT PRIMARY KEY,
  headline TEXT DEFAULT '',
  subheading TEXT DEFAULT '',
  cta_label TEXT DEFAULT '',
  cta_link TEXT DEFAULT '',
  file TEXT DEFAULT '',
  media_type TEXT DEFAULT '',
  object_position TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  published_at TEXT DEFAULT '',
  video_autoplay BOOLEAN DEFAULT FALSE,
  video_controls BOOLEAN DEFAULT FALSE,
  video_loop BOOLEAN DEFAULT FALSE,
  video_muted BOOLEAN DEFAULT FALSE,
  created TEXT DEFAULT (DATETIME('now')),
  updated TEXT DEFAULT (DATETIME('now'))
);

-- ============================================================================
-- 3. PUBLIC CONTENT & RESOURCE HUB
-- ============================================================================

CREATE TABLE IF NOT EXISTS library_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  body_text TEXT DEFAULT '',
  content_type TEXT NOT NULL DEFAULT 'blog',
  status TEXT DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  youtube_url TEXT DEFAULT '',
  vimeo_url TEXT DEFAULT '',
  featured_image TEXT DEFAULT '',
  author_name TEXT DEFAULT '',
  author_credentials TEXT DEFAULT '',
  external_url TEXT DEFAULT '',
  read_time TEXT DEFAULT '',
  is_reference BOOLEAN DEFAULT FALSE,
  key_insight TEXT DEFAULT '',
  published_at TEXT DEFAULT (DATETIME('now')),
  created TEXT DEFAULT (DATETIME('now')),
  updated TEXT DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  category TEXT NOT NULL,
  format TEXT DEFAULT 'guide',
  url TEXT DEFAULT '',
  members_only BOOLEAN DEFAULT FALSE,
  created TEXT DEFAULT (DATETIME('now')),
  updated TEXT DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS podcast_episodes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  audio_file TEXT DEFAULT '',
  author_name TEXT DEFAULT '',
  author_credentials TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  publish_date TEXT DEFAULT '',
  created TEXT DEFAULT (DATETIME('now')),
  updated TEXT DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS founders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT DEFAULT '',
  credentials TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  personal_mission TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  photo_position TEXT DEFAULT 'center top',
  slug TEXT UNIQUE NOT NULL,
  sort_order NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'published',
  created TEXT DEFAULT (DATETIME('now')),
  updated TEXT DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  topic TEXT DEFAULT '',
  message TEXT DEFAULT '',
  created TEXT DEFAULT (DATETIME('now')),
  updated TEXT DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS membership_applications (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  age_range TEXT DEFAULT '',
  primary_goal TEXT DEFAULT '',
  current_health TEXT DEFAULT '',
  recent_diagnosis TEXT DEFAULT '',
  expectations TEXT DEFAULT '',
  timeline TEXT DEFAULT '',
  why_metx TEXT DEFAULT '',
  referral_source TEXT DEFAULT '',
  created TEXT DEFAULT (DATETIME('now')),
  updated TEXT DEFAULT (DATETIME('now'))
);

-- ============================================================================
-- 4. CLIENT PORTAL & PWA METRICS (EARMARKED)
-- ============================================================================

CREATE TABLE IF NOT EXISTS client_documents (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  title TEXT NOT NULL,
  file_key TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME('now')),
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  title TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (DATETIME('now')),
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS client_metrics (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value REAL NOT NULL,
  recorded_at TEXT NOT NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_library_content_status ON library_content (status);
CREATE INDEX IF NOT EXISTS idx_library_content_type ON library_content (content_type);
CREATE INDEX IF NOT EXISTS idx_resources_members_only ON resources (members_only);
CREATE INDEX IF NOT EXISTS idx_founders_slug ON founders (slug);