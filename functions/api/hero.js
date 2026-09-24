export async function onRequestGet(context) {
  const { env } = context;

  try {
    const db = env.DB || env.remission_db;
    if (!db) {
      return new Response(JSON.stringify({ error: 'D1 database binding missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const copyResult = await db
      .prepare("SELECT eyebrow, headline_prefix, headline_italic, subheadline, primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url, bottom_tagline FROM hero_copy WHERE status = 'active' ORDER BY created_at DESC LIMIT 1")
      .first();

    const assetResult = await db
      .prepare("SELECT asset_url, media_type, overlay_opacity FROM hero_assets WHERE status = 'active' ORDER BY created_at DESC LIMIT 1")
      .first();

    const defaultVideoUrl = '/hero-bg.mp4';
    const defaultPosterUrl = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop';

    const payload = {
      copy: copyResult || {
        eyebrow: 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
        headline_prefix: 'Live Beyond',
        headline_italic: 'the Prognosis.',
        subheadline: 'For high-achievers who have cleared active treatment and refuse to wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness. Not disease management. Survivorship excellence.',
        primary_cta_text: 'Request a Consultation →',
        primary_cta_url: '/consultation',
        secondary_cta_text: 'Explore Our Resources',
        secondary_cta_url: '/resources',
        bottom_tagline: 'PHYSICIAN-GUIDED · COACH-DELIVERED · BUILT FOR LIFE AFTER TREATMENT',
      },
      asset: {
        asset_url: assetResult.asset_url || defaultVideoUrl,
        poster_url: defaultPosterUrl,
        media_type: assetResult.media_type || 'video',
        overlay_opacity: assetResult.overlay_opacity ? 60 : 60,
      },
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}