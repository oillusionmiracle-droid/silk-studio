'use client';
import Image from 'next/image';
import { usePortfolio } from '@/lib/usePortfolio';
export default function StudioPrintArchive() {
  const items = usePortfolio();
  return <div className="studio-print-grid">{items.map(item => <article key={item.id}><div><Image src={item.src} alt={item.title} fill sizes="(max-width:700px) 90vw, 30vw" unoptimized={item.src.startsWith('http')} /></div><small>{item.category} / Studio archive</small><h3>{item.title}</h3></article>)}</div>;
}
