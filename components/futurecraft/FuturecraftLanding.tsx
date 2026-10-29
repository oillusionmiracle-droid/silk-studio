'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Plus, Minus } from 'lucide-react';
import LivingCanvas from './LivingCanvas';
import MakePlayground from './MakePlayground';
import FuturecraftNav from './FuturecraftNav';
import GenesisLaunch from './GenesisLaunch';

type Lab = { name: string; description: string };
const labs: Lab[] = [
  { name: 'Build Night', description: 'Bring an idea. Work through it with other makers. Leave with a working first version.' },
  { name: 'Prompt & Paint', description: 'Make images, layouts and stories with more intention and creative control.' },
  { name: 'Ship It', description: 'Take a small website or app from first idea to a published link in one guided session.' },
  { name: 'Automate This', description: 'Bring the task you do over and over. Explore a better workflow and build the automation.' },
  { name: 'Ad Lab', description: 'Turn a brief into an actual commercial—from concept and script to the final cut.' },
  { name: 'Game Jam: AI Edition', description: 'Build a tiny playable game in a day, including characters, mechanics and a finished experience.' },
  { name: 'Clone It', description: 'Recreate an interesting interface to learn the ideas, interactions and code behind it.' },
  { name: 'Fix My Business', description: 'Look at a small business challenge and build an AI-powered way to make things easier.' },
  { name: 'Future Friday', description: 'Experiment with a new AI tool or creative technique before it becomes everybody’s tutorial.' },
  { name: 'The 60-Minute Build', description: 'Start from zero and race the clock with the instructor to create something useful.' },
  { name: 'Creator Challenge', description: 'Get the brief first. Figure it out with guidance. Show what you made.' },
  { name: 'Guest Lab', description: 'Go behind the scenes with working creators and builders to see how they really do it.' },
];
const faqs = [
  ['When does Genesis start?', 'Genesis Bootcamp 1.0 starts on 3 November 2026. It runs for 14 weeks. The weekly session timetable will be shared by email and on the Futurecraft Academy WhatsApp channel.'],
  ['Is Genesis free?', 'Yes. Genesis Bootcamp 1.0 is free to register for. No payment details are required.'],
  ['Can I join as a complete beginner?', 'Yes. Start from zero. You do not need to know how to code or have previous experience with AI.'],
  ['How long is the bootcamp?', 'Fourteen weeks. Practical sessions are planned to run for two hours each; the confirmed timetable will be shared with registered participants.'],
  ['Will I build real projects?', 'That is the point. Sessions focus on making, testing, sharing and improving things you can actually use or show.'],
  ['Are all the Labs part of Genesis?', 'These are the session formats that make up the Futurecraft approach. The exact Genesis timetable and which Labs run in this cohort will be announced before classes begin.'],
  ['How will I get class details?', 'After registration, Futurecraft will send confirmation and welcome emails. Joining instructions and the final schedule will follow when confirmed.'],
  ['Is there a student portal?', 'A portal for recordings, assignments and progress tracking is planned for a later phase. It is not part of this first landing-page launch.'],
];

function Registration(){
 const [state,setState]=useState<'idle'|'sending'|'done'|'error'>('idle'),[message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(state==='sending')return;
  const fd=new FormData(e.currentTarget);
  const payload={name:String(fd.get('name')||''),email:String(fd.get('email')||''),phone:String(fd.get('phone')||''),experience:String(fd.get('experience')||''),interest:String(fd.get('interest')||''),consent:fd.get('consent')==='yes',website_url:String(fd.get('website_url')||'')};
  setState('sending');setMessage('');
  try{
   const res=await fetch('/api/futurecraft/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const data=await res.json();
   if(!res.ok)throw new Error(data.error||'We could not register you right now.');
   if(data.alreadyRegistered){setState('done');setMessage('This email is already registered. Look out for Genesis updates.');return;}
   window.location.assign('/futurecraft/success');
  }catch(err){setState('error');setMessage(err instanceof Error?err.message:'Please try again.');}
 }
 return <form className="fc-form" onSubmit={submit}>
  <div className="fc-form-grid"><label>Full name<input name="name" type="text" required minLength={2} maxLength={90} autoComplete="name" placeholder="Your full name"/></label><label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com"/></label></div>
  <div className="fc-form-grid"><label>WhatsApp number <span className="fc-optional">Optional</span><input name="phone" type="tel" maxLength={28} autoComplete="tel" placeholder="+234…"/></label><label>Starting point<select name="experience" required defaultValue=""><option value="" disabled>Choose your experience</option><option value="complete_beginner">Completely new</option><option value="exploring">Exploring AI tools</option><option value="building">Already building things</option></select></label></div>
  <label>What would you love to explore?<select name="interest" required defaultValue=""><option value="" disabled>Choose an interest</option><option value="design">Design and visuals</option><option value="video">Video and advertising</option><option value="games">Games and apps</option><option value="automation">Automation</option><option value="everything">Everything</option></select></label>
  <div className="fc-hidden-field" aria-hidden="true"><label>Do not fill<input name="website_url" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="fc-consent"><input type="checkbox" name="consent" value="yes" required/><span>I agree to receive Genesis registration and programme emails. <Link href="/futurecraft/privacy" target="_blank">Privacy details</Link>.</span></label>
  {message&&<p className={state==='error'?'fc-error':'fc-note'} role="alert">{message}</p>}
  <button type="submit" className="fc-form-submit" disabled={state==='sending'||state==='done'}>{state==='sending'?'Sending…':state==='done'?'You’re registered':'Join Genesis — free'}</button>
  <p className="fc-form-foot">Genesis starts 3 November 2026. We’ll email your session timetable and joining details.</p>
 </form>;
}
function Newsletter(){
 const [email,setEmail]=useState(''),[status,setStatus]=useState<'idle'|'sending'|'done'|'error'>('idle'),[message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(status==='sending')return;setStatus('sending');setMessage('');
  try{const res=await fetch('/api/futurecraft/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});const json=await res.json();if(!res.ok)throw new Error(json.error||'Please try again later.');setStatus('done');setMessage('You’re on the list.');}
  catch(err){setStatus('error');setMessage(err instanceof Error?err.message:'Please try again.');}
 }
 return <form className="fc-newsletter" onSubmit={submit}><label htmlFor="fc-newsletter-email">Get news about upcoming Labs and cohorts.</label><div className="fc-newsletter-control"><input id="fc-newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit" aria-label="Subscribe" disabled={status==='sending'||status==='done'}><ArrowRight size={19}/></button></div>{message&&<p role="status" className={status==='error'?'fc-error':'fc-note'}>{message}</p>}</form>;
}

export default function FuturecraftLanding(){
 const root=useRef<HTMLDivElement>(null);
 const [activeFaq,setActiveFaq]=useState<number|null>(null);
 useEffect(()=>{
  if(!root.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  const ctx=gsap.context(()=>{
   gsap.utils.toArray<HTMLElement>('.fc-reveal').forEach(el=>gsap.from(el,{y:36,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  },root);return()=>ctx.revert();
 },[]);
 return <div ref={root} className="fc-site">
  <a className="fc-skip" href="#fc-main">Skip to content</a>
  <FuturecraftNav/>
  <main id="fc-main">
   <LivingCanvas/>
   <MakePlayground/>
   <GenesisLaunch><Registration/></GenesisLaunch>
   <section className="fc-section fc-about" id="about"><div className="fc-section-inner fc-about-layout"><div className="fc-reveal"><h2>Learn by<br/><em>making.</em></h2></div><div className="fc-about-copy fc-reveal"><p>Futurecraft is a creative technology academy built around one simple belief: the best way to understand a tool is to use it to make something.</p><p>Genesis is our first free, 14-week bootcamp. You’ll learn alongside other beginners, work on practical projects, and meet creators who use these skills in the real world.</p><div className="fc-about-details"><span>Free first cohort</span><span>14 weeks</span><span>Two-hour practical sessions</span></div></div></div></section>
   <section className="fc-section fc-labs" id="labs"><div className="fc-section-inner">
    <div className="fc-labs-heading fc-reveal"><div><p className="fc-section-kicker">The Futurecraft experience</p><h2>Inside<br/><em>the Labs.</em></h2></div><p>Not just courses to complete. Sessions to explore, experiment, build and share.</p></div>
    <div className="fc-labs-list">{labs.map((lab,i)=><article key={lab.name} id={`lab-${lab.name === 'Prompt & Paint' ? 'prompt-paint' : lab.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} className="fc-lab fc-reveal"><span className="fc-lab-number">{String(i+1).padStart(2,'0')}</span><h3>{lab.name}</h3><p>{lab.description}</p></article>)}</div>
    <p className="fc-labs-foot">The Genesis schedule will announce which Labs run during the first cohort.</p>
   </div></section>
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
   <section className="fc-section fc-faq" id="faq"><div className="fc-section-inner fc-faq-layout"><div className="fc-reveal"><h2>Good<br/><em>questions.</em></h2></div><div className="fc-faq-list">{faqs.map(([q,a],i)=><div key={q} className="fc-faq-item"><button type="button" aria-expanded={activeFaq===i} onClick={()=>setActiveFaq(activeFaq===i?null:i)}><span>{q}</span>{activeFaq===i?<Minus size={19}/>:<Plus size={19}/>}</button>{activeFaq===i&&<p>{a}</p>}</div>)}</div></div></section>
  </main>
  <footer className="fc-footer"><Link href="/futurecraft" className="fc-brand"><img src="/futurecraft/mark.svg" alt="" width="33" height="33"/><span>futurecraft<span className="fc-brand-dot">.</span></span></Link><span>Learn the future by making it.</span><div><Link href="/futurecraft/privacy">Privacy</Link><a href="#top">Back to top ↑</a></div></footer>
 </div>;
}