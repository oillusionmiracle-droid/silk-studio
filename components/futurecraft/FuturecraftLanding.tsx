/* eslint-disable react/no-unescaped-entities -- natural marketing copy */
'use client';

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowUpRight, ArrowRight, ArrowDown, Check, ChevronDown, Menu, X, CalendarDays, LockKeyhole, PlayCircle } from 'lucide-react';

const LOGO = '/futurecraft/mark.svg';
const deadline = new Date('2026-11-03T00:00:00+01:00').getTime();
function getTimeLeft() {
  const n = Math.max(0, deadline - Date.now());
  return [Math.floor(n / 86400000), Math.floor(n / 3600000) % 24, Math.floor(n / 60000) % 60, Math.floor(n / 1000) % 60];
}
function Countdown() {
  const [time,setTime]=useState<number[]|null>(null);
  useEffect(()=>{setTime(getTimeLeft());const handle=setInterval(()=>setTime(getTimeLeft()),1000);return()=>clearInterval(handle)},[]);
  return <div className="fc-countdown" aria-label="Countdown to November third, 2026">
    <span className="fc-count-label"><span className="fc-live-dot"/>Countdown to Nov 3</span>
    <span className="fc-time" aria-live="off">{['days','hrs','mins','secs'].map((unit,i)=><span className="fc-tick" key={unit}><strong suppressHydrationWarning>{time ? String(time[i]).padStart(2,'0'):'--'}</strong><small>{unit}</small></span>)}</span>
  </div>;
}
function PillLink({href,children,subtle=false,external=false}:{href:string;children:React.ReactNode;subtle?:boolean;external?:boolean}) {
  const ref=useRef<HTMLAnchorElement>(null);
  function move(e:MouseEvent<HTMLAnchorElement>){const el=ref.current;if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(pointer:coarse)').matches)return;const b=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-b.left-b.width/2)*.1,y:(e.clientY-b.top-b.height/2)*.13,duration:.4,ease:'power3.out'});}
  function leave(){if(ref.current)gsap.to(ref.current,{x:0,y:0,duration:.5,ease:'elastic.out(1,.5)'})}
  return <a ref={ref} className={'fc-pill '+(subtle?'fc-pill-subtle':'fc-pill-primary')} href={href} onMouseMove={move} onMouseLeave={leave} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined}>{children}<ArrowUpRight size={17}/></a>;
}
const tracks=[
 {n:'01',title:'Design',desc:'Flyers, brand identities, campaigns and content you’re proud to publish.',kind:'Visual design'},
 {n:'02',title:'Video & motion',desc:'Create and edit videos, tell stories and produce advertisements.',kind:'Creative storytelling'},
 {n:'03',title:'Build',desc:'Go from an idea to apps, playful games and working digital experiences.',kind:'Apps & games'},
 {n:'04',title:'Automate',desc:'Build systems that make everyday business tasks simpler and faster.',kind:'Business workflows'}
];
const quotes=[
 {quote:'“I had the idea, made it that same afternoon.”',name:'Christian Ortega',role:'The Original Tamale Co.',url:'https://openai.com/index/small-business-stories/'},
 {quote:'“Now, it’s like, okay, I can do this.”',name:'Rachael Sharp',role:'Sharp & Sharp Certified Seed',url:'https://openai.com/index/small-business-stories/'},
 {quote:'“ChatGPT saved me at least 10 hours of data entry.”',name:'Kevin English',role:'Owner, Keg Built',url:'https://openai.com/index/introducing-chatgpt-small-business-program/'}
];
const faqs=[
 ['Is the Genesis Bootcamp free?','Yes. Genesis 1.0 is free. You don’t need to enter payment information to register.'],
 ['I have never used AI. Can I join?','Yes. This programme starts with the basics and focuses on learning by actually making things.'],
 ['How long is the programme?','Genesis runs for fourteen weeks, with practical two-hour sessions. We’ll email the confirmed class timetable.'],
 ['Is there a student dashboard?','A student portal for recordings, assignments, and progress tracking is planned for a later release.'],
 ['When do classes start?','The exact class start date has not been announced yet. The November 3 countdown marks our next programme milestone, not a confirmed first class.']
];
function Registration(){
  const [state,setState]=useState<'idle'|'sending'|'error'|'done'>('idle');
  const [message,setMessage]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(state==='sending')return;
    const data=new FormData(e.currentTarget);
    const payload={name:String(data.get('name')||''),email:String(data.get('email')||''),phone:String(data.get('phone')||''),experience:String(data.get('experience')||''),interest:String(data.get('interest')||''),consent:data.get('consent')==='yes',website_url:String(data.get('website_url')||'')};
    setState('sending');setMessage('');
    try {
      const response=await fetch('/api/futurecraft/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'Registration is unavailable. Please try again.');
      if(result.alreadyRegistered){setState('done');setMessage('You are already registered. Watch your inbox for updates.');return;}
      window.location.assign('/futurecraft/success');
    } catch(err){setState('error');setMessage(err instanceof Error?err.message:'Please try again.')}
  }
  return <form className="fc-form" onSubmit={submit}>
    <div className="fc-form-top"><h3>Join Genesis 1.0</h3><span>Free to register</span></div>
    <div className="fc-form-pair">
      <label>Full name<input name="name" type="text" minLength={2} maxLength={90} autoComplete="name" placeholder="Your name" required/></label>
      <label>Email address<input name="email" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" required/></label>
    </div>
    <label>WhatsApp number <span>(optional)</span><input name="phone" type="tel" maxLength={28} autoComplete="tel" placeholder="+234"/></label>
    <div className="fc-form-pair">
      <label>Experience level<select name="experience" defaultValue="" required><option value="" disabled>Select your level</option><option value="complete_beginner">I'm just starting</option><option value="exploring">I've tried a few tools</option><option value="building">I already build things</option></select></label>
      <label>What interests you most?<select name="interest" defaultValue="" required><option value="" disabled>Choose an interest</option><option value="design">Design</option><option value="video">Video & motion</option><option value="games">Apps & games</option><option value="automation">Business automation</option><option value="everything">Everything!</option></select></label>
    </div>
    <div className="fc-hidden" aria-hidden="true"><label>Website<input name="website_url" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="fc-check"><input name="consent" type="checkbox" value="yes" required/><span>I agree to receive Genesis registration and programme emails. <Link href="/futurecraft/privacy">Privacy policy</Link>.</span></label>
    {message&&<p className="fc-form-message" role="alert">{message}</p>}
    <button className="fc-submit" type="submit" disabled={state==='sending'||state==='done'}>{state==='sending'?'Submitting…':state==='done'?'You’re registered':'Join the community — free'}<ArrowUpRight size={18}/></button>
    <p className="fc-form-caption">No payment required. Session details will be shared by email.</p>
  </form>;
}
function Newsletter(){
 const [email,setEmail]=useState('');const [state,setState]=useState<'idle'|'loading'|'ok'|'error'>('idle');const [error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setState('loading');setError('');
 try{const r=await fetch('/api/futurecraft/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Please try again later.');setState('ok');}
 catch(e){setState('error');setError(e instanceof Error?e.message:'Please try again later.');}}
 return <form className="fc-newsletter" onSubmit={submit}><label htmlFor="fc-updates-email">Futurecraft updates, straight to your inbox.</label><div><input id="fc-updates-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address" required/><button type="submit" disabled={state==='loading'||state==='ok'} aria-label="Join Futurecraft newsletter">{state==='ok'?'Subscribed':state==='loading'?'Joining…':'Subscribe'}<ArrowUpRight size={17}/></button></div>{state==='error'&&<p role="alert">{error}</p>}{state==='ok'&&<p>You're on the updates list.</p>}</form>;
}
export default function FuturecraftLanding(){
 const root=useRef<HTMLDivElement>(null);
 const [menu,setMenu]=useState(false),[faq,setFaq]=useState<number|null>(0);
 useEffect(()=>{
  if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger,SplitText);
  const ctx=gsap.context(()=>{
    const headline=document.querySelector('.fc-hero h1');
    if(headline){
      SplitText.create(headline,{type:'words',autoSplit:true,onSplit(self){return gsap.from(self.words,{yPercent:85,opacity:0,duration:1.05,stagger:.09,ease:'power4.out'})}});
      gsap.from('.fc-hero-lead',{opacity:0,y:24,duration:.9,delay:.5,ease:'power3.out'});
      gsap.from('.fc-countdown',{opacity:0,y:-18,duration:.8,delay:.25,ease:'power3.out'});
    }
    gsap.utils.toArray<HTMLElement>('.fc-animate').forEach(el=>gsap.from(el,{opacity:0,y:45,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
  },root);
  return()=>ctx.revert();
 },[]);
 useEffect(()=>{if(!menu)return;const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[menu]);
 return <div className="fc-site" ref={root}>
  <a className="fc-skip" href="#fc-content">Skip to content</a>
  <header className="fc-header">
   <Link href="/futurecraft" className="fc-brand" aria-label="Futurecraft"><img src={LOGO} width="43" height="40" alt=""/><span>futurecraft<span className="fc-mark">.</span></span></Link>
   <nav className={'fc-nav '+(menu?'fc-nav-open':'')} aria-label="Main navigation">
    <a onClick={()=>setMenu(false)} href="#opportunity">The opportunity</a>
    <a onClick={()=>setMenu(false)} href="#tracks">What you'll learn</a>
    <a onClick={()=>setMenu(false)} href="#stories">Real stories</a>
    <a onClick={()=>setMenu(false)} href="#cohorts">Cohorts</a>
   </nav>
   <a href="#register" className="fc-header-cta">Join Genesis <ArrowUpRight size={17}/></a>
   <button className="fc-menu" type="button" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label={menu?'Close navigation':'Open navigation'}>{menu?<X/>:<Menu/>}</button>
  </header>
  <main id="fc-content">
   <section className="fc-hero">
    <Countdown/>
    <div className="fc-hero-text">
      <div className="fc-hero-tag">Futurecraft Academy <span>✳</span> First free cohort</div>
      <h1>Introducing the <strong>Genesis<br/>Bootcamp <i>1.0</i></strong></h1>
      <p className="fc-hero-lead">Join a community of creators and builders learning to design, develop, animate and automate with AI. Start from scratch. Build something real.</p>
      <div className="fc-hero-actions fc-hero-lead"><PillLink href="#register">Join Genesis for free</PillLink><a className="fc-text-link" href="#opportunity">See why it matters <ArrowDown size={18}/></a></div>
      <div className="fc-hero-mini fc-hero-lead"><span>14 weeks</span><span>2-hour practical sessions</span><span>Beginner-friendly</span></div>
    </div>
    <div className="fc-hero-photo fc-animate"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=85" alt="A group of creators collaborating around a table" loading="eager"/></div>
   </section>
   <section className="fc-section fc-opportunity" id="opportunity">
    <div className="fc-section-heading fc-animate"><h2>There’s real opportunity<br/><em>in what you make.</em></h2><p>AI is changing how people create, work and run businesses. The opportunity isn’t a promise of instant income. It’s learning useful skills and putting them to work.</p></div>
    <div className="fc-facts">
      <article className="fc-fact fc-animate"><strong>50<span>%</span></strong><h3>of surveyed freelancers reported earning more per project with AI.</h3><a href="https://s3.amazonaws.com/press.freelancer.com/Generative%20AI%20Is%20Boosting%20Freelancers%20Pay%2C%20Finds%20Global%20Survey.docx.pdf" target="_blank" rel="noopener noreferrer">Freelancer.com survey, 2024 <ArrowUpRight size={15}/></a></article>
      <article className="fc-fact fc-fact-blue fc-animate"><strong>92<span>%</span></strong><h3>of AI practitioners surveyed reported improved productivity.</h3><a href="https://www.stateof.ai/2025-explore/survey" target="_blank" rel="noopener noreferrer">State of AI practitioner survey, 2025 <ArrowUpRight size={15}/></a></article>
      <article className="fc-fact fc-animate"><strong>$2.6<span>T+</span></strong><h3>estimated global annual economic potential from generative AI use cases.</h3><a href="https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" target="_blank" rel="noopener noreferrer">McKinsey estimate, not individual earnings <ArrowUpRight size={15}/></a></article>
    </div>
    <p className="fc-source-note">Survey findings are self-reported and are not promises of income or outcomes from Genesis.</p>
   </section>
   <section className="fc-section fc-stories" id="stories">
    <div className="fc-section-heading fc-animate"><h2>AI is already changing<br/><em>the way people work.</em></h2><p>Real experiences published by businesses and creators—not testimonials from Genesis students.</p></div>
    <div className="fc-quotes">
      {quotes.map((q,i)=><article className="fc-quote fc-animate" key={q.name}><span className="fc-quote-mark">“</span><blockquote>{q.quote}</blockquote><div className="fc-quote-person"><div><strong>{q.name}</strong><span>{q.role}</span></div><a href={q.url} aria-label={'Read '+q.name+' story'} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={20}/></a></div></article>)}
    </div>
   </section>
   <section className="fc-section fc-tracks" id="tracks">
    <div className="fc-section-heading fc-animate"><h2>Learn it.<br/><em>Then make it.</em></h2><p>Four creative directions. Practical work. A community to grow with.</p></div>
    <div className="fc-track-list">{tracks.map(t=><div className="fc-track fc-animate" key={t.n}><span className="fc-track-number">{t.n}</span><div><h3>{t.title}</h3><p>{t.desc}</p></div><span className="fc-track-tag">{t.kind}</span><ArrowUpRight className="fc-track-arrow" size={26}/></div>)}</div>
    <div className="fc-project-images fc-animate">
       <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85" alt="Team collaborating on their digital projects" loading="lazy"/>
       <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85" alt="Working development workspace with laptop" loading="lazy"/>
    </div>
   </section>
   <section className="fc-section fc-how">
    <div className="fc-section-heading fc-animate"><h2>Start at zero.<br/><em>Make your first thing.</em></h2><p>Two-hour practical sessions, project feedback and makers learning side by side. No endless lecture marathons.</p></div>
    <div className="fc-steps">{[['01','Join','Register and receive a confirmation and welcome email.'],['02','Create','Learn the tools by building hands-on projects.'],['03','Share','Improve your work, get feedback and keep growing.']].map(([n,t,d])=><div className="fc-step fc-animate" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
   </section>
   <section className="fc-section fc-cohorts" id="cohorts">
     <div className="fc-section-heading fc-animate"><h2>What’s coming next?</h2><p>Genesis is just the beginning. We’re laying the foundation for future cohorts and a student portal.</p></div>
     <div className="fc-future-grid"><article className="fc-future fc-animate"><div className="fc-future-icon"><CalendarDays size={25}/></div><div><h3>Genesis 1.0</h3><p>Fourteen weeks · Free cohort</p><p>Next milestone: 3 November 2026. Class start date will be confirmed by email.</p></div><a href="#register" className="fc-future-link">Get updates <ArrowUpRight size={17}/></a></article>
     <article className="fc-future fc-animate"><div className="fc-future-icon"><LockKeyhole size={25}/></div><div><h3>Student portal <span className="fc-soon">Coming later</span></h3><p>One place for class recordings, assignments, progress tracking and resources.</p></div></article></div>
   </section>
   <section className="fc-section fc-join" id="register">
    <div className="fc-join-copy fc-animate"><img src={LOGO} width="70" height="65" alt=""/><h2>Ready to build<br/><em>with us?</em></h2><p>Your first project starts with showing up. Genesis 1.0 is free and built for beginners.</p></div>
    <Registration/>
   </section>
   <section className="fc-section fc-news-section"><div className="fc-news-copy"><h2>A little more<br/><em>Futurecraft.</em></h2><p>Updates on cohorts, experiments and things we’re building. No clutter.</p></div><Newsletter/></section>
   <section className="fc-section fc-faq" id="faq"><div className="fc-section-heading fc-animate"><h2>Good questions.</h2></div><div className="fc-faq-list">{faqs.map(([q,a],i)=><div className="fc-faq-row" key={q}><button type="button" aria-expanded={faq===i} onClick={()=>setFaq(faq===i?null:i)}><span>{q}</span><ChevronDown size={22} className={faq===i?'fc-rotate':''}/></button>{faq===i&&<p>{a}</p>}</div>)}</div></section>
  </main>
  <footer className="fc-footer"><div className="fc-footer-brand"><img src={LOGO} alt="" width="49" height="47"/><strong>futurecraft.</strong></div><div><span>A creative technology academy.</span><p>Learn the future by making it.</p></div><nav><a href="/futurecraft/privacy">Privacy</a><a href="#register">Join Genesis</a><a href="#top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}}>Back to top ↑</a></nav></footer>
 </div>;
}