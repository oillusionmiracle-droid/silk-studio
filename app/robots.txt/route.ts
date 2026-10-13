import { robotsText } from '@/lib/searchIndex';
export function GET() {
  return new Response(robotsText(), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
}
