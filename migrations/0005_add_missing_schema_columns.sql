-- Migration 0005: Add missing columns required by API endpoints

-- 1. Add description column to library_content
ALTER TABLE library_content ADD COLUMN description TEXT;

-- 2. Add slug column to resource_assets and resources
ALTER TABLE resource_assets ADD COLUMN slug TEXT;
ALTER TABLE resources ADD COLUMN slug TEXT;
