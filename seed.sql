-- Seed hero_media baseline
INSERT INTO hero_media (id, headline, subheading, file, status, published_at, created, updated)
VALUES (
  'hero-1',
  'Physician-Guided Metabolic Medicine',
  'Evidence-based protocols for long-term health restoration, survivorship excellence, and biological resilience.',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80',
  'published',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  headline = excluded.headline,
  subheading = excluded.subheading,
  file = excluded.file,
  status = excluded.status,
  published_at = excluded.published_at,
  updated = CURRENT_TIMESTAMP;

-- Seed founders baseline
INSERT INTO founders (id, name, title, bio, photo, created, updated, slug, status)
VALUES (
  'founder-1',
  'Clinical & Metabolic Leadership',
  'Physician-Guided Care Team',
  'Our multidisciplinary team unites board-certified physicians, metabolic health strategists, and performance coaches dedicated to survivorship excellence and long-term physiological resilience.',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  'clinical-metabolic-leadership',
  'published'
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  title = excluded.title,
  bio = excluded.bio,
  photo = excluded.photo,
  updated = CURRENT_TIMESTAMP;

-- Seed resources baseline
INSERT INTO resources (id, title, summary, category, format, url, members_only, created, updated)
VALUES 
  (
    'res-1',
    'Metabolic Survivorship Framework',
    'Comprehensive baseline framework for post-treatment physiological restoration and biomarker tracking.',
    'Guides',
    'guide',
    '/api/files/protocol-guide.pdf',
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'res-2',
    'Advanced Biomarker Reference Matrix',
    'Optimal clinical reference ranges for routine laboratory work, metabolic panels, and inflammatory markers.',
    'Clinical Tools',
    'guide',
    '/api/files/biomarker-matrix.pdf',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  summary = excluded.summary,
  category = excluded.category,
  format = excluded.format,
  url = excluded.url,
  members_only = excluded.members_only,
  updated = CURRENT_TIMESTAMP;
