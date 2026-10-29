'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const experiences = [
 {id:'build-night',name:'Build Night',image:'build-night',description:'Bring an idea. Leave with a working prototype.',note:'From a rough idea to a first version.'},
 {id:'prompt-paint',name:'Prompt & Paint',image:'prompt-paint',description:'Turn imagination into visual work.',note:'Images, composition, colour and a point of view.'},
 {id:'ship-it',name:'Ship It',image:'ship-it',description:'Make a website or app and publish it.',note:'A real link. Something you can put into the world.'},
 {id:'ad-lab',name:'Ad Lab',image:'ad-lab',description:'Make campaigns and commercials.',note:'Take a brief from the first spark to the final cut.'},
];

export default function LabsGallery(){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{
  try { if (localStorage.getItem('futurecraft-motion') === 'reduced') return; } catch {}
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>{
    gsap.utils.toArray<HTMLElement>('.lab-gallery-art').forEach(el=>{
     gsap.fromTo(el,{clipPath:'inset(100% 0 0 0)',rotationX:12},{clipPath:'inset(0% 0 0 0)',rotationX:0,duration:1.15,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
    });
   },root);return()=>ctx.revert();
  });return()=>media.revert();
 },[]);
 return <section ref={root} id="labs" className="fc-section lab-gallery" aria-labelledby="labs-title"><div className="fc-section-inner">
  <header className="lab-gallery-head"><p className="fc-section-kicker">04 / The Futurecraft experiences</p><h2 id="labs-title">Less watching.<br/>More making.</h2><p>Bring your curiosity. Find your people. Leave with something you made.</p></header>
  <div className="lab-gallery-grid">{experiences.map((lab,i)=><article id={`lab-${lab.id}`} className={`lab-gallery-piece lab-gallery-piece-${i}`} key={lab.id}>
   <div className="lab-gallery-meta"><span>0{i+1}</span><h3>{lab.name}</h3><span>A Futurecraft Lab</span></div>
   <a href="#register" className="lab-gallery-art" aria-label={`Join Genesis to experience ${lab.name}`}><img src={`/futurecraft/labs/${lab.image}.webp`} alt={lab.name} width={1200} height={760} loading="lazy"/></a>
   <div className="lab-gallery-caption"><p>{lab.description}</p><span>{lab.note}</span></div>
  </article>)}</div>
  <div className="lab-gallery-more"><p>And there’s more to get your hands on.<br/><span>Automate This. Game Jam. Future Friday.</span></p><Link href="/futurecraft/labs" className="fc-editorial-pill">Explore all Labs</Link></div>
 </div></section>;
}
