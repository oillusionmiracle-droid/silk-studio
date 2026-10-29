'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './make-playground.css';

const projects = [
  { id: 'design', label: 'Design something.', title: 'A poster that stops the scroll.', description: 'Turn one idea into a visual identity. Explore image-making, composition and type, then bring them together in a finished poster.', lab: 'Prompt & Paint', target: 'prompt-paint', alt: 'Illustrated hand holding a world of cards, colours and possibilities' },
  { id: 'build', label: 'Build something.', title: 'Your own recipe app.', description: 'Take an everyday idea from a rough sketch to a working app. Give it recipes, a shopping list and a link you can share.', lab: 'Ship It', target: 'ship-it', alt: 'Playful 3D character making pancakes in a colourful kitchen' },
  { id: 'story', label: 'Create a story.', title: 'A tiny film. A big plot twist.', description: 'Create a character, build their world and turn a short script into an animated story. Shape the shots, sound and final cut.', lab: 'Ad Lab', target: 'ad-lab', alt: 'A surprised animated man opening his door to a glowing cauldron' },
  { id: 'automate', label: 'Automate something.', title: 'An assistant for the busywork.', description: 'Build a workflow that takes a customer enquiry, records the details and prepares a reply. Spend less time copying and pasting.', lab: 'Automate This', target: 'automate-this', alt: '3D creator at a laptop with apps reflected in his glasses' },
] as const;

export default function MakePlayground() {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const project = projects[selected];

  useLayoutEffect(() => {
  try { if (localStorage.getItem('futurecraft-motion') === 'reduced') return; } catch {}
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.make-image', {
          clipPath: 'inset(15% 0 85% 0 round 32px)', scale: 1.06,
          duration: 1.1, stagger: .09, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.make-grid', start: 'top 85%', once: true },
        });
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);

  useLayoutEffect(() => {
    if (!panel.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.make-project-copy > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, stagger: .055, ease: 'power2.out' });
    }, panel);
    return () => ctx.revert();
  }, [selected]);

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % projects.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + projects.length - 1) % projects.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = projects.length - 1;
    else return;
    event.preventDefault(); setSelected(next);
    root.current?.querySelector<HTMLButtonElement>(`#make-tab-${projects[next].id}`)?.focus();
  }

  return <section ref={root} id="make" className="make-section no-pad" aria-labelledby="make-title">
    <div className="make-inner">
      <div className="make-heading"><h2 id="make-title">What will <br />you make?</h2><p>Pick a direction.<br />See where it could take you.</p></div>
      <div className="make-grid" role="tablist" aria-label="Choose what you want to make">
        {projects.map((item, index) => <button key={item.id} type="button" role="tab" aria-label={item.label} id={`make-tab-${item.id}`} aria-selected={selected === index} aria-controls="make-project" tabIndex={selected === index ? 0 : -1} className="make-choice" onClick={() => setSelected(index)} onKeyDown={event => onKeyDown(event, index)}>
          <span className="make-image"><img src={`/futurecraft/playground/${item.id}.webp`} alt={item.alt} width={900} height={1125} loading="lazy" draggable={false} /><span className="make-glass-edge" /></span>
          <span className="make-choice-name">{item.label}</span>
          <span className="make-selected" aria-hidden="true" />
        </button>)}
      </div>
      <div ref={panel} id="make-project" role="tabpanel" tabIndex={0} aria-labelledby={`make-tab-${project.id}`} className="make-project">
        <div className="make-project-copy" aria-live="polite" aria-atomic="true"><h3>{project.title}</h3><p>{project.description}</p></div>
        <a className="make-lab" href={project.target === 'automate-this' ? '/futurecraft/labs#automate-this' : `#lab-${project.target}`}>Explore {project.lab}</a>
      </div>
    </div>
  </section>;
}
