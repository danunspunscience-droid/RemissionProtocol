-- Hero Copy Table
CREATE TABLE IF NOT EXISTS hero_copy (
    id INTEGER PRIMARY KEY DEFAULT 1,
    eyebrow_tag TEXT NOT NULL DEFAULT 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
    headline_prefix TEXT NOT NULL DEFAULT 'Live Beyond',
    headline_italic TEXT NOT NULL DEFAULT 'the Prognosis.',
    subheadline TEXT NOT NULL,
    cta_label TEXT DEFAULT 'Request a Consultation',
    cta_link TEXT DEFAULT '/consultation',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Multi-Image Hero Carousel Table
CREATE TABLE IF NOT EXISTS hero_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    display_duration_ms INTEGER NOT NULL DEFAULT 6000,
    transition_speed_ms INTEGER NOT NULL DEFAULT 1200,
    overlay_opacity INTEGER NOT NULL DEFAULT 60,
    object_position TEXT NOT NULL DEFAULT 'center 30%',
    active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_sort ON hero_slides(sort_order, active);
