import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { getServerSupabase } from '@/lib/serverSupabase';
import { checkDistributedRateLimit, getClientIp, rateLimitedResponse } from '@/lib/rateLimit';
import { genesisConfirmationEmail, genesisWelcomeEmail } from '@/lib/futurecraft/emails';

export const runtime = 'nodejs';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEVELS = ['complete_beginner','exploring','building'];
const INTERESTS = ['design','video','games','automation','everything'];

export async function POST(req: NextRequest) {
 try {
  if (Number(req.headers.get('content-length') || 0) > 6500) return NextResponse.json({ error:'Please shorten your response.' },{status:413});
  if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error:'Invalid request format.' },{status:415});
  let body:any;
  try {body = await req.json();} catch {return NextResponse.json({error:'Invalid registration details.'},{status:400});}
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({error:'Invalid registration details.'},{status:400});
  // A honeypot catches basic automated submissions without blocking first-time users.
  if (typeof body.website_url === 'string' && body.website_url.trim()) return NextResponse.json({ok:true});
  const name = typeof body.name==='string' ? body.name.trim().replace(/\s+/g,' ') : '';
  const email = typeof body.email==='string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone==='string' ? body.phone.trim() : '';
  const experience = typeof body.experience==='string' ? body.experience : null;
  const deviceAvailability = typeof body.deviceAvailability==='string' ? body.deviceAvailability : null;
  const interest = typeof body.interest==='string' ? body.interest : '';
  if (name.length < 2 || name.length > 90 || !EMAIL.test(email) || email.length > 254 || phone.length > 28 || (experience === null && deviceAvailability === null) || (experience !== null && !LEVELS.includes(experience)) || (deviceAvailability !== null && !['phone','computer','both','shared'].includes(deviceAvailability)) || !INTERESTS.includes(interest) || body.consent!==true) return NextResponse.json({ error:'Please complete the required fields and agree to registration emails.' },{status:400});
  // A registration is not complete until the email service is ready.
  if (!process.env.RESEND_API_KEY || !process.env.FUTURECRAFT_FROM_EMAIL) {
   return NextResponse.json({error:'Genesis registration is not open yet. Our email service is being configured.'},{status:503});
  }
  const ip = getClientIp(req);
  const anonymized = createHash('sha256').update(email).digest('hex').slice(0,32);
  const ipLimit = await checkDistributedRateLimit('futurecraft:signup:'+ip,5,60*60*1000);
  if(!ipLimit.allowed)return rateLimitedResponse(ipLimit.retryAfterSeconds,'Too many attempts. Please try again later.');
  const emailLimit = await checkDistributedRateLimit('futurecraft:email:'+anonymized,3,24*60*60*1000);
  if(!emailLimit.allowed)return rateLimitedResponse(emailLimit.retryAfterSeconds,'This email was recently submitted.');
  const db=getServerSupabase();
  const { data, error }=await db.from('futurecraft_genesis_registrations').insert({name,email,phone:phone||null,experience,interest,device_availability:deviceAvailability,consent_at:new Date().toISOString(),status:'registered'}).select('id').single();
  if(error?.code==='23505')return NextResponse.json({ok:true,alreadyRegistered:true});
  if(error || !data){ console.error('Genesis registration save failed',error?.code);return NextResponse.json({error:'Registration is temporarily unavailable. Please try again.'},{status:503}); }
  const sender=process.env.FUTURECRAFT_FROM_EMAIL;
  const apiKey=process.env.RESEND_API_KEY;
  if(!sender || !apiKey){throw new Error('Resend sender configuration missing');}
  const resend = new Resend(apiKey);
  const first = name.split(' ')[0] || 'Maker';
  const mailings = [
   {type:'confirmation_sent_at',subject:'Genesis registration received ✳',html:genesisConfirmationEmail(first),key:'genesis-confirmation-'+data.id},
   {type:'welcome_sent_at',subject:'Welcome to Futurecraft. You are a Maker now.',html:genesisWelcomeEmail(first),key:'genesis-welcome-'+data.id},
  ] as const;
  let emailsPending=false;
  for (const msg of mailings) {
   try {
    const result=await resend.emails.send({from:sender,replyTo:process.env.FUTURECRAFT_REPLY_TO,to:[email],subject:msg.subject,html:msg.html},{idempotencyKey:msg.key});
    if(result.error){emailsPending=true;console.error('Genesis transactional email failed',msg.type,result.error.name);}
    else await db.from('futurecraft_genesis_registrations').update({[msg.type]:new Date().toISOString()}).eq('id',data.id);
   }catch(err){emailsPending=true;console.error('Genesis mail exception',msg.type,err instanceof Error?err.name:'unknown');}
  }
  return NextResponse.json({ok:true,emailsPending});
 } catch(error) {
  console.error('Genesis registration error',error instanceof Error?error.name:'unknown');
  return NextResponse.json({error:'Registration is temporarily unavailable. Please try again.'},{status:503});
 }
}
