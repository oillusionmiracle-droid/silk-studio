'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import FoldText from './motion/FoldText';
import TextType from './motion/TextType';

const WarpText = dynamic(() => import('./motion/WarpText'), {ssr: false});
const tracks = [
 {title:'Design',description:'Flyers, campaigns, visual identities and social content that look considered—not generated.',detail:'Create'},
 {title:'Video',description:'Plan, generate, direct and edit moving images, ads and stories with AI.',detail:'Animate'},
 {title:'Build',description:'From an idea to a working website, playful experience or playable game.',detail:'Develop'},
 {title:'Automate',description:'Make useful workflows that save time for creators, teams and businesses.',detail:'Simplify'},
];
const faqs=[
 ['Is Genesis free?', 'Yes. The first Genesis Bootcamp is free. There is no payment required to register.'],
 ['Can I join without experience?', 'Yes. Genesis is designed for beginners, including people who have never coded or used AI tools before.'],
 ['How long is the programme?', 'Fourteen weeks, with practical two-hour classes. We will email the confirmed dates and schedule.'],
 ['How will I join the classes?', 'Register your interest and watch your email for the confirmed timetable, format and community onboarding details.'],
 ['Will there be a student portal?', 'A student portal for recordings, assignments and progress tracking is planned for a later release.'],
];
function Pill({href,children,ghost=false}: {href:string;children:ReactNode;ghost?:boolean}){
 return <a className={'fc-pill'+(ghost?' fc-pill-ghost':'')} href={href}>{children}<ArrowUpRight size={18} strokeWidth={1.8}/></a>;
}
function Header(){
 const [open,setOpen]=useState(false),[active,setActive]=useState('Programme');
 const links=[['Programme','#programme'],['Curriculum','#curriculum'],['Experience','#experience'],['FAQs','#faq']] as const;
 useEffect(()=>{const f=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[]);
 return <header className="fc-header" id="top">
  <Link href="/futurecraft" className="fc-brand" aria-label="Futurecraft Academy home">
   <img src="/futurecraft/mark.svg" alt="" width="31" height="31"/>
   <span>futurecraft<span className="fc-brand-period">.</span></span>
  </Link>
  <nav className="fc-desktop-nav" aria-label="Futurecraft navigation">{links.map(([label,href])=><a key={label} href={href} onClick={()=>setActive(label)} className={active===label?'fc-nav-item is-active':'fc-nav-item'}>{active===label&&<motion.span layoutId="fc-active-nav" className="fc-nav-indicator" transition={{type:'spring',stiffness:420,damping:33}}/>}<span>{label}</span></a>)}</nav>
  <a href="#register" className="fc-header-join">Join Genesis <ArrowUpRight size={16}/></a>
  <button type="button" className="fc-menu-trigger" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="fc-mobile-nav" onClick={()=>setOpen(v=>!v)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
  <AnimatePresence>{open&&<motion.nav id="fc-mobile-nav" className="fc-mobile-nav" aria-label="Mobile Futurecraft navigation" initial={{opacity:0,height:0,scale:.96}} animate={{opacity:1,height:'auto',scale:1}} exit={{opacity:0,height:0,scale:.96}} transition={{duration:.26,ease:[.25,.1,.25,1]}}>{links.map(([label,href])=><a key={label} href={href} onClick={()=>{setActive(label);setOpen(false)}}>{label}<ArrowUpRight size={16}/></a>)}<a href="#register" onClick={()=>setOpen(false)}>Join Genesis<ArrowUpRight size={16}/></a></motion.nav>}</AnimatePresence>
 </header>
}
function Registration(){
 const [state,setState]=useState<'idle'|'sending'|'done'|'error'>('idle'),[message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
   e.preventDefault();if(state==='sending')return;
   const el=e.currentTarget,fd=new FormData(el);
   const payload={name:String(fd.get('name')||''),email:String(fd.get('email')||''),phone:String(fd.get('phone')||''),experience:String(fd.get('experience')||''),interest:String(fd.get('interest')||''),consent:fd.get('consent')==='yes',website_url:String(fd.get('website_url')||'')};
   setState('sending');setMessage('');
   try{
    const res=await fetch('/api/futurecraft/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json();if(!res.ok)throw new Error(data.error||'We could not register you right now.');
    if(data.alreadyRegistered){setState('done');setMessage('This email is already registered. Look out for Genesis updates.');return}
    window.location.assign('/futurecraft/success');
   }catch(err){setState('error');setMessage(err instanceof Error?err.message:'Please try again.')}
 }
 return <form className="fc-form" onSubmit={submit}>
  <div className="fc-form-grid"><label>Full name<input name="name" type="text" required minLength={2} maxLength={90} autoComplete="name" placeholder="Your name"/></label><label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com"/></label></div>
  <label>WhatsApp number <span className="fc-optional">Optional</span><input name="phone" type="tel" maxLength={28} autoComplete="tel" placeholder="+234…"/></label>
  <div className="fc-form-grid"><label>Starting point<select name="experience" required defaultValue=""><option value="" disabled>Where are you now?</option><option value="complete_beginner">I'm completely new</option><option value="exploring">I've tried some AI tools</option><option value="building">I've already built something</option></select></label><label>What interests you?<select name="interest" required defaultValue=""><option value="" disabled>Choose an area</option><option value="design">Design</option><option value="video">Video</option><option value="games">Games and apps</option><option value="automation">Automation</option><option value="everything">Everything</option></select></label></div>
  <div className="fc-hidden-field" aria-hidden="true"><label>Leave blank<input name="website_url" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="fc-consent"><input type="checkbox" name="consent" value="yes" required/><span>I agree to receive programme and registration emails. <Link href="/futurecraft/privacy" target="_blank">Privacy policy</Link>.</span></label>
  {message&&<p className={state==='error'?'fc-error':'fc-note'} role="alert">{message}</p>}
  <button className="fc-form-submit" disabled={state==='sending'||state==='done'} type="submit">{state==='sending'?'Sending…':state==='done'?'You’re registered':'Join Genesis — free'}<ArrowUpRight size={20}/></button>
  <p className="fc-form-foot">Registration dates, session links and onboarding details will be sent by email.</p>
 </form>;
}
function Newsletter(){
 const [email,setEmail]=useState(''),[status,setStatus]=useState<'idle'|'loading'|'done'|'error'>('idle'),[msg,setMsg]=useState('');
 async function send(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setStatus('loading');setMsg('');
  try{const res=await fetch('/api/futurecraft/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});const obj=await res.json();if(!res.ok)throw new Error(obj.error||'Try again later.');setStatus('done');setMsg('You’re on the update list.');}
  catch(err){setStatus('error');setMsg(err instanceof Error?err.message:'Try again later.')}
 }
 return <form className="fc-newsletter" onSubmit={send}><label htmlFor="fc-newsletter-email">Get future cohort updates.</label><div className="fc-newsletter-control"><input id="fc-newsletter-email" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" required/><button type="submit" disabled={status==='loading'||status==='done'} aria-label="Subscribe to Futurecraft updates"><ArrowRight size={21}/></button></div>{msg&&<p role="status">{msg}</p>}</form>;
}
export default function FuturecraftLanding(){
 const ref=useRef<HTMLDivElement>(null),[faq,setFaq]=useState<number|null>(0);
 useEffect(()=>{
  if(!ref.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  const ctx=gsap.context(()=>{
   gsap.from('.fc-hero-intro', {y:25,opacity:0,duration:.85,ease:'power3.out',delay:.15});
   gsap.from('.fc-hero-copy, .fc-hero-actions',{opacity:0,y:24,stagger:.13,duration:.8,ease:'power3.out',delay:.4});
   gsap.utils.toArray<HTMLElement>('.fc-reveal').forEach(el=>gsap.from(el,{y:26,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  },ref);return()=>ctx.revert();
 },[]);
 return <div ref={ref} className="fc-site">
  <a className="fc-skip" href="#fc-main">Skip to content</a>
  <Header/>
  <main id="fc-main">
   <section className="fc-hero" aria-labelledby="fc-title">
    <div className="fc-hero-main">
     <div className="fc-hero-intro"><FoldText text="Introducing the" foldStyle="paper" splitBy="word" hinge="top" trigger="mount" duration={.8} stagger={.12} creaseShading={.26} fontSize="clamp(1.3rem, 2.2vw, 2.2rem)" fontWeight={500}/></div>
     <h1 id="fc-title"><span className="fc-visually-hidden">Introducing the Genesis Bootcamp 1.0</span><span className="fc-hero-warp" aria-hidden="true"><WarpText text={'Genesis\nBootcamp'} fontFamily="var(--fc-display)" fontSize="clamp(4.5rem, 11vw, 11.6rem)" color="#1763f6" fontWeight={850} letterSpacing="-.07em" lineHeight={.86} warpStrength={.07} warpScale={1.7} speed={.55} lens="pinch" pointerInfluence={.42} pointerStrength={.38} refraction={.018} chromatic={.3} idleDrift={.14} intro ripple clickRipple style={{height:'clamp(250px,34vw,470px)'}}/></span></h1>
     <span className="fc-version">1.0</span>
     <p className="fc-hero-copy">Join a community of creators and builders learning to design, develop, animate and automate with AI. Start from scratch. Build something real.</p>
     <div className="fc-hero-actions"><Pill href="#register">Join the bootcamp — free</Pill><Pill href="#curriculum" ghost>Explore the programme</Pill></div>
    </div>
    <a href="#programme" className="fc-scroll-cue" aria-label="Scroll to programme"><span>Discover Genesis</span><ArrowRight size={18}/></a>
   </section>
   <section className="fc-section fc-overview" id="programme">
    <div className="fc-section-inner fc-overview-grid"><div className="fc-reveal"><span className="fc-eyebrow">The programme</span><h2>Not another<br/><i>tutorial playlist.</i></h2></div><div className="fc-overview-copy fc-reveal"><p>Genesis is Futurecraft Academy’s first free bootcamp. Fourteen weeks of learning through making, with other beginners beside you.</p><p>No previous coding experience required. Just curiosity and the willingness to start.</p><div className="fc-detail-row"><span>14 weeks</span><span>Practical two-hour classes</span><span>Free</span></div></div></div>
   </section>
   <section className="fc-section fc-curriculum" id="curriculum"><div className="fc-section-inner">
    <div className="fc-section-heading fc-reveal"><div><span className="fc-eyebrow">What you’ll learn</span><h2>Find your<br/><i>way to make.</i></h2></div><p>Four directions. Real projects. Skills you can carry into your own ideas.</p></div>
    <div className="fc-track-list">{tracks.map((track,i)=><article key={track.title} className="fc-track fc-reveal"><span className="fc-track-index">0{i+1}</span><div className="fc-track-main"><h3>{track.title}</h3><p>{track.description}</p></div><span className="fc-track-end">{track.detail}<ArrowUpRight size={20}/></span></article>)}</div>
   </div></section>
   <section className="fc-section fc-experience" id="experience"><div className="fc-section-inner fc-experience-grid">
    <div className="fc-reveal"><span className="fc-eyebrow">How it works</span><h2>Learn it.<br/>Try it.<br/><i>Make it.</i></h2></div>
    <div className="fc-experience-content fc-reveal"><p>Sessions are made for doing. Follow along, ask questions, make mistakes, learn from people already building with AI, and leave with work you can show.</p><div className="fc-experience-line">Learn alongside other beginners</div><div className="fc-experience-line">Get feedback on your projects</div><div className="fc-experience-line">Meet working AI creators</div>
    <div className="fc-typed-line"><TextType text={['Ideas become projects.','Beginners become makers.','Small starts become real work.']} typingSpeed={55} deletingSpeed={36} pauseDuration={2000} cursorStyle="bar" typeEffect="fade" showCursor cursorGlide /></div>
    </div>
   </div></section>
   <section className="fc-section fc-next"><div className="fc-section-inner fc-next-inner">
    <div className="fc-reveal"><span className="fc-eyebrow">What comes next</span><h2>Genesis is<br/><i>just the start.</i></h2></div>
    <div className="fc-next-content fc-reveal"><p>The first programme runs for 14 weeks. The exact start date and class format will be confirmed by email.</p><p>A student portal with recordings, assignments and progress tracking is planned for a later release.</p><Pill href="#register">Join the first cohort</Pill></div>
   </div></section>
   <section className="fc-section fc-register" id="register"><div className="fc-section-inner fc-register-grid">
    <div className="fc-reveal"><span className="fc-eyebrow">Your first step</span><h2>Let’s build<br/><i>something.</i></h2><p>Genesis 1.0 is free and open to beginners. Leave your details and we’ll keep you posted on what happens next.</p></div><Registration/>
   </div></section>
   <section className="fc-section fc-final-section" id="faq"><div className="fc-section-inner fc-faq-grid"><div className="fc-reveal"><h2>Questions?<br/><i>Good.</i></h2><Newsletter/></div><div className="fc-faq-list">{faqs.map(([question,answer],i)=><div key={question} className="fc-faq"><button type="button" aria-expanded={faq===i} onClick={()=>setFaq(faq===i?null:i)}>{question}<ChevronDown className={faq===i?'fc-faq-chevron is-open':'fc-faq-chevron'} size={19}/></button><AnimatePresence initial={false}>{faq===i&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.22}} className="fc-faq-answer"><p>{answer}</p></motion.div>}</AnimatePresence></div>)}</div></div></section>
  </main>
  <footer className="fc-footer"><Link href="/futurecraft" className="fc-footer-brand"><img src="/futurecraft/mark.svg" width="34" height="34" alt=""/><span>futurecraft.</span></Link><p>Learn the future by making it.</p><div className="fc-footer-links"><Link href="/futurecraft/privacy">Privacy</Link><a href="#top">Back to top ↑</a></div></footer>
 </div>;
}