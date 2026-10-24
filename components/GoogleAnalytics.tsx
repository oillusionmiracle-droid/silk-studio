'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
declare global { interface Window { gtag?: (...args: unknown[]) => void; } }
// Public GA4 web-stream ID. Never substitute a Tag Manager container ID here.
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
export default function GoogleAnalytics(){
 const path=usePathname(),[ready,setReady]=useState(false);
 const configured=/^G-[A-Z0-9]+$/.test(measurementId);
 useEffect(()=>{if(!ready)return;window.gtag?.('event','page_view',{page_path:path,page_location:window.location.href,page_title:document.title});
 if(!path.startsWith('/blog/'))return;
 window.gtag?.('event','article_view',{article_slug:path.split('/').pop()});
 const end=document.querySelector('.blog-author-note');if(!end)return;
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){window.gtag?.('event','article_read',{article_slug:path.split('/').pop()});observer.disconnect();}},{threshold:.3});observer.observe(end);return()=>observer.disconnect();
 },[path,ready]);
 if(!configured)return null;
 return <><Script id="ga4-config" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config','${measurementId}',{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});`}</Script><Script id="ga4-library" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" onReady={()=>setReady(true)}/></>;
}
