export async function GET(req) {
  const url = new URL(req.url);
  if (url.searchParams.get('ping') === '1') {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  }
  return new Response(JSON.stringify({ ok: true, route: '/api/chat' }), { status: 200, headers: { 'content-type': 'application/json' } });
}

export async function POST(req) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
    const body = await req.json();
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
    const txt = await resp.text();
    return new Response(txt, {
      status: resp.status,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Proxy request failed', details: String(e.message || e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
