'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import projects from '@/app/data/studio-projects.json';
const slides = ['bordeaux','splithouse','proofroom','moremi','suya'].map(id => projects.find(p => p.id === id)!);
export default function CurvedCarousel() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || held) return;
    const timer = setInterval(() => setActive(n => (n + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [reduced, held]);
  return <div className="curve-carousel" aria-label="Project image carousel" aria-roledescription="carousel" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)} onFocusCapture={() => setHeld(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false); }}>
    <div className="curve-stage">{slides.map((p, i) => {
      const offset = ((i - active + slides.length + 2) % slides.length) - 2;
      return <Link key={p.id} href={`/portfolio?project=${p.id}`} tabIndex={offset === 0 ? 0 : -1} aria-hidden={offset !== 0} aria-label={`Explore ${p.title}`} className="curve-slide" style={{transform:`translateX(${offset * 145}px) translateZ(${-Math.abs(offset) * 100}px) rotateY(${offset * -24}deg) rotateZ(${offset * 5}deg) translateY(${Math.abs(offset) * 24}px)`,opacity:Math.abs(offset) > 1 ? .25 : 1,zIndex:3-Math.abs(offset)}}><Image src={p.image} alt={`${p.title} project preview`} fill sizes="300px" priority={i === 0}/><span>{p.title}<ArrowRight size={16}/></span></Link>;
    })}</div>
    <div className="curve-controls"><button onClick={() => setActive(n => (n-1+slides.length)%slides.length)} aria-label="Previous project"><ArrowLeft size={18}/></button><span aria-live={held || reduced ? 'polite' : 'off'}>{String(active+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</span><button onClick={() => setActive(n => (n+1)%slides.length)} aria-label="Next project"><ArrowRight size={18}/></button></div>
  </div>;
}
