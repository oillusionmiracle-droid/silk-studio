import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  getClientIp,
  rateLimitedResponse,
} from '@/lib/rateLimit';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
- Print Services: Flyers, banners, jotters, ID cards (from ₦4,500)
- Web & Digital: Landing pages, business websites, event pages (from ₦80,000)
- Design: Logo & branding, packaging, illustration

For full pricing details or custom quotes, encourage users to visit the Order page or contact us via WhatsApp.
Do not make up prices not listed here. If unsure, suggest requesting a custom quote on the Order page.`;

export async function POST(req: NextRequest) {
  // 1. Per-IP rate limit (bot / loop protection for a paid LLM endpoint).
  const ip = getClientIp(req);
  const rl = checkRateLimit(`chat:${ip}`, CHAT_LIMIT, CHAT_WINDOW_MS);
  if (!rl.allowed) {
    return rateLimitedResponse(
      rl.retryAfterSeconds,
      'Too many chat requests. Please wait a moment and try again.'
    );
  }

  try {
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

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
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
