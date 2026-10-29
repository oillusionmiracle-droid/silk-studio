import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { getServerSupabase } from '@/lib/serverSupabase';
import { checkDistributedRateLimit, getClientIp, rateLimitedResponse } from '@/lib/rateLimit';

export const runtime='nodejs';
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(req:NextRequest){
 try{
  if(Number(req.headers.get('content-length')||0)>2048)return NextResponse.json({error:'Request too large'},{status:413});
  if(!req.headers.get('content-type')?.includes('application/json'))return NextResponse.json({error:'Invalid request'},{status:415});
  let body:unknown;try{body=await req.json();}catch{return NextResponse.json({error:'Invalid email address'},{status:400});}
  if(typeof body!=='object'||!body||Array.isArray(body))return NextResponse.json({error:'Invalid request'},{status:400});
  const data=body as Record<string,unknown>;
  const email=typeof data.email==='string'?data.email.trim().toLowerCase():'';
  if(!EMAIL.test(email)||email.length>254)return NextResponse.json({error:'Enter a valid email address'},{status:400});
  if(typeof data.website_url==='string'&&data.website_url.trim())return NextResponse.json({ok:true});
  if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)return NextResponse.json({error:'Newsletter signup is temporarily unavailable'},{status:503});
  const hash=createHash('sha256').update(email).digest('hex').slice(0,32);
  const ipLimit=await checkDistributedRateLimit('fc:newsletter:ip:'+getClientIp(req),6,60*60*1000);
  if(!ipLimit.allowed)return rateLimitedResponse(ipLimit.retryAfterSeconds);
  const emailLimit=await checkDistributedRateLimit('fc:newsletter:email:'+hash,3,24*60*60*1000);
  if(!emailLimit.allowed)return rateLimitedResponse(emailLimit.retryAfterSeconds);
  const db=getServerSupabase();
  const {error}=await db.from('futurecraft_newsletter_subscribers').upsert({email,subscribed_at:new Date().toISOString()},{onConflict:'email'});
  if(error){console.error('Futurecraft newsletter error',error.code);return NextResponse.json({error:'Newsletter signup could not be recorded right now.'},{status:503});}
  return NextResponse.json({ok:true});
 }catch(e){console.error('Futurecraft newsletter request failed',e instanceof Error?e.name:'unknown');return NextResponse.json({error:'Please try again later.'},{status:503});}
}
