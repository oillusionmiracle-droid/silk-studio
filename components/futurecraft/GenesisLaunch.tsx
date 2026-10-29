'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './genesis-launch.css';

const channel = 'https://whatsapp.com/channel/0029VbDswxf1NCrdDeaZac3j';
const topics = ['Programme', 'Schedule', 'How to join'] as const;

export default function GenesisLaunch({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const [topic, setTopic] = useState(0);

  useLayoutEffect(() => {
  try { if (localStorage.getItem('futurecraft-motion') === 'reduced') return; } catch {}
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const layers = gsap.utils.toArray<HTMLElement>('.genesis-extrusion');
        const intro = gsap.timeline({ scrollTrigger: { trigger: title.current, start: 'top 80%', once: true } });
        intro.fromTo(layers, { opacity: 0 }, { opacity: .9, duration: 1.15, stagger: .035, ease: 'power3.inOut' });
        intro.fromTo('.genesis-title-face', { scale: .94, rotationX: 9 }, { scale: 1, rotationX: 0, duration: 1.25, ease: 'power3.out' }, 0);
        const depth = gsap.timeline({ scrollTrigger: { trigger: title.current, start: 'top 85%', end: 'bottom 45%', scrub: .65 } });
        depth.fromTo(layers, { x: 0, y: 0 }, { x: index => (layers.length - index) * 2.1, y: index => (layers.length - index) * 2.8, duration: 1, ease: 'none' });
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);

  return <section ref={root} id="genesis" className="genesis-launch no-pad" aria-labelledby="genesis-heading">
    <div className="genesis-inner">
      <h2 id="genesis-heading" className="fc-sr-only">Genesis Bootcamp 1.0</h2>
      <p className="genesis-date">Starts <time dateTime="2026-11-03">3 November 2026</time></p>
      <div ref={title} className="genesis-title" role="img" aria-label="Genesis Bootcamp 1.0, sculpted chrome and violet 3D lettering">
        {Array.from({ length: 10 }, (_, index) => <span className="genesis-extrusion" key={index} aria-hidden="true" />)}
        <img className="genesis-title-face" src="/futurecraft/genesis/genesis-chrome.webp" alt="" width={1600} height={899} loading="lazy" draggable={false} />
      </div>
      <div className="genesis-announcement">
        <p>The first flagship Futurecraft experience. A free, 14-week bootcamp helping beginners design, build, create and automate with AI.</p>
        <div className="genesis-actions"><a className="genesis-cta" href="#register">Register for Genesis</a><a className="genesis-channel" href={channel} target="_blank" rel="noopener noreferrer">Follow on WhatsApp</a></div>
      </div>
      <div className="genesis-details">
        <div className="genesis-tabs" role="tablist" aria-label="Genesis programme information">
          {topics.map((name, index) => <button key={name} id={`genesis-tab-${index}`} type="button" role="tab" aria-selected={topic === index} aria-controls="genesis-info" tabIndex={topic === index ? 0 : -1} onClick={() => setTopic(index)} onKeyDown={event => {
            let next = index;
            if (event.key === 'ArrowRight') next = (index + 1) % topics.length;
            else if (event.key === 'ArrowLeft') next = (index + topics.length - 1) % topics.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = topics.length - 1;
            else return;
            event.preventDefault(); setTopic(next); root.current?.querySelector<HTMLButtonElement>(`#genesis-tab-${next}`)?.focus();
          }}>{name}</button>)}
        </div>
        <div id="genesis-info" role="tabpanel" aria-labelledby={`genesis-tab-${topic}`} className="genesis-info" tabIndex={0}>
          {topic === 0 && <div><h3>Start from scratch. Make something real.</h3><p>Explore AI design, websites and apps, visual storytelling and useful automations. Learn through guided builds, practical Labs and feedback from other makers.</p></div>}
          {topic === 1 && <div><h3>We begin on 3 November.</h3><p>Genesis runs for 14 weeks, starting 3 November 2026. The weekly session timetable and joining links will be shared by email and on the Futurecraft Academy WhatsApp channel.</p></div>}
          {topic === 2 && <div><h3>Your first move is simple.</h3><p>Complete the free registration below, follow the Futurecraft Academy WhatsApp channel, then look out for your programme emails and session instructions.</p><a href={channel} target="_blank" rel="noopener noreferrer">Open the Futurecraft Academy channel</a></div>}
        </div>
      </div>
      <div id="register" className="genesis-registration">
        <div className="genesis-register-copy"><h2>Make your<br />first move.</h2><p>Join Genesis Bootcamp 1.0.<br />Free. Beginner-friendly. Built around making.</p><p>Starts 3 November 2026.</p></div>
        {children}
      </div>
    </div>
  </section>;
}
