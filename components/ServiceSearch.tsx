'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search, ArrowUpRight, Sparkles, X } from 'lucide-react';
import { searchSite } from '@/lib/service-search';
export default function ServiceSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const close = (e: PointerEvent) => { if (!container.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    const timer = reduced ? undefined : setInterval(() => setHint(h => (h + 1) % 3), 3200);
    return () => { document.removeEventListener('pointerdown', close); clearInterval(timer); };
  }, [reduced]);
  const results = searchSite(query);
  return <div className="service-search" ref={container} onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}>
    <div className={`service-search-bar ${open ? 'is-open' : ''}`}><Search size={22} /><input aria-label="Search services, projects and pages" aria-expanded={open} aria-controls="service-results" value={query} onChange={e => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Search Silk — what do you need?" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={18}/></button>}<button className="search-submit" aria-label="Show search results" onClick={() => setOpen(true)}><ArrowUpRight size={23}/></button></div>
    {!open && <div className="search-hint">Try <AnimatePresence mode="wait"><motion.span key={hint} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:reduced ? 0 : .25}}>{['“business cards”','“a website” — search “website”','“UGC ads”'][hint]}</motion.span></AnimatePresence><span>Find it. Make it.</span></div>}
    <AnimatePresence>{open && <motion.div id="service-results" className="service-results" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:reduced ? 0 : .2}}><small>{query ? `${results.length} matches` : 'Popular starting points'}</small>{results.map(r => <Link key={r.title} href={r.href} onClick={() => setOpen(false)}><div><strong>{r.title}</strong><small>{r.kind}</small></div><ArrowUpRight size={20}/></Link>)}{!results.length && <p>No match yet. Tell our assistant what you want to make.</p>}<button className="search-ai" onClick={() => { setOpen(false); window.dispatchEvent(new Event('open-gemini-chat')); }}><Sparkles size={17}/> Help me choose with Gemini ↗</button></motion.div>}</AnimatePresence>
    <div className="search-shortcuts">{[['Print','/order?category=Print'],['Build a website','/order?category=Web'],['Make an ad','/?brief=AI%20UGC%20%26%20advertising#brief']].map(([name,href]) => <Link key={name} href={href}>{name} ↗</Link>)}</div>
  </div>;
}
