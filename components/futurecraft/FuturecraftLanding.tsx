'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus } from 'lucide-react';
import LivingCanvas from './LivingCanvas';
import MakePlayground from './MakePlayground';
import FuturecraftNav from './FuturecraftNav';
import GenesisLaunch from './GenesisLaunch';
import LabsGallery from './LabsGallery';
import FirstMakers from './FirstMakers';
import MotionPreference from './MotionPreference';
import BellToggle from './interactions/BellToggle';
import GradualBlur from './interactions/GradualBlur';
import './futurecraft-editorial.css';

const FUTURECRAFT_WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029VbDswxf1NCrdDeaZac3j';

const faqs = [
 ['Who can join Genesis?', 'Genesis is designed for beginners. No previous coding or AI experience is needed. Any age or location restrictions will be published after the co-founders confirm them.'],
 ['How much does it cost?', 'Genesis Bootcamp 1.0 is free to join. We will confirm any tool or data requirements before sessions begin, so you can decide what works for you. No payment details are required to register.'],
 ['Can I learn with just my phone?', 'Tell us whether you have a phone, computer, both, or shared access when you register. The device requirements for each Lab are still being confirmed; we will publish them before you need to choose tools.'],
 ['Is it online or in person?', 'The attendance format has not yet been confirmed by the co-founders. We will publish whether sessions are online, in person, or a mix, together with the joining details.'],
 ['When does Genesis start, and what is the schedule?', 'The announced start date is 3 November 2026. The weekly days, session times and final programme timetable are awaiting co-founder confirmation. Registered learners will receive the confirmed details by email and through the Futurecraft Academy WhatsApp channel.'],
 ['What will I learn to make?', 'The Genesis focus is designing, building, creating and automating with AI. Our featured Labs include Build Night, Prompt & Paint, Ship It and Ad Lab. The final cohort line-up will be published with the schedule.'],
 ['What happens after I register?', 'Once your registration is successful, we’ll take you straight to the Futurecraft Academy WhatsApp channel so you can follow programme updates. We’ll also send your registration and welcome emails.'],
];

function Registration(){
 const [state,setState]=useState<'idle'|'sending'|'done'|'error'>('idle'),[message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(state==='sending')return;
  const fd=new FormData(e.currentTarget);
  const payload={name:String(fd.get('name')||''),email:String(fd.get('email')||''),phone:String(fd.get('phone')||''),deviceAvailability:String(fd.get('deviceAvailability')||''),interest:String(fd.get('interest')||''),consent:fd.get('consent')==='yes',website_url:String(fd.get('website_url')||'')};
  setState('sending');setMessage('');
  try{
   const res=await fetch('/api/futurecraft/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const data=await res.json();
   if(!res.ok)throw new Error(data.error||'We could not register you right now.');
   if(data.alreadyRegistered){setState('done');setMessage('You’re already on the list. Taking you to the Futurecraft WhatsApp channel…');window.setTimeout(()=>window.location.assign(FUTURECRAFT_WHATSAPP_CHANNEL),2600);return;}
   setState('done');setMessage('You’re on the list. Taking you to the Futurecraft WhatsApp channel…');
   window.setTimeout(()=>window.location.assign(FUTURECRAFT_WHATSAPP_CHANNEL),2600);
  }catch(err){setState('error');setMessage(err instanceof Error?err.message:'Please try again.');}
 }
 if(state==='done')return <div className="fc-registration-success" role="status" aria-live="polite"><span className="fc-registration-check" aria-hidden="true">✓</span><p className="fc-registration-eyebrow">GENESIS 1.0 · REGISTRATION CONFIRMED</p><h3>You’re on<br/><em>the list.</em></h3><p className="fc-registration-copy">Your place is registered. We’re taking you to the Futurecraft Academy WhatsApp channel so you can stay close to the updates.</p><div className="fc-registration-redirect"><span className="fc-registration-pulse"/>Redirecting you to our WhatsApp channel<span className="fc-registration-dots" aria-hidden="true">···</span></div><a className="fc-registration-fallback" href={FUTURECRAFT_WHATSAPP_CHANNEL}>Not redirected? Open the channel</a></div>;
 return <form className="fc-form" onSubmit={submit}>
  <div className="fc-form-grid"><label>Full name<input name="name" type="text" required minLength={2} maxLength={90} autoComplete="name" placeholder="Your full name"/></label><label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com"/></label></div>
  <div className="fc-form-grid"><label>WhatsApp number <span className="fc-optional">Optional</span><input name="phone" type="tel" maxLength={28} autoComplete="tel" placeholder="+234…"/></label><label>What will you use?<select name="deviceAvailability" required defaultValue=""><option value="" disabled>Choose your device</option><option value="phone">Phone</option><option value="computer">Laptop or desktop</option><option value="both">Phone and computer</option><option value="shared">Shared device / still arranging access</option></select></label></div>
  <label>What would you love to explore?<select name="interest" required defaultValue=""><option value="" disabled>Choose an interest</option><option value="design">Design and visuals</option><option value="video">Video and advertising</option><option value="games">Games and apps</option><option value="automation">Automation</option><option value="everything">Everything</option></select></label>
  <div className="fc-hidden-field" aria-hidden="true"><label>Do not fill<input name="website_url" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="fc-consent"><input type="checkbox" name="consent" value="yes" required/><span>I agree to receive Genesis registration and programme emails. <Link href="/futurecraft/privacy" target="_blank">Privacy details</Link>.</span></label>
  {message&&<p className={state==='error'?'fc-error':'fc-note'} role="alert">{message}</p>}
  <button type="submit" className="fc-form-submit" disabled={state==='sending'||state==='done'}>{state==='sending'?'Sending…':state==='done'?'You’re registered':'Join Genesis — free'}</button>
  <p className="fc-form-foot">Genesis starts 3 November 2026. We’ll email your session timetable and joining details.</p>
 </form>;
}
function Newsletter(){
 const form=useRef<HTMLFormElement>(null);
 const [email,setEmail]=useState(''),[status,setStatus]=useState<'idle'|'sending'|'done'|'error'>('idle'),[message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(status==='sending')return;setStatus('sending');setMessage('');
  try{const res=await fetch('/api/futurecraft/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});const json=await res.json();if(!res.ok)throw new Error(json.error||'Please try again later.');setStatus('done');setMessage('You’re on the list. Check your inbox for your Futurecraft welcome.');}
  catch(err){setStatus('error');setMessage(err instanceof Error?err.message:'Please try again.');}
 }
 return <form ref={form} className="fc-newsletter" onSubmit={submit}><label htmlFor="fc-newsletter-email">Get news about upcoming Labs and cohorts.</label><div className="fc-newsletter-control"><input id="fc-newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><BellToggle icon={undefined} offLabel={status==='sending'?'Saving…':'Notify me'} onLabel="You'll be notified" label="Notify me about Futurecraft by email" color="#f5f5f5" background="#27272a" onColor="#18181b" onBackground="#f5f5f5" size="md" radius={22} ringAmplitude={17} ringPasses={5} ringDecay={1} ringDuration={820} ringPivot={16} crossfadeMs={200} revealBounce={0} count={0} badge badgeColor="#ef4444" waves clapper={false} pressed={status==='done'} disabled={status==='sending'} onChange={(pressed:boolean)=>{if(pressed)form.current?.requestSubmit();}}/></div><p className="fc-notify-note">Email updates, when there’s something new to make.</p>{message&&<p role="status" className={status==='error'?'fc-error':'fc-note'}>{message}</p>}</form>;
}

export default function FuturecraftLanding(){
 const root=useRef<HTMLDivElement>(null);
 const [activeFaq,setActiveFaq]=useState<number|null>(null);
 useEffect(()=>{
  try { if(localStorage.getItem('futurecraft-motion')==='reduced') return; } catch {}
  if(!root.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  const ctx=gsap.context(()=>{
   gsap.utils.toArray<HTMLElement>('.fc-reveal').forEach(el=>gsap.from(el,{y:36,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  },root);return()=>ctx.revert();
 },[]);
 return <div ref={root} className="fc-site" id="top">
  <a className="fc-skip" href="#fc-main">Skip to content</a>
  <FuturecraftNav/>
  <main id="fc-main">
   <LivingCanvas/>
   <MakePlayground/>
   <GenesisLaunch><Registration/></GenesisLaunch>
   <section className="fc-section fc-about" id="about"><div className="fc-section-inner fc-about-layout"><div className="fc-reveal"><h2>Learn by<br/><em>making.</em></h2></div><div className="fc-about-copy fc-reveal"><p>Futurecraft is a creative technology academy built around one simple belief: the best way to understand a tool is to use it to make something.</p><p>Genesis is our first free, 14-week bootcamp. You’ll learn alongside other beginners, work on practical projects, and meet creators who use these skills in the real world.</p><div className="fc-about-details"><span>Free first cohort</span><span>14 weeks</span><span>Practical learning</span></div></div></div></section>
   <LabsGallery/>
   <section className="fc-section fc-experience" id="experience"><div className="fc-section-inner">
    <div className="fc-experience-head fc-reveal"><p className="fc-section-kicker">How it works</p><h2>Curiosity in.<br/><em>Something out.</em></h2></div>
    <div className="fc-method-list">
     <div className="fc-method fc-reveal"><span>01</span><h3>Start anywhere.</h3><p>You don’t need to code or arrive with a polished idea. Just show up ready to try.</p></div>
     <div className="fc-method fc-reveal"><span>02</span><h3>Build together.</h3><p>Ask questions, get feedback and learn alongside other first-time makers.</p></div>
     <div className="fc-method fc-reveal"><span>03</span><h3>Leave with work.</h3><p>Designs, videos, useful systems and small products you actually made.</p></div>
    </div>
   </div></section>
   <section className="fc-section fc-future" id="future"><div className="fc-section-inner fc-future-layout">
    <div className="fc-reveal"><h2>And then<br/><em>what’s next?</em></h2></div>
    <div className="fc-future-content fc-reveal"><p>The student portal is coming later—with class recordings, assignments and progress tracking. Future cohorts and their calendars will be announced once dates are confirmed.</p><Newsletter/></div>
   </div></section>
   <section className="fc-section fc-faq" id="faq"><div className="fc-section-inner fc-faq-layout"><div className="fc-reveal"><h2>Good<br/><em>questions.</em></h2></div><div className="fc-faq-list">{faqs.map(([q,a],i)=><div key={q} className="fc-faq-item"><button type="button" id={`faq-question-${i}`} aria-controls={`faq-answer-${i}`} aria-expanded={activeFaq===i} onClick={()=>setActiveFaq(activeFaq===i?null:i)}><span>{q}</span>{activeFaq===i?<Minus size={19}/>:<Plus size={19}/>}</button>{activeFaq===i&&<p id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`}>{a}</p>}</div>)}</div></div></section>
   <FirstMakers/>
  </main>
  <GradualBlur width={undefined} container={undefined} style={undefined} target="page" position="bottom" height="6rem" strength={2} layers={8} curve="linear" exponential tint="rgba(18, 15, 23, 0.6)" autoHide zIndex={25}/>
  <footer className="fc-footer"><Link href="/futurecraft" className="fc-brand"><img src="/futurecraft/mark.svg" alt="" width="33" height="33"/><span>futurecraft<span className="fc-brand-dot">.</span></span></Link><span>Learn the future by making it.</span><div><MotionPreference/><button type="button" className="fc-motion-preference" onClick={()=>window.dispatchEvent(new Event('silk-cookie-settings'))}>Cookie settings</button><Link href="/futurecraft/privacy">Privacy</Link><a href="#top">Back to top ↑</a></div></footer>
 </div>;
}