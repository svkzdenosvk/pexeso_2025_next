
export async function POST(req: Request) {
  const { query } = await req.json();

  if (query.includes('images')) {
    const data = [
      { name: 'kvapka' },
      { name: 'vibracia' },
      { name: 'more' },
      { name: 'blesk' },
      { name: 'drevo' },
      { name: 'slnko' },
      { name: 'vesmir' },
      { name: 'vietor' },
    ];

    return new Response(
      JSON.stringify({
        data: { images: data },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Invalid query' }),
    { status: 400 }
  );
}
