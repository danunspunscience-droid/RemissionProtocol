-- Migration 0004: Align resources, resource_assets, and library_content schemas

-- 1. Create resource_assets table
CREATE TABLE IF NOT EXISTS resource_assets (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
description TEXT,
category TEXT DEFAULT 'Protocol',
r2_key TEXT NOT NULL,
download_count INTEGER DEFAULT 0,
members_only INTEGER DEFAULT 0,
published INTEGER DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create resources table alias for backward compatibility
CREATE TABLE IF NOT EXISTS resources (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
description TEXT,
category TEXT DEFAULT 'Protocol',
r2_key TEXT NOT NULL,
download_count INTEGER DEFAULT 0,
members_only INTEGER DEFAULT 0,
published INTEGER DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ensure slug column exists on library_content
ALTER TABLE library_content ADD COLUMN slug TEXT;
