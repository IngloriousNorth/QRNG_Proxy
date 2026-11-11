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
    // 1. Extract the query parameters from the incoming request URL
    const url = new URL(req.url);
    const length = url.searchParams.get('length') || '1'; // defaults to 10 if not provided

    // 2. Build the target URL using the extracted length
    const targetUrl = `https://lfdr.de/api?length=${length}`;
    const response = await fetch(targetUrl);
    const data = await response.text();

    // Return the response WITH the required CORS header
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' 
      },
    });
  }
}
