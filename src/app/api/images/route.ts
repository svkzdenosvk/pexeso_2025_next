// pages/api/images.ts

export async function GET(req: Request) {
  return new Response(JSON.stringify([
    {  name: 'kvapka' },
    {  name: 'vibracia' },
    {  name: 'more' },
    {  name: 'blesk' },
    {  name: 'drevo' },
    {  name: 'slnko' },
    {  name: 'vesmir' },
    {  name: 'vietor' },
  ]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}