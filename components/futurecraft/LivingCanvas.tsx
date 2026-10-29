'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import FoldText from './motion/FoldText';
import './living-canvas.css';

const artwork = [
  ['poster', 'Colourful masterclass poster design'],
  ['creator', 'A creator exploring ideas on a foldable phone'],
  ['city', 'Blue architectural world illustration'],
  ['interface', 'Movie discovery app interface design'],
  ['maker', 'A maker working at his laptop'],
  ['animation', 'An animated character exploring a miniature world'],
  ['film', 'Alexander the Great cinematic poster'],
  ['lagos', 'An illustrated Lagos streetscape'],
];

export default function LivingCanvas() {
  const root = useRef<HTMLElement>(null);
  const drift = useRef<gsap.core.Tween[]>([]);
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const pieces = gsap.utils.toArray<HTMLElement>('.lc-artwork');
        drift.current = pieces.map((piece, index) => gsap.to(piece.querySelector('.lc-artwork-drift'), {
          x: index % 2 ? -9 : 11, y: index % 3 ? 16 : -13,
          rotation: index % 2 ? 2 : -2, duration: 6 + index * .65,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
        }));
        gsap.from('.lc-artwork-intro', { opacity: 0, scale: .9, duration: 1.4, stagger: .07, ease: 'power2.out' });
        const stage = element.querySelector<HTMLElement>('.lc-stage')!;
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: element, start: 'top top', end: 'bottom bottom', scrub: .8,
          invalidateOnRefresh: true,
          onUpdate: self => {
            element.dataset.scrolling = String(self.progress > .02);
            drift.current.forEach(tween => self.progress > .02 || element.dataset.paused === 'true' ? tween.pause() : tween.resume());
          },
        } });
        timeline.to('.lc-content', { y: -55, opacity: 0, duration: .35, ease: 'power1.in' }, 0);
        timeline.to('.lc-scroll', { opacity: 0, duration: .15 }, 0);
        pieces.forEach((piece, index) => {
          const mobile = () => stage.clientWidth < 700;
          const columns = () => mobile() ? 2 : 4;
          const gap = () => mobile() ? 10 : 20;
          const margin = () => mobile() ? 20 : Math.max(40, stage.clientWidth * .07);
          const width = () => (stage.clientWidth - margin() * 2 - gap() * (columns() - 1)) / columns();
          const height = () => mobile() ? Math.min(140, stage.clientHeight * .18) : Math.min(210, stage.clientHeight * .27);
          timeline.to(piece, {
            x: () => margin() + (index % columns()) * (width() + gap()) + width() / 2 - piece.offsetLeft - piece.offsetWidth / 2,
            y: () => (stage.clientHeight - Math.ceil(pieces.length / columns()) * (height() + gap()) + gap()) / 2 + Math.floor(index / columns()) * (height() + gap()) + height() / 2 - piece.offsetTop - piece.offsetHeight / 2,
            scale: () => Math.min(width() / piece.offsetWidth, height() / piece.offsetHeight),
            rotation: 0, opacity: 1, duration: .75, ease: 'power2.inOut',
          }, .18);
        });
        timeline.to('.lc-artwork-drift', { x: 0, y: 0, rotation: 0, duration: .5 }, .4);
        const observer = new IntersectionObserver(([entry]) => {
          drift.current.forEach(tween => entry.isIntersecting && element.dataset.paused !== 'true' && element.dataset.scrolling !== 'true' ? tween.resume() : tween.pause());
        });
        observer.observe(element);
        const visibility = () => drift.current.forEach(tween => document.hidden || element.dataset.paused === 'true' || element.dataset.scrolling === 'true' ? tween.pause() : tween.resume());
        document.addEventListener('visibilitychange', visibility);
        return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
      }, element);
      return () => { ctx.revert(); drift.current = []; };
    });
    return () => media.revert();
  }, []);

  function toggleMotion() {
    const next = !paused;
    setPaused(next);
    drift.current.forEach(tween => next || root.current?.dataset.scrolling === 'true' ? tween.pause() : tween.resume());
  }

  return <section ref={root} className="lc-hero" aria-labelledby="lc-title" data-paused={paused}>
    <noscript><style>{`.lc-content .fold-text-piece,.lc-content .fold-text-slat{opacity:1!important}.lc-content .fold-text-slat[data-fold-slat="b"]{display:none}.lc-hero{height:auto}.lc-motion{display:none}`}</style></noscript>
    <div className="lc-stage">
      <div className="lc-canvas" aria-hidden="true">
        {artwork.map(([name, alt], index) => <div className={`lc-artwork lc-artwork-${index}`} key={name}>
          <div className="lc-artwork-intro"><div className="lc-artwork-drift">
            <img src={`/futurecraft/canvas/${name}.webp`} alt={alt} width={720} height={720} fetchPriority={index < 4 ? 'high' : 'auto'} draggable={false} />
          </div></div>
        </div>)}
      </div>
      <div className="lc-content">
        <h1 id="lc-title">
          <FoldText text="THE FUTURE" splitBy="char" foldStyle="blinds" hinge="top" duration={1.3} stagger={.045} fontSize="inherit" fontWeight={400} creaseShading={0} />
          <FoldText text="ISN’T WAITING." splitBy="char" foldStyle="blinds" hinge="bottom" duration={1.3} stagger={.045} fontSize="inherit" fontWeight={400} creaseShading={0} />
        </h1>
        <p className="lc-subtitle">And neither should your ideas.</p>
        <div className="lc-actions">
          <a href="#register" className="lc-join">Join Genesis <ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href="#labs" className="lc-explore">Explore Labs</a>
        </div>
        <p className="lc-cohort">A free, 14-week bootcamp. Start from scratch.</p>
      </div>
      <a href="#about" className="lc-scroll"><ArrowDown size={16} aria-hidden="true" /><span>Bring your ideas together</span></a>
      <button className="lc-motion" type="button" aria-label={paused ? 'Play canvas animation' : 'Pause canvas animation'} aria-pressed={paused} onClick={toggleMotion}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </div>
  </section>;
}
