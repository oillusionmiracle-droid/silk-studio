import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
  try {
    const { messages } = await req.json();

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

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
