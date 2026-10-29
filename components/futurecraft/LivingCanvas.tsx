'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import ScrambledText from './motion/ScrambledText';
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
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const pieces = gsap.utils.toArray<HTMLElement>('.lc-artwork');
        gsap.from('.lc-artwork-intro', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, stagger: .05, ease: 'power3.inOut' });
        const stage = element.querySelector<HTMLElement>('.lc-stage')!;
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: element, start: 'top top', end: 'bottom bottom', scrub: .8,
          invalidateOnRefresh: true,
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
      }, element);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);

  return <section ref={root} className="lc-hero no-pad" aria-labelledby="lc-title">
    <noscript><style>{`.fc-site .lc-hero{height:auto}`}</style></noscript>
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
          <ScrambledText intro clickBurst radius={100} strength={1} trail={.6} duration={1.2} speed={.5} scrambleChars=".:">THE FUTURE</ScrambledText>
          <ScrambledText intro clickBurst radius={100} strength={1} trail={.6} duration={1.2} speed={.5} scrambleChars=".:">ISN’T WAITING.</ScrambledText>
        </h1>
        <p className="lc-subtitle">And neither should your ideas.</p>
        <div className="lc-actions">
          <a href="#register" className="lc-join">Join Genesis</a>
          <a href="#labs" className="lc-explore">Explore Labs</a>
        </div>
        <p className="lc-cohort">A free, 14-week bootcamp. Start from scratch.</p>
      </div>
      <a href="#make" className="lc-scroll"><ArrowDown size={16} aria-hidden="true" /><span>Bring your ideas together</span></a>
    </div>
  </section>;
}
