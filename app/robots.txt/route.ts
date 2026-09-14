import { NextResponse } from 'next/server';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://silkstudios.com.ng';

export function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
