import { PagesFunction } from '@cloudflare/workers-types';

interface HeroCopyPayload {
  eyebrow_tag?: string;
  headline_prefix?: string;
  headline_italic?: string;
  subheadline?: string;
  headline_color?: string;
  italic_color?: string;
  subheadline_color?: string;
  text_shadow_enabled?: boolean | number;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const copy = await env.DB.prepare('SELECT * FROM hero_copy WHERE id = 1').first();

    if (!copy) {
      // Fallback baseline record if id = 1 does not exist
      const defaultCopy = {
        id: 1,
        eyebrow_tag: 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
        headline_prefix: 'Live Beyond',
        headline_italic: 'the Prognosis.',
        subheadline: 'For high-achievers who have cleared active treatment and refuse to wait.',
        headline_color: '#ffffff',
        italic_color: '#dc2626',
        subheadline_color: '#3b82f6',
        text_shadow_enabled: 1,
      };
      return new Response(JSON.stringify(defaultCopy), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(copy), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to fetch hero copy' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as HeroCopyPayload;

    const eyebrow_tag = body.eyebrow_tag ?? 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX';
    const headline_prefix = body.headline_prefix ?? 'Live Beyond';
    const headline_italic = body.headline_italic ?? 'the Prognosis.';
    const subheadline = body.subheadline ?? '';
    const headline_color = body.headline_color ?? '#ffffff';
    const italic_color = body.italic_color ?? '#dc2626';
    const subheadline_color = body.subheadline_color ?? '#3b82f6';
    const text_shadow_enabled = body.text_shadow_enabled ? 1 : 0;

    await env.DB.prepare(
      `INSERT INTO hero_copy (
        id, eyebrow_tag, headline_prefix, headline_italic, subheadline, headline_color, italic_color, subheadline_color, text_shadow_enabled
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        eyebrow_tag = excluded.eyebrow_tag,
        headline_prefix = excluded.headline_prefix,
        headline_italic = excluded.headline_italic,
        subheadline = excluded.subheadline,
        headline_color = excluded.headline_color,
        italic_color = excluded.italic_color,
        subheadline_color = excluded.subheadline_color,
        text_shadow_enabled = excluded.text_shadow_enabled`
    )
      .bind(
        eyebrow_tag,
        headline_prefix,
        headline_italic,
        subheadline,
        headline_color,
        italic_color,
        subheadline_color,
        text_shadow_enabled
      )
      .run();

    const updatedCopy = await env.DB.prepare('SELECT * FROM hero_copy WHERE id = 1').first();

    return new Response(JSON.stringify({ success: true, copy: updatedCopy }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to update hero copy' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};