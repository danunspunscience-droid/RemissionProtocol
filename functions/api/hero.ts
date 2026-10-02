import { PagesFunction } from '@cloudflare/workers-types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'DB binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const copyRes = await env.DB.prepare(
      'SELECT * FROM hero_copy WHERE id = 1'
    ).first();

    const { results: slides } = await env.DB.prepare(
      'SELECT * FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC'
    ).all();

    return new Response(
      JSON.stringify({
        copy: copyRes || null,
        slides: slides || [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to aggregate hero data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};