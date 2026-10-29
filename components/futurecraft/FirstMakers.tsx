'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function FirstMakers(){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{
  try { if (localStorage.getItem('futurecraft-motion') === 'reduced') return; } catch {}
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>gsap.from('.first-makers-art',{clipPath:'inset(100% 0 0 0)',rotationX:15,transformOrigin:'center bottom',duration:1.3,ease:'power3.inOut',scrollTrigger:{trigger:root.current,start:'top 75%',once:true}}),root);return()=>ctx.revert();
  });return()=>media.revert();
 },[]);
 return <section ref={root} className="first-makers" id="first-makers" aria-labelledby="first-makers-title">
  <div className="first-makers-inner"><p className="fc-section-kicker">09 / Join the first generation</p><h2 id="first-makers-title" className="fc-sr-only">Join the First Makers</h2>
  <img className="first-makers-art" src="/futurecraft/makers/first-makers.webp" alt="First Makers — monumental curved gold lettering" width={1536} height={1024} loading="lazy"/>
  <h3>Your first build<br/>starts here.</h3><p>What are you waiting to make?<br/>Be part of Futurecraft’s first generation of Makers.</p><a href="#register" className="fc-editorial-pill first-makers-join">Join Genesis 1.0</a><span className="first-makers-note">Beginners welcome. Practical learning. Real projects.</span></div>
 </section>;
}
