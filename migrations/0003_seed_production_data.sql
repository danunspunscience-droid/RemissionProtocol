-- Ensure correct schema for production seed tables
DROP TABLE IF EXISTS hero_copy;
CREATE TABLE hero_copy (
  id TEXT PRIMARY KEY,
  eyebrow TEXT DEFAULT '',
  headline_prefix TEXT DEFAULT '',
  headline_italic TEXT DEFAULT '',
  subheadline TEXT DEFAULT '',
  primary_cta_text TEXT DEFAULT '',
  primary_cta_url TEXT DEFAULT '',
  secondary_cta_text TEXT DEFAULT '',
  secondary_cta_url TEXT DEFAULT '',
  bottom_tagline TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (DATETIME('now'))
);

DROP TABLE IF EXISTS hero_assets;
CREATE TABLE hero_assets (
  id TEXT PRIMARY KEY,
  asset_url TEXT DEFAULT '',
  poster_url TEXT DEFAULT '',
  media_type TEXT DEFAULT 'video',
  overlay_opacity INTEGER DEFAULT 60,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (DATETIME('now'))
);

DROP TABLE IF EXISTS library_content;
CREATE TABLE library_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  body_text TEXT DEFAULT '',
  key_insight TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  media_type TEXT DEFAULT 'article',
  status TEXT DEFAULT 'published',
  published_at TEXT DEFAULT (DATETIME('now')),
  created_at TEXT DEFAULT (DATETIME('now'))
);

DROP TABLE IF EXISTS resources;
CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_key TEXT DEFAULT '',
  category TEXT DEFAULT '',
  status TEXT DEFAULT 'published',
  created_at TEXT DEFAULT (DATETIME('now'))
);

-- Seed Production Hero Copy
INSERT OR REPLACE INTO hero_copy (
  id, eyebrow, headline_prefix, headline_italic, subheadline,
  primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url,
  bottom_tagline, status, created_at
) VALUES (
  'hero_copy_prod_001',
  'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
  'Live Beyond',
  'the Prognosis.',
  'For high-achievers who have cleared active treatment and refuse to wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness.',
  'Request a Consultation →',
  '/consultation',
  'Explore Our Resources',
  '/resources',
  'PHYSICIAN-GUIDED · COACH-DELIVERED · BUILT FOR LIFE AFTER TREATMENT',
  'active',
  datetime('now')
);

-- Seed Production Hero Asset Background
INSERT OR REPLACE INTO hero_assets (
  id, asset_url, poster_url, media_type, overlay_opacity, status, created_at
) VALUES (
  'hero_asset_prod_001',
  '/hero-bg.mp4',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop',
  'video',
  60,
  'active',
  datetime('now')
);

-- Seed Production Content Library Monograph
INSERT OR REPLACE INTO library_content (
  id, title, category, summary, body_text, key_insight, video_url, cover_url, media_type, status, published_at, created_at
) VALUES (
  'lib_prod_001',
  'Therapeutic Ketones in Post-Treatment Oncology',
  'Metabolic Oncology',
  'Clinical review on modulating blood ketone bodies to optimize mitochondrial resilience following chemotherapy and radiation.',
  'Post-treatment metabolic recovery relies heavily on restoring mitochondrial substrate flexibility.',
  'Maintaining blood ketone levels between 1.0 - 2.5 mmol/L enhances cellular repair pathways.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
  'article',
  'published',
  datetime('now'),
  datetime('now')
);

-- Seed Production Downloadable Public Resource
INSERT OR REPLACE INTO resources (
  id, title, description, file_key, category, status, created_at
) VALUES (
  'res_prod_001',
  'Metabolic Baseline Reference Guide',
  'Comprehensive clinician reference guide detailing optimal biomarkers for metabolic survivorship.',
  'public/metabolic_baseline_guide.pdf',
  'Clinical Guide',
  'published',
  datetime('now')
);
