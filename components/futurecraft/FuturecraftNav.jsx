'use client';

import { useEffect, useState } from 'react';
import PillNav from './navigation/PillNav';
import dynamic from 'next/dynamic';
const CreativeExperiment = dynamic(() => import('./CreativeExperiment'), { ssr: false });
import './futurecraft-nav.css';

const items = [
  { label: 'About', href: '#about' },
  { label: 'Make', href: '#make' },
  { label: 'Genesis 1.0', href: '#genesis' },
  { label: 'The Labs', href: '#labs' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Join Genesis', href: '#register' },
];

export default function FuturecraftNav() {
  const [experimentOpen, setExperimentOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#genesis');
  useEffect(() => {
    const update = () => { if (window.location.hash) setActiveHref(window.location.hash); };
    update();
    window.addEventListener('hashchange', update);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActiveHref(`#${visible.target.id}`);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    items.forEach(item => { const section = document.querySelector(item.href); if (section) observer.observe(section); });
    return () => { observer.disconnect(); window.removeEventListener('hashchange', update); };
  }, []);

  return <header className="fc-header fc-pill-header" id="top">
    <div className="fc-pill-nav-wrap">
      <PillNav
        logo="/futurecraft/mark.svg"
        logoAlt="Futurecraft Academy home"
        logoHref="#top"
        items={items}
        activeHref={activeHref}
        onItemClick={item => setActiveHref(item.href)}
        itemStyle="pill"
        hoverEffect="glide"
        indicator="dot"
        layout="joined"
        bounce={0.32}
        stretch={0.62}
        size="lg"
        theme="dark"
        surface="glass"
        barColor="rgba(28, 18, 42, 0.16)"
        textColor="#241036"
        highlightColor="#7e3bed"
        highlightTextColor="#ffffff"
        ariaLabel="Futurecraft navigation"
        className="fc-react-pill-nav"
        style={{ '--pn-tile': 'rgba(126,59,237,.09)', '--pn-tile-rim': 'inset 0 1px 0 rgba(255,255,255,.16), inset 0 0 0 1px rgba(199,166,255,.12)' }}
      />
      <span className="fc-nav-wordmark" aria-hidden="true">futurecraft.</span>
    </div>
    <button className="fc-creative-trigger" type="button" onClick={() => setExperimentOpen(true)} aria-haspopup="dialog">I’m feeling creative<span aria-hidden="true">✳</span></button>
    {experimentOpen && <CreativeExperiment onClose={() => setExperimentOpen(false)}/>}
  </header>;
}
