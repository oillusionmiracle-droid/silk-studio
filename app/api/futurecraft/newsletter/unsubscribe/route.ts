import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/serverSupabase';
export const runtime='nodejs';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function page(message:string,token?:string,status=200){
 return new NextResponse(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Futurecraft email preferences</title><body style="margin:0;background:#fff8e9;color:#18131f;font:18px/1.6 Arial,sans-serif"><main style="max-width:480px;margin:12vh auto;padding:28px"><p style="color:#7e3bed;font-weight:900">futurecraft.</p><h1 style="line-height:1.1">Email preferences</h1><p>${message}</p>${token?`<form method="post" action="?token=${token}"><button type="submit" style="border:0;border-radius:28px;padding:16px 24px;background:#7e3bed;color:white;font:700 16px Arial;cursor:pointer">Unsubscribe from Futurecraft</button></form>`:''}<p><a href="https://www.silkstudios.com.ng/futurecraft" style="color:#7e3bed">Back to Futurecraft</a></p></main></body></html>`,{status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'"}});
}
export async function GET(req:NextRequest){
 const token=req.nextUrl.searchParams.get('token')||'';
 if(!UUID.test(token))return page('This unsubscribe link is invalid.',undefined,400);
 // GET never changes preferences: email link scanners can safely visit this page.
 return page('You can stop Futurecraft newsletter updates here. Your Genesis registration and Silk Studio subscriptions will stay unchanged.',token);
}
export async function POST(req:NextRequest){
 const token=req.nextUrl.searchParams.get('token')||'';
 if(!UUID.test(token))return page('This unsubscribe link is invalid.',undefined,400);
 try{
  const {data,error}=await getServerSupabase().from('futurecraft_newsletter_subscribers').update({unsubscribed_at:new Date().toISOString()}).eq('unsubscribe_token',token).select('email');
  if(error)return page('We could not update your preference. Please try again.',token,503);
  if(!data?.length)return page('This unsubscribe link is no longer available.',undefined,404);
  return page('You’re unsubscribed from Futurecraft newsletter updates. Your Genesis registration and Silk Studio subscriptions are unchanged.');
 }catch{return page('We could not update your preference. Please try again.',token,503);}
}
