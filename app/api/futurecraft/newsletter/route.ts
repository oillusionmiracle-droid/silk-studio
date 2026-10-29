import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { newsletterWelcomeEmail, newsletterWelcomeText } from '@/lib/futurecraft/emails';
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
  if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY||!process.env.RESEND_API_KEY||!process.env.FUTURECRAFT_FROM_EMAIL)return NextResponse.json({error:'Newsletter signup is temporarily unavailable'},{status:503});
  const hash=createHash('sha256').update(email).digest('hex').slice(0,32);
  const ipLimit=await checkDistributedRateLimit('fc:newsletter:ip:'+getClientIp(req),6,60*60*1000);
  if(!ipLimit.allowed)return rateLimitedResponse(ipLimit.retryAfterSeconds);
  const emailLimit=await checkDistributedRateLimit('fc:newsletter:email:'+hash,3,24*60*60*1000);
  if(!emailLimit.allowed)return rateLimitedResponse(emailLimit.retryAfterSeconds);
  const db=getServerSupabase();
  const {error}=await db.from('futurecraft_newsletter_subscribers').upsert({email,subscribed_at:new Date().toISOString()},{onConflict:'email',ignoreDuplicates:true});
  if(error){console.error('Futurecraft newsletter error',error.code);return NextResponse.json({error:'Newsletter signup could not be recorded right now.'},{status:503});}
  const {data:subscriber,error:readError}=await db.from('futurecraft_newsletter_subscribers').select('unsubscribe_token,welcome_sent_at,unsubscribed_at').eq('email',email).single();
  if(readError||!subscriber)return NextResponse.json({error:'Your signup could not be completed. Please try again.'},{status:503});
  // A public signup must never silently reset an earlier opt-out.
  if(subscriber.unsubscribed_at)return NextResponse.json({error:'This address has opted out of Futurecraft updates. Contact us if you would like to rejoin.'},{status:409});
  if(!subscriber.welcome_sent_at){
   const unsubscribeUrl='https://www.silkstudios.com.ng/api/futurecraft/newsletter/unsubscribe?token='+subscriber.unsubscribe_token;
   const resend=new Resend(process.env.RESEND_API_KEY);
   const {error:mailError}=await resend.emails.send({
    from:process.env.FUTURECRAFT_FROM_EMAIL!,replyTo:process.env.FUTURECRAFT_REPLY_TO,to:[email],
    subject:'Welcome to Futurecraft. What will you make?',
    html:newsletterWelcomeEmail(unsubscribeUrl),text:newsletterWelcomeText(unsubscribeUrl),
    headers:{'List-Unsubscribe':'<'+unsubscribeUrl+'>','List-Unsubscribe-Post':'List-Unsubscribe=One-Click'},
   },{idempotencyKey:'futurecraft-newsletter-welcome-'+subscriber.unsubscribe_token});
   if(mailError){console.error('Futurecraft welcome email failed',mailError.name);return NextResponse.json({error:'Your address is saved, but the welcome email could not be sent. Please try again.'},{status:503});}
   const {error:markError}=await db.from('futurecraft_newsletter_subscribers').update({welcome_sent_at:new Date().toISOString()}).eq('email',email);
   if(markError){console.error('Futurecraft welcome status failed',markError.code);return NextResponse.json({error:'Your address is saved. Please try again to finish your signup.'},{status:503});}
  }
  return NextResponse.json({ok:true});
 }catch(e){console.error('Futurecraft newsletter request failed',e instanceof Error?e.name:'unknown');return NextResponse.json({error:'Please try again later.'},{status:503});}
}
