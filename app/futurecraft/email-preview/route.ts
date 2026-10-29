import { NextRequest, NextResponse } from 'next/server';
import { newsletterWelcomeEmail, genesisConfirmationEmail, genesisWelcomeEmail } from '@/lib/futurecraft/emails';
// Public samples only. No subscriber data, real unsubscribe links, or sending actions.
export function GET(req:NextRequest){
 const type=req.nextUrl.searchParams.get('type');
 const html=type==='registration'?genesisConfirmationEmail('Maker'):type==='genesis'?genesisWelcomeEmail('Maker'):newsletterWelcomeEmail('https://www.silkstudios.com.ng/futurecraft#future');
 return new NextResponse(html,{headers:{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'self'"}});
}
