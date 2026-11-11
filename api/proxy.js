export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const length = url.searchParams.get('length');

  // Validate that the length parameter exists
  if (!length) {
    return new Response(JSON.stringify({ error: 'Missing length parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    // Forward the request to lfdr.de with the provided length parameter
    const targetUrl = `https://lfdr.de/?length=${encodeURIComponent(length)}`;
    const response = await fetch(targetUrl);
    const data = await response.text();

    // Return the response back to your client with CORS enabled
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'text/plain',
        'Access-Control-Allow-Origin': '*', // Allows client-side fetch from any domain
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from target server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}