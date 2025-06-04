// app/api/images/route.ts
export async function GET() {
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
    JSON.stringify(data),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
