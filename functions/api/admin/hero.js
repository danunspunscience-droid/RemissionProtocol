import { requireAdmin } from '../../_lib/requireAdmin.js';

export async function onRequestGet(context) {
  const guard = await requireAdmin(context);
  if (guard) return guard;
  const { env } = context;
  try {
    const db = env.DB || env.remission_db;
    const copy = await db.prepare("SELECT * FROM hero_copy ORDER BY created_at DESC LIMIT 1").first();
    const asset = await db.prepare("SELECT * FROM hero_assets ORDER BY created_at DESC LIMIT 1").first();
    return new Response(JSON.stringify({ copy, asset }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost(context) {
  const guard = await requireAdmin(context);
  if (guard) return guard;
  const { env, request } = context;
  try {
    const db = env.DB || env.remission_db;
    const { copy, asset } = await request.json();

    if (copy) {
      await db.prepare(
        "INSERT INTO hero_copy (id, eyebrow, headline_prefix, headline_italic, subheadline, primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url, bottom_tagline, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))"
      ).bind(
        crypto.randomUUID(), copy.eyebrow, copy.headline_prefix, copy.headline_italic, copy.subheadline,
        copy.primary_cta_text, copy.primary_cta_url, copy.secondary_cta_text, copy.secondary_cta_url, copy.bottom_tagline
      ).run();
    }

    if (asset) {
      await db.prepare(
        "INSERT INTO hero_assets (id, asset_url, poster_url, media_type, overlay_opacity, status, created_at) VALUES (?, ?, ?, ?, ?, 'active', datetime('now'))"
      ).bind(crypto.randomUUID(), asset.asset_url, asset.poster_url, asset.media_type || 'video', asset.overlay_opacity ?? 60).run();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}