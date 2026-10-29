import { NextResponse } from 'next/server';

// Preview-only QA surface. The iframe gives the actual route a phone-sized viewport.
export function GET() {
  if (process.env.VERCEL_ENV !== 'preview') return new NextResponse('Not found', { status: 404 });
  return new NextResponse(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Futurecraft hero responsive review</title><style>body{margin:0;background:#202020;color:white;font:14px system-ui;text-align:center}nav{height:48px;display:flex;gap:12px;align-items:center;justify-content:center}button{border:0;border-radius:20px;padding:8px 15px;cursor:pointer}iframe{display:block;margin:0 auto;border:0;background:black;width:390px;height:844px;max-width:100%}</style><nav><button onclick="resize(390,844)">Phone 390</button><button onclick="resize(360,800)">Phone 360</button><button onclick="resize(768,1024)">Tablet 768</button></nav><iframe title="Futurecraft responsive preview" src="/futurecraft"></iframe><script>function resize(w,h){let f=document.querySelector('iframe');f.style.width=w+'px';f.style.height=h+'px'}</script></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
  });
}
