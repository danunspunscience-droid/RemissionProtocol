export interface HeroCopyRecord {
id: number;
headline: string;
subheadline: string;
badge_text: string;
cta_primary_text: string;
cta_primary_url: string;
cta_secondary_text: string;
cta_secondary_url: string;
updated_at?: string;
}

export interface HeroMediaRecord {
id: number;
title: string;
media_type: 'image' | 'video';
r2_key: string;
overlay_opacity: number;
status: 'published' | 'draft';
created_at?: string;
}

export interface ResourceRecord {
id: number;
title: string;
description: string;
category: string;
r2_key: string;
download_count: number;
members_only: boolean;
published: boolean;
}

export interface LibraryContentRecord {
id: number;
title: string;
content_type: 'video' | 'audio' | 'article';
video_url?: string;
embed_type?: 'youtube' | 'vimeo';
cover_image_key?: string;
summary: string;
published: boolean;
}

export interface FounderRecord {
id: number;
name: string;
title: string;
bio: string;
photo_key: string;
sort_order: number;
}
