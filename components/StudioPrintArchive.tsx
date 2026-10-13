'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePortfolio } from '@/lib/usePortfolio';
import type { PortfolioItem } from '@/app/data/portfolio';
const missing: Record<string,string> = {'web-4':'/images/portfolio/restaurant-illustration.jpg','web-5':'/images/portfolio/dashboard-illustration.svg','work-9':'/images/portfolio/summit-illustration.jpg','branding-9':'/images/portfolio/branding-3.jpg','events-3':'/images/portfolio/work-4.jpg','events-4':'/images/portfolio/print-5.jpg','events-5':'/images/portfolio/summit-illustration.jpg'};
const categoryFallback: Record<string,string> = {Print:'/images/portfolio/businesscard.jpg',Branding:'/images/portfolio/branding-3.jpg',Apparel:'/images/portfolio/work-3.jpg',Web:'/images/portfolio/dashboard-illustration.svg',Events:'/images/portfolio/summit-illustration.jpg'};
function ArchiveItem({item}: {item: PortfolioItem}) {
  const replacement = missing[item.id];
  const [failed,setFailed] = useState(false);
  const category = item.category==='Events' ? 'Bundle' : item.category==='Branding' ? 'Design' : item.category;
  const source = failed ? categoryFallback[item.category] : replacement || item.src;
  return <article><Link href={`/order?category=${category}`} aria-label={`Start a ${item.title} project`}><div style={{position:'relative',aspectRatio:'4/3',overflow:'hidden'}}><Image src={source} alt={`${item.title}${replacement || failed ? ' — illustrative preview' : ''}`} fill sizes="(max-width:700px) 45vw, 30vw" unoptimized={source.startsWith('http')} onError={() => setFailed(true)}/></div></Link><small>{item.category} / {replacement || failed ? 'Illustrative preview' : 'Studio archive'}</small><h3><Link href={`/order?category=${category}`}>{item.title} ↗</Link></h3></article>;
}
export default function StudioPrintArchive() {
  const items = usePortfolio();
  return <div className="studio-print-grid">{items.map(item => <ArchiveItem key={item.id} item={item}/>)}</div>;
}
