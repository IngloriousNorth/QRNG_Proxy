export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Handle preflight OPTIONS request if necessary
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    // Fetch data from your target provider (e.g., lfdr.de)
    const targetUrl = `https://lfdr.de/api?length=${length}`;
    const response = await fetch(targetUrl);
    const data = await response.text();

    // Return the response WITH the required CORS header
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'text/plain',
        'Access-Control-Allow-Origin': '*', // <-- This fixes the CORS error!
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' // <-- Also include on errors
      },
    });
  }
}
