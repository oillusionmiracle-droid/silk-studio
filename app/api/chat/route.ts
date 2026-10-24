import { GoogleGenAI } from '@google/genai';
import { websitePackages, naira, offerPrice } from '@/lib/websitePackages';
export const maxDuration = 60;
import { NextRequest, NextResponse } from 'next/server';
import {
  checkDistributedRateLimit,
  checkRateLimit,
  getClientIp,
  rateLimitedResponse,
} from '@/lib/rateLimit';

// Lazily constructed: `next build` imports this module to collect page data,
// so never build the client at import time. The handler only runs at request
// time, where the real key exists.
let ai: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!ai) ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return ai;
}

// Abuse caps: Gemini costs money per token, so keep the window tight.
const CHAT_LIMIT = 10; // requests
const CHAT_WINDOW_MS = 60 * 1000; // per minute, per IP
const MAX_MESSAGES = 20; // history turns accepted per request
const MAX_MESSAGE_CHARS = 2000; // per message
const MAX_TOTAL_CHARS = 12000; // whole payload

const SYSTEM_INSTRUCTION = `You are the official AI Assistant for Silk Studio, a premium design, print, and digital agency in Lagos.
Your goal is to assist clients with information about services, pricing, and general inquiries.
Be concise, professional, and friendly.

Core Services & Starting Prices:
- Print Services: Flyers, banners, jotters, ID cards; use /order for specifications and a current quote.
- Web & Digital: 40% off selected website packages. ${websitePackages.map(p => `${p.name}: regular ${naira(p.standard)}, offer ${naira(offerPrice(p.standard))}`).join('; ')}. Confirm scope and exclusions at /website-offer. Custom apps are quoted separately from ₦1,200,000 and are outside this offer.
- Design: Logo & branding, packaging, illustration
- Content: UGC, ads, photography and motion. Apparel and merchandise are available at /apparel.
- Blog at /blog publishes original practical advice and sourced commentary about AI tools, creator culture, content, business and print. It is called Blog, not Silk Notes. The site includes /portfolio, /studio, /contact, /apparel, /order and /website-offer. Offer exclusions are important: custom apps, domain, hosting and third-party services are outside the 40% selected-package discount. Do not invent deadlines or say every custom website receives it.

For full pricing details or custom quotes, encourage users to visit the Order page or contact us via WhatsApp.
Do not make up prices not listed here. If unsure, suggest requesting a custom quote on the Order page.`;

export async function POST(req: NextRequest) {
  // 1. Per-IP rate limit (bot / loop protection for a paid LLM endpoint).
  try {
  const ip = getClientIp(req);
  // The public live assistant already has provider configuration and its own
  // rate limit. Preview builds can reuse it without production database keys.
  const usePublicAssistant = process.env.VERCEL_ENV === 'preview' && !process.env.GEMINI_API_KEY;
  const rl = usePublicAssistant
    ? checkRateLimit(`preview-chat:${ip}`, CHAT_LIMIT, CHAT_WINDOW_MS)
    : await checkDistributedRateLimit(`chat:${ip}`, CHAT_LIMIT, CHAT_WINDOW_MS);
  if (!rl.allowed) {
    return rateLimitedResponse(
      rl.retryAfterSeconds,
      'Too many chat requests. Please wait a moment and try again.'
    );
  }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const messages = (body as any)?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages must be a non-empty array.' },
        { status: 400 }
      );
    }
    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: `Too many messages. Send at most ${MAX_MESSAGES} at a time.` },
        { status: 400 }
      );
    }

    let totalChars = 0;
    const contents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];
    for (const m of messages) {
      if (!m || typeof m !== 'object') {
        return NextResponse.json({ error: 'Each message must be an object.' }, { status: 400 });
      }
      if (m.role !== 'user' && m.role !== 'model') {
        return NextResponse.json(
          { error: 'Each message role must be "user" or "model".' },
          { status: 400 }
        );
      }
      if (typeof m.content !== 'string' || m.content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Each message must have non-empty text content.' },
          { status: 400 }
        );
      }
      if (m.content.length > MAX_MESSAGE_CHARS) {
        return NextResponse.json(
          { error: `Each message must be under ${MAX_MESSAGE_CHARS} characters.` },
          { status: 400 }
        );
      }
      totalChars += m.content.length;
      if (totalChars > MAX_TOTAL_CHARS) {
        return NextResponse.json(
          { error: 'Conversation is too long. Please start a new chat.' },
          { status: 400 }
        );
      }
      contents.push({ role: m.role, parts: [{ text: m.content }] });
    }

    if (usePublicAssistant) {
      const upstream = await fetch('https://www.silkstudios.com.ng/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(25000),
      });
      // Never forward cookies, authorization headers or user-configured URLs.
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          'Content-Type': upstream.headers.get('content-type') || 'text/plain',
          'Cache-Control': 'no-store',
          ...(upstream.headers.get('retry-after') ? { 'Retry-After': upstream.headers.get('retry-after')! } : {}),
        },
      });
    }

    const responseStream = await getAi().models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 1024,
      }
    });
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
        } catch (e) {
          console.error(e);
          controller.enqueue(new TextEncoder().encode("\n[Error generating response]"));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
