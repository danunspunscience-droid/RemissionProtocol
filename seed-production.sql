-- Initial Production Seed Data for Remission Protocol

-- 1. Hero Settings & Rotation
INSERT OR REPLACE INTO hero_copy (id, eyebrow, headline_prefix, headline_italic, subheadline, primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url, bottom_tagline, status)
VALUES (1, 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX', 'Live Beyond', 'the Prognosis.', 'For high-achievers who have cleared active treatment and refuse to simply wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness. Not disease management. Survivorship excellence.', 'Request a Consultation →', '/consultation', 'Explore Our Resources', '/resources', 'PHYSICIAN-GUIDED · COACH-DELIVERED · BUILT FOR LIFE AFTER TREATMENT', 'active');

INSERT OR REPLACE INTO hero_assets (id, asset_url, media_type, overlay_opacity, status)
VALUES (1, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80', 'image', 60, 'active');

-- 2. Non-Lead-Capture Public Resources & Protocols
INSERT OR REPLACE INTO resources (id, title, category, summary, file_key, status, created_at, members_only)
VALUES (1, 'Metabolic Baseline & Biomarker Guide', 'Protocols', 'Comprehensive biomarker reference ranges for post-treatment metabolic restoration and mitochondrial health.', 'https://pub-media.remission-protocol.com/public/metabolic-baseline-guide.pdf', 'published', CURRENT_TIMESTAMP, 0),
(2, 'Integrative Survivorship Framework', 'Whitepapers', 'Clinical protocol blueprint detailing exercise oncology, hyperbaric oxygen therapy, and metabolic pulse strategies.', 'https://pub-media.remission-protocol.com/public/survivorship-framework.pdf', 'published', CURRENT_TIMESTAMP, 0);

-- 3. High-Authority Blog & Video Content (using library_content table)
INSERT OR REPLACE INTO library_content (id, title, excerpt, body_text, content_type, status, featured, youtube_url, vimeo_url)
VALUES (1, 'Targeting Metabolic Vulnerabilities Post-Chemotherapy', 'An in-depth analysis of cellular respiration restoration and targeted fasting protocols following cytotoxic cancer therapy.', 'Full article detailing mitochondrial resuscitation and glycemic control strategies.', 'blog', 'published', 0, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL);