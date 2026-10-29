'use client';
import Link from 'next/link';
import {useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
const labs=[
 ['build-night','Build Night','Bring an idea. Leave with a working prototype.','build-night'],
 ['prompt-paint','Prompt & Paint','Turn imagination into visual work.','prompt-paint'],
 ['ship-it','Ship It','Make a website or app and publish it.','ship-it'],
 ['ad-lab','Ad Lab','Make campaigns and commercials.','ad-lab'],
 ['automate-this','Automate This','Take a repetitive task. Build a workflow that gives you the time back.',null],
 ['game-jam','Game Jam','Invent a tiny world. Make a game you can actually play.','game-jam'],
 ['future-friday','Future Friday','Try an unfamiliar tool. Find out what you can make with it.','future-friday'],
 ['clone-it','Clone It','Recreate an interesting interface to understand how it works.','clone-it'],
 ['fix-my-business','Fix My Business','Start with a real business problem. Build something useful.','fix-my-business'],
 ['60-minute-build','The 60-Minute Build','Take a small idea from zero to a working first version.','60-minute-build'],
 ['creator-challenge','Creator Challenge','Get the brief. Explore your own way to make it.','creator-challenge'],
];
export default function LabsDirectory(){const root=useRef<HTMLElement>(null);
useLayoutEffect(()=>{try{if(localStorage.getItem('futurecraft-motion')==='reduced')return;}catch{}gsap.registerPlugin(ScrollTrigger);const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{const ctx=gsap.context(()=>{gsap.utils.toArray<HTMLElement>('.labs-index article').forEach(el=>gsap.from(el,{opacity:0,y:35,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));},root);return()=>ctx.revert();});return()=>media.revert();},[]);
return <main ref={root} className="fc-site fc-labs-page"><nav><Link href="/futurecraft">futurecraft.</Link><Link href="/futurecraft#register">Join Genesis 1.0</Link></nav><header><p className="fc-section-kicker">The Futurecraft experiences</p><h1>A place to<br/>try things.</h1><p>Bring curiosity. Make a mess. Find a way through.<br/>These are the Labs where we learn by making.</p></header><div className="labs-index">{labs.map(([id,name,description,image],i)=><article id={id!} key={id}><span className="labs-index-number">0{i+1}</span><div>{image?<img src={`/futurecraft/labs/${image}.webp`} alt={name!} width={1200} height={760} loading="lazy"/>:<h2>{name}</h2>}<h3>{name}</h3><p>{description}</p></div></article>)}</div><section className="labs-community"><p className="fc-section-kicker">Make with your people</p><h2>Ideas get better<br/>in good company.</h2><p>Share experiments, ask questions and meet other first-time makers. Session dates will be announced here and on our WhatsApp channel.</p><a className="fc-editorial-pill" href="https://whatsapp.com/channel/0029VbDswxf1NCrdDeaZac3j" target="_blank" rel="noopener noreferrer">Join the Futurecraft community</a><p className="labs-calendar-note">The event calendar is coming. No dates to miss yet.</p></section><footer><Link href="/futurecraft#labs">Back to Futurecraft</Link></footer></main>}
